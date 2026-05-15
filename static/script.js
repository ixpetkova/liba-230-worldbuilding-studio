const inlineBootstrap = window.__APP_BOOTSTRAP__ || null;
const DEFAULT_UI_STORAGE_KEY = "liba230-worldbuilding-ui-v2";
const SESSION_TOKEN_STORAGE_KEY = "liba230-worldbuilding-session-token";

const worldBibleSections = [
  { id: "originStory", label: "Origin story / creation logic" },
  { id: "geographyEnvironment", label: "Geography and environment" },
  { id: "speciesRelations", label: "Species and interspecies relations" },
  { id: "ecologySustainability", label: "Ecology and sustainability" },
  { id: "culturesPractices", label: "Cultures and social practices" },
  { id: "powerGovernance", label: "Power and governance" },
  { id: "ritualsBelief", label: "Rituals and belief systems" },
  { id: "genderSexuality", label: "Gender and sexuality" },
  { id: "materialSystems", label: "Technology / magic / material systems" },
  { id: "everydayLife", label: "Everyday life" },
  { id: "conflictInequality", label: "Conflict and inequality" },
  { id: "characters", label: "Characters" },
  { id: "storyPossibilities", label: "Story possibilities" },
  { id: "visualDesignReferences", label: "Visual design references" },
  { id: "finalPitch", label: "Final story pitch" },
];

const exportTypes = [
  { id: "worldBible", label: "World Bible" },
  { id: "questionnaire", label: "Worldbuilding Questionnaire" },
  { id: "designBrief", label: "Site Planning Brief" },
  { id: "factionChart", label: "Faction Chart" },
  { id: "timeline", label: "Timeline" },
  { id: "ritualSystem", label: "Ritual System" },
  { id: "cultureSheet", label: "Culture Sheet" },
  { id: "storyPitch", label: "Project Proposal" },
  { id: "peerResponseKit", label: "Peer Response Kit" },
  { id: "finalReflection", label: "Final Reflection" },
  { id: "workshopPacket", label: "Workshop Packet" },
  { id: "collaborationCanon", label: "Collaboration Agreement / Canon Tracker" },
];

const storyStructureChoices = [
  { id: "undecided", label: "Undecided" },
  { id: "three-act", label: "Three-act structure" },
  { id: "four-act", label: "Four-act / Ki-Sh\u014d-Ten-Ketsu" },
  { id: "hybrid", label: "Hybrid or nonlinear" },
];

const courseScaffoldResources = [
  {
    title: "Worldbuilding Questionnaire",
    summary:
      "The actual course uses a recurring questionnaire organized around planet, ecosystems, sustainability, patterns of humanity, and gender / sexuality.",
    prompts: [
      "Ask how climate, gravity, seasons, landforms, and ecological limits shape survival.",
      "Trace how humans and nonhumans share resources, waste systems, danger, and adaptation.",
      "Document culture through kinship, labor, language, hierarchy, diversity, and consent.",
    ],
  },
  {
    title: "Story Structure Coach",
    summary:
      "The course includes explicit three-act and four-act story structure guides plus AI collaboration guidance for revising proposals.",
    prompts: [
      "Choose whether your story is better served by a causal three-act arc or a layered four-act arc.",
      "Name the protagonist, central conflict, midpoint or perspective shift, and closing image or new equilibrium.",
      "Use AI to test weak points, pacing, and world-specific stakes without letting it write the final story for you.",
    ],
  },
  {
    title: "Peer Response Protocol",
    summary:
      "Week 9 uses a structured peer response sequence focused on vividness, conflict clarity, world logic, structure, audience, and revision priorities.",
    prompts: [
      "Ask what stayed with readers most vividly and what emotions the proposal created.",
      "Check whether the world and story feel like a natural outgrowth of one another.",
      "End by naming one change that would strengthen the piece and one element that must be preserved.",
    ],
  },
  {
    title: "AI Collaboration And Attribution",
    summary:
      "The course asks students to name how AI was used, whether it functioned more like an assistant or co-writer, and how that collaboration will be acknowledged.",
    prompts: [
      "Record what AI helped with: brainstorming, coherence testing, research framing, or structure analysis.",
      "Name where your own judgment, revision, and ethical responsibility reshaped the output.",
      "Draft a brief acknowledgment note that can travel with the proposal or final project.",
    ],
  },
  {
    title: "Collaboration and Safety",
    summary:
      "The live collaboration weeks emphasize shared canon, safety tools like Lines and Veils, ownership of decisions, and contradiction tracking.",
    prompts: [
      "Record who owns which decisions and what becomes approved canon.",
      "Use safety boundaries before collaborative play, performance, or speculative scenario work.",
      "Track contradictions in real time so the group can revise intentionally instead of drifting into inconsistency.",
    ],
  },
];

const storyStructureLabelMap = new Map(storyStructureChoices.map((choice) => [choice.id, choice.label]));

const signalCatalog = {
  place: {
    label: "meaningful places and spatial anchors",
    keywords: [
      "place",
      "home",
      "street",
      "room",
      "city",
      "village",
      "shore",
      "river",
      "mountain",
      "map",
      "border",
      "district",
      "garden",
      "road",
    ],
  },
  sensory: {
    label: "sensory texture",
    keywords: [
      "smell",
      "taste",
      "touch",
      "sound",
      "texture",
      "light",
      "noise",
      "heat",
      "cold",
      "color",
      "wind",
      "voice",
      "music",
    ],
  },
  movement: {
    label: "movement, exile, and thresholds",
    keywords: [
      "move",
      "migration",
      "travel",
      "cross",
      "threshold",
      "arrival",
      "departure",
      "route",
      "exile",
      "return",
      "gate",
      "bridge",
    ],
  },
  belonging: {
    label: "belonging and identity",
    keywords: [
      "belong",
      "outsider",
      "inside",
      "outside",
      "citizen",
      "guest",
      "memory",
      "inherit",
      "home",
      "diaspora",
      "kin",
    ],
  },
  transformation: {
    label: "transformation and estrangement",
    keywords: [
      "transform",
      "change",
      "strange",
      "symbol",
      "portal",
      "double",
      "mirror",
      "threshold",
      "extraordinary",
      "reveal",
    ],
  },
  rules: {
    label: "governing rules and constraints",
    keywords: [
      "rule",
      "law",
      "restriction",
      "must",
      "cannot",
      "allowed",
      "forbidden",
      "cost",
      "price",
      "penalty",
      "oath",
    ],
  },
  species: {
    label: "nonhuman life and species difference",
    keywords: [
      "species",
      "animal",
      "plant",
      "fungi",
      "insect",
      "bird",
      "nonhuman",
      "creature",
      "beast",
      "forest",
      "reef",
      "pack",
    ],
  },
  communication: {
    label: "communication systems",
    keywords: [
      "speak",
      "signal",
      "song",
      "gesture",
      "scent",
      "touch",
      "translate",
      "language",
      "call",
      "listen",
      "echo",
      "code",
    ],
  },
  interdependence: {
    label: "interdependence and mutual need",
    keywords: [
      "depend",
      "mutual",
      "symbiosis",
      "care",
      "exchange",
      "coexist",
      "shared",
      "web",
      "network",
      "alliance",
    ],
  },
  ecology: {
    label: "ecological logic",
    keywords: [
      "ecosystem",
      "climate",
      "soil",
      "water",
      "forest",
      "reef",
      "season",
      "habitat",
      "weather",
      "pollution",
      "river",
      "drought",
    ],
  },
  resource: {
    label: "resources and material supply",
    keywords: [
      "resource",
      "food",
      "fuel",
      "energy",
      "harvest",
      "mine",
      "grow",
      "storage",
      "supply",
      "farm",
      "feed",
      "ship",
    ],
  },
  waste: {
    label: "waste and afterlife of materials",
    keywords: [
      "waste",
      "scrap",
      "garbage",
      "compost",
      "sewage",
      "reuse",
      "repair",
      "discard",
      "recycle",
      "toxic",
    ],
  },
  climate: {
    label: "climate and environmental limits",
    keywords: [
      "climate",
      "storm",
      "heat",
      "cold",
      "season",
      "drought",
      "flood",
      "wind",
      "ice",
      "monsoon",
    ],
  },
  kinship: {
    label: "kinship and family structure",
    keywords: [
      "family",
      "kin",
      "parent",
      "child",
      "elder",
      "lineage",
      "household",
      "ancestor",
      "clan",
      "guardian",
    ],
  },
  labor: {
    label: "labor and maintenance",
    keywords: [
      "work",
      "labor",
      "job",
      "craft",
      "farm",
      "maintenance",
      "service",
      "industry",
      "guild",
      "repair",
      "worker",
    ],
  },
  education: {
    label: "education and cultural transmission",
    keywords: [
      "teach",
      "school",
      "apprentice",
      "learning",
      "archive",
      "mentor",
      "curriculum",
      "study",
      "library",
    ],
  },
  law: {
    label: "law, norms, and accountability",
    keywords: [
      "law",
      "court",
      "justice",
      "punishment",
      "custom",
      "contract",
      "oath",
      "rule",
      "trial",
      "sentence",
    ],
  },
  value: {
    label: "values and social meaning",
    keywords: [
      "value",
      "honor",
      "care",
      "status",
      "shame",
      "beauty",
      "duty",
      "wealth",
      "virtue",
      "prestige",
    ],
  },
  history: {
    label: "history and internal change",
    keywords: [
      "history",
      "past",
      "change",
      "memory",
      "tradition",
      "reform",
      "generation",
      "era",
      "ancestor",
      "former",
      "colonial",
    ],
  },
  power: {
    label: "power structures",
    keywords: [
      "power",
      "govern",
      "council",
      "state",
      "rule",
      "authority",
      "empire",
      "office",
      "leader",
      "police",
      "minister",
    ],
  },
  status: {
    label: "status and hierarchy",
    keywords: [
      "status",
      "rank",
      "class",
      "caste",
      "prestige",
      "wealth",
      "elite",
      "citizen",
      "title",
    ],
  },
  resistance: {
    label: "resistance and refusal",
    keywords: [
      "resist",
      "protest",
      "union",
      "rebel",
      "smuggle",
      "refuse",
      "hide",
      "sabotage",
      "strike",
      "escape",
    ],
  },
  ritual: {
    label: "ritual and repeated practice",
    keywords: [
      "ritual",
      "ceremony",
      "festival",
      "rite",
      "mourning",
      "marriage",
      "initiation",
      "offering",
      "procession",
      "prayer",
    ],
  },
  belief: {
    label: "belief and sacred meaning",
    keywords: [
      "belief",
      "faith",
      "sacred",
      "profane",
      "spirit",
      "ancestor",
      "divine",
      "taboo",
      "holy",
      "relic",
    ],
  },
  embodiment: {
    label: "embodiment and presentation",
    keywords: [
      "body",
      "dress",
      "clothing",
      "presentation",
      "gender",
      "sex",
      "intimacy",
      "desire",
      "pregnancy",
      "adornment",
    ],
  },
  conflict: {
    label: "conflict and consequences",
    keywords: [
      "conflict",
      "tension",
      "dispute",
      "violence",
      "inequality",
      "struggle",
      "scarcity",
      "stake",
      "risk",
      "crisis",
    ],
  },
  character: {
    label: "character perspective",
    keywords: [
      "character",
      "protagonist",
      "witness",
      "worker",
      "child",
      "elder",
      "leader",
      "outsider",
      "guide",
      "narrator",
    ],
  },
  story: {
    label: "story movement and stakes",
    keywords: [
      "story",
      "plot",
      "scene",
      "event",
      "pitch",
      "stakes",
      "goal",
      "turning point",
      "quest",
      "mystery",
    ],
  },
  technology: {
    label: "technology, magic, or material systems",
    keywords: [
      "technology",
      "machine",
      "device",
      "tool",
      "magic",
      "spell",
      "material",
      "crystal",
      "network",
      "engine",
      "artifact",
    ],
  },
  everyday: {
    label: "everyday life",
    keywords: [
      "daily",
      "morning",
      "meal",
      "market",
      "sleep",
      "school",
      "street",
      "routine",
      "kitchen",
      "commute",
    ],
  },
  archive: {
    label: "heterotopic or layered spaces",
    keywords: [
      "archive",
      "museum",
      "garden",
      "prison",
      "ship",
      "cemetery",
      "theater",
      "portal",
      "festival",
      "virtual",
      "sanctuary",
    ],
  },
  collaboration: {
    label: "collaborative process and canon",
    keywords: [
      "group",
      "team",
      "shared",
      "canon",
      "collaborate",
      "ownership",
      "agreement",
      "document",
      "version",
      "meeting",
    ],
  },
};

function makeModule(config) {
  return config;
}

const modules = [
  makeModule({
    id: "personal-geography",
    week: "Aug 18",
    title: "Personal Geography",
    focus: "Ground the world in lived place, memory, thresholds, and sensory geography.",
    description:
      "Start from meaningful places, movement, borders, and emotional maps instead of abstract spectacle.",
    output: "Personal geography map / reflection",
    sections: ["geographyEnvironment", "everydayLife", "visualDesignReferences"],
    archives: [],
    focusSignals: ["place", "sensory", "movement", "belonging"],
    questions: [
      {
        signal: "place",
        text: "Which real, remembered, or imagined place carries the emotional center of this world for you?",
      },
      {
        signal: "movement",
        text: "What route, border, threshold, or repeated movement shapes belonging or exclusion here?",
      },
      {
        signal: "sensory",
        text: "What does this place smell like, sound like, or feel like at ground level?",
      },
      {
        signal: "belonging",
        text: "Who feels at home in this geography, and who must negotiate entry, exile, or return?",
      },
      {
        signal: "everyday",
        text: "How does this geography shape ordinary routines such as meals, transit, gathering, or solitude?",
      },
    ],
    directions: [
      {
        title: "Threshold Map",
        description:
          "Treat doors, bridges, transit lines, shorelines, or stairwells as social thresholds that organize intimacy and exclusion.",
      },
      {
        title: "Memory Topography",
        description:
          "Build the world through remembered textures, weather, and landmarks so geography carries emotional history rather than just coordinates.",
      },
      {
        title: "Belonging Atlas",
        description:
          "Map where different people, species, or classes feel welcome, watched, hidden, or displaced.",
      },
    ],
  }),
  makeModule({
    id: "personal-oz",
    week: "Aug 25",
    title: "Personal Oz",
    focus: "Make the familiar strange, symbolic, and narratively expandable.",
    description:
      "Transform an ordinary place through rules of passage, symbolic logic, and altered significance.",
    output: "Personal Oz concept sheet",
    sections: ["originStory", "storyPossibilities", "visualDesignReferences"],
    archives: ["storyIdeas"],
    focusSignals: ["transformation", "rules", "place", "story"],
    questions: [
      {
        signal: "place",
        text: "What ordinary place becomes extraordinary, and what makes that transformation personally meaningful?",
      },
      {
        signal: "transformation",
        text: "What familiar element changes scale, value, danger, or symbolism once the threshold is crossed?",
      },
      {
        signal: "rules",
        text: "What rule of passage determines who can enter, leave, or survive this altered space?",
      },
      {
        signal: "story",
        text: "What narrative question becomes possible only because this familiar place has become strange?",
      },
      {
        signal: "value",
        text: "What does the strange version of the place reveal about the creator's fears, desires, or unresolved tensions?",
      },
    ],
    directions: [
      {
        title: "Threshold Contract",
        description:
          "Give the transformed place a clear entrance condition, cost, or exchange so the strangeness has consequence.",
      },
      {
        title: "Symbolic Mutation",
        description:
          "Choose one mundane object or routine and let it become a major moral, political, or spiritual structure.",
      },
      {
        title: "Double Vision",
        description:
          "Keep the ordinary and extraordinary versions visible at once so the world comments on its source.",
      },
    ],
  }),
  makeModule({
    id: "multispecies-perspective",
    week: "Sept 8",
    title: "Multi-species Perspective and Interspecies Communication",
    focus: "Move beyond human-centered worldbuilding through perception, communication, and mutual misunderstanding.",
    description:
      "Design how nonhuman beings sense, interpret, and negotiate the world on their own terms.",
    output: "Ecological report from a nonhuman perspective",
    sections: ["speciesRelations", "characters", "everydayLife"],
    archives: ["species", "characters"],
    focusSignals: ["species", "communication", "interdependence", "sensory"],
    questions: [
      {
        signal: "species",
        text: "Which nonhuman species or life forms matter in this world, and what do they perceive that humans miss?",
      },
      {
        signal: "communication",
        text: "How do species communicate across differences in body, scale, time, or sensory capacity?",
      },
      {
        signal: "interdependence",
        text: "Where do species rely on one another, and where do their needs collide?",
      },
      {
        signal: "sensory",
        text: "Which senses dominate for different beings: scent, vibration, heat, magnetic orientation, memory, song?",
      },
      {
        signal: "conflict",
        text: "What misunderstandings or ethical tensions emerge when species interpret the same situation differently?",
      },
    ],
    directions: [
      {
        title: "Sensory Asymmetry",
        description:
          "Build a relationship where each species accesses a different layer of reality, making translation partial and political.",
      },
      {
        title: "Negotiated Translation",
        description:
          "Design a ritual, tool, or labor practice that lets species communicate imperfectly rather than magically understand each other.",
      },
      {
        title: "Shared Dependence",
        description:
          "Tie survival to a resource or ecological cycle that no species can manage alone.",
      },
    ],
  }),
  makeModule({
    id: "multispecies-sustainability",
    week: "Sept 15",
    title: "Multispecies Sustainability",
    focus: "Build ecologically coherent worlds with material tradeoffs and limits.",
    description:
      "Trace resources, waste, climate pressures, and interspecies dependency instead of using sustainability as a vague virtue.",
    output: "500-word sustainability report and ecology system map",
    sections: ["ecologySustainability", "geographyEnvironment", "materialSystems"],
    archives: ["ecologySystems", "worldRules"],
    focusSignals: ["ecology", "resource", "waste", "climate", "interdependence"],
    questions: [
      {
        signal: "resource",
        text: "What resources keep the world functioning, and who gathers, grows, mines, or protects them?",
      },
      {
        signal: "waste",
        text: "Where does waste go, and which bodies or landscapes absorb the cost?",
      },
      {
        signal: "climate",
        text: "What environmental limits or seasonal pressures shape design, labor, and survival?",
      },
      {
        signal: "interdependence",
        text: "How do species, infrastructures, and environments depend on each other across time?",
      },
      {
        signal: "conflict",
        text: "What sustainability tradeoff creates winners, losers, repair practices, or sacrifice zones?",
      },
    ],
    directions: [
      {
        title: "Closed Loop Test",
        description:
          "Trace one material from extraction to use to afterlife, then ask who pays at each stage.",
      },
      {
        title: "Seasonal Constraint",
        description:
          "Let weather or cyclical scarcity force the society into visible adaptations rather than abstract claims of resilience.",
      },
      {
        title: "Caretaker Economy",
        description:
          "Center the people or species who maintain ecological balance, not just those who benefit from it.",
      },
    ],
  }),
  makeModule({
    id: "creating-cultures",
    week: "Sept 22",
    title: "Human Patterns",
    focus: "Create patterns of humanity with depth, history, labor, kinship, conflict, and change rather than stereotypes.",
    description:
      "Build specific practices, institutions, values, and disagreements that make cultures dynamic and internally diverse.",
    output: "Patterns of Humanity sheet",
    sections: ["culturesPractices", "everydayLife", "conflictInequality"],
    archives: ["cultures"],
    focusSignals: ["kinship", "labor", "education", "law", "value", "history"],
    questions: [
      {
        signal: "kinship",
        text: "How are kinship, care, inheritance, or household responsibilities organized?",
      },
      {
        signal: "labor",
        text: "What kinds of work sustain daily life, and who is expected to perform them?",
      },
      {
        signal: "education",
        text: "How do people learn what matters, who teaches it, and who gets excluded?",
      },
      {
        signal: "law",
        text: "What laws, customs, or expectations govern conflict, accountability, and belonging?",
      },
      {
        signal: "history",
        text: "How has the culture changed over time, and what disagreements exist within it now?",
      },
    ],
    directions: [
      {
        title: "Everyday Infrastructure",
        description:
          "Start with kitchens, markets, schools, and repair practices so the culture is lived before it is explained.",
      },
      {
        title: "Conflict Within Culture",
        description:
          "Give the culture internal debate across generation, class, belief, region, or species relationship.",
      },
      {
        title: "Historical Layering",
        description:
          "Show what older customs persist, what has been reformed, and what remains contested.",
      },
    ],
  }),
  makeModule({
    id: "distribution-of-power",
    week: "Sept 29",
    title: "Political Economies, Power and Authority",
    focus: "Design governance, inequality, authority, resistance, and the visible consequences of political economy.",
    description:
      "Map who makes decisions, who controls resources, who is excluded, and how resistance circulates.",
    output: "Power map / governance chart or mini-utopia sketch",
    sections: ["powerGovernance", "conflictInequality", "everydayLife"],
    archives: ["powerStructures"],
    focusSignals: ["power", "resource", "status", "resistance", "law", "conflict"],
    questions: [
      {
        signal: "power",
        text: "Who makes binding decisions in this world, and by what logic do they claim legitimacy?",
      },
      {
        signal: "resource",
        text: "Who controls food, information, movement, energy, land, or care infrastructure?",
      },
      {
        signal: "status",
        text: "What counts as status here, and how is hierarchy displayed through space, dress, speech, or labor?",
      },
      {
        signal: "resistance",
        text: "How do people resist, evade, negotiate, or outlast authority?",
      },
      {
        signal: "conflict",
        text: "What concrete consequences follow from unequal power for bodies, neighborhoods, or species relations?",
      },
    ],
    directions: [
      {
        title: "Visible Hierarchy",
        description:
          "Make power legible in architecture, transit access, clothing, ritual sequence, or who gets privacy.",
      },
      {
        title: "Control Point",
        description:
          "Identify one resource or administrative chokepoint and trace its downstream effects across the world.",
      },
      {
        title: "Resistance Ecology",
        description:
          "Build not just rulers but the informal networks, workarounds, or solidarities that answer them.",
      },
    ],
  }),
  makeModule({
    id: "building-worlds",
    week: "Oct 6",
    title: "The Built World",
    focus: "Integrate systems into a coherent built environment with architecture, site planning, and material logic.",
    description:
      "Connect rules, cultures, ecology, power, and everyday life so the built environment can support story.",
    output: "Site planning brief and built world overview",
    sections: ["originStory", "materialSystems", "storyPossibilities"],
    archives: ["worldRules"],
    focusSignals: ["rules", "power", "ecology", "technology", "everyday", "story"],
    questions: [
      {
        signal: "rules",
        text: "What rules govern the world, and what happens when someone breaks or bends them?",
      },
      {
        signal: "technology",
        text: "How do technology, magic, or material systems connect to labor, power, and ecology?",
      },
      {
        signal: "everyday",
        text: "How do large systems appear in ordinary routines instead of only in dramatic moments?",
      },
      {
        signal: "story",
        text: "What does the audience need to understand first in order for the world to feel coherent?",
      },
      {
        signal: "conflict",
        text: "Which contradictions still do not fit together, and what might need redesign rather than explanation?",
      },
    ],
    directions: [
      {
        title: "Rule To Consequence",
        description:
          "Take one world rule and trace its effects through architecture, labor, intimacy, and conflict.",
      },
      {
        title: "Distinctive First Impression",
        description:
          "Decide what a viewer or reader would notice in the first thirty seconds and what that detail teaches.",
      },
      {
        title: "Contradiction Audit",
        description:
          "Treat unresolved tensions as design prompts: keep them, revise them, or make them part of the world's conflict.",
      },
    ],
  }),
  makeModule({
    id: "ritual",
    week: "Oct 13",
    title: "Ritual",
    focus: "Develop ritual as embodied social meaning with exclusions, memories, and political effects.",
    description:
      "Design rites of passage, sacred distinctions, seasonal cycles, and collective performances that do social work.",
    output: "Ritual design document and myth seed",
    sections: ["ritualsBelief", "powerGovernance", "culturesPractices"],
    archives: ["rituals"],
    focusSignals: ["ritual", "belief", "power", "sensory", "history"],
    questions: [
      {
        signal: "ritual",
        text: "What repeated acts mark passage, mourning, alliance, debt, healing, or seasonal change?",
      },
      {
        signal: "belief",
        text: "What belief, memory, or cosmology gives the ritual social or sacred force?",
      },
      {
        signal: "power",
        text: "Who participates, who is excluded, and how does the ritual reinforce or challenge power?",
      },
      {
        signal: "sensory",
        text: "Which objects, sounds, costumes, gestures, or spaces make the ritual legible and affective?",
      },
      {
        signal: "history",
        text: "How has the ritual changed over time, and what conflicts surround that change?",
      },
    ],
    directions: [
      {
        title: "Embodied Sequence",
        description:
          "Build the ritual step by step so each action carries a social meaning rather than decorative atmosphere.",
      },
      {
        title: "Boundary Ritual",
        description:
          "Use ritual to define who belongs, who is purified, who is watched, or who gets transformed.",
      },
      {
        title: "Ritual Contest",
        description:
          "Let different groups argue over the ritual's meaning, ownership, or right form.",
      },
    ],
  }),
  makeModule({
    id: "gender-and-sexuality",
    week: "Oct 20",
    title: "Gender and Sexuality",
    focus: "Create culturally specific systems of gender, sexuality, kinship, embodiment, and intimacy.",
    description:
      "Avoid generic binaries by asking how gender and sexuality operate through law, ritual, kinship, labor, and presentation.",
    output: "Gender / sexuality system reflection",
    sections: ["genderSexuality", "culturesPractices", "everydayLife"],
    archives: ["genderSexualitySystems"],
    focusSignals: ["embodiment", "kinship", "law", "ritual", "power", "value"],
    questions: [
      {
        signal: "embodiment",
        text: "How is gender recognized, felt, signaled, ignored, or contested through bodies and presentation?",
      },
      {
        signal: "kinship",
        text: "How do family, kinship, parenting, partnership, or inheritance relate to sexuality and gender?",
      },
      {
        signal: "law",
        text: "How do law, custom, or social sanction structure intimacy, transition, privacy, or recognition?",
      },
      {
        signal: "ritual",
        text: "What rites, celebrations, or prohibitions shape embodiment and relationship categories?",
      },
      {
        signal: "power",
        text: "Which identities gain power or vulnerability, and which categories do not map to contemporary Western binaries?",
      },
    ],
    directions: [
      {
        title: "Kinship First",
        description:
          "Design gender and sexuality through kinship, care, and inheritance before labels or aesthetics.",
      },
      {
        title: "Embodiment Spectrum",
        description:
          "Anchor categories in local practices of dress, voice, labor, ritual, or body modification rather than imported binaries.",
      },
      {
        title: "Power Lens",
        description:
          "Ask who benefits from existing categories, who resists them, and how everyday life changes across those positions.",
      },
    ],
  }),
  makeModule({
    id: "story-pitch",
    week: "Oct 27",
    title: "Project Proposal",
    focus: "Turn the world into a concise story proposal with world-rooted conflict, stakes, and structure.",
    description:
      "Connect setting, focal perspective, conflict, and stakes so the story could only happen in this world.",
    output: "500-word project proposal",
    sections: ["finalPitch", "storyPossibilities", "characters"],
    archives: ["storyIdeas", "characters"],
    focusSignals: ["story", "character", "conflict", "rules", "power"],
    questions: [
      {
        signal: "character",
        text: "Whose perspective best reveals the world's tensions, and why are they affected now?",
      },
      {
        signal: "story",
        text: "What event or choice launches the pitch, and why can it only happen in this world?",
      },
      {
        signal: "conflict",
        text: "What are the stakes if the focal character fails, refuses, or changes course?",
      },
      {
        signal: "rules",
        text: "Which key world rule or contradiction must the audience understand for the pitch to land?",
      },
      {
        signal: "power",
        text: "How does the story expose power, ecology, ritual, or kinship rather than sitting outside them?",
      },
    ],
    directions: [
      {
        title: "World Through Character",
        description:
          "Choose a perspective already entangled with the world's systems so exposition can emerge through pressure.",
      },
      {
        title: "Conflict From Setting",
        description:
          "Let scarcity, governance, ritual duty, ecological strain, or interspecies translation create the plot engine.",
      },
      {
        title: "Pitch Spine",
        description:
          "Compress the pitch into setting, protagonist, conflict, stakes, and what makes the world indispensable to the story.",
      },
    ],
  }),
  makeModule({
    id: "workshop-week",
    week: "Nov 3",
    title: "Peer Review Sessions",
    focus: "Prepare revision questions, peer prompts, and a coherence checklist for structured workshop response.",
    description:
      "Turn the project into something legible for peers by naming unresolved issues and high-value feedback requests.",
    output: "Peer response packet",
    sections: ["storyPossibilities", "conflictInequality"],
    archives: ["storyIdeas"],
    focusSignals: ["conflict", "story", "rules"],
    questions: [
      {
        signal: "story",
        text: "What part of the world needs outside readers to understand or challenge most urgently?",
      },
      {
        signal: "conflict",
        text: "Which contradictions or weak spots deserve peer attention rather than private polishing?",
      },
      {
        signal: "rules",
        text: "What coherence check should peers use when they read your material?",
      },
      {
        signal: "power",
        text: "What ethical or representational questions do you want peers to help you pressure-test?",
      },
      {
        signal: "character",
        text: "Which character, relationship, or scene needs the clearest feedback next?",
      },
    ],
    directions: [
      {
        title: "Question-Led Workshop",
        description:
          "Ask for responses to two or three specific design problems instead of general approval.",
      },
      {
        title: "Revision Priorities",
        description:
          "Rank the issues that would most improve coherence, originality, or ethical complexity if addressed next.",
      },
      {
        title: "Peer Lens Pack",
        description:
          "Prepare peers to read for ecology, culture, power, and story emergence, not just vibe.",
      },
    ],
  }),
  makeModule({
    id: "collaboration-best-practices",
    week: "Nov 10",
    title: "Online Collaborative Worldbuilding",
    focus: "Support collaborative worldbuilding with shared canon, safety tools, ownership, and contradiction management.",
    description:
      "Document how group members make decisions, resolve conflicts, and maintain a shared world without flattening authorship.",
    output: "Collaboration agreement, safety notes, and canon tracker",
    sections: ["powerGovernance", "storyPossibilities"],
    archives: [],
    focusSignals: ["collaboration", "rules", "conflict"],
    questions: [
      {
        signal: "collaboration",
        text: "Who owns which design decisions, and where is shared canon documented?",
      },
      {
        signal: "rules",
        text: "How are new rules approved, revised, or retired when the group changes direction?",
      },
      {
        signal: "conflict",
        text: "How will the group handle creative disagreements or contradictory proposals?",
      },
      {
        signal: "story",
        text: "What shared world commitments should every collaborator understand before adding story material?",
      },
      {
        signal: "power",
        text: "What practices keep stronger voices from quietly becoming the default canon?",
      },
    ],
    directions: [
      {
        title: "Canon Tracker",
        description:
          "Separate approved canon, test ideas, and rejected directions so the group can move without confusion.",
      },
      {
        title: "Ownership Map",
        description:
          "Assign stewardship by system, character, region, or artifact while keeping shared review points.",
      },
      {
        title: "Conflict Protocol",
        description:
          "Write down how disagreement becomes design work rather than silent drift or accidental override.",
      },
    ],
  }),
  makeModule({
    id: "world-to-story",
    week: "Nov 17",
    title: "Writing the Story Experience",
    focus: "Help story grow organically from the world's tensions instead of being pasted on top.",
    description:
      "Use the world's existing contradictions to identify characters, events, conflicts, and story structure that belong to it.",
    output: "World-to-story bridge and structure sheet",
    sections: ["characters", "storyPossibilities", "finalPitch"],
    archives: ["storyIdeas", "characters"],
    focusSignals: ["story", "character", "conflict", "power", "everyday"],
    questions: [
      {
        signal: "conflict",
        text: "What tensions already exist in the world before any plot begins?",
      },
      {
        signal: "character",
        text: "Who is most affected by those tensions and why are they positioned to reveal them?",
      },
      {
        signal: "story",
        text: "What event exposes the world's logic while forcing a decision, loss, or change?",
      },
      {
        signal: "everyday",
        text: "How does the story emerge from ordinary life rather than only exceptional spectacle?",
      },
      {
        signal: "power",
        text: "Which power structure, ritual, ecological limit, or kinship rule gives the conflict its shape?",
      },
    ],
    directions: [
      {
        title: "Pressure Point Story",
        description:
          "Find the place where a daily routine collides with a world rule, then build the story from that break.",
      },
      {
        title: "Affected Perspective",
        description:
          "Choose a character whose social position makes the world's contradictions unavoidable.",
      },
      {
        title: "Reveal Through Event",
        description:
          "Pick an event that reveals how the world works while also changing a relationship or status quo.",
      },
    ],
  }),
  makeModule({
    id: "collaborative-live-project",
    week: "Nov 24",
    title: "Live Fire Collaborative Worldbuilding",
    focus: "Support real-time group development with prompts, decision logs, contradiction tracking, and representation checks.",
    description:
      "Keep live collaboration legible by making decisions, tensions, and open questions visible as they happen.",
    output: "Collaborative project record",
    sections: ["storyPossibilities", "conflictInequality"],
    archives: [],
    focusSignals: ["collaboration", "conflict", "rules", "story"],
    questions: [
      {
        signal: "collaboration",
        text: "What decisions did the group make today, and who needs to see them next?",
      },
      {
        signal: "conflict",
        text: "What contradictions surfaced in live development, and which deserve immediate follow-up?",
      },
      {
        signal: "rules",
        text: "Which rules or assumptions changed during collaboration, and what do those changes affect?",
      },
      {
        signal: "story",
        text: "What live prompt or synthesis would help the group move from fragments to a shared direction?",
      },
      {
        signal: "power",
        text: "Whose ideas dominated the session, and how can the next round rebalance participation?",
      },
    ],
    directions: [
      {
        title: "Decision Log",
        description:
          "Record what became canon, what stayed provisional, and what was explicitly rejected in the session.",
      },
      {
        title: "Contradiction Tracker",
        description:
          "Treat live inconsistencies as shared design questions instead of letting them disappear into memory.",
      },
      {
        title: "Prompt Cards",
        description:
          "Use short structured prompts to keep the group generating consequences instead of disconnected features.",
      },
    ],
  }),
  makeModule({
    id: "heterotopias",
    week: "Dec 1",
    title: "World As Story / Zootopias and Heterotopias",
    focus: "Design layered spaces that juxtapose incompatible meanings, orders, or realities while carrying the world into story form.",
    description:
      "Build spaces of exception such as gardens, ships, archives, theaters, cemeteries, prisons, festivals, or virtual worlds.",
    output: "Heterotopia design sheet",
    sections: ["geographyEnvironment", "conflictInequality", "originStory"],
    archives: ["storyIdeas"],
    focusSignals: ["archive", "power", "transformation", "rules", "story"],
    questions: [
      {
        signal: "archive",
        text: "What space in the world holds layered, incompatible, or exceptional meanings at once?",
      },
      {
        signal: "rules",
        text: "What different rules of time, access, memory, or behavior operate inside this space?",
      },
      {
        signal: "power",
        text: "Who is allowed in, who is watched, and what social order does the space reveal or suspend?",
      },
      {
        signal: "transformation",
        text: "How does crossing into the space alter identity, status, or perception?",
      },
      {
        signal: "story",
        text: "What story event, secret, archive, or conflict becomes possible because this heterotopia exists?",
      },
    ],
    directions: [
      {
        title: "Exception Space",
        description:
          "Design the heterotopia as a place where incompatible values must coexist under visible rules.",
      },
      {
        title: "Threshold Architecture",
        description:
          "Use entry rituals, surveillance, timing, or layered rooms to make the space socially legible.",
      },
      {
        title: "World In Miniature",
        description:
          "Let the space reveal the larger world by concentrating its tensions into one charged site.",
      },
    ],
  }),
  makeModule({
    id: "final-review",
    week: "Dec 8",
    title: "Final Project Review",
    focus: "Review the whole portfolio for coherence, originality, ethics, story readiness, and submission quality.",
    description:
      "Audit what the world can already support, what needs revision, and what the final reflection should name clearly.",
    output: "Final project checklist and portfolio export",
    sections: ["finalPitch", "storyPossibilities"],
    archives: [],
    focusSignals: ["story", "conflict", "rules", "power", "ecology"],
    questions: [
      {
        signal: "rules",
        text: "Which world rules, systems, or assumptions still feel underdeveloped or contradictory?",
      },
      {
        signal: "story",
        text: "Is the project ready to support a story, and what evidence from the world shows that?",
      },
      {
        signal: "power",
        text: "Where does representation need more specificity, consequence, or ethical attention?",
      },
      {
        signal: "ecology",
        text: "Which sustainability, material, or multispecies claims still need logic or research?",
      },
      {
        signal: "conflict",
        text: "What revision priorities would most improve coherence, originality, or usability right now?",
      },
    ],
    directions: [
      {
        title: "Portfolio Audit",
        description:
          "Review the project as a set of linked systems rather than isolated module outputs.",
      },
      {
        title: "Ethical Revision Pass",
        description:
          "Check for flattened cultures, unearned sustainability claims, and categories borrowed without depth.",
      },
      {
        title: "Story Readiness Pass",
        description:
          "Ask whether the world now generates plot pressure, character stakes, and distinctive scenes on its own.",
      },
    ],
  }),
];

const moduleMap = new Map(modules.map((module) => [module.id, module]));
const worldBibleSectionMap = new Map(worldBibleSections.map((section) => [section.id, section]));

const elements = {
  currentUserBadge: document.getElementById("currentUserBadge"),
  currentCourseBadge: document.getElementById("currentCourseBadge"),
  accessModeBadge: document.getElementById("accessModeBadge"),
  syncStatusBadge: document.getElementById("syncStatusBadge"),
  launchNotice: document.getElementById("launchNotice"),
  projectList: document.getElementById("projectList"),
  createProjectButton: document.getElementById("createProjectButton"),
  duplicateProjectButton: document.getElementById("duplicateProjectButton"),
  projectSnapshot: document.getElementById("projectSnapshot"),
  resourceScaffolds: document.getElementById("resourceScaffolds"),
  savedIdeasList: document.getElementById("savedIdeasList"),
  watchList: document.getElementById("watchList"),
  tabButtons: Array.from(document.querySelectorAll(".tab-button")),
  tabPanels: Array.from(document.querySelectorAll(".tab-panel")),
  studentName: document.getElementById("studentName"),
  worldTitle: document.getElementById("worldTitle"),
  genre: document.getElementById("genre"),
  medium: document.getElementById("medium"),
  coreConcept: document.getElementById("coreConcept"),
  tone: document.getElementById("tone"),
  visualStyle: document.getElementById("visualStyle"),
  themes: document.getElementById("themes"),
  visualReferences: document.getElementById("visualReferences"),
  intendedFinalOutput: document.getElementById("intendedFinalOutput"),
  currentModuleSelect: document.getElementById("currentModuleSelect"),
  storyStructureChoice: document.getElementById("storyStructureChoice"),
  aiCollaborationNote: document.getElementById("aiCollaborationNote"),
  safetyCanonNote: document.getElementById("safetyCanonNote"),
  moduleCardGrid: document.getElementById("moduleCardGrid"),
  workspaceTitle: document.getElementById("workspaceTitle"),
  moduleSummary: document.getElementById("moduleSummary"),
  moduleStudentInput: document.getElementById("moduleStudentInput"),
  moduleStudentResponses: document.getElementById("moduleStudentResponses"),
  studentDecision: document.getElementById("studentDecision"),
  generateGuidanceButton: document.getElementById("generateGuidanceButton"),
  saveDecisionButton: document.getElementById("saveDecisionButton"),
  rejectDecisionButton: document.getElementById("rejectDecisionButton"),
  markUnresolvedButton: document.getElementById("markUnresolvedButton"),
  saveModuleToBibleButton: document.getElementById("saveModuleToBibleButton"),
  workingList: document.getElementById("workingList"),
  clarificationList: document.getElementById("clarificationList"),
  questionsList: document.getElementById("questionsList"),
  directionsList: document.getElementById("directionsList"),
  coherenceList: document.getElementById("coherenceList"),
  decisionPoint: document.getElementById("decisionPoint"),
  reflectionDecided: document.getElementById("reflectionDecided"),
  reflectionRejected: document.getElementById("reflectionRejected"),
  reflectionAiChange: document.getElementById("reflectionAiChange"),
  reflectionUnresolved: document.getElementById("reflectionUnresolved"),
  reflectionConnection: document.getElementById("reflectionConnection"),
  reflectionResearch: document.getElementById("reflectionResearch"),
  saveReflectionButton: document.getElementById("saveReflectionButton"),
  worldBibleGrid: document.getElementById("worldBibleGrid"),
  exportTypeSelect: document.getElementById("exportTypeSelect"),
  exportFileName: document.getElementById("exportFileName"),
  refreshExportButton: document.getElementById("refreshExportButton"),
  downloadExportButton: document.getElementById("downloadExportButton"),
  downloadJsonButton: document.getElementById("downloadJsonButton"),
  copyExportButton: document.getElementById("copyExportButton"),
  exportPreview: document.getElementById("exportPreview"),
  instructorSummary: document.getElementById("instructorSummary"),
  instructorProjectCards: document.getElementById("instructorProjectCards"),
};

const baseState = {
  projects: [],
  activeProjectId: "",
  activeTab: "dashboard",
  selectedExportType: exportTypes[0].id,
};

let appContext = {
  sessionToken: "",
  uiStateStorageKey: DEFAULT_UI_STORAGE_KEY,
  user: {
    id: "",
    displayName: "",
    email: "",
    role: "guest",
  },
  course: {
    id: "",
    title: "",
  },
  canvas: {
    clientId: "",
    deploymentId: "",
    issuer: "",
    resourceLinkId: "",
    roles: [],
  },
  permissions: {
    canCreateProjects: false,
    canEditProjects: false,
    canReviewCourse: false,
  },
  launch: {
    placement: "",
    messageType: "",
    targetLinkUri: "",
    targetModuleId: "",
    targetModuleTitle: "",
  },
};

let state = structuredCloneSafe(baseState);
let saveTimerId = null;
let isSaving = false;
const dirtyProjectIds = new Set();

populateStaticOptions();
bindEvents();
updateContextBar();
applyAccessState();
initializeApp();

function populateStaticOptions() {
  elements.currentModuleSelect.innerHTML = modules
    .map(
      (module) =>
        `<option value="${module.id}">${escapeHtml(module.week)} - ${escapeHtml(
          module.title,
        )}</option>`,
    )
    .join("");

  elements.storyStructureChoice.innerHTML = storyStructureChoices
    .map((choice) => `<option value="${choice.id}">${escapeHtml(choice.label)}</option>`)
    .join("");

  elements.exportTypeSelect.innerHTML = exportTypes
    .map((exportType) => `<option value="${exportType.id}">${escapeHtml(exportType.label)}</option>`)
    .join("");
}

async function initializeApp() {
  setSyncStatus("Checking launch context", "muted");

  try {
    const bootstrap = await loadBootstrap();
    if (!bootstrap) {
      showLaunchNotice("Launch the studio from Canvas, or use `/dev/login` while configuring the LTI tool.");
      setSyncStatus("Launch required", "warning");
      renderAll();
      return;
    }

    await applyBootstrap(bootstrap);
    renderAll();
  } catch (error) {
    console.error(error);
    showLaunchNotice(error.message || "The launch context could not be restored. Start again from Canvas.");
    setSyncStatus("Launch required", "warning");
    renderAll();
  }
}

async function loadBootstrap() {
  if (inlineBootstrap?.sessionToken) {
    persistSessionToken(inlineBootstrap.sessionToken);
    return inlineBootstrap;
  }

  const sessionToken = getSessionToken();
  if (!sessionToken) {
    return null;
  }

  const payload = await apiRequest("/api/bootstrap", { tokenOverride: sessionToken });
  return payload.app;
}

async function applyBootstrap(bootstrap) {
  appContext = {
    sessionToken: bootstrap.sessionToken || "",
    uiStateStorageKey: bootstrap.uiStateStorageKey || DEFAULT_UI_STORAGE_KEY,
    user: bootstrap.user || appContext.user,
    course: bootstrap.course || appContext.course,
    canvas: bootstrap.canvas || appContext.canvas,
    permissions: bootstrap.permissions || appContext.permissions,
    launch: bootstrap.launch || appContext.launch,
  };

  persistSessionToken(appContext.sessionToken);

  state = ensureStateShape({
    ...loadUiState(),
    projects: Array.isArray(bootstrap.projects) ? bootstrap.projects : [],
  });

  if (!state.projects.length && appContext.permissions.canCreateProjects) {
    await ensureStarterProject();
  }

  applyLaunchTarget();

  showLaunchNotice(getLaunchNotice());
  updateContextBar();
  applyAccessState();
  persistUiState();
  setSyncStatus("All changes saved", "success");
}

async function ensureStarterProject() {
  const starterProject = createProject();
  if (!starterProject.studentName.trim() && appContext.user.displayName) {
    starterProject.studentName = appContext.user.displayName;
  }

  const createdProject = await apiCreateProject(starterProject);
  state.projects = [hydrateProject(createdProject)];
  state.activeProjectId = createdProject.projectId;
  persistUiState();
}

function getSessionToken() {
  try {
    return window.sessionStorage.getItem(SESSION_TOKEN_STORAGE_KEY) || "";
  } catch (error) {
    return "";
  }
}

function persistSessionToken(token) {
  appContext.sessionToken = token || "";
  try {
    if (token) {
      window.sessionStorage.setItem(SESSION_TOKEN_STORAGE_KEY, token);
    }
  } catch (error) {
    console.warn("Session token could not be stored in sessionStorage.", error);
  }
}

function clearSessionToken() {
  appContext.sessionToken = "";
  try {
    window.sessionStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
  } catch (error) {
    console.warn("Session token could not be cleared from sessionStorage.", error);
  }
}

function loadUiState() {
  try {
    const raw = window.sessionStorage.getItem(appContext.uiStateStorageKey || DEFAULT_UI_STORAGE_KEY);
    if (!raw) {
      return structuredCloneSafe(baseState);
    }
    return JSON.parse(raw);
  } catch (error) {
    return structuredCloneSafe(baseState);
  }
}

function persistUiState() {
  try {
    window.sessionStorage.setItem(
      appContext.uiStateStorageKey || DEFAULT_UI_STORAGE_KEY,
      JSON.stringify({
        activeProjectId: state.activeProjectId,
        activeTab: state.activeTab,
        selectedExportType: state.selectedExportType,
      }),
    );
  } catch (error) {
    console.warn("UI state could not be stored in sessionStorage.", error);
  }
}

function showLaunchNotice(message) {
  elements.launchNotice.textContent = message;
}

function getLaunchNotice() {
  const launchModule = moduleMap.get(appContext.launch.targetModuleId || "");
  if (launchModule) {
    return `Canvas opened the ${launchModule.title} workspace directly. The studio moved this session to that module so the project can continue in context.`;
  }

  if (appContext.user.role === "instructor") {
    return "Instructor review mode is active. You can inspect student progress, but project editing stays with the student author.";
  }

  return "Your project work now saves to the server for this Canvas course instead of staying in a single browser.";
}

function applyLaunchTarget() {
  const launchModuleId = appContext.launch.targetModuleId || "";
  if (!launchModuleId || !moduleMap.has(launchModuleId)) {
    return;
  }

  const launchProject = getActiveProject() || state.projects[0];
  if (!launchProject) {
    state.activeTab = "modules";
    return;
  }

  state.activeProjectId = launchProject.projectId;
  state.activeTab = "modules";

  if (!projectCanEdit(launchProject)) {
    persistUiState();
    return;
  }

  if (launchProject.currentModule === launchModuleId) {
    persistUiState();
    return;
  }

  launchProject.currentModule = launchModuleId;
  touchProject(launchProject);
  scheduleProjectSync({ immediate: true, projectId: launchProject.projectId });
  persistUiState();
}

function setSyncStatus(message, tone = "muted") {
  elements.syncStatusBadge.textContent = message;
  elements.syncStatusBadge.classList.remove("context-pill-muted", "context-pill-warning", "context-pill-success");
  if (tone === "success") {
    elements.syncStatusBadge.classList.add("context-pill-success");
    return;
  }
  if (tone === "warning") {
    elements.syncStatusBadge.classList.add("context-pill-warning");
    return;
  }
  elements.syncStatusBadge.classList.add("context-pill-muted");
}

function updateContextBar() {
  const roleLabel = appContext.user.role === "instructor" ? "Instructor review" : "Student studio";
  elements.currentUserBadge.textContent = appContext.user.displayName
    ? `${appContext.user.displayName}`
    : "Waiting for launch";
  elements.currentCourseBadge.textContent = appContext.course.title
    ? `${appContext.course.title}`
    : "No course context yet";
  elements.accessModeBadge.textContent = roleLabel;
}

function projectCanEdit(project = getActiveProject()) {
  return Boolean(appContext.permissions.canEditProjects && project?._meta?.canEdit !== false);
}

function hasProjects() {
  return Array.isArray(state.projects) && state.projects.length > 0;
}

function applyAccessState() {
  const project = getActiveProject();
  const canEdit = projectCanEdit(project);
  const canCreate = Boolean(appContext.permissions.canCreateProjects);
  const hasProject = Boolean(project);

  elements.createProjectButton.classList.toggle("is-hidden", !canCreate);
  elements.createProjectButton.disabled = !canCreate;
  elements.duplicateProjectButton.classList.toggle("is-hidden", !canEdit);
  elements.duplicateProjectButton.disabled = !canEdit;

  [
    elements.studentName,
    elements.worldTitle,
    elements.genre,
    elements.medium,
    elements.coreConcept,
    elements.tone,
    elements.visualStyle,
    elements.themes,
    elements.visualReferences,
    elements.intendedFinalOutput,
    elements.currentModuleSelect,
    elements.storyStructureChoice,
    elements.aiCollaborationNote,
    elements.safetyCanonNote,
    elements.moduleStudentInput,
    elements.moduleStudentResponses,
    elements.studentDecision,
    elements.reflectionDecided,
    elements.reflectionRejected,
    elements.reflectionAiChange,
    elements.reflectionUnresolved,
    elements.reflectionConnection,
    elements.reflectionResearch,
  ].forEach((element) => {
    element.disabled = !canEdit || !hasProject;
  });

  [
    elements.generateGuidanceButton,
    elements.saveDecisionButton,
    elements.rejectDecisionButton,
    elements.markUnresolvedButton,
    elements.saveModuleToBibleButton,
    elements.saveReflectionButton,
  ].forEach((button) => {
    button.disabled = !canEdit || !hasProject;
  });

  [
    elements.exportTypeSelect,
    elements.exportFileName,
    elements.refreshExportButton,
    elements.downloadExportButton,
    elements.downloadJsonButton,
    elements.copyExportButton,
  ].forEach((control) => {
    control.disabled = !hasProject;
  });
}

async function apiRequest(url, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = options.tokenOverride || appContext.sessionToken || getSessionToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      clearSessionToken();
      appContext.permissions.canCreateProjects = false;
      appContext.permissions.canEditProjects = false;
      showLaunchNotice("Your session expired. Relaunch the studio from Canvas to keep saving your work.");
      updateContextBar();
      applyAccessState();
    }
    throw new Error(payload?.error || `Request failed with status ${response.status}.`);
  }

  return payload;
}

async function apiCreateProject(project) {
  const payload = await apiRequest("/api/projects", {
    method: "POST",
    body: { project },
  });
  return payload.project;
}

async function apiUpdateProject(project) {
  const payload = await apiRequest(`/api/projects/${encodeURIComponent(project.projectId)}`, {
    method: "PUT",
    body: { project },
  });
  return payload.project;
}

async function apiDeleteProject(projectId) {
  await apiRequest(`/api/projects/${encodeURIComponent(projectId)}`, {
    method: "DELETE",
  });
}

function scheduleProjectSync({ immediate = false, projectId = getActiveProject()?.projectId } = {}) {
  if (!projectId) {
    return;
  }
  if (!projectCanEdit(state.projects.find((project) => project.projectId === projectId))) {
    return;
  }

  dirtyProjectIds.add(projectId);
  setSyncStatus("Saving changes", "warning");

  if (immediate) {
    void flushProjectSync();
    return;
  }

  window.clearTimeout(saveTimerId);
  saveTimerId = window.setTimeout(() => {
    void flushProjectSync();
  }, 500);
}

async function flushProjectSync() {
  if (isSaving || !dirtyProjectIds.size) {
    return;
  }

  isSaving = true;
  const projectIds = [...dirtyProjectIds];
  dirtyProjectIds.clear();
  setSyncStatus("Saving changes", "warning");

  try {
    for (const projectId of projectIds) {
      const project = state.projects.find((entry) => entry.projectId === projectId);
      if (!project || !projectCanEdit(project)) {
        continue;
      }
      const savedProject = await apiUpdateProject(project);
      replaceProject(savedProject);
    }
    setSyncStatus("All changes saved", "success");
  } catch (error) {
    projectIds.forEach((projectId) => dirtyProjectIds.add(projectId));
    setSyncStatus("Save failed", "warning");
    showLaunchNotice(error.message || "Saving to the course workspace failed. Try launching the studio again.");
  } finally {
    isSaving = false;
  }
}

function replaceProject(project) {
  const hydrated = hydrateProject(project);
  const nextProjects = state.projects.map((entry) => (entry.projectId === hydrated.projectId ? hydrated : entry));
  const existingIndex = nextProjects.findIndex((entry) => entry.projectId === hydrated.projectId);
  if (existingIndex === -1) {
    nextProjects.unshift(hydrated);
  }
  state.projects = nextProjects;
}

function bindEvents() {
  elements.tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tab;
      persistUiState();
      renderTabs();
    });
  });

  elements.createProjectButton.addEventListener("click", () => {
    void createNewProject();
  });
  elements.duplicateProjectButton.addEventListener("click", () => {
    void duplicateActiveProject();
  });

  elements.projectList.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) {
      return;
    }

    const projectId = actionButton.dataset.projectId;
    if (!projectId) {
      return;
    }

    if (actionButton.dataset.action === "open-project") {
      state.activeProjectId = projectId;
      persistUiState();
      renderAll();
      return;
    }

    if (actionButton.dataset.action === "delete-project") {
      void deleteProject(projectId);
    }
  });

  const projectInputs = {
    studentName: "studentName",
    worldTitle: "worldTitle",
    genre: "genre",
    medium: "medium",
    coreConcept: "coreConcept",
    tone: "tone",
    visualStyle: "visualStyle",
    intendedFinalOutput: "intendedFinalOutput",
    aiCollaborationNote: "aiCollaborationNote",
    safetyCanonNote: "safetyCanonNote",
  };

  Object.entries(projectInputs).forEach(([elementKey, projectKey]) => {
    elements[elementKey].addEventListener("input", () => {
      const project = getActiveProject();
      if (!project || !projectCanEdit(project)) {
        return;
      }
      project[projectKey] = elements[elementKey].value;
      touchProject(project);
      refreshProjectDerived(project);
      saveState();
      renderProjectList();
      renderProjectSnapshot();
      renderInstructorDashboard();
    });
  });

  elements.themes.addEventListener("input", () => {
    const project = getActiveProject();
    if (!project || !projectCanEdit(project)) {
      return;
    }
    project.themes = parseCommaList(elements.themes.value);
    touchProject(project);
    refreshProjectDerived(project);
    saveState();
    renderProjectSnapshot();
    renderInstructorDashboard();
  });

  elements.visualReferences.addEventListener("input", () => {
    const project = getActiveProject();
    if (!project || !projectCanEdit(project)) {
      return;
    }
    project.visualReferences = parseCommaList(elements.visualReferences.value);
    touchProject(project);
    refreshProjectDerived(project);
    saveState();
    renderProjectSnapshot();
    renderInstructorDashboard();
  });

  elements.currentModuleSelect.addEventListener("change", () => {
    const project = getActiveProject();
    if (!project) {
      return;
    }
    project.currentModule = elements.currentModuleSelect.value;
    if (projectCanEdit(project)) {
      touchProject(project);
      saveState();
    } else {
      persistUiState();
    }
    renderModuleSelector();
    hydrateModuleWorkspace();
    renderProjectSnapshot();
  });

  elements.storyStructureChoice.addEventListener("change", () => {
    const project = getActiveProject();
    if (!project || !projectCanEdit(project)) {
      return;
    }
    project.storyStructureChoice = elements.storyStructureChoice.value;
    touchProject(project);
    refreshProjectDerived(project);
    saveState();
    renderProjectSnapshot();
    renderInstructorDashboard();
  });

  elements.moduleCardGrid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-module-id]");
    if (!card) {
      return;
    }

    const project = getActiveProject();
    if (!project) {
      return;
    }
    project.currentModule = card.dataset.moduleId;
    if (projectCanEdit(project)) {
      touchProject(project);
      saveState();
    } else {
      persistUiState();
    }
    renderModuleSelector();
    hydrateProjectForm();
    hydrateModuleWorkspace();
    renderProjectSnapshot();
  });

  elements.moduleStudentInput.addEventListener("input", () => {
    const response = getActiveModuleResponse();
    if (!response || !projectCanEdit()) {
      return;
    }
    response.studentInput = elements.moduleStudentInput.value;
    touchProject(getActiveProject());
    saveState();
    renderProjectSnapshot();
    renderModuleSelector();
  });

  elements.moduleStudentResponses.addEventListener("input", () => {
    const response = getActiveModuleResponse();
    if (!response || !projectCanEdit()) {
      return;
    }
    response.studentResponses = splitParagraphs(elements.moduleStudentResponses.value);
    touchProject(getActiveProject());
    saveState();
    renderProjectSnapshot();
    renderModuleSelector();
  });

  elements.studentDecision.addEventListener("input", () => {
    const response = getActiveModuleResponse();
    if (!response || !projectCanEdit()) {
      return;
    }
    response.studentDecision = elements.studentDecision.value;
    touchProject(getActiveProject());
    saveState();
  });

  const reflectionFieldMap = {
    reflectionDecided: "decided",
    reflectionRejected: "rejected",
    reflectionAiChange: "aiChange",
    reflectionUnresolved: "unresolved",
    reflectionConnection: "connection",
    reflectionResearch: "research",
  };

  Object.entries(reflectionFieldMap).forEach(([elementKey, reflectionKey]) => {
    elements[elementKey].addEventListener("input", () => {
      const response = getActiveModuleResponse();
      if (!response || !projectCanEdit()) {
        return;
      }
      response.reflection[reflectionKey] = elements[elementKey].value;
      touchProject(getActiveProject());
      saveState();
      renderProjectSnapshot();
      renderModuleSelector();
    });
  });

  elements.generateGuidanceButton.addEventListener("click", generateGuidanceForActiveModule);
  elements.saveDecisionButton.addEventListener("click", () => saveStudentDecision("approved"));
  elements.rejectDecisionButton.addEventListener("click", () => saveStudentDecision("rejected"));
  elements.markUnresolvedButton.addEventListener("click", markModuleUnresolved);
  elements.saveModuleToBibleButton.addEventListener("click", saveModuleToWorldBible);
  elements.saveReflectionButton.addEventListener("click", saveReflectionForActiveModule);

  elements.directionsList.addEventListener("click", (event) => {
    if (!projectCanEdit()) {
      return;
    }
    const button = event.target.closest("[data-direction-action]");
    if (!button) {
      return;
    }

    const response = getActiveModuleResponse();
    const direction = response.aiResponse?.directions?.[Number(button.dataset.directionIndex)];
    if (!direction) {
      return;
    }

    if (button.dataset.directionAction === "approve") {
      appendIdea(getActiveProject(), "approved", `${direction.title}: ${direction.description}`);
    }

    if (button.dataset.directionAction === "reject") {
      appendIdea(getActiveProject(), "rejected", `${direction.title}: ${direction.description}`);
    }

    if (button.dataset.directionAction === "park") {
      appendIdea(getActiveProject(), "unresolved", `${direction.title}: ${direction.description}`);
    }

    saveState();
    refreshProjectDerived(getActiveProject());
    renderMemoryRail();
    renderProjectSnapshot();
    renderInstructorDashboard();
  });

  elements.exportTypeSelect.addEventListener("change", () => {
    state.selectedExportType = elements.exportTypeSelect.value;
    const project = getActiveProject();
    elements.exportFileName.value = project
      ? defaultExportFileName(project, state.selectedExportType)
      : "worldbuilding-export.md";
    persistUiState();
    renderExportPreview();
  });

  elements.refreshExportButton.addEventListener("click", () => {
    renderExportPreview();
    trackExport("previewed");
  });

  elements.downloadExportButton.addEventListener("click", () => {
    const project = getActiveProject();
    const text = buildExportPreview(project, state.selectedExportType);
    const fileName = sanitizeFileName(elements.exportFileName.value || defaultExportFileName(project, state.selectedExportType));
    downloadText(fileName, text);
    trackExport("downloaded");
  });

  elements.downloadJsonButton.addEventListener("click", () => {
    const project = getActiveProject();
    const fileName = sanitizeFileName(`${slugify(project.worldTitle || "worldbuilding-project")}.json`);
    downloadText(fileName, JSON.stringify(project, null, 2));
    trackExport("json");
  });

  elements.copyExportButton.addEventListener("click", async () => {
    const text = elements.exportPreview.textContent;
    try {
      await navigator.clipboard.writeText(text);
      window.alert("Export preview copied to clipboard.");
    } catch (error) {
      window.alert("Clipboard copy failed in this browser.");
    }
  });

  elements.instructorProjectCards.addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-project-from-instructor]");
    if (!button) {
      return;
    }

    state.activeProjectId = button.dataset.openProjectFromInstructor;
    state.activeTab = "modules";
    persistUiState();
    renderAll();
  });
}

async function createNewProject() {
  if (!appContext.permissions.canCreateProjects) {
    return;
  }

  try {
    setSyncStatus("Creating project", "warning");
    const project = createProject();
    const savedProject = await apiCreateProject(project);
    state.projects.unshift(hydrateProject(savedProject));
    state.activeProjectId = savedProject.projectId;
    persistUiState();
    setSyncStatus("All changes saved", "success");
    renderAll();
  } catch (error) {
    showLaunchNotice(error.message || "The project could not be created.");
    setSyncStatus("Save failed", "warning");
  }
}

async function duplicateActiveProject() {
  const project = getActiveProject();
  if (!project || !projectCanEdit(project)) {
    return;
  }
  try {
    setSyncStatus("Duplicating project", "warning");
    const duplicate = structuredCloneSafe(project);
    duplicate.projectId = generateId();
    duplicate.worldTitle = `${project.worldTitle || "Untitled world"} (Copy)`;
    duplicate.createdAt = new Date().toISOString();
    duplicate.updatedAt = duplicate.createdAt;
    const savedProject = await apiCreateProject(duplicate);
    state.projects.unshift(hydrateProject(savedProject));
    state.activeProjectId = savedProject.projectId;
    persistUiState();
    setSyncStatus("All changes saved", "success");
    renderAll();
  } catch (error) {
    showLaunchNotice(error.message || "The project copy could not be created.");
    setSyncStatus("Save failed", "warning");
  }
}

async function deleteProject(projectId) {
  if (!appContext.permissions.canEditProjects) {
    return;
  }
  if (state.projects.length === 1) {
    window.alert("Keep at least one project in the studio archive.");
    return;
  }

  const target = state.projects.find((project) => project.projectId === projectId);
  const projectName = target?.worldTitle || "this project";
  const shouldDelete = window.confirm(`Delete ${projectName}? This removes it from the course workspace for this student.`);
  if (!shouldDelete) {
    return;
  }

  try {
    setSyncStatus("Deleting project", "warning");
    await apiDeleteProject(projectId);
    state.projects = state.projects.filter((project) => project.projectId !== projectId);
    if (state.activeProjectId === projectId) {
      state.activeProjectId = state.projects[0]?.projectId || "";
    }
    persistUiState();
    setSyncStatus("All changes saved", "success");
    renderAll();
  } catch (error) {
    showLaunchNotice(error.message || "The project could not be deleted.");
    setSyncStatus("Save failed", "warning");
  }
}

function createProject() {
  const project = {
    projectId: generateId(),
    studentName: appContext.user.displayName || "",
    worldTitle: "",
    coreConcept: "",
    genre: "",
    medium: "",
    tone: "",
    themes: [],
    visualStyle: "",
    visualReferences: [],
    intendedFinalOutput: "",
    currentModule: modules[0].id,
    storyStructureChoice: storyStructureChoices[0].id,
    aiCollaborationNote: "",
    safetyCanonNote: "",
    approvedIdeas: [],
    rejectedIdeas: [],
    savedDecisions: [],
    unresolvedItems: [],
    worldRules: [],
    characters: [],
    cultures: [],
    species: [],
    powerStructures: [],
    rituals: [],
    genderSexualitySystems: [],
    ecologySystems: [],
    storyIdeas: [],
    worldBible: createWorldBibleStore(),
    moduleResponses: modules.map(createModuleResponse),
    coherenceWarnings: [],
    reflectionNotes: [],
    revisionHistory: [],
    exportsGenerated: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  refreshProjectDerived(project);
  return project;
}

function createModuleResponse(module) {
  return {
    moduleId: module.id,
    moduleName: module.title,
    studentInput: "",
    aiQuestions: [],
    studentResponses: [],
    coherenceFlags: [],
    savedToWorldBible: false,
    reflection: {
      decided: "",
      rejected: "",
      aiChange: "",
      unresolved: "",
      connection: "",
      research: "",
    },
    studentDecision: "",
    aiResponse: null,
    unresolved: false,
    lastSavedAt: "",
  };
}

function createWorldBibleStore() {
  return Object.fromEntries(worldBibleSections.map((section) => [section.id, []]));
}

function ensureStateShape(input) {
  const nextState = {
    ...baseState,
    ...input,
  };

  const projects = Array.isArray(nextState.projects) ? nextState.projects : [];
  nextState.projects = projects.map(hydrateProject);
  if (
    nextState.projects.length &&
    (!nextState.activeProjectId || !nextState.projects.some((project) => project.projectId === nextState.activeProjectId))
  ) {
    nextState.activeProjectId = nextState.projects[0].projectId;
  }
  if (!nextState.projects.length) {
    nextState.activeProjectId = "";
  }

  if (!exportTypes.some((exportType) => exportType.id === nextState.selectedExportType)) {
    nextState.selectedExportType = exportTypes[0].id;
  }

  if (!["dashboard", "modules", "worldBible", "exports", "instructor"].includes(nextState.activeTab)) {
    nextState.activeTab = "dashboard";
  }

  return nextState;
}

function hydrateProject(project) {
  const fresh = createProject();
  const nextProject = {
    ...fresh,
    ...project,
  };

  nextProject.themes = Array.isArray(nextProject.themes) ? nextProject.themes : parseCommaList(nextProject.themes);
  nextProject.visualReferences = Array.isArray(nextProject.visualReferences)
    ? nextProject.visualReferences
    : parseCommaList(nextProject.visualReferences);
  nextProject.storyStructureChoice = storyStructureLabelMap.has(nextProject.storyStructureChoice)
    ? nextProject.storyStructureChoice
    : storyStructureChoices[0].id;
  nextProject.aiCollaborationNote = String(nextProject.aiCollaborationNote || "");
  nextProject.safetyCanonNote = String(nextProject.safetyCanonNote || "");

  nextProject.approvedIdeas = arrayOrEmpty(nextProject.approvedIdeas);
  nextProject.rejectedIdeas = arrayOrEmpty(nextProject.rejectedIdeas);
  nextProject.savedDecisions = arrayOrEmpty(nextProject.savedDecisions);
  nextProject.unresolvedItems = arrayOrEmpty(nextProject.unresolvedItems);
  nextProject.worldRules = arrayOrEmpty(nextProject.worldRules);
  nextProject.characters = arrayOrEmpty(nextProject.characters);
  nextProject.cultures = arrayOrEmpty(nextProject.cultures);
  nextProject.species = arrayOrEmpty(nextProject.species);
  nextProject.powerStructures = arrayOrEmpty(nextProject.powerStructures);
  nextProject.rituals = arrayOrEmpty(nextProject.rituals);
  nextProject.genderSexualitySystems = arrayOrEmpty(nextProject.genderSexualitySystems);
  nextProject.ecologySystems = arrayOrEmpty(nextProject.ecologySystems);
  nextProject.storyIdeas = arrayOrEmpty(nextProject.storyIdeas);
  nextProject.coherenceWarnings = arrayOrEmpty(nextProject.coherenceWarnings);
  nextProject.reflectionNotes = arrayOrEmpty(nextProject.reflectionNotes);
  nextProject.revisionHistory = arrayOrEmpty(nextProject.revisionHistory);
  nextProject.exportsGenerated = arrayOrEmpty(nextProject.exportsGenerated);

  const worldBible = nextProject.worldBible && typeof nextProject.worldBible === "object" ? nextProject.worldBible : {};
  nextProject.worldBible = createWorldBibleStore();
  worldBibleSections.forEach((section) => {
    nextProject.worldBible[section.id] = Array.isArray(worldBible[section.id]) ? worldBible[section.id] : [];
  });

  const responseMap = new Map(arrayOrEmpty(nextProject.moduleResponses).map((response) => [response.moduleId, response]));
  nextProject.moduleResponses = modules.map((module) => {
    const freshResponse = createModuleResponse(module);
    const existing = responseMap.get(module.id) || {};
    return {
      ...freshResponse,
      ...existing,
      studentResponses: arrayOrEmpty(existing.studentResponses),
      aiQuestions: arrayOrEmpty(existing.aiQuestions),
      coherenceFlags: arrayOrEmpty(existing.coherenceFlags),
      reflection: {
        ...freshResponse.reflection,
        ...(existing.reflection || {}),
      },
    };
  });

  if (!moduleMap.has(nextProject.currentModule)) {
    nextProject.currentModule = modules[0].id;
  }

  refreshProjectDerived(nextProject);
  return nextProject;
}

function saveState() {
  persistUiState();
  scheduleProjectSync();
}

function renderAll() {
  renderTabs();
  renderProjectList();
  renderProjectSnapshot();
  renderResourceScaffolds();
  renderMemoryRail();
  renderWorldBible();
  hydrateExportControls();
  renderExportPreview();
  renderInstructorDashboard();
  hydrateProjectForm();
  renderModuleSelector();
  hydrateModuleWorkspace();
  updateContextBar();
  applyAccessState();
}

function renderTabs() {
  elements.tabButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === state.activeTab);
  });
  elements.tabPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === `tab-${state.activeTab}`);
  });
}

function renderProjectList() {
  const activeProject = getActiveProject();
  if (!state.projects.length) {
    elements.projectList.innerHTML = `<div class="empty-state">No projects are in this course workspace yet.</div>`;
    return;
  }
  elements.projectList.innerHTML = state.projects
    .map((project) => {
      const progress = getProjectProgress(project);
      const readiness = getReadinessLabel(project);
      const isActive = project.projectId === activeProject?.projectId;
      const currentModule = moduleMap.get(project.currentModule);
      const displayName =
        project.studentName || project._meta?.ownerDisplayName || "No student name yet";
      const canDelete = projectCanEdit(project);

      return `
        <article class="project-item ${isActive ? "is-active" : ""}">
          <div class="project-item-top">
            <div>
              <div class="project-name">${escapeHtml(project.worldTitle || "Untitled world")}</div>
              <div class="project-meta">${escapeHtml(displayName)}</div>
            </div>
            <div class="mini-row">
              <button class="mini-button" type="button" data-action="open-project" data-project-id="${project.projectId}">
                Open
              </button>
              ${
                canDelete
                  ? `<button class="mini-button" type="button" data-action="delete-project" data-project-id="${project.projectId}">
                      Delete
                    </button>`
                  : ""
              }
            </div>
          </div>

          <div class="mini-row">
            <span class="pill pill-accent">${progress.completed}/${modules.length} modules saved</span>
            <span class="pill pill-muted">${escapeHtml(readiness)}</span>
          </div>

          <div class="project-meta">
            Current module: ${escapeHtml(currentModule?.title || "Unknown")}
          </div>

          <div class="progress-bar" aria-hidden="true">
            <span style="width: ${progress.percent}%"></span>
          </div>
        </article>
      `;
    })
    .join("");
}

function hydrateProjectForm() {
  const project = getActiveProject();
  if (!project) {
    elements.studentName.value = "";
    elements.worldTitle.value = "";
    elements.genre.value = "";
    elements.medium.value = "";
    elements.coreConcept.value = "";
    elements.tone.value = "";
    elements.visualStyle.value = "";
    elements.themes.value = "";
    elements.visualReferences.value = "";
    elements.intendedFinalOutput.value = "";
    elements.currentModuleSelect.value = modules[0].id;
    elements.storyStructureChoice.value = storyStructureChoices[0].id;
    elements.aiCollaborationNote.value = "";
    elements.safetyCanonNote.value = "";
    return;
  }
  elements.studentName.value = project.studentName;
  elements.worldTitle.value = project.worldTitle;
  elements.genre.value = project.genre;
  elements.medium.value = project.medium;
  elements.coreConcept.value = project.coreConcept;
  elements.tone.value = project.tone;
  elements.visualStyle.value = project.visualStyle;
  elements.themes.value = project.themes.join(", ");
  elements.visualReferences.value = project.visualReferences.join(", ");
  elements.intendedFinalOutput.value = project.intendedFinalOutput;
  elements.currentModuleSelect.value = project.currentModule;
  elements.storyStructureChoice.value = project.storyStructureChoice;
  elements.aiCollaborationNote.value = project.aiCollaborationNote;
  elements.safetyCanonNote.value = project.safetyCanonNote;
}

function renderProjectSnapshot() {
  const project = getActiveProject();
  if (!project) {
    elements.projectSnapshot.innerHTML = `<div class="empty-state">Launch or create a project to start tracking progress.</div>`;
    return;
  }
  const progress = getProjectProgress(project);
  const readiness = getReadinessLabel(project);
  const currentModule = moduleMap.get(project.currentModule);
  const savedEntries = worldBibleSections.reduce(
    (count, section) => count + arrayOrEmpty(project.worldBible[section.id]).length,
    0,
  );

  elements.projectSnapshot.innerHTML = `
    <article class="snapshot-card">
      <p class="metric-label">Completion</p>
      <strong>${progress.completed}/${modules.length}</strong>
      <div class="progress-bar" aria-hidden="true"><span style="width: ${progress.percent}%"></span></div>
    </article>

    <article class="snapshot-card">
      <p class="metric-label">Current module</p>
      <strong>${escapeHtml(currentModule?.title || "Unknown")}</strong>
      <small>${escapeHtml(currentModule?.week || "")}</small>
    </article>

    <article class="snapshot-card">
      <p class="metric-label">Project memory</p>
      <strong>${project.savedDecisions.length}</strong>
      <small>${project.aiCollaborationNote.trim() ? "AI note recorded" : "AI note still needed"}</small>
    </article>

    <article class="snapshot-card">
      <p class="metric-label">Readiness</p>
      <strong>${escapeHtml(readiness)}</strong>
      <small>${savedEntries} World Bible entries, ${project.coherenceWarnings.length} warnings, ${escapeHtml(
        getStoryStructureLabel(project.storyStructureChoice),
      )}</small>
    </article>
  `;
}

function renderResourceScaffolds() {
  elements.resourceScaffolds.innerHTML = courseScaffoldResources
    .map(
      (resource) => `
        <article class="notice-card">
          <p class="notice-title">${escapeHtml(resource.title)}</p>
          <p>${escapeHtml(resource.summary)}</p>
          <ul class="hero-list compact-list">
            ${resource.prompts.map((prompt) => `<li>${escapeHtml(prompt)}</li>`).join("")}
          </ul>
        </article>
      `,
    )
    .join("");
}

function renderMemoryRail() {
  const project = getActiveProject();
  if (!project) {
    elements.savedIdeasList.innerHTML = `<div class="empty-state">Saved decisions will appear once a project is underway.</div>`;
    elements.watchList.innerHTML = `<div class="empty-state">Warnings and unresolved questions will appear here once work begins.</div>`;
    return;
  }

  elements.savedIdeasList.innerHTML = renderMemoryItems(
    project.savedDecisions.slice(0, 6).map((item) => ({
      title: "Saved decision",
      text: item,
    })),
    "No approved choices saved yet. Use the student decision panel or direction cards to keep track of commitments.",
  );

  const watchItems = [
    ...project.rejectedIdeas.slice(0, 3).map((item) => ({
      title: "Rejected idea",
      text: item,
    })),
    ...project.unresolvedItems.slice(0, 3).map((item) => ({
      title: "Unresolved question",
      text: item,
    })),
    ...project.coherenceWarnings.slice(0, 3).map((item) => ({
      title: "Coherence warning",
      text: item,
    })),
  ];

  elements.watchList.innerHTML = renderMemoryItems(
    watchItems,
    "Rejected ideas, unresolved questions, and coherence warnings will appear here.",
  );
}

function renderMemoryItems(items, emptyMessage) {
  if (!items.length) {
    return `<div class="empty-state">${escapeHtml(emptyMessage)}</div>`;
  }

  return items
    .map(
      (item) => `
        <article class="memory-card">
          <small>${escapeHtml(item.title)}</small>
          <p>${escapeHtml(item.text)}</p>
        </article>
      `,
    )
    .join("");
}

function renderModuleSelector() {
  const project = getActiveProject();
  if (!project) {
    elements.moduleCardGrid.innerHTML = `<div class="empty-state">No module workspace is active yet.</div>`;
    return;
  }
  elements.moduleCardGrid.innerHTML = modules
    .map((module) => {
      const response = getModuleResponse(project, module.id);
      const status = getModuleStatus(response);
      return `
        <button class="module-card ${project.currentModule === module.id ? "is-active" : ""} ${
          status === "complete" ? "is-complete" : ""
        }" type="button" data-module-id="${module.id}">
          <div class="module-card-header">
            <p class="module-card-title">${escapeHtml(module.title)}</p>
            <span class="module-card-week">${escapeHtml(module.week)}</span>
          </div>
          <p class="module-card-focus">${escapeHtml(module.focus)}</p>
          <div class="mini-row">
            <span class="pill ${status === "complete" ? "pill-accent" : status === "unresolved" ? "pill-warning" : "pill-muted"}">
              ${escapeHtml(prettyStatus(status))}
            </span>
          </div>
        </button>
      `;
    })
    .join("");
}

function hydrateModuleWorkspace() {
  const project = getActiveProject();
  if (!project) {
    elements.workspaceTitle.textContent = "Module Workspace";
    elements.moduleSummary.innerHTML = `<div class="empty-state">Open or create a project to begin a weekly module.</div>`;
    elements.moduleStudentInput.value = "";
    elements.moduleStudentResponses.value = "";
    elements.studentDecision.value = "";
    elements.reflectionDecided.value = "";
    elements.reflectionRejected.value = "";
    elements.reflectionAiChange.value = "";
    elements.reflectionUnresolved.value = "";
    elements.reflectionConnection.value = "";
    elements.reflectionResearch.value = "";
    renderAiPanel(null);
    return;
  }
  const module = moduleMap.get(project.currentModule);
  const response = getModuleResponse(project, project.currentModule);

  elements.workspaceTitle.textContent = `${module.title} Workspace`;
  elements.moduleSummary.innerHTML = `
    <article class="module-summary-card">
      <small>Learning focus</small>
      <strong>${escapeHtml(module.focus)}</strong>
      <p>${escapeHtml(module.description)}</p>
    </article>
    <article class="module-summary-card">
      <small>Expected output</small>
      <strong>${escapeHtml(module.output)}</strong>
      <p>Use the prompts to document process, not to outsource authorship.</p>
    </article>
    <article class="module-summary-card">
      <small>World Bible sections</small>
      <strong>${escapeHtml(module.sections.map((sectionId) => worldBibleSectionMap.get(sectionId)?.label).join(" / "))}</strong>
      <p>Saving this module adds a structured entry to these sections.</p>
    </article>
  `;

  elements.moduleStudentInput.value = response.studentInput;
  elements.moduleStudentResponses.value = response.studentResponses.join("\n\n");
  elements.studentDecision.value = response.studentDecision;
  elements.reflectionDecided.value = response.reflection.decided;
  elements.reflectionRejected.value = response.reflection.rejected;
  elements.reflectionAiChange.value = response.reflection.aiChange;
  elements.reflectionUnresolved.value = response.reflection.unresolved;
  elements.reflectionConnection.value = response.reflection.connection;
  elements.reflectionResearch.value = response.reflection.research;

  renderAiPanel(response.aiResponse);
}

function renderAiPanel(aiResponse) {
  if (!aiResponse) {
    const emptyMessage =
      "Enter module notes, then generate guidance to receive questions, possible directions, coherence risks, and a decision point.";
    elements.workingList.innerHTML = `<div class="empty-state">${escapeHtml(emptyMessage)}</div>`;
    elements.clarificationList.innerHTML = `<div class="empty-state">${escapeHtml(emptyMessage)}</div>`;
    elements.questionsList.innerHTML = `<div class="empty-state">${escapeHtml(emptyMessage)}</div>`;
    elements.directionsList.innerHTML = `<div class="empty-state">${escapeHtml(emptyMessage)}</div>`;
    elements.coherenceList.innerHTML = `<div class="empty-state">${escapeHtml(emptyMessage)}</div>`;
    elements.decisionPoint.innerHTML = escapeHtml("Choose one design move you are willing to test after guidance is generated.");
    return;
  }

  elements.workingList.innerHTML = renderBulletItems(aiResponse.working);
  elements.clarificationList.innerHTML = renderBulletItems(aiResponse.clarification);
  elements.questionsList.innerHTML = renderBulletItems(aiResponse.questions);
  elements.directionsList.innerHTML = renderDirectionCards(aiResponse.directions);
  elements.coherenceList.innerHTML = renderFlagItems(aiResponse.coherenceRisks);
  elements.decisionPoint.innerHTML = escapeHtml(aiResponse.decisionPoint);
}

function renderBulletItems(items) {
  if (!items?.length) {
    return `<div class="empty-state">No notes yet.</div>`;
  }
  return items
    .map(
      (item) => `
        <article class="bullet-item">
          <p>${escapeHtml(item)}</p>
        </article>
      `,
    )
    .join("");
}

function renderDirectionCards(directions) {
  if (!directions?.length) {
    return `<div class="empty-state">No directions generated yet.</div>`;
  }

  const canEdit = projectCanEdit();
  return directions
    .map(
      (direction, index) => `
        <article class="direction-card">
          <div>
            <h3>${escapeHtml(direction.title)}</h3>
            <p>${escapeHtml(direction.description)}</p>
          </div>
          <small>${escapeHtml(direction.prompt)}</small>
          <div class="direction-actions">
            <button class="direction-action" type="button" data-direction-action="approve" data-direction-index="${index}" ${
              canEdit ? "" : "disabled"
            }>
              Approve
            </button>
            <button class="direction-action" type="button" data-direction-action="reject" data-direction-index="${index}" ${
              canEdit ? "" : "disabled"
            }>
              Reject
            </button>
            <button class="direction-action" type="button" data-direction-action="park" data-direction-index="${index}" ${
              canEdit ? "" : "disabled"
            }>
              Mark unresolved
            </button>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderFlagItems(flags) {
  if (!flags?.length) {
    return `<div class="empty-state">No coherence risks detected yet.</div>`;
  }

  return flags
    .map(
      (flag) => `
        <article class="flag-item ${escapeHtml(flag.severity)}">
          <small>${escapeHtml(flag.category)}</small>
          <p>${escapeHtml(flag.text)}</p>
        </article>
      `,
    )
    .join("");
}

function renderWorldBible() {
  const project = getActiveProject();
  if (!project) {
    elements.worldBibleGrid.innerHTML = `<div class="empty-state">Saved World Bible sections will appear after a project is launched.</div>`;
    return;
  }
  elements.worldBibleGrid.innerHTML = worldBibleSections
    .map((section) => {
      const entries = arrayOrEmpty(project.worldBible[section.id]);
      return `
        <article class="world-bible-card">
          <div>
            <h3>${escapeHtml(section.label)}</h3>
            <small>${entries.length} saved item${entries.length === 1 ? "" : "s"}</small>
          </div>
          ${
            entries.length
              ? `<div class="world-bible-list">
                  ${entries
                    .map(
                      (entry) => `
                        <div class="world-bible-entry">
                          <small>${escapeHtml(entry.moduleName)}${entry.savedAt ? ` • ${escapeHtml(formatDate(entry.savedAt))}` : ""}</small>
                          <p>${escapeHtml(entry.text)}</p>
                        </div>
                      `,
                    )
                    .join("")}
                </div>`
              : `<div class="world-bible-empty">No saved material yet. Use “Save to World Bible” from the module workspace when a decision is ready.</div>`
          }
        </article>
      `;
    })
    .join("");
}

function hydrateExportControls() {
  const project = getActiveProject();
  elements.exportTypeSelect.value = state.selectedExportType;
  elements.exportFileName.value = project
    ? elements.exportFileName.value || defaultExportFileName(project, state.selectedExportType)
    : "worldbuilding-export.md";
}

function renderExportPreview() {
  const project = getActiveProject();
  if (!project) {
    elements.exportPreview.textContent = "No project is active yet, so there is nothing to export.";
    return;
  }
  const preview = buildExportPreview(project, state.selectedExportType);
  elements.exportPreview.textContent = preview;
}

function renderInstructorDashboard() {
  const totalProjects = state.projects.length;
  const totalCompletedModules = state.projects.reduce(
    (sum, project) => sum + getProjectProgress(project).completed,
    0,
  );
  const unresolvedCount = state.projects.reduce((sum, project) => sum + project.unresolvedItems.length, 0);
  const readyProjects = state.projects.filter((project) => getReadinessScore(project) >= 3).length;

  elements.instructorSummary.innerHTML = `
    <article class="metric-card">
      <p class="metric-label">Projects</p>
      <strong>${totalProjects}</strong>
      <small>Projects available in this Canvas course context.</small>
    </article>
    <article class="metric-card">
      <p class="metric-label">Modules Saved</p>
      <strong>${totalCompletedModules}</strong>
      <small>Total module work saved to the World Bible across all projects.</small>
    </article>
    <article class="metric-card">
      <p class="metric-label">Unresolved</p>
      <strong>${unresolvedCount}</strong>
      <small>Questions students or groups still need to resolve.</small>
    </article>
    <article class="metric-card">
      <p class="metric-label">Export Ready</p>
      <strong>${readyProjects}</strong>
      <small>Projects that appear ready for a substantive portfolio export.</small>
    </article>
  `;

  if (!state.projects.length) {
    elements.instructorProjectCards.innerHTML = `<div class="empty-state">No projects have been saved in this course workspace yet.</div>`;
    return;
  }

  elements.instructorProjectCards.innerHTML = state.projects
    .map((project) => {
      const progress = getProjectProgress(project);
      const missingModules = getMissingModules(project);
      const reflectionQuality = getReflectionQuality(project);
      const aiReflection = getLatestAiReflection(project);
      const savedOutputs = worldBibleSections.reduce(
        (count, section) => count + arrayOrEmpty(project.worldBible[section.id]).length,
        0,
      );

      const displayName = project.studentName || project._meta?.ownerDisplayName || "No student name yet";

      return `
        <article class="instructor-card">
          <div class="instructor-card-top">
            <div>
              <h3>${escapeHtml(project.worldTitle || "Untitled world")}</h3>
              <p class="muted">${escapeHtml(displayName)}</p>
            </div>
            <button
              class="mini-button"
              type="button"
              data-open-project-from-instructor="${project.projectId}"
            >
              Open project
            </button>
          </div>

          <div class="status-line">
            <span class="pill pill-accent">${progress.completed}/${modules.length} saved</span>
            <span class="pill pill-muted">Reflection: ${escapeHtml(reflectionQuality)}</span>
            <span class="pill ${project.coherenceWarnings.length ? "pill-warning" : "pill-muted"}">
              ${project.coherenceWarnings.length} warnings
            </span>
          </div>

          <p><strong>Current module:</strong> ${escapeHtml(moduleMap.get(project.currentModule)?.title || "Unknown")}</p>
          <p><strong>Saved outputs:</strong> ${savedOutputs} World Bible entries</p>
          <p><strong>Missing modules:</strong> ${escapeHtml(missingModules.slice(0, 4).join(", ") || "None")}${
            missingModules.length > 4 ? "..." : ""
          }</p>
          <p><strong>Story structure:</strong> ${escapeHtml(getStoryStructureLabel(project.storyStructureChoice))}</p>
          <p><strong>AI collaboration note:</strong> ${escapeHtml(
            summarizeText(
              project.aiCollaborationNote,
              "No course-level AI acknowledgment note recorded yet.",
            ),
          )}</p>
          <p><strong>AI-use reflection:</strong> ${escapeHtml(aiReflection || "No AI revision reflection recorded yet.")}</p>
          <p><strong>Safety / canon note:</strong> ${escapeHtml(
            summarizeText(project.safetyCanonNote, "No collaboration safety or canon note recorded yet."),
          )}</p>
          <p><strong>Export readiness:</strong> ${escapeHtml(getReadinessLabel(project))}</p>
        </article>
      `;
    })
    .join("");
}

function generateGuidanceForActiveModule() {
  const project = getActiveProject();
  if (!project || !projectCanEdit(project)) {
    return;
  }
  const module = moduleMap.get(project.currentModule);
  const response = getActiveModuleResponse();
  if (!response) {
    return;
  }

  const aiResponse = generateAiResponse(project, module, response);
  response.aiResponse = aiResponse;
  response.aiQuestions = aiResponse.questions;
  response.coherenceFlags = aiResponse.coherenceRisks.map((flag) => `${flag.category}: ${flag.text}`);
  response.unresolved = aiResponse.coherenceRisks.length > 0;

  refreshProjectDerived(project);
  touchProject(project);
  persistUiState();
  scheduleProjectSync({ immediate: true });
  renderAiPanel(aiResponse);
  renderProjectSnapshot();
  renderMemoryRail();
  renderModuleSelector();
  renderInstructorDashboard();
}

function generateAiResponse(project, module, response) {
  const text = [
    project.worldTitle,
    project.coreConcept,
    project.genre,
    project.medium,
    project.tone,
    project.visualStyle,
    project.themes.join(" "),
    response.studentInput,
    response.studentResponses.join(" "),
    response.studentDecision,
  ]
    .filter(Boolean)
    .join(" ");

  const analysis = analyzeSignals(text);
  const working = buildWhatWorks(project, module, response, analysis);
  const clarification = buildClarification(project, module, response, analysis);
  const questions = buildNextQuestions(module, analysis);
  const directions = buildPossibleDirections(project, module);
  const coherenceRisks = buildCoherenceRisks(project, module, response, analysis);
  const decisionPoint = buildDecisionPoint(module, coherenceRisks);

  return {
    working,
    clarification,
    questions,
    directions,
    coherenceRisks,
    decisionPoint,
  };
}

function buildWhatWorks(project, module, response, analysis) {
  const notes = [];
  const wordCount = getWordCount([response.studentInput, response.studentResponses.join(" ")].join(" "));

  if (project.coreConcept.trim()) {
    notes.push(`The project already has a central premise to build from: ${excerpt(project.coreConcept, 120)}.`);
  }

  if (analysis.sensory || analysis.place) {
    notes.push("You are grounding the world in place or sensory detail instead of leaving it as a pure concept.");
  }

  if (analysis.power || analysis.conflict || analysis.resource) {
    notes.push("You are starting to connect design choices to consequence, which supports stronger world coherence.");
  }

  if (analysis.history || analysis.kinship || analysis.labor) {
    notes.push("Social systems are beginning to appear, which helps the world feel inhabited rather than decorative.");
  }

  if (wordCount > 120) {
    notes.push("There is enough draft material here to compare options and revise, not just brainstorm from zero.");
  }

  if (!notes.length) {
    notes.push(`You already have a workable starting point for ${module.title}; now the goal is to deepen it with consequence and specificity.`);
  }

  return notes.slice(0, 4);
}

function buildClarification(project, module, response, analysis) {
  const notes = [];
  const moduleText = [response.studentInput, response.studentResponses.join(" "), response.studentDecision].join(" ");

  if (getWordCount(moduleText) < 45) {
    notes.push("This module note is still brief. Add concrete scenes, systems, examples, or lived detail before locking decisions.");
  }

  module.focusSignals.forEach((signalKey) => {
    if (!analysis[signalKey]) {
      notes.push(`Clarify ${signalCatalog[signalKey].label}.`);
    }
  });

  if (!project.themes.length) {
    notes.push("Name the central themes so the world's choices can be measured against what the project is trying to ask or reveal.");
  }

  if (!project.visualStyle.trim()) {
    notes.push("The visual direction is still open. Even a rough material or atmospheric cue can help organize decisions.");
  }

  return dedupeList(notes).slice(0, 5);
}

function buildNextQuestions(module, analysis) {
  const prioritized = [...module.questions].sort((a, b) => {
    const aMissing = analysis[a.signal] ? 1 : 0;
    const bMissing = analysis[b.signal] ? 1 : 0;
    return aMissing - bMissing;
  });

  return prioritized.slice(0, 5).map((question) => question.text);
}

function buildPossibleDirections(project, module) {
  const worldName = project.worldTitle.trim() || "this world";
  return module.directions.slice(0, 3).map((direction) => ({
    ...direction,
    prompt: `In ${worldName}, how would this choice change power, daily life, or story pressure?`,
  }));
}

function buildCoherenceRisks(project, module, response, analysis) {
  const flags = [];
  const text = [
    project.coreConcept,
    response.studentInput,
    response.studentResponses.join(" "),
    response.studentDecision,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (getWordCount(text) < 35) {
    flags.push({
      category: "Depth",
      severity: "warning",
      text: "The idea may still be too sketch-level to test for coherence. Add material, social, or sensory specifics.",
    });
  }

  const tropeMatches = [
    "chosen one",
    "ancient prophecy",
    "medieval kingdom",
    "evil empire",
    "magic crystal",
    "post-apocalyptic wasteland",
    "floating city",
    "secret rebellion",
  ].filter((phrase) => text.includes(phrase));

  if (tropeMatches.length) {
    flags.push({
      category: "Originality",
      severity: "warning",
      text: `Generic trope risk: ${tropeMatches.join(", ")}. Differentiate with social, ecological, and historical specificity.`,
    });
  }

  if ((text.includes("sustainable") || text.includes("green") || text.includes("renewable")) && !(analysis.resource && analysis.waste)) {
    flags.push({
      category: "Ecology",
      severity: "risk",
      text: "Sustainability is named, but the material logic of resources, waste, or maintenance is still thin.",
    });
  }

  if ((analysis.power || module.id === "distribution-of-power") && !(analysis.status || analysis.resistance || analysis.conflict)) {
    flags.push({
      category: "Power",
      severity: "risk",
      text: "Power structures appear without enough downstream consequence for status, exclusion, or resistance.",
    });
  }

  if (module.id === "creating-cultures" && !(analysis.history && (analysis.labor || analysis.kinship))) {
    flags.push({
      category: "Culture",
      severity: "risk",
      text: "The culture may read as flat unless it gains labor systems, historical change, or internal disagreement.",
    });
  }

  if (module.id === "ritual" && !(analysis.belief && analysis.power)) {
    flags.push({
      category: "Ritual",
      severity: "risk",
      text: "The ritual may feel disconnected from belief or social order unless you clarify why it matters and who it organizes.",
    });
  }

  if (module.id === "gender-and-sexuality" && text.match(/\bmale\b|\bfemale\b|\bboy\b|\bgirl\b/) && !(analysis.kinship || analysis.law || analysis.ritual)) {
    flags.push({
      category: "Gender and sexuality",
      severity: "risk",
      text: "Gender and sexuality may be treated too superficially unless they are connected to kinship, law, ritual, or embodied practice.",
    });
  }

  if ((module.id === "story-pitch" || module.id === "world-to-story") && !(analysis.conflict && analysis.character && analysis.story)) {
    flags.push({
      category: "Story emergence",
      severity: "warning",
      text: "The story idea may not yet emerge clearly from the world. Make sure a character and conflict are rooted in existing systems.",
    });
  }

  if (analysis.species && !analysis.interdependence && module.id !== "personal-geography") {
    flags.push({
      category: "Multi-species logic",
      severity: "warning",
      text: "Nonhuman presence is visible, but the relationships of dependency, conflict, or communication are still unclear.",
    });
  }

  if ((module.id === "creating-cultures" || analysis.kinship || analysis.history || analysis.value) && !analysis.conflict) {
    flags.push({
      category: "Complexity",
      severity: "warning",
      text: "The world may need more disagreement, inequality, or competing values to avoid polished but static description.",
    });
  }

  return flags.slice(0, 6);
}

function buildDecisionPoint(module, coherenceRisks) {
  if (coherenceRisks.some((flag) => flag.severity === "risk")) {
    return `Choose one high-risk area in ${module.title} to revise now, one suggestion to reject explicitly, and one question to keep open for research.`;
  }

  return `Choose one direction to adopt, one assumption to test for consequence, and one detail to trace through daily life, power, or ecology next.`;
}

function analyzeSignals(text) {
  const lower = text.toLowerCase();
  return Object.fromEntries(
    Object.entries(signalCatalog).map(([signalKey, signal]) => [
      signalKey,
      signal.keywords.some((keyword) => lower.includes(keyword)),
    ]),
  );
}

function saveStudentDecision(kind) {
  const project = getActiveProject();
  if (!project || !projectCanEdit(project)) {
    return;
  }
  const module = moduleMap.get(project.currentModule);
  const response = getActiveModuleResponse();
  if (!response) {
    return;
  }
  const decisionText = response.studentDecision.trim() || elements.studentDecision.value.trim();

  if (!decisionText) {
    window.alert("Write a decision in the student decision panel before saving it.");
    return;
  }

  appendIdea(project, kind, `${module.title}: ${decisionText}`);

  if (kind === "approved") {
    response.reflection.decided = response.reflection.decided || decisionText;
  }

  if (kind === "rejected") {
    response.reflection.rejected = response.reflection.rejected || decisionText;
  }

  touchProject(project);
  refreshProjectDerived(project);
  persistUiState();
  scheduleProjectSync({ immediate: true });
  hydrateModuleWorkspace();
  renderMemoryRail();
  renderProjectSnapshot();
  renderInstructorDashboard();
}

function markModuleUnresolved() {
  const project = getActiveProject();
  if (!project || !projectCanEdit(project)) {
    return;
  }
  const module = moduleMap.get(project.currentModule);
  const response = getActiveModuleResponse();
  if (!response) {
    return;
  }
  const unresolvedText =
    response.studentDecision.trim() ||
    response.reflection.unresolved.trim() ||
    response.studentInput.trim() ||
    `Further work needed in ${module.title}.`;

  response.unresolved = true;
  response.reflection.unresolved = response.reflection.unresolved || unresolvedText;
  appendIdea(project, "unresolved", `${module.title}: ${unresolvedText}`);
  touchProject(project);
  refreshProjectDerived(project);
  persistUiState();
  scheduleProjectSync({ immediate: true });
  renderMemoryRail();
  renderProjectSnapshot();
  renderModuleSelector();
  renderInstructorDashboard();
}

function saveReflectionForActiveModule() {
  const project = getActiveProject();
  if (!project || !projectCanEdit(project)) {
    return;
  }
  const response = getActiveModuleResponse();
  if (!response) {
    return;
  }
  const filledFields = Object.values(response.reflection).filter((value) => value.trim()).length;

  if (!filledFields) {
    window.alert("Add at least one reflection note before saving.");
    return;
  }

  if (response.reflection.rejected.trim()) {
    appendIdea(project, "rejected", `${response.moduleName}: ${response.reflection.rejected.trim()}`, true);
  }

  if (response.reflection.unresolved.trim()) {
    appendIdea(project, "unresolved", `${response.moduleName}: ${response.reflection.unresolved.trim()}`, true);
  }

  if (response.reflection.decided.trim()) {
    appendIdea(project, "approved", `${response.moduleName}: ${response.reflection.decided.trim()}`, true);
  }

  touchProject(project);
  refreshProjectDerived(project);
  persistUiState();
  scheduleProjectSync({ immediate: true });
  renderMemoryRail();
  renderProjectSnapshot();
  renderModuleSelector();
  renderInstructorDashboard();
  window.alert("Reflection saved to the project archive.");
}

function saveModuleToWorldBible() {
  const project = getActiveProject();
  if (!project || !projectCanEdit(project)) {
    return;
  }
  const module = moduleMap.get(project.currentModule);
  const response = getActiveModuleResponse();
  if (!response) {
    return;
  }
  const entryText = buildModuleArchiveText(response);

  if (!entryText) {
    window.alert("Add module notes, a decision, or a reflection before saving to the World Bible.");
    return;
  }

  module.sections.forEach((sectionId) => {
    const entries = arrayOrEmpty(project.worldBible[sectionId]);
    const nextEntry = {
      moduleId: module.id,
      moduleName: module.title,
      text: entryText,
      savedAt: new Date().toISOString(),
    };
    project.worldBible[sectionId] = [nextEntry, ...entries.filter((entry) => entry.moduleId !== module.id)];
  });

  const archiveSummary = `${module.title}: ${excerpt(entryText, 180)}`;
  module.archives.forEach((archiveKey) => {
    project[archiveKey] = dedupeList([archiveSummary, ...arrayOrEmpty(project[archiveKey])]);
  });

  response.savedToWorldBible = true;
  response.unresolved = false;
  response.lastSavedAt = new Date().toISOString();

  touchProject(project);
  refreshProjectDerived(project);
  persistUiState();
  scheduleProjectSync({ immediate: true });
  renderWorldBible();
  renderModuleSelector();
  renderProjectSnapshot();
  renderMemoryRail();
  renderExportPreview();
  renderInstructorDashboard();
  window.alert("Module material saved to the World Bible.");
}

function buildModuleArchiveText(response) {
  const parts = [
    response.studentDecision.trim(),
    response.reflection.decided.trim(),
    response.studentInput.trim(),
    response.studentResponses.join(" ").trim(),
    response.reflection.connection.trim(),
    response.reflection.research.trim() ? `Research still needed: ${response.reflection.research.trim()}` : "",
  ].filter(Boolean);

  return parts.length ? parts.join(" ") : "";
}

function appendIdea(project, kind, text, silent = false) {
  const entry = text.trim();
  if (!entry) {
    return;
  }

  if (kind === "approved") {
    project.approvedIdeas = dedupeList([entry, ...project.approvedIdeas]);
    project.savedDecisions = dedupeList([entry, ...project.savedDecisions]);
  }

  if (kind === "rejected") {
    project.rejectedIdeas = dedupeList([entry, ...project.rejectedIdeas]);
  }

  if (kind === "unresolved") {
    project.unresolvedItems = dedupeList([entry, ...project.unresolvedItems]);
  }

  if (!silent) {
    project.revisionHistory = dedupeList([
      `${formatDate(new Date().toISOString())}: ${kind} - ${entry}`,
      ...project.revisionHistory,
    ]).slice(0, 60);
  }
}

function refreshProjectDerived(project) {
  project.coherenceWarnings = dedupeList([
    ...project.moduleResponses.flatMap((response) => arrayOrEmpty(response.coherenceFlags)),
    ...collectCourseScaffoldWarnings(project),
  ]);

  project.reflectionNotes = dedupeList(
    project.moduleResponses
      .map((response) => {
        const reflection = response.reflection;
        if (!Object.values(reflection).some((value) => value.trim())) {
          return "";
        }
        return `${response.moduleName}: Decided - ${reflection.decided || "n/a"} | Rejected - ${
          reflection.rejected || "n/a"
        } | AI changed - ${reflection.aiChange || "n/a"} | Unresolved - ${reflection.unresolved || "n/a"}`;
      })
      .filter(Boolean),
  );

  project.updatedAt = new Date().toISOString();
}

function buildExportPreview(project, exportTypeId) {
  const header = buildProjectHeader(project);
  switch (exportTypeId) {
    case "questionnaire":
      return `${header}\n\n${buildQuestionnaireExport(project)}`;
    case "designBrief":
      return `${header}\n\n${buildDesignBrief(project)}`;
    case "factionChart":
      return `${header}\n\n${buildFactionChart(project)}`;
    case "timeline":
      return `${header}\n\n${buildTimeline(project)}`;
    case "ritualSystem":
      return `${header}\n\n${buildRitualSystem(project)}`;
    case "cultureSheet":
      return `${header}\n\n${buildCultureSheet(project)}`;
    case "storyPitch":
      return `${header}\n\n${buildStoryPitch(project)}`;
    case "peerResponseKit":
      return `${header}\n\n${buildPeerResponseKit(project)}`;
    case "finalReflection":
      return `${header}\n\n${buildFinalReflection(project)}`;
    case "workshopPacket":
      return `${header}\n\n${buildWorkshopPacket(project)}`;
    case "collaborationCanon":
      return `${header}\n\n${buildCollaborationCanon(project)}`;
    case "worldBible":
    default:
      return `${header}\n\n${buildWorldBibleExport(project)}`;
  }
}

function buildProjectHeader(project) {
  return [
    `# ${project.worldTitle || "Untitled Worldbuilding Project"}`,
    `Student: ${project.studentName || "Unspecified"}`,
    `Genre / medium: ${project.genre || "Unspecified"} / ${project.medium || "Unspecified"}`,
    `Tone / visual style: ${project.tone || "Unspecified"} / ${project.visualStyle || "Unspecified"}`,
    `Themes: ${project.themes.join(", ") || "Unspecified"}`,
    `Intended final output: ${project.intendedFinalOutput || "Unspecified"}`,
    `Story structure path: ${getStoryStructureLabel(project.storyStructureChoice)}`,
    "",
    "> Scaffolded draft export. Revise, select, and annotate before submitting or sharing.",
  ].join("\n");
}

function buildWorldBibleExport(project) {
  return [
    "## Project Overview",
    `Core concept: ${project.coreConcept || "Not yet defined."}`,
    `Saved decisions: ${project.savedDecisions.length}`,
    `Coherence warnings: ${project.coherenceWarnings.length}`,
    "",
    ...worldBibleSections.flatMap((section) => {
      const entries = arrayOrEmpty(project.worldBible[section.id]);
      return [
        `## ${section.label}`,
        entries.length
          ? entries
              .map((entry) => `- ${entry.moduleName}: ${entry.text}`)
              .join("\n")
          : "- No saved material yet.",
        "",
      ];
    }),
  ].join("\n");
}

function buildQuestionnaireExport(project) {
  return [
    "## Worldbuilding Questionnaire",
    "Use this as a structured research notebook based on the actual course questionnaire. Answer selectively, but push for specificity.",
    "",
    "## Planet",
    formatSimpleList(
      [
        "What is the world called by the people who live there?",
        "What climate, seasons, gravity, weather patterns, and natural disasters shape life?",
        "What past geological or historical events created the world's current conditions?",
      ],
      "No questionnaire prompts available.",
    ),
    "",
    "## Ecosystems",
    formatSimpleList(
      [
        "Which ecosystems support life here, and where do humans or human-adjacent beings live within them?",
        "What provisioning services, plants, animals, materials, or hazards shape survival?",
        "How do inhabitants tell time, prepare for seasons, and adapt to ecological risk?",
      ],
      "No questionnaire prompts available.",
    ),
    "",
    "## Sustainability",
    formatSimpleList(
      [
        "How are water, food, energy, waste, and pollution managed?",
        "What systems of reuse, biodegradability, or repair exist locally and at larger scales?",
        "Who is responsible for maintaining sustainable practice, and how is compliance measured?",
      ],
      "No questionnaire prompts available.",
    ),
    "",
    "## Patterns Of Humanity",
    formatSimpleList(
      [
        "Who counts as a person in this world?",
        "How are kinship, labor, language, territory, hierarchy, and diversity organized?",
        "What does belonging look and feel like in everyday life?",
      ],
      "No questionnaire prompts available.",
    ),
    "",
    "## Gender And Sexuality",
    formatSimpleList(
      [
        "How are gender, kinship, consent, embodiment, and social recognition structured?",
        "Which identities gain power, safety, or vulnerability?",
        "What assumptions need deeper cultural specificity before they become canon?",
      ],
      "No questionnaire prompts available.",
    ),
    "",
    "## Empathy And Representation",
    formatSimpleList(
      [
        "How large is the circle of empathy in this world, and who is excluded from it?",
        "Who counts as a person, and what must they manifest to receive rights or standing?",
        "Who is left out of the good life, and who decides how they are represented?",
      ],
      "No questionnaire prompts available.",
    ),
    "",
    "## Story And Visitor Experience",
    formatSimpleList(
      [
        "What sort of readers, viewers, players, or visitors are meant to encounter this world?",
        "How might those experiences differ across backgrounds, knowledge, or vulnerability?",
        "What safety tools, mechanics, or design choices help people feel safe while moving through this world?",
      ],
      "No questionnaire prompts available.",
    ),
    "",
    "## Ritual And Power",
    formatSimpleList(
      [
        "Which rituals bind the community, control conflict, or stage transformation?",
        "What sacred spaces, icons, costumes, substances, or gestures carry social meaning?",
        "What forms of authority feel legitimate here, and how are obedience or resistance produced?",
      ],
      "No questionnaire prompts available.",
    ),
    "",
    "## Saved Material To Reuse",
    formatSimpleList(
      [
        ...entriesToSimpleList(project, ["geographyEnvironment", "ecologySustainability", "culturesPractices"]),
        ...project.savedDecisions.slice(0, 10),
      ],
      "Save module work to the World Bible to pre-fill this questionnaire with project material.",
    ),
  ].join("\n");
}

function buildDesignBrief(project) {
  return [
    "## Site Planning Brief",
    `Core concept: ${project.coreConcept || "Not yet defined."}`,
    `Audience-facing tone: ${project.tone || "Not yet defined."}`,
    `Visual direction: ${project.visualStyle || "Not yet defined."}`,
    `Themes to foreground: ${project.themes.join(", ") || "Not yet defined."}`,
    "",
    "## Distinctive Built World Elements",
    formatSimpleList(project.worldRules, "Add world rules by saving Built World or sustainability module decisions."),
    "",
    "## Power, Ecology, And Site Constraints",
    formatSimpleList(
      [...project.powerStructures, ...project.ecologySystems],
      "Power and ecology notes have not been saved yet.",
    ),
    "",
    "## Planning Questions To Resolve",
    formatSimpleList(
      [
        "Where should housing, ritual, governance, and infrastructure sit relative to ecological zones?",
        "How do waste, water, energy, transport, and sacred or protected space interact?",
        ...project.unresolvedItems.slice(0, 8),
      ],
      "Story possibilities have not been saved yet.",
    ),
  ].join("\n");
}

function buildFactionChart(project) {
  return [
    "## Faction Chart",
    "Use this as a research-facing scaffold rather than a final canonical chart.",
    "",
    "## Governing groups or institutions",
    formatSimpleList(project.powerStructures, "No power structures saved yet."),
    "",
    "## Cultural blocs or communities",
    formatSimpleList(project.cultures, "No cultural group notes saved yet."),
    "",
    "## Species or multispecies actors",
    formatSimpleList(project.species, "No species notes saved yet."),
    "",
    "## Open questions for faction design",
    formatSimpleList(
      project.unresolvedItems,
      "Add unresolved questions when groups, institutions, or alliances still need definition.",
    ),
  ].join("\n");
}

function buildTimeline(project) {
  return [
    "## Timeline Scaffold",
    "This prototype export organizes saved material into a possible development sequence. Revise into an in-world timeline.",
    "",
    "## Foundational conditions",
    formatSimpleList(
      entriesToSimpleList(project, ["originStory", "geographyEnvironment", "ecologySustainability"]),
      "No foundational entries saved yet.",
    ),
    "",
    "## Social and political shifts",
    formatSimpleList(
      entriesToSimpleList(project, ["culturesPractices", "powerGovernance", "conflictInequality"]),
      "No social or political entries saved yet.",
    ),
    "",
    "## Story-era triggers",
    formatSimpleList(
      [...project.storyIdeas, ...entriesToSimpleList(project, ["finalPitch"])],
      "No story-era triggers saved yet.",
    ),
  ].join("\n");
}

function buildRitualSystem(project) {
  return [
    "## Ritual System",
    formatSimpleList(project.rituals, "No ritual notes saved yet."),
    "",
    "## Linked belief and power structures",
    formatSimpleList(
      entriesToSimpleList(project, ["ritualsBelief", "powerGovernance"]),
      "Save Ritual or Distribution of Power module decisions to populate this area.",
    ),
    "",
    "## Unresolved ritual questions",
    formatSimpleList(
      project.unresolvedItems.filter((item) => item.toLowerCase().includes("ritual")),
      "No ritual-specific unresolved questions logged yet.",
    ),
  ].join("\n");
}

function buildCultureSheet(project) {
  return [
    "## Culture Sheet",
    formatSimpleList(project.cultures, "No cultural notes saved yet."),
    "",
    "## Everyday life",
    formatSimpleList(
      entriesToSimpleList(project, ["everydayLife", "culturesPractices"]),
      "No everyday life entries saved yet.",
    ),
    "",
    "## Gender, kinship, and intimacy",
    formatSimpleList(
      [...project.genderSexualitySystems, ...entriesToSimpleList(project, ["genderSexuality"])],
      "No gender, sexuality, or kinship notes saved yet.",
    ),
  ].join("\n");
}

function buildStoryPitch(project) {
  return [
    "## Project Proposal",
    "### Core elements",
    formatSimpleList(
      [
        `Logline: ${project.storyIdeas[0] || "State the protagonist, goal, and central conflict in one sentence."}`,
        `Genre / medium: ${project.genre || "Not yet defined."} / ${project.medium || "Not yet defined."}`,
        `Target audience: ${project.intendedFinalOutput || "Name the audience and why this world speaks to them."}`,
        `Thematic statement: ${project.themes.join(", ") || "State the central question or tension."}`,
        `Story structure path: ${getStoryStructureLabel(project.storyStructureChoice)}`,
      ],
      "No proposal material saved yet.",
    ),
    "",
    "### Story foundation",
    formatSimpleList(
      [
        ...project.characters.slice(0, 5),
        ...entriesToSimpleList(project, ["storyPossibilities", "powerGovernance"]),
      ],
      "Save character, story, and power notes to populate the proposal foundation.",
    ),
    "",
    "### AI collaboration approach",
    formatSimpleList(
      project.aiCollaborationNote.trim() ? [project.aiCollaborationNote.trim()] : [],
      "Record how AI supported brainstorming, revision, or analysis and how you will acknowledge that use.",
    ),
    "",
    "### Structure options",
    formatSimpleList(
      [
        "Three-act: setup, confrontation, resolution.",
        "Four-act (Ki-Shō-Ten-Ketsu): introduction, development, change, resolution.",
        "Choose the structure that best fits how this world's tensions unfold.",
      ],
      "No structure scaffold available.",
    ),
    "",
    "### Coherence checks before submission",
    formatSimpleList(project.coherenceWarnings, "No current coherence warnings."),
  ].join("\n");
}

function buildFinalReflection(project) {
  return [
    "## Final Reflection Scaffold",
    "## AI collaboration note",
    formatSimpleList(
      project.aiCollaborationNote.trim() ? [project.aiCollaborationNote.trim()] : [],
      "Add a note on whether AI acted as assistant, brainstorming partner, or co-writer and how you will acknowledge it.",
    ),
    "",
    "## Process reflections",
    formatSimpleList(
      project.reflectionNotes,
      "No module reflections saved yet. Use the reflection panel in each module workspace.",
    ),
    "",
    "## Revision priorities",
    formatSimpleList(project.coherenceWarnings, "No current revision warnings."),
    "",
    "## AI-use reflections",
    formatSimpleList(
      project.moduleResponses
        .map((response) => response.reflection.aiChange.trim())
        .filter(Boolean),
      "No AI revision reflections saved yet.",
    ),
  ].join("\n");
}

function buildWorkshopPacket(project) {
  return [
    "## Workshop Packet",
    "### Presenter focus questions",
    formatSimpleList(
      [
        "What two aspects of the proposal do you most want feedback on?",
        "What do you want peers to evaluate: conflict clarity, world logic, pacing, or audience impact?",
      ],
      "No presenter questions recorded yet.",
    ),
    "",
    "### Peer review questions",
    formatSimpleList(
      [
        "What elements of the story stayed with you most vividly?",
        "What emotions or feelings did the proposal evoke?",
        "Which character interests you most and why?",
        "Is the central conflict clear, and how would you describe it?",
        "What aspects of the world intrigue you or need more detail?",
        "Does the proposed story feel like a natural outgrowth of the world?",
        "What one change would most strengthen the story?",
        "What should absolutely be preserved?",
      ],
      "Peer review questions not generated yet.",
    ),
    "",
    "### Coherence checklist",
    formatSimpleList(project.coherenceWarnings, "No current coherence warnings."),
    "",
    "### Revision priorities",
    formatSimpleList(project.unresolvedItems, "No unresolved issues recorded yet."),
  ].join("\n");
}

function buildPeerResponseKit(project) {
  return [
    "## Peer Response Kit",
    "Use this packet during proposal workshop or collaborative review.",
    "",
    "### What the presenter should say first",
    formatSimpleList(
      [
        "I am especially looking for feedback on ________ and ________.",
        "Please tell me what feels vivid, unclear, or disconnected between the world and the story.",
      ],
      "No presenter prompts available.",
    ),
    "",
    "### Response sequence",
    formatSimpleList(
      [
        "Initial response: what stayed with you, what emotions arose, what kind of experience do you imagine?",
        "Character and conflict: who interests you, what conflict is clear, where is growth strongest?",
        "World and setting: what feels compelling, what needs more explanation, does the world fit the story's needs?",
        "Structure and pacing: where do you expect tension, what beats seem promising, where is sequence confusing?",
        "Closing: what should be preserved, and what single change would help most?",
      ],
      "No peer response sequence available.",
    ),
    "",
    "### Current project-specific follow-ups",
    formatSimpleList(
      [
        ...project.coherenceWarnings.slice(0, 6),
        ...project.unresolvedItems.slice(0, 6),
      ],
      "No project-specific follow-ups recorded yet.",
    ),
  ].join("\n");
}

function buildCollaborationCanon(project) {
  return [
    "## Collaboration Agreement / Canon Tracker",
    "### Safety and visitor care",
    formatSimpleList(
      project.safetyCanonNote.trim() ? [project.safetyCanonNote.trim()] : [],
      "No Lines and Veils, visitor safety, or canon ownership notes recorded yet.",
    ),
    "",
    "### Approved canon",
    formatSimpleList(project.savedDecisions, "No approved canon entries saved yet."),
    "",
    "### Rejected ideas",
    formatSimpleList(project.rejectedIdeas, "No rejected ideas logged yet."),
    "",
    "### Open questions",
    formatSimpleList(project.unresolvedItems, "No open questions logged yet."),
    "",
    "### Shared rules and systems",
    formatSimpleList(project.worldRules, "No shared rules documented yet."),
  ].join("\n");
}

function trackExport(action) {
  const project = getActiveProject();
  if (!project || !projectCanEdit(project)) {
    return;
  }
  const exportLabel = exportTypes.find((item) => item.id === state.selectedExportType)?.label || "Export";
  project.exportsGenerated = dedupeList([
    `${formatDate(new Date().toISOString())}: ${exportLabel} ${action}`,
    ...project.exportsGenerated,
  ]).slice(0, 40);
  touchProject(project);
  saveState();
  renderInstructorDashboard();
}

function getActiveProject() {
  return state.projects.find((project) => project.projectId === state.activeProjectId) || state.projects[0] || null;
}

function getModuleResponse(project, moduleId) {
  if (!project) {
    return null;
  }
  return project.moduleResponses.find((response) => response.moduleId === moduleId);
}

function getActiveModuleResponse() {
  const project = getActiveProject();
  if (!project) {
    return null;
  }
  return getModuleResponse(project, project.currentModule);
}

function touchProject(project) {
  project.updatedAt = new Date().toISOString();
}

function getProjectProgress(project) {
  const completed = project.moduleResponses.filter((response) => response.savedToWorldBible).length;
  return {
    completed,
    percent: Math.round((completed / modules.length) * 100),
  };
}

function getModuleStatus(response) {
  if (response.savedToWorldBible) {
    return "complete";
  }
  if (response.unresolved || response.reflection.unresolved.trim()) {
    return "unresolved";
  }
  if (response.studentInput.trim() || response.studentResponses.length || response.aiQuestions.length) {
    return "in progress";
  }
  return "not started";
}

function prettyStatus(status) {
  if (status === "in progress") {
    return "In progress";
  }
  if (status === "not started") {
    return "Not started";
  }
  if (status === "unresolved") {
    return "Needs revision";
  }
  return "Saved";
}

function getMissingModules(project) {
  return project.moduleResponses
    .filter((response) => !response.savedToWorldBible)
    .map((response) => response.moduleName);
}

function getReflectionQuality(project) {
  const reflectionTexts = project.moduleResponses.flatMap((response) => Object.values(response.reflection));
  const filled = reflectionTexts.filter((text) => text.trim()).length;
  const chars = reflectionTexts.join(" ").trim().length;

  if (filled >= 12 && chars > 1000) {
    return "Strong";
  }
  if (filled >= 6 && chars > 400) {
    return "Developing";
  }
  if (filled > 0) {
    return "Emerging";
  }
  return "Minimal";
}

function getLatestAiReflection(project) {
  const reflections = project.moduleResponses
    .map((response) => response.reflection.aiChange.trim())
    .filter(Boolean);
  return reflections[0] || "";
}

function getReadinessScore(project) {
  const progress = getProjectProgress(project);
  const savedEntries = worldBibleSections.reduce(
    (count, section) => count + arrayOrEmpty(project.worldBible[section.id]).length,
    0,
  );
  const reflectionQuality = getReflectionQuality(project);

  let score = 0;
  if (progress.completed >= 10) {
    score += 2;
  } else if (progress.completed >= 5) {
    score += 1;
  }

  if (savedEntries >= 10) {
    score += 1;
  }

  if (project.storyStructureChoice && project.storyStructureChoice !== "undecided") {
    score += 0.5;
  }

  if (project.aiCollaborationNote.trim()) {
    score += 0.5;
  }

  if (reflectionQuality === "Strong") {
    score += 1;
  } else if (reflectionQuality === "Developing") {
    score += 0.5;
  }

  if (project.coherenceWarnings.length >= 6) {
    score -= 1;
  }

  return Math.max(0, score);
}

function getReadinessLabel(project) {
  const score = getReadinessScore(project);
  if (score >= 3) {
    return "Ready for substantial export";
  }
  if (score >= 1.5) {
    return "Developing toward export";
  }
  return "Early stage";
}

function getStoryStructureLabel(choiceId) {
  return storyStructureLabelMap.get(choiceId) || storyStructureLabelMap.get("undecided") || "Undecided";
}

function getCompletedModuleCount(project) {
  return project.moduleResponses.filter((response) => response.savedToWorldBible).length;
}

function summarizeText(text, fallback, maxLength = 140) {
  const normalized = String(text || "").trim();
  if (!normalized) {
    return fallback;
  }
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength - 1).trimEnd()}\u2026`;
}

function collectCourseScaffoldWarnings(project) {
  const warnings = [];
  const completedModules = getCompletedModuleCount(project);
  const proposalResponse = project.moduleResponses.find((response) => response.moduleId === "story-pitch");
  const collaborationSaved = project.moduleResponses.some(
    (response) =>
      (response.moduleId === "collaboration-best-practices" || response.moduleId === "collaborative-live-project") &&
      response.savedToWorldBible,
  );

  if (completedModules >= 4 && !project.aiCollaborationNote.trim()) {
    warnings.push(
      "Course scaffold: record how AI is helping and how that collaboration will be acknowledged in the proposal or final project.",
    );
  }

  if (proposalResponse?.savedToWorldBible && project.storyStructureChoice === "undecided") {
    warnings.push(
      "Project Proposal: choose a story structure path so the pitch reflects how this world's tensions actually unfold.",
    );
  }

  if (collaborationSaved && !project.safetyCanonNote.trim()) {
    warnings.push(
      "Collaboration: add Lines and Veils, visitor safety, or canon ownership notes before live or group worldbuilding sessions.",
    );
  }

  return warnings;
}

function entriesToSimpleList(project, sectionIds) {
  return sectionIds.flatMap((sectionId) =>
    arrayOrEmpty(project.worldBible[sectionId]).map((entry) => `${entry.moduleName}: ${entry.text}`),
  );
}

function formatSimpleList(items, fallback) {
  if (!items.length) {
    return `- ${fallback}`;
  }
  return items.map((item) => `- ${item}`).join("\n");
}

function defaultExportFileName(project, exportTypeId) {
  const exportLabel = exportTypes.find((item) => item.id === exportTypeId)?.label || "export";
  return `${slugify(project.worldTitle || "worldbuilding-project")}-${slugify(exportLabel)}.md`;
}

function parseCommaList(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitParagraphs(text) {
  return String(text || "")
    .split(/\n{1,2}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getWordCount(text) {
  return String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function excerpt(text, length = 140) {
  const normalized = String(text || "").trim().replace(/\s+/g, " ");
  if (normalized.length <= length) {
    return normalized;
  }
  return `${normalized.slice(0, length).trim()}...`;
}

function arrayOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}

function dedupeList(items) {
  return [...new Set(items.filter(Boolean))];
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value));
}

function formatDate(value) {
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return String(value);
  }
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "export";
}

function sanitizeFileName(fileName) {
  const cleaned = String(fileName || "export.md").replace(/[^a-zA-Z0-9._-]+/g, "-");
  return cleaned.endsWith(".md") || cleaned.endsWith(".json") ? cleaned : `${cleaned}.md`;
}

function downloadText(fileName, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function generateId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `project-${Math.random().toString(36).slice(2, 10)}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
