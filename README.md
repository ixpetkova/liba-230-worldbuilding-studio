# LIBA 230 Worldbuilding Studio

Canvas-oriented web app for an AI-assisted worldbuilding scaffold aligned to the LIBA 230 course sequence.

## What this version includes

- Flask web app with server-side project storage in SQLite
- Canvas LTI 1.3 launch endpoints
- Canvas deep-linking support for week-specific module and assignment links
- student and instructor launch modes
- launch-aware routing so a Canvas link can open a specific weekly workspace
- guided weekly module workspace across the full course arc
- rule-based AI collaborator panel that asks questions instead of writing assignments
- coherence flags, reflection capture, and World Bible building
- export studio with course-specific outputs such as:
  - `Worldbuilding Questionnaire`
  - `Site Planning Brief`
  - `Project Proposal`
  - `Peer Response Kit`
  - `Collaboration Agreement / Canon Tracker`

## Local setup

```bash
cd "/Users/evypetkova/Documents/New project/liba-230-worldbuilding-studio"
python3 -m pip install -r requirements.txt
python3 app.py
```

For a production-style local server you can also run:

```bash
gunicorn app:app --bind 127.0.0.1:8023
```

Then open one of these demo URLs:

- Student demo: [http://127.0.0.1:8023/dev/login?role=student&name=Ari](http://127.0.0.1:8023/dev/login?role=student&name=Ari)
- Instructor demo: [http://127.0.0.1:8023/dev/login?role=instructor&name=Professor%20Mora](http://127.0.0.1:8023/dev/login?role=instructor&name=Professor%20Mora)
- Student demo opened directly to a module: [http://127.0.0.1:8023/dev/login?role=student&name=Ari&module_id=story-pitch](http://127.0.0.1:8023/dev/login?role=student&name=Ari&module_id=story-pitch)
- Deep-link selector demo: [http://127.0.0.1:8023/dev/deep-link](http://127.0.0.1:8023/dev/deep-link)

## Environment variables

Copy `.env.example` values into your deployment environment:

- `APP_BASE_URL`
  Use the public `https://` URL Canvas will launch, for example `https://worldbuilding.yourschool.edu`
- `CANVAS_ALLOWED_CLIENT_IDS`
  Comma-separated allowlist of Canvas LTI client IDs permitted to launch this tool

## Canvas / LTI endpoints

- LTI login: [http://127.0.0.1:8023/lti/login](http://127.0.0.1:8023/lti/login)
- LTI launch: [http://127.0.0.1:8023/lti/launch](http://127.0.0.1:8023/lti/launch)
- Deep-link response endpoint: [http://127.0.0.1:8023/lti/deep-link/respond](http://127.0.0.1:8023/lti/deep-link/respond)
- JWKS: [http://127.0.0.1:8023/.well-known/jwks.json](http://127.0.0.1:8023/.well-known/jwks.json)
- Canvas dev key JSON: [http://127.0.0.1:8023/lti/config.json](http://127.0.0.1:8023/lti/config.json)

For a real Canvas install, replace `http://127.0.0.1:8023` with your public `https://` domain.

The generated LTI config now includes:

- `course_navigation`
- `link_selection`
- `assignment_selection`

That means Canvas instructors can either:

- launch the full studio from course navigation
- add a week-specific studio link inside a Canvas module
- add a week-specific studio link while configuring an assignment

## What deep linking does here

- Instructors choose `Worldbuilding Studio` from Canvas external tool selection
- the tool opens a selector for `Studio Home` or one of the 16 LIBA 230 weekly workspaces
- the selected item is returned to Canvas as an LTI resource link
- when a student launches that Canvas item later, the app opens directly to the matching module workspace

## Storage model

- project data is stored server-side in `instance/worldbuilding_studio.db`
- LTI launch state, deep-link sessions, and app sessions are stored in the same SQLite database
- the tool RSA keypair is created in `instance/lti_tool_private_key.pem`
- browser `sessionStorage` is used only for the short-lived session token and UI state

## Deployment notes

- the app now calls `init_db()` at import time, so it is safe to run under `gunicorn`
- a `Procfile` is included for platforms that support process file deployment
- for a real Canvas install, host this behind `https` before creating the developer key
- this repo does not yet include a live LLM integration; the pedagogical AI layer is still rule-based on purpose

## Notes

- This prototype does not call a live LLM API yet. The AI layer is intentionally rule-based so the pedagogy and interaction pattern can be tested safely.
- The current UI and exports were revised against the exported Canvas course so the tool better reflects the actual questionnaire, project proposal, peer response, collaboration safety, and AI acknowledgment practices used in class.
