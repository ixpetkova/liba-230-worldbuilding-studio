import base64
import hashlib
import json
import os
import secrets
import sqlite3
import time
from pathlib import Path
from urllib.parse import urlencode

import jwt
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from flask import Flask, g, jsonify, redirect, render_template, request


APP_DIR = Path(__file__).resolve().parent
INSTANCE_DIR = APP_DIR / "instance"
INSTANCE_DIR.mkdir(exist_ok=True)
DB_PATH = INSTANCE_DIR / "worldbuilding_studio.db"
PRIVATE_KEY_PATH = INSTANCE_DIR / "lti_tool_private_key.pem"

STATE_TTL_SECONDS = 15 * 60
SESSION_TTL_SECONDS = 12 * 60 * 60
DEEP_LINK_TTL_SECONDS = 15 * 60
UI_STATE_KEY = "liba230-worldbuilding-ui-v2"

CANVAS_ENVIRONMENTS = {
    "production": {
        "issuer": "https://canvas.instructure.com",
        "auth_url": "https://sso.canvaslms.com/api/lti/authorize_redirect",
        "jwks_url": "https://sso.canvaslms.com/api/lti/security/jwks",
    },
    "beta": {
        "issuer": "https://canvas.beta.instructure.com",
        "auth_url": "https://sso.beta.canvaslms.com/api/lti/authorize_redirect",
        "jwks_url": "https://sso.beta.canvaslms.com/api/lti/security/jwks",
    },
    "test": {
        "issuer": "https://canvas.test.instructure.com",
        "auth_url": "https://sso.test.canvaslms.com/api/lti/authorize_redirect",
        "jwks_url": "https://sso.test.canvaslms.com/api/lti/security/jwks",
    },
}

ROLE_ALIASES = {
    "administrator": "instructor",
    "admin": "instructor",
    "instructor": "instructor",
    "teachingassistant": "instructor",
    "ta": "instructor",
    "designer": "instructor",
    "student": "student",
    "learner": "student",
}

MESSAGE_TYPE_CLAIM = "https://purl.imsglobal.org/spec/lti/claim/message_type"
VERSION_CLAIM = "https://purl.imsglobal.org/spec/lti/claim/version"
DEPLOYMENT_ID_CLAIM = "https://purl.imsglobal.org/spec/lti/claim/deployment_id"
ROLES_CLAIM = "https://purl.imsglobal.org/spec/lti/claim/roles"
CONTEXT_CLAIM = "https://purl.imsglobal.org/spec/lti/claim/context"
RESOURCE_LINK_CLAIM = "https://purl.imsglobal.org/spec/lti/claim/resource_link"
CUSTOM_CLAIM = "https://purl.imsglobal.org/spec/lti/claim/custom"
DEEP_LINK_SETTINGS_CLAIM = "https://purl.imsglobal.org/spec/lti-dl/claim/deep_linking_settings"
DEEP_LINK_DATA_CLAIM = "https://purl.imsglobal.org/spec/lti-dl/claim/data"
DEEP_LINK_CONTENT_ITEMS_CLAIM = "https://purl.imsglobal.org/spec/lti-dl/claim/content_items"

COURSE_MODULES = [
    {
        "id": "personal-geography",
        "week": "Aug 18",
        "title": "Personal Geography",
        "description": "Ground the world in lived place, memory, thresholds, and sensory geography.",
        "output": "Personal geography map / reflection",
    },
    {
        "id": "personal-oz",
        "week": "Aug 25",
        "title": "Personal Oz",
        "description": "Make the familiar strange, symbolic, and narratively expandable.",
        "output": "Personal Oz concept sheet",
    },
    {
        "id": "multispecies-perspective",
        "week": "Sept 8",
        "title": "Multi-species Perspective and Interspecies Communication",
        "description": "Move beyond human-centered worldbuilding through perception, communication, and mutual misunderstanding.",
        "output": "Multi-species perspective profile",
    },
    {
        "id": "multispecies-sustainability",
        "week": "Sept 15",
        "title": "Multispecies Sustainability",
        "description": "Build ecologically coherent worlds with material tradeoffs and limits.",
        "output": "Sustainability report and ecology system map",
    },
    {
        "id": "creating-cultures",
        "week": "Sept 22",
        "title": "Human Patterns",
        "description": "Create patterns of humanity with depth, conflict, care, labor, and change rather than stereotype.",
        "output": "Patterns of Humanity sheet",
    },
    {
        "id": "distribution-of-power",
        "week": "Sept 29",
        "title": "Political Economies, Power and Authority",
        "description": "Design governance, inequality, authority, resistance, and the visible consequences of power.",
        "output": "Power map / governance chart or mini-utopia sketch",
    },
    {
        "id": "building-worlds",
        "week": "Oct 6",
        "title": "The Built World",
        "description": "Integrate systems into a coherent built environment with architecture, site planning, and material logic.",
        "output": "Site planning brief and built world overview",
    },
    {
        "id": "ritual",
        "week": "Oct 13",
        "title": "Ritual",
        "description": "Develop ritual as embodied social meaning with exclusions, memories, and political effects.",
        "output": "Ritual design document and myth seed",
    },
    {
        "id": "gender-and-sexuality",
        "week": "Oct 20",
        "title": "Gender and Sexuality",
        "description": "Create culturally specific systems of gender, sexuality, kinship, embodiment, and intimacy.",
        "output": "Gender / sexuality system reflection",
    },
    {
        "id": "story-pitch",
        "week": "Oct 27",
        "title": "Project Proposal",
        "description": "Turn the world into a concise proposal with world-rooted conflict, stakes, and structure.",
        "output": "500-word project proposal",
    },
    {
        "id": "workshop-week",
        "week": "Nov 3",
        "title": "Peer Review Sessions",
        "description": "Prepare revision questions, peer prompts, and a coherence checklist for workshop response.",
        "output": "Peer response packet",
    },
    {
        "id": "collaboration-best-practices",
        "week": "Nov 10",
        "title": "Online Collaborative Worldbuilding",
        "description": "Support shared canon, safety tools, ownership, and contradiction management.",
        "output": "Collaboration agreement, safety notes, and canon tracker",
    },
    {
        "id": "world-to-story",
        "week": "Nov 17",
        "title": "Writing the Story Experience",
        "description": "Help story grow organically from the world's tensions instead of being pasted on top.",
        "output": "World-to-story bridge and structure sheet",
    },
    {
        "id": "collaborative-live-project",
        "week": "Nov 24",
        "title": "Live Fire Collaborative Worldbuilding",
        "description": "Support real-time group development with prompts, decision logs, and contradiction tracking.",
        "output": "Collaborative project record",
    },
    {
        "id": "heterotopias",
        "week": "Dec 1",
        "title": "World As Story / Zootopias and Heterotopias",
        "description": "Design layered spaces that juxtapose incompatible meanings, orders, or realities.",
        "output": "Heterotopia design sheet",
    },
    {
        "id": "final-review",
        "week": "Dec 8",
        "title": "Final Project Review",
        "description": "Review the whole portfolio for coherence, originality, ethics, and story readiness.",
        "output": "Final project checklist and portfolio export",
    },
]

COURSE_MODULE_MAP = {module["id"]: module for module in COURSE_MODULES}


app = Flask(__name__, static_folder="static", template_folder="templates")
app.config["JSON_SORT_KEYS"] = False


class ApiError(Exception):
    def __init__(self, message, status_code):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(_error):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    db = sqlite3.connect(DB_PATH)
    db.executescript(
        """
        CREATE TABLE IF NOT EXISTS launch_states (
            state TEXT PRIMARY KEY,
            nonce TEXT NOT NULL,
            client_id TEXT NOT NULL,
            deployment_id TEXT,
            target_link_uri TEXT,
            canvas_environment TEXT NOT NULL,
            issuer TEXT NOT NULL,
            created_at INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS app_sessions (
            token TEXT PRIMARY KEY,
            role TEXT NOT NULL,
            canvas_user_id TEXT NOT NULL,
            canvas_course_id TEXT NOT NULL,
            display_name TEXT,
            email TEXT,
            deployment_id TEXT,
            client_id TEXT,
            resource_link_id TEXT,
            session_context_json TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            expires_at INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS deep_link_sessions (
            token TEXT PRIMARY KEY,
            context_json TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            expires_at INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS projects (
            project_id TEXT PRIMARY KEY,
            canvas_course_id TEXT NOT NULL,
            owner_canvas_user_id TEXT NOT NULL,
            owner_display_name TEXT,
            owner_login TEXT,
            data_json TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_projects_course_owner
            ON projects(canvas_course_id, owner_canvas_user_id);

        CREATE INDEX IF NOT EXISTS idx_projects_course_updated
            ON projects(canvas_course_id, updated_at DESC);

        CREATE INDEX IF NOT EXISTS idx_sessions_expiry
            ON app_sessions(expires_at);

        CREATE INDEX IF NOT EXISTS idx_deep_link_sessions_expiry
            ON deep_link_sessions(expires_at);
        """
    )
    db.commit()
    db.close()


def now_ts():
    return int(time.time())


def iso_now():
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def json_dumps(value):
    return json.dumps(value, ensure_ascii=True, separators=(",", ":"))


def json_loads(value, fallback=None):
    try:
        return json.loads(value)
    except (TypeError, json.JSONDecodeError):
        return fallback


def random_token(length=32):
    return secrets.token_urlsafe(length)


def b64url_bytes(raw_bytes):
    return base64.urlsafe_b64encode(raw_bytes).decode("ascii").rstrip("=")


def b64url_uint(number):
    width = max(1, (number.bit_length() + 7) // 8)
    return b64url_bytes(number.to_bytes(width, "big"))


def get_private_key():
    if PRIVATE_KEY_PATH.exists():
        return serialization.load_pem_private_key(
            PRIVATE_KEY_PATH.read_bytes(),
            password=None,
        )

    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    PRIVATE_KEY_PATH.write_bytes(
        private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption(),
        )
    )
    return private_key


def get_public_jwk():
    private_key = get_private_key()
    public_numbers = private_key.public_key().public_numbers()
    modulus = public_numbers.n
    exponent = public_numbers.e
    kid_source = f"{modulus}:{exponent}".encode("utf-8")
    kid = hashlib.sha256(kid_source).hexdigest()[:32]
    return {
        "kty": "RSA",
        "use": "sig",
        "alg": "RS256",
        "kid": kid,
        "n": b64url_uint(modulus),
        "e": b64url_uint(exponent),
    }


def get_base_url():
    configured = os.environ.get("APP_BASE_URL", "").strip().rstrip("/")
    if configured:
        return configured
    return request.url_root.rstrip("/")


def env_csv(name):
    raw_value = os.environ.get(name, "")
    return [item.strip() for item in raw_value.split(",") if item.strip()]


def get_allowed_client_ids():
    configured = env_csv("CANVAS_ALLOWED_CLIENT_IDS")
    if configured:
        return configured
    fallback = os.environ.get("CANVAS_CLIENT_ID", "").strip()
    return [fallback] if fallback else []


def client_id_is_allowed(client_id):
    allowed_client_ids = get_allowed_client_ids()
    if not allowed_client_ids:
        return True
    return client_id in allowed_client_ids


def sign_jwt(payload, *, issuer=None, subject=None, audience=None):
    public_jwk = get_public_jwk()
    private_key = get_private_key()
    claims = dict(payload)
    if issuer is not None:
        claims["iss"] = issuer
    if subject is not None:
        claims["sub"] = subject
    if audience is not None:
        claims["aud"] = audience
    return jwt.encode(
        claims,
        private_key,
        algorithm="RS256",
        headers={"kid": public_jwk["kid"]},
    )


def infer_canvas_environment(issuer, explicit_environment=None):
    if explicit_environment in CANVAS_ENVIRONMENTS:
        return explicit_environment

    for environment_name, config in CANVAS_ENVIRONMENTS.items():
        if issuer == config["issuer"]:
            return environment_name

    return "production"


def canvas_config_for_request(issuer, explicit_environment=None):
    environment_name = infer_canvas_environment(issuer, explicit_environment)
    return environment_name, CANVAS_ENVIRONMENTS[environment_name]


def get_lti_claim(payload, claim_name, fallback=None):
    return payload.get(claim_name, fallback)


def normalize_role(roles):
    normalized = []
    for role in roles or []:
        lowered = str(role).lower()
        compact = lowered.rsplit("#", 1)[-1].rsplit("/", 1)[-1]
        mapped = ROLE_ALIASES.get(compact)
        if mapped:
            normalized.append(mapped)
    if "instructor" in normalized:
        return "instructor"
    return "student"


def require_json_body():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        raise ApiError("Request body must be JSON.", 400)
    return payload


def json_error(message, status_code):
    response = jsonify({"ok": False, "error": message})
    response.status_code = status_code
    return response


def cleanup_expired_rows(db):
    current_time = now_ts()
    db.execute("DELETE FROM launch_states WHERE created_at < ?", (current_time - STATE_TTL_SECONDS,))
    db.execute("DELETE FROM app_sessions WHERE expires_at < ?", (current_time,))
    db.execute("DELETE FROM deep_link_sessions WHERE expires_at < ?", (current_time,))
    db.commit()


def store_launch_state(db, launch_state):
    cleanup_expired_rows(db)
    db.execute(
        """
        INSERT INTO launch_states (
            state, nonce, client_id, deployment_id, target_link_uri, canvas_environment, issuer, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            launch_state["state"],
            launch_state["nonce"],
            launch_state["client_id"],
            launch_state.get("deployment_id"),
            launch_state.get("target_link_uri"),
            launch_state["canvas_environment"],
            launch_state["issuer"],
            launch_state["created_at"],
        ),
    )
    db.commit()


def pop_launch_state(db, state_value):
    row = db.execute("SELECT * FROM launch_states WHERE state = ?", (state_value,)).fetchone()
    if row:
        db.execute("DELETE FROM launch_states WHERE state = ?", (state_value,))
        db.commit()
    return row


def create_session(db, session_context):
    cleanup_expired_rows(db)
    token = random_token(24)
    created_at = now_ts()
    expires_at = created_at + SESSION_TTL_SECONDS
    db.execute(
        """
        INSERT INTO app_sessions (
            token, role, canvas_user_id, canvas_course_id, display_name, email,
            deployment_id, client_id, resource_link_id, session_context_json,
            created_at, expires_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            token,
            session_context["role"],
            session_context["canvasUserId"],
            session_context["canvasCourseId"],
            session_context.get("displayName"),
            session_context.get("email"),
            session_context.get("deploymentId"),
            session_context.get("clientId"),
            session_context.get("resourceLinkId"),
            json_dumps(session_context),
            created_at,
            expires_at,
        ),
    )
    db.commit()
    return token


def create_deep_link_session(db, deep_link_context):
    cleanup_expired_rows(db)
    token = random_token(18)
    created_at = now_ts()
    expires_at = created_at + DEEP_LINK_TTL_SECONDS
    db.execute(
        """
        INSERT INTO deep_link_sessions (
            token, context_json, created_at, expires_at
        ) VALUES (?, ?, ?, ?)
        """,
        (
            token,
            json_dumps(deep_link_context),
            created_at,
            expires_at,
        ),
    )
    db.commit()
    return token


def consume_deep_link_session(db, token):
    row = db.execute("SELECT * FROM deep_link_sessions WHERE token = ?", (token,)).fetchone()
    if row is None:
        return None

    db.execute("DELETE FROM deep_link_sessions WHERE token = ?", (token,))
    db.commit()

    if row["expires_at"] < now_ts():
        return None

    return json_loads(row["context_json"], {}) or {}


def get_session_from_request(db):
    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        return None

    token = header.replace("Bearer ", "", 1).strip()
    if not token:
        return None

    row = db.execute("SELECT * FROM app_sessions WHERE token = ?", (token,)).fetchone()
    if row is None:
        return None
    if row["expires_at"] < now_ts():
        db.execute("DELETE FROM app_sessions WHERE token = ?", (token,))
        db.commit()
        return None

    context = json_loads(row["session_context_json"], {}) or {}
    context["sessionToken"] = token
    return context


def require_session():
    session_context = get_session_from_request(get_db())
    if session_context is None:
        raise ApiError("Your session has expired. Launch the app from Canvas again.", 401)
    return session_context


def normalize_project_payload(payload, *, owner_display_name, owner_canvas_user_id):
    project_id = str(payload.get("projectId", "")).strip() or f"project-{random_token(8)}"
    normalized = dict(payload)
    normalized["projectId"] = project_id
    normalized["studentName"] = str(normalized.get("studentName", "")).strip()
    normalized["updatedAt"] = iso_now()
    normalized["createdAt"] = str(normalized.get("createdAt", "")).strip() or normalized["updatedAt"]
    normalized["_meta"] = {
        "ownerDisplayName": owner_display_name,
        "ownerCanvasUserId": owner_canvas_user_id,
        "canEdit": True,
    }
    return normalized


def save_project_row(db, session_context, project_payload):
    normalized = normalize_project_payload(
        project_payload,
        owner_display_name=session_context.get("displayName") or "",
        owner_canvas_user_id=session_context["canvasUserId"],
    )
    timestamp = now_ts()
    db.execute(
        """
        INSERT INTO projects (
            project_id, canvas_course_id, owner_canvas_user_id, owner_display_name, owner_login,
            data_json, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(project_id) DO UPDATE SET
            canvas_course_id = excluded.canvas_course_id,
            owner_canvas_user_id = excluded.owner_canvas_user_id,
            owner_display_name = excluded.owner_display_name,
            owner_login = excluded.owner_login,
            data_json = excluded.data_json,
            updated_at = excluded.updated_at
        """,
        (
            normalized["projectId"],
            session_context["canvasCourseId"],
            session_context["canvasUserId"],
            session_context.get("displayName") or "",
            session_context.get("email") or "",
            json_dumps(normalized),
            timestamp,
            timestamp,
        ),
    )
    db.commit()
    return normalized


def project_row_to_dict(row, *, viewer_role, viewer_canvas_user_id):
    project = json_loads(row["data_json"], {}) or {}
    meta = project.get("_meta", {})
    meta["ownerDisplayName"] = row["owner_display_name"] or meta.get("ownerDisplayName") or ""
    meta["ownerCanvasUserId"] = row["owner_canvas_user_id"] or meta.get("ownerCanvasUserId") or ""
    meta["canEdit"] = viewer_role == "student" and row["owner_canvas_user_id"] == viewer_canvas_user_id
    project["_meta"] = meta
    return project


def get_projects_for_session(db, session_context):
    if session_context["role"] == "instructor":
        rows = db.execute(
            """
            SELECT * FROM projects
            WHERE canvas_course_id = ?
            ORDER BY updated_at DESC
            """,
            (session_context["canvasCourseId"],),
        ).fetchall()
    else:
        rows = db.execute(
            """
            SELECT * FROM projects
            WHERE canvas_course_id = ? AND owner_canvas_user_id = ?
            ORDER BY updated_at DESC
            """,
            (session_context["canvasCourseId"], session_context["canvasUserId"]),
        ).fetchall()

    return [
        project_row_to_dict(
            row,
            viewer_role=session_context["role"],
            viewer_canvas_user_id=session_context["canvasUserId"],
        )
        for row in rows
    ]


def get_project_owner_row(db, project_id):
    return db.execute(
        "SELECT project_id, owner_canvas_user_id, canvas_course_id FROM projects WHERE project_id = ?",
        (project_id,),
    ).fetchone()


def ensure_project_access(db, session_context, project_id, *, allow_instructor_read=False):
    row = get_project_owner_row(db, project_id)
    if row is None:
        raise ApiError("Project not found.", 404)

    if row["canvas_course_id"] != session_context["canvasCourseId"]:
        raise ApiError("This project belongs to another course context.", 403)

    if session_context["role"] == "instructor" and allow_instructor_read:
        return row

    if row["owner_canvas_user_id"] != session_context["canvasUserId"]:
        raise ApiError("You do not have permission to modify this project.", 403)

    return row


def build_launch_url(base_url, *, placement="", module_id=""):
    query = {}
    if placement:
        query["placement"] = placement
    if module_id:
        query["module_id"] = module_id
    if not query:
        return f"{base_url}/lti/launch"
    return f"{base_url}/lti/launch?{urlencode(query)}"


def build_launch_context(session_context):
    return {
        "placement": session_context.get("launchPlacement") or "",
        "messageType": session_context.get("messageType") or "",
        "targetLinkUri": session_context.get("targetLinkUri") or "",
        "targetModuleId": session_context.get("launchModuleId") or "",
        "targetModuleTitle": session_context.get("launchModuleTitle") or "",
    }


def build_bootstrap_payload(session_context, projects):
    return {
        "sessionToken": session_context["sessionToken"],
        "uiStateStorageKey": UI_STATE_KEY,
        "user": {
            "id": session_context["canvasUserId"],
            "displayName": session_context.get("displayName") or "Canvas user",
            "email": session_context.get("email") or "",
            "role": session_context["role"],
        },
        "course": {
            "id": session_context["canvasCourseId"],
            "title": session_context.get("courseTitle") or "Canvas course",
        },
        "canvas": {
            "clientId": session_context.get("clientId") or "",
            "deploymentId": session_context.get("deploymentId") or "",
            "issuer": session_context.get("issuer") or "",
            "resourceLinkId": session_context.get("resourceLinkId") or "",
            "roles": session_context.get("roles") or [],
        },
        "permissions": {
            "canCreateProjects": session_context["role"] == "student",
            "canEditProjects": session_context["role"] == "student",
            "canReviewCourse": session_context["role"] == "instructor",
        },
        "launch": build_launch_context(session_context),
        "projects": projects,
    }


def render_app(bootstrap=None):
    return render_template("app.html", bootstrap=bootstrap or None)


def render_deep_link_picker(deep_link_context):
    return render_template(
        "deep_link_picker.html",
        deep_link=deep_link_context,
        modules=COURSE_MODULES,
    )


@app.route("/")
def index():
    return redirect("/app")


@app.route("/app")
def app_shell():
    return render_app()


@app.route("/healthz")
def healthcheck():
    return jsonify({"ok": True, "status": "healthy"})


@app.route("/.well-known/jwks.json")
def jwks():
    return jsonify({"keys": [get_public_jwk()]})


@app.route("/lti/config.json")
def lti_config():
    base_url = get_base_url()
    placements = [
        {
            "placement": "course_navigation",
            "message_type": "LtiResourceLinkRequest",
            "target_link_uri": build_launch_url(base_url, placement="course_navigation"),
            "text": "Worldbuilding Studio",
            "enabled": True,
            "default": "enabled",
            "visibility": "members",
        },
        {
            "placement": "link_selection",
            "message_type": "LtiDeepLinkingRequest",
            "target_link_uri": build_launch_url(base_url, placement="link_selection"),
            "text": "Add Worldbuilding Module Link",
            "enabled": True,
            "selection_width": 1100,
            "selection_height": 800,
        },
        {
            "placement": "assignment_selection",
            "message_type": "LtiDeepLinkingRequest",
            "target_link_uri": build_launch_url(base_url, placement="assignment_selection"),
            "text": "Add Worldbuilding Assignment Link",
            "enabled": True,
            "selection_width": 1100,
            "selection_height": 800,
        },
    ]
    return jsonify(
        {
            "title": "LIBA 230 Worldbuilding Studio",
            "description": "AI-assisted worldbuilding scaffold for LIBA 230.",
            "oidc_initiation_url": f"{base_url}/lti/login",
            "target_link_uri": build_launch_url(base_url, placement="course_navigation"),
            "public_jwk_url": f"{base_url}/.well-known/jwks.json",
            "scopes": [
                "https://purl.imsglobal.org/spec/lti-nrps/scope/contextmembership.readonly"
            ],
            "extensions": [
                {
                    "domain": request.host.split(":", 1)[0],
                    "tool_id": "liba-worldbuilding-studio",
                    "platform": "canvas.instructure.com",
                    "privacy_level": "name_only",
                    "settings": {
                        "text": "Worldbuilding Studio",
                        "placements": placements,
                    },
                }
            ],
        }
    )


@app.route("/lti/login", methods=["GET", "POST"])
def lti_login():
    params = request.values
    issuer = params.get("iss", "").strip()
    login_hint = params.get("login_hint", "").strip()
    client_id = params.get("client_id", "").strip()

    if not issuer or not login_hint or not client_id:
        return json_error("Missing required LTI login parameters.", 400)
    if not client_id_is_allowed(client_id):
        return json_error("This Canvas client ID is not allowed for this tool.", 403)

    canvas_environment, canvas_config = canvas_config_for_request(
        issuer,
        params.get("canvas_environment", "").strip() or None,
    )
    state_value = random_token(16)
    nonce_value = random_token(16)
    target_link_uri = params.get("target_link_uri", "").strip() or f"{get_base_url()}/lti/launch"

    store_launch_state(
        get_db(),
        {
            "state": state_value,
            "nonce": nonce_value,
            "client_id": client_id,
            "deployment_id": params.get("deployment_id", "").strip(),
            "target_link_uri": target_link_uri,
            "canvas_environment": canvas_environment,
            "issuer": issuer,
            "created_at": now_ts(),
        },
    )

    redirect_params = {
        "scope": "openid",
        "response_type": "id_token",
        "response_mode": "form_post",
        "prompt": "none",
        "client_id": client_id,
        "redirect_uri": f"{get_base_url()}/lti/launch",
        "login_hint": login_hint,
        "nonce": nonce_value,
        "state": state_value,
    }

    lti_message_hint = params.get("lti_message_hint", "").strip()
    if lti_message_hint:
        redirect_params["lti_message_hint"] = lti_message_hint

    return redirect(f"{canvas_config['auth_url']}?{urlencode(redirect_params)}")


@app.route("/lti/launch", methods=["POST"])
def lti_launch():
    id_token = request.form.get("id_token", "").strip()
    state_value = request.form.get("state", "").strip()
    if not id_token or not state_value:
        return json_error("Missing LTI launch payload.", 400)

    db = get_db()
    launch_state = pop_launch_state(db, state_value)
    if launch_state is None:
        return json_error("The launch state is invalid or has expired.", 400)

    try:
        unverified_claims = jwt.decode(id_token, options={"verify_signature": False})
    except jwt.PyJWTError:
        return json_error("Could not read the LTI launch token.", 400)

    issuer = unverified_claims.get("iss", "")
    _, canvas_config = canvas_config_for_request(
        issuer,
        launch_state["canvas_environment"],
    )
    if not client_id_is_allowed(str(launch_state["client_id"]).strip()):
        return json_error("This Canvas client ID is not allowed for this tool.", 403)

    try:
        signing_key = jwt.PyJWKClient(canvas_config["jwks_url"]).get_signing_key_from_jwt(id_token)
        launch_claims = jwt.decode(
            id_token,
            signing_key.key,
            algorithms=["RS256"],
            audience=launch_state["client_id"],
            issuer=launch_state["issuer"],
        )
    except jwt.PyJWTError as error:
        return json_error(f"Canvas launch verification failed: {error}", 400)

    nonce_claim = launch_claims.get("nonce", "")
    if nonce_claim != launch_state["nonce"]:
        return json_error("Canvas launch nonce did not match the login request.", 400)

    message_type = get_lti_claim(launch_claims, MESSAGE_TYPE_CLAIM, "") or ""
    roles = get_lti_claim(launch_claims, ROLES_CLAIM, []) or []
    context_claim = get_lti_claim(launch_claims, CONTEXT_CLAIM, {}) or {}
    resource_link_claim = get_lti_claim(launch_claims, RESOURCE_LINK_CLAIM, {}) or {}
    custom_claim = get_lti_claim(launch_claims, CUSTOM_CLAIM, {}) or {}

    course_id = str(context_claim.get("id", "")).strip() or "canvas-course"
    course_title = str(context_claim.get("title", "")).strip() or "Canvas Course"
    placement = request.args.get("placement", "").strip()
    launch_module_id = request.args.get("module_id", "").strip() or str(custom_claim.get("module_id", "")).strip()
    launch_module = COURSE_MODULE_MAP.get(launch_module_id)

    if message_type == "LtiDeepLinkingRequest":
        normalized_role = normalize_role(roles)
        if normalized_role != "instructor":
            return json_error("Only instructors and course designers can create Canvas links for this tool.", 403)

        deep_link_settings = get_lti_claim(launch_claims, DEEP_LINK_SETTINGS_CLAIM, {}) or {}
        deep_link_context = {
            "clientId": str(launch_state["client_id"]).strip(),
            "deploymentId": str(
                get_lti_claim(launch_claims, DEPLOYMENT_ID_CLAIM, launch_state["deployment_id"]) or ""
            ).strip(),
            "issuer": issuer,
            "courseId": course_id,
            "courseTitle": course_title,
            "displayName": str(launch_claims.get("name", "")).strip() or "Canvas instructor",
            "placement": placement or "link_selection",
            "deepLinkReturnUrl": str(deep_link_settings.get("deep_link_return_url", "")).strip(),
            "acceptMultiple": bool(deep_link_settings.get("accept_multiple")),
            "data": str(get_lti_claim(launch_claims, DEEP_LINK_DATA_CLAIM, "") or "").strip(),
        }
        if not deep_link_context["deepLinkReturnUrl"]:
            return json_error("Canvas did not send a deep_link_return_url for this selection request.", 400)

        deep_link_context["token"] = create_deep_link_session(db, deep_link_context)
        return render_deep_link_picker(deep_link_context)

    session_context = {
        "role": normalize_role(roles),
        "canvasUserId": str(launch_claims.get("sub", "")).strip() or "canvas-user",
        "canvasCourseId": course_id,
        "displayName": str(launch_claims.get("name", "")).strip()
        or str(launch_claims.get("given_name", "")).strip()
        or "Canvas user",
        "email": str(launch_claims.get("email", "")).strip(),
        "deploymentId": str(launch_state["deployment_id"] or "").strip(),
        "clientId": str(launch_state["client_id"]).strip(),
        "resourceLinkId": str(resource_link_claim.get("id", "")).strip(),
        "courseTitle": course_title,
        "issuer": issuer,
        "roles": roles,
        "messageType": message_type,
        "launchPlacement": placement,
        "launchModuleId": launch_module_id if launch_module else "",
        "launchModuleTitle": launch_module["title"] if launch_module else "",
        "targetLinkUri": launch_state["target_link_uri"] or "",
    }

    session_token = create_session(db, session_context)
    session_context["sessionToken"] = session_token
    projects = get_projects_for_session(db, session_context)
    return render_app(build_bootstrap_payload(session_context, projects))


@app.route("/lti/deep-link/respond", methods=["POST"])
def deep_link_respond():
    session_token = request.form.get("token", "").strip()
    if not session_token:
        return json_error("A deep-link selection token is required.", 400)

    deep_link_context = consume_deep_link_session(get_db(), session_token)
    if not deep_link_context:
        return json_error("This deep-link selection has expired. Start again from Canvas.", 400)

    selected_module_id = request.form.get("module_id", "").strip()
    selected_module = COURSE_MODULE_MAP.get(selected_module_id)
    placement = deep_link_context.get("placement") or "link_selection"
    base_url = get_base_url()

    if selected_module is None:
        item_title = "LIBA 230 Worldbuilding Studio"
        item_text = "Open the full Worldbuilding Studio for project work, exports, and instructor review."
        launch_url = build_launch_url(base_url, placement="resource_link")
        custom_values = {}
    else:
        item_title = f"{selected_module['week']} - {selected_module['title']}"
        item_text = (
            f"Open the {selected_module['title']} workspace in the LIBA 230 Worldbuilding Studio."
        )
        launch_url = build_launch_url(
            base_url,
            placement="resource_link",
            module_id=selected_module["id"],
        )
        custom_values = {"module_id": selected_module["id"]}

    content_item = {
        "type": "ltiResourceLink",
        "title": item_title,
        "text": item_text,
        "url": launch_url,
    }
    if custom_values:
        content_item["custom"] = custom_values

    issued_at = now_ts()
    response_payload = {
        MESSAGE_TYPE_CLAIM: "LtiDeepLinkingResponse",
        VERSION_CLAIM: "1.3.0",
        DEPLOYMENT_ID_CLAIM: deep_link_context["deploymentId"],
        "azp": deep_link_context["clientId"],
        "nonce": random_token(8),
        "iat": issued_at,
        "exp": issued_at + 5 * 60,
        DEEP_LINK_CONTENT_ITEMS_CLAIM: [content_item],
    }
    if deep_link_context.get("data"):
        response_payload[DEEP_LINK_DATA_CLAIM] = deep_link_context["data"]

    jwt_response = sign_jwt(
        response_payload,
        issuer=deep_link_context["clientId"],
        subject=deep_link_context["clientId"],
        audience=deep_link_context["issuer"],
    )

    return render_template(
        "deep_link_return.html",
        return_url=deep_link_context["deepLinkReturnUrl"],
        jwt_response=jwt_response,
        item_title=item_title,
        placement=placement,
    )


@app.route("/dev/login")
def dev_login():
    role = request.args.get("role", "student").strip().lower()
    if role not in {"student", "instructor"}:
        role = "student"

    course_id = request.args.get("course_id", "liba-230-demo").strip() or "liba-230-demo"
    course_title = request.args.get("course_title", "LIBA 230 Demo Course").strip() or "LIBA 230 Demo Course"
    display_name = request.args.get("name", "Demo User").strip() or "Demo User"
    user_id = request.args.get("user_id", f"{role}-{slug_fragment(display_name)}").strip()
    email = request.args.get("email", f"{slug_fragment(display_name)}@example.edu").strip()
    launch_module_id = request.args.get("module_id", "").strip()
    launch_module = COURSE_MODULE_MAP.get(launch_module_id)
    launch_placement = request.args.get("placement", "course_navigation").strip() or "course_navigation"

    db = get_db()
    session_context = {
        "role": role,
        "canvasUserId": user_id,
        "canvasCourseId": course_id,
        "displayName": display_name,
        "email": email,
        "deploymentId": "demo-deployment",
        "clientId": "demo-client-id",
        "resourceLinkId": "demo-resource-link",
        "courseTitle": course_title,
        "issuer": "https://canvas.instructure.com",
        "roles": [role],
        "messageType": "LtiResourceLinkRequest",
        "launchPlacement": launch_placement,
        "launchModuleId": launch_module_id if launch_module else "",
        "launchModuleTitle": launch_module["title"] if launch_module else "",
        "targetLinkUri": build_launch_url(get_base_url(), placement=launch_placement, module_id=launch_module_id),
    }

    session_token = create_session(db, session_context)
    session_context["sessionToken"] = session_token
    projects = get_projects_for_session(db, session_context)
    return render_app(build_bootstrap_payload(session_context, projects))


@app.route("/dev/deep-link")
def dev_deep_link():
    placement = request.args.get("placement", "link_selection").strip() or "link_selection"
    base_url = get_base_url()
    deep_link_context = {
        "clientId": "demo-client-id",
        "deploymentId": "demo-deployment",
        "issuer": "https://canvas.instructure.com",
        "courseId": request.args.get("course_id", "liba-230-demo").strip() or "liba-230-demo",
        "courseTitle": request.args.get("course_title", "LIBA 230 Demo Course").strip() or "LIBA 230 Demo Course",
        "displayName": request.args.get("name", "Professor Mora").strip() or "Professor Mora",
        "placement": placement,
        "deepLinkReturnUrl": f"{base_url}/dev/deep-link/inspect",
        "acceptMultiple": False,
        "data": "demo-deep-link",
    }
    deep_link_context["token"] = create_deep_link_session(get_db(), deep_link_context)
    return render_deep_link_picker(deep_link_context)


@app.route("/dev/deep-link/inspect", methods=["POST"])
def dev_deep_link_inspect():
    raw_jwt = request.form.get("JWT", "").strip() or request.form.get("id_token", "").strip()
    if not raw_jwt:
        return json_error("No deep-link JWT was posted back to the demo inspector.", 400)

    try:
        decoded = jwt.decode(raw_jwt, options={"verify_signature": False})
    except jwt.PyJWTError as error:
        return json_error(f"Could not decode the deep-link response: {error}", 400)

    pretty_payload = json.dumps(decoded, ensure_ascii=True, indent=2)
    return (
        "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Deep Link Inspect</title>"
        "<style>body{font-family:Menlo,Consolas,monospace;margin:0;padding:2rem;background:#f6f0e3;color:#18252c}"
        "pre{white-space:pre-wrap;background:#fffaf2;border:1px solid rgba(24,37,44,.12);border-radius:16px;padding:1rem}"
        "a{color:#295566}</style></head><body>"
        "<h1>Deep-link response preview</h1>"
        "<p>This local inspector shows the payload your Canvas deep-link response would post back.</p>"
        f"<pre>{pretty_payload}</pre>"
        f"<p><a href='{get_base_url()}/dev/deep-link'>Create another demo deep link</a></p>"
        "</body></html>"
    )


def slug_fragment(value):
    cleaned = "".join(ch.lower() if ch.isalnum() else "-" for ch in value)
    return "-".join(part for part in cleaned.split("-") if part) or "user"


@app.route("/api/bootstrap")
def api_bootstrap():
    session_context = require_session()
    projects = get_projects_for_session(get_db(), session_context)
    return jsonify({"ok": True, "app": build_bootstrap_payload(session_context, projects)})


@app.route("/api/projects", methods=["POST"])
def create_project():
    session_context = require_session()
    if session_context["role"] != "student":
        return json_error("Only students can create projects.", 403)

    payload = require_json_body()
    project_payload = payload.get("project")
    if not isinstance(project_payload, dict):
        return json_error("A project payload is required.", 400)

    project = save_project_row(get_db(), session_context, project_payload)
    return jsonify({"ok": True, "project": project})


@app.route("/api/projects/<project_id>", methods=["PUT"])
def update_project(project_id):
    session_context = require_session()
    if session_context["role"] != "student":
        return json_error("Only students can edit projects.", 403)

    db = get_db()
    ensure_project_access(db, session_context, project_id)
    payload = require_json_body()
    project_payload = payload.get("project")
    if not isinstance(project_payload, dict):
        return json_error("A project payload is required.", 400)

    project_payload["projectId"] = project_id
    project = save_project_row(db, session_context, project_payload)
    return jsonify({"ok": True, "project": project})


@app.route("/api/projects/<project_id>", methods=["DELETE"])
def delete_project(project_id):
    session_context = require_session()
    if session_context["role"] != "student":
        return json_error("Only students can delete projects.", 403)

    db = get_db()
    ensure_project_access(db, session_context, project_id)
    db.execute("DELETE FROM projects WHERE project_id = ?", (project_id,))
    db.commit()
    return jsonify({"ok": True, "deletedProjectId": project_id})


@app.route("/api/projects/<project_id>")
def fetch_project(project_id):
    session_context = require_session()
    db = get_db()
    ensure_project_access(db, session_context, project_id, allow_instructor_read=True)
    row = db.execute("SELECT * FROM projects WHERE project_id = ?", (project_id,)).fetchone()
    if row is None:
        return json_error("Project not found.", 404)
    project = project_row_to_dict(
        row,
        viewer_role=session_context["role"],
        viewer_canvas_user_id=session_context["canvasUserId"],
    )
    return jsonify({"ok": True, "project": project})


@app.errorhandler(ApiError)
def handle_api_error(error):
    return json_error(error.message, error.status_code)


@app.errorhandler(404)
def not_found(_error):
    if request.path.startswith("/api/") or request.path.startswith("/lti/"):
        return json_error("Not found.", 404)
    return render_app(), 404


init_db()


if __name__ == "__main__":
    app.run(debug=False, use_reloader=False, host="127.0.0.1", port=8023)
