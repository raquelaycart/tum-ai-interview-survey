// ─────────────────────────────────────────────────────────────
//  CONTENT — all questions, options and UI text (EN + DE)
//  Sheet columns are always written in ENGLISH, whatever language the respondent chose.
// ─────────────────────────────────────────────────────────────
(function () {
  const L = (en, de) => ({ en, de });
  const o = (id, t, d, extra) => Object.assign({ id, t, d: d || null }, extra || {});
  const other = (id) => o(id || "other", L("Other", "Sonstiges"), null, { other: true });

  const STAGES = [
    o("exp", L("Experimental", "Experimentell")),
    o("pilot", L("Pilot", "Pilot")),
    o("prod", L("In production", "Produktiv"))
  ];

  const ui = {
    org: L("Advanced Seminar in Asset Management · TUM", "Advanced Seminar in Asset Management · TUM"),
    introEyebrow: L("Research study · Practitioner perspectives", "Forschungsstudie · Perspektiven aus der Praxis"),
    introTitle: L("Where does AI really move the needle in asset management?", "Wo bringt KI im Asset Management wirklich etwas?"),
    introLead: L(
      "We are studying where AI is used today, and when it can support investment decisions beyond operational efficiency. Your practical experience keeps our findings honest.",
      "Wir untersuchen, wo KI heute eingesetzt wird und wann sie Anlageentscheidungen über operative Effizienz hinaus unterstützen kann. Ihre Praxiserfahrung hält unsere Ergebnisse realistisch."
    ),
    introThanks: L(
      "Thank you for taking the time to complete this questionnaire. Your insights are the heart of our study, and we are truly grateful for your contribution.",
      "Vielen Dank, dass Sie sich die Zeit für diesen Fragebogen nehmen. Ihre Einblicke sind das Herzstück unserer Studie, und wir sind für Ihren Beitrag sehr dankbar."
    ),
    meta1: L("≈ 10–12 minutes", "ca. 10–12 Minuten"),
    meta2: L("Every question is optional", "Jede Frage ist optional"),
    meta3: L("Progress saves automatically", "Fortschritt wird automatisch gespeichert"),
    meta4: L("Brief answers are welcome", "Kurze Antworten genügen"),
    consent: L(
      "I have read the privacy notice and agree that my answers are stored and used for this academic study.",
      "Ich habe den Datenschutzhinweis gelesen und bin einverstanden, dass meine Antworten für diese wissenschaftliche Studie gespeichert und verwendet werden."
    ),
    privacyTitle: L("Privacy & confidentiality", "Datenschutz & Vertraulichkeit"),
    privacy: L(
      "Your answers are collected by a student research team of the Technical University of Munich (TUM) for the Advanced Seminar in Asset Management and are used only for this study. Name, firm and role are optional; if you choose “anonymise”, we will not attribute any statement to you or your firm in our report. Data is stored in a restricted-access Google Sheet and deleted after the seminar ends. You can ask us to delete your answers at any time (contact: {contact}). Please do not share confidential client data or non-public firm information.",
      "Ihre Antworten werden von einem studentischen Forschungsteam der Technischen Universität München (TUM) im Rahmen des Advanced Seminar in Asset Management erhoben und ausschließlich für diese Studie verwendet. Name, Unternehmen und Funktion sind freiwillig; wenn Sie „anonymisieren“ wählen, ordnen wir keine Aussage Ihnen oder Ihrem Haus zu. Die Daten liegen in einem zugriffsbeschränkten Google Sheet und werden nach Ende des Seminars gelöscht. Sie können jederzeit die Löschung Ihrer Antworten verlangen (Kontakt: {contact}). Bitte teilen Sie keine vertraulichen Kundendaten oder nicht-öffentlichen Firmeninformationen."
    ),
    begin: L("Begin", "Beginnen"),
    needIdeas: L("Need inspiration?", "Brauchen Sie Anregung?"),
    hideIdeas: L("Hide examples", "Beispiele ausblenden"),
    ideasTitle: L("Examples from practice", "Beispiele aus der Praxis"),
    ideasNote: L("Illustrative only — your reality may look entirely different.", "Nur zur Illustration — Ihre Realität kann ganz anders aussehen."),
    ourQuestion: L("Our question", "Unsere Frage"),
    back: L("Back", "Zurück"),
    cont: L("Continue", "Weiter"),
    skip: L("Skip", "Überspringen"),
    submit: L("Submit responses", "Antworten absenden"),
    sending: L("Sending…", "Wird gesendet …"),
    sectionOf: L("Section {n} of {t}", "Abschnitt {n} von {t}"),
    questionOf: L("Step {n} of {t}", "Schritt {n} von {t}"),
    before: L("Before we start", "Bevor wir starten"),
    optional: L("Optional", "Optional"),
    specify: L("Please specify", "Bitte präzisieren"),
    maxHint: L("Choose up to {n}", "Bis zu {n} auswählen"),
    rankHint: L("Select all that apply, then put them in order of priority", "Alle zutreffenden auswählen und nach Priorität ordnen"),
    rankTitle: L("Your order of priority (most important first)", "Ihre Prioritätsreihenfolge (wichtigstes zuerst)"),
    moveUp: L("Move up", "Nach oben"),
    moveDown: L("Move down", "Nach unten"),
    anyHint: L("Select all that apply", "Alle zutreffenden auswählen"),
    oneHint: L("Select one", "Eine Option wählen"),
    selectedCount: L("{n} of {m} selected", "{n} von {m} gewählt"),
    langLabel: L("Language", "Sprache"),
    restored: L("Welcome back — we restored your draft.", "Willkommen zurück — Ihr Entwurf wurde wiederhergestellt."),
    startOver: L("Start over", "Neu beginnen"),
    doneEyebrow: L("Response received", "Antwort erhalten"),
    doneTitle: L("Thank you — this genuinely helps.", "Vielen Dank — das hilft uns sehr."),
    doneLead: L(
      "Your perspective will feed directly into our analysis of how asset managers use AI today, and where it is heading.",
      "Ihre Perspektive fließt direkt in unsere Analyse ein, wie Asset Manager KI heute nutzen und wohin sich die Branche entwickelt."
    ),
    glance: L("Your answers at a glance", "Ihre Antworten auf einen Blick"),
    glanceAreas: L("Where AI is applied", "Wo KI eingesetzt wird"),
    glanceTech: L("Technologies in use", "Eingesetzte Technologien"),
    glanceLadder: L("AI’s role in decisions", "Rolle der KI bei Entscheidungen"),
    followTitle: L("Stay in the loop (optional)", "Auf dem Laufenden bleiben (optional)"),
    followLead: L("We’re happy to share what we learn — it is our way of giving something back.", "Wir teilen gern unsere Erkenntnisse — als kleines Dankeschön."),
    wantResults: L("Send me a summary of the study results", "Bitte senden Sie mir eine Zusammenfassung der Studienergebnisse"),
    wantCall: L("I’m open to a short follow-up conversation (15–20 min)", "Ich stehe für ein kurzes Nachgespräch zur Verfügung (15–20 Min.)"),
    emailLabel: L("Email address", "E-Mail-Adresse"),
    sendFollow: L("Save my preferences", "Auswahl speichern"),
    followSent: L("Noted — thank you! We’ll be in touch.", "Notiert — vielen Dank! Wir melden uns."),
    errorSend: L("We couldn’t send your answers (check your connection).", "Ihre Antworten konnten nicht gesendet werden (bitte Verbindung prüfen)."),
    retry: L("Try again", "Erneut versuchen"),
    copyAnswers: L("Copy my answers", "Antworten kopieren"),
    copied: L("Copied to clipboard", "In die Zwischenablage kopiert"),
    another: L("Submit another response", "Weitere Antwort erfassen"),
    demo: L("Preview mode · answers are not sent", "Vorschau-Modus · Antworten werden nicht gesendet"),
    fillEmail: L("Please enter a valid email address.", "Bitte geben Sie eine gültige E-Mail-Adresse ein."),
    ladderNone: L("Not used", "Nicht genutzt"),
    stageWord: L("Stage", "Stufe"),
    inUse: L("{n} in use", "{n} im Einsatz"),
    recStart: L("Record your answer", "Antwort aufnehmen"),
    recStop: L("Stop", "Stopp"),
    recSaving: L("Saving…", "Wird gespeichert …"),
    recSaved: L("Recording saved", "Aufnahme gespeichert"),
    recAgain: L("Record again", "Neu aufnehmen"),
    recDelete: L("Delete", "Löschen"),
    recDenied: L("Microphone access was blocked. Please allow it in your browser settings.", "Der Mikrofonzugriff wurde blockiert. Bitte erlauben Sie ihn in den Browsereinstellungen."),
    recNote: L("Optional · up to 3 min · stored privately for this study", "Optional · bis zu 3 Min. · nur für diese Studie privat gespeichert"),
    addApp: L("Add an application", "Anwendung hinzufügen"),
    addAnother: L("Add another application", "Weitere Anwendung hinzufügen"),
    removeApp: L("Remove", "Entfernen"),
    appN: L("Application {n}", "Anwendung {n}"),
    noneStage: L("None at this stage", "Keine in dieser Phase"),
    maxApps: L("Maximum reached", "Maximum erreicht"),
    naShort: L("N/A", "n. z."),
    naBtn: L("Not applicable / I don’t know this area", "Nicht zutreffend / Bereich mir nicht bekannt")
  };

  const sections = [
    L("Current AI adoption", "Aktueller KI-Einsatz"),
    L("Value creation", "Wertschöpfung"),
    L("Beyond operational efficiency", "Jenseits operativer Effizienz"),
    L("Future outlook", "Ausblick")
  ];

  const screens = [
    // ───────────── PROFILE ─────────────
    {
      id: "profile", kind: "profile", sec: null,
      title: L("A little about you", "Ein wenig über Sie"),
      lead: L("Everything on this page is optional. It helps us place your answers in context.", "Alles auf dieser Seite ist freiwillig. Es hilft uns, Ihre Antworten einzuordnen."),
      blocks: [
        { type: "input", key: "p_name", col: "Name", label: L("Your name", "Ihr Name"), ph: L("First and last name", "Vor- und Nachname"), autocomplete: "name" },
        { type: "input", key: "p_firm", col: "Firm", label: L("Firm", "Unternehmen"), ph: L("Company name", "Name des Unternehmens"), autocomplete: "organization" },
        { type: "input", key: "p_role", col: "Role", label: L("Role", "Funktion"), ph: L("e.g. Head of Quant Research", "z. B. Head of Quant Research"), autocomplete: "organization-title" }
      ]
    },

    // ───────────── PART 1 ─────────────
    {
      id: "qprog", num: 1, sec: 0,
      title: L("How far has AI progressed in your firm?", "Wie weit ist KI in Ihrem Haus fortgeschritten?"),
      ask: L("How far has AI progressed in your firm?", "Wie weit ist KI in Ihrem Haus fortgeschritten?"),
      ideas: [],
      blocks: [
        {
          type: "cards", key: "q3_stage", col: "Q1 · Furthest stage reached", single: true, stepper: true,
          label: L("Select the stage that fits best", "Wählen Sie die passende Stufe"),
          options: [
            o("s1", L("Exploring", "Exploration"), L("Individual experiments and idea-testing", "Einzelne Experimente und Ideentests")),
            o("s2", L("Piloting", "Pilotierung"), L("Structured pilots with defined users", "Strukturierte Piloten mit definierten Nutzern")),
            o("s3", L("Integrated in workflows", "In Workflows integriert"), L("Part of daily work for some teams", "Teil des Arbeitsalltags einzelner Teams")),
            o("s4", L("Core to the investment process", "Kern des Investmentprozesses"), L("Shapes how decisions get made", "Prägt, wie Entscheidungen entstehen"))
          ]
        }
      ]
    },
    {
      id: "q1", num: 2, sec: 0,
      title: L("Which AI applications are you running or testing?", "Welche KI-Anwendungen betreiben oder testen Sie?"),
      ask: L(
        "Which AI applications does your firm currently use or test in its asset management process?",
        "Welche KI-Anwendungen setzt oder testet Ihr Unternehmen derzeit in seinem Asset-Management-Prozess ein?"
      ),
      note: L(
        "By AI we mean any data-driven model or algorithm that learns from data, including machine learning, NLP, generative AI / LLMs and AI agents; not purely rule-based automation.",
        "Mit KI meinen wir jedes datengetriebene Modell bzw. jeden Algorithmus, der aus Daten lernt – darunter Machine Learning, NLP, generative KI / LLMs und KI-Agenten; nicht rein regelbasierte Automatisierung."
      ),
      ideas: [
        L("Name: “Research copilot”. Where: investment process. Role: supports decisions. How: an LLM over broker research and internal notes; analysts query it each morning; built on a vendor API.", "Name: „Research-Copilot“. Wo: Investmentprozess. Rolle: Entscheidungsunterstützung. Wie: ein LLM über Broker-Research und interne Notizen; Analysten fragen es jeden Morgen ab; auf Basis einer Anbieter-API."),
        L("Name: “Trade surveillance”. Where: risk & compliance. How: unsupervised anomaly detection on order flow, alerts reviewed by compliance.", "Name: „Handelsüberwachung“. Wo: Risiko & Compliance. Wie: unüberwachte Anomalieerkennung im Orderfluss, Alerts werden von Compliance geprüft."),
        L("Name: “Client report drafter”. Where: client interaction. How: generative AI drafts quarterly commentary, relationship managers edit and approve.", "Name: „Kundenbericht-Entwurf“. Wo: Kundeninteraktion. Wie: generative KI entwirft Quartalskommentare, Kundenberater prüfen und geben frei.")
      ],
      blocks: [
        {
          type: "applist", key: "q1_apps", col: "Q2 · AI applications", max: 5,
          label: L("Your AI applications, by stage", "Ihre KI-Anwendungen nach Phase"),
          help: L("Add each application under the stage it has reached, starting with what is live today. For each one, give a short name, say where in the value chain it is used and describe briefly how it works.", "Tragen Sie jede Anwendung unter der erreichten Phase ein, beginnend mit dem, was heute live ist. Nennen Sie je einen Kurznamen, den Einsatzort in der Wertschöpfungskette und beschreiben Sie kurz die Funktionsweise."),
          lanes: [
            { id: "prod", t: L("In production", "Produktiv"), q: L("Which AI applications are currently in production?", "Welche KI-Anwendungen sind derzeit produktiv?"), d: L("Routine, supported use in the asset management process.", "Regelmäßiger, unterstützter Einsatz im Asset-Management-Prozess.") },
            { id: "pilot", t: L("Pilot", "Pilot"), q: L("Which AI applications are currently in a pilot phase?", "Welche KI-Anwendungen befinden sich derzeit in der Pilotphase?"), d: L("Real users, limited scope, not yet rolled out.", "Echte Nutzer, begrenzter Umfang, noch kein Roll-out.") },
            { id: "exp", t: L("Experimental", "Experimentell"), q: L("Which AI applications are currently in an experimental phase?", "Welche KI-Anwendungen befinden sich derzeit in der Experimentierphase?"), d: L("Internal tests or proofs of concept, no real users yet.", "Interne Tests oder Proofs of Concept, noch keine echten Nutzer.") }
          ],
          fields: {
            name: { l: L("Name or short label", "Name oder Kurzbezeichnung"), ph: L("e.g. Research copilot", "z. B. Research-Copilot") },
            area: { l: L("Where in the value chain?", "Wo in der Wertschöpfungskette?"), h: L("Select all that apply", "Alle zutreffenden auswählen") },
            role: { l: L("Main role", "Hauptrolle") },
            desc: { l: L("How does it work?", "Wie funktioniert sie?"), h: L("Model or method · data it uses · what it outputs · who uses it · built in-house or bought", "Modell bzw. Methode · genutzte Daten · Output · Nutzer · intern entwickelt oder zugekauft"), ph: L("e.g. LLM over broker research and internal notes; analysts query it each morning; vendor API with our own retrieval layer…", "z. B. LLM über Broker-Research und interne Notizen; Analysten fragen es jeden Morgen ab; Anbieter-API mit eigener Retrieval-Schicht …") }
          },
          areas: [
            o("invest", L("Investment process", "Investmentprozess")),
            o("risk", L("Risk & compliance", "Risiko & Compliance")),
            o("ops", L("Operations", "Operations")),
            o("client", L("Client interaction", "Kundeninteraktion")),
            o("tech", L("Data & technology", "Daten & Technologie")),
            o("other", L("Other", "Sonstiges"))
          ],
          roles: [
            o("decision", L("Supports investment decisions", "Unterstützt Anlageentscheidungen")),
            o("efficiency", L("Efficiency / automation", "Effizienz / Automatisierung")),
            o("both", L("Both", "Beides"))
          ]
        }
      ]
    },
    {
      id: "q2", num: 3, sec: 0,
      title: L("Which technologies sit underneath?", "Welche Technologien stecken dahinter?"),
      ask: L(
        "Which AI technologies and methods underpin these applications, and what specific tasks do they perform?",
        "Welche KI-Technologien und -Methoden liegen diesen Anwendungen zugrunde, und welche konkreten Aufgaben übernehmen sie?"
      ),
      ideas: [
        L("Traditional ML: gradient-boosted trees for return or default prediction; clustering for regime detection.", "Klassisches ML: Gradient-Boosting für Rendite- oder Ausfallprognosen; Clustering zur Regimeerkennung."),
        L("NLP: sentiment and topic extraction from news, filings and transcripts.", "NLP: Sentiment- und Themenextraktion aus Nachrichten, Filings und Transkripten."),
        L("GenAI/LLMs: drafting investment memos, Q&A over internal research.", "GenAI/LLMs: Entwurf von Investment-Memos, Q&A über internes Research."),
        L("Agentic AI: multi-step agents that gather data, run checks and prepare a first analysis.", "Agentic AI: mehrstufige Agenten, die Daten sammeln, Prüfungen durchführen und eine Erstanalyse vorbereiten.")
      ],
      blocks: [
        {
          type: "cards", key: "q2_tech", col: "Q3 · Technologies", detail: "note",
          notePh: L("What task does it perform?", "Welche Aufgabe übernimmt sie?"),
          label: L("Select the technologies you use", "Welche Technologien setzen Sie ein?"),
          help: L("Add a few words on the task for each one you pick.", "Ergänzen Sie jeweils ein paar Worte zur Aufgabe."),
          options: [
            o("ml", L("Traditional machine learning", "Klassisches Machine Learning"), L("Supervised & unsupervised: regression, trees, clustering", "Überwacht & unüberwacht: Regression, Entscheidungsbäume, Clustering")),
            o("rl", L("Reinforcement learning", "Reinforcement Learning"), L("Learning from trial and feedback, e.g. execution or dynamic allocation", "Lernen durch Versuch und Feedback, z. B. Ausführung oder dynamische Allokation")),
            o("dl", L("Deep learning & neural networks", "Deep Learning & neuronale Netze")),
            o("ts", L("Time-series & forecasting models", "Zeitreihen- & Prognosemodelle"), L("Statistical, state-space or deep models for prices, volatility, macro", "Statistische, Zustandsraum- oder Deep-Modelle für Preise, Volatilität, Makro")),
            o("nlp", L("Natural language processing (NLP)", "Natural Language Processing (NLP)"), L("Sentiment, entity and topic extraction from text", "Sentiment-, Entitäts- und Themenextraktion aus Texten")),
            o("llm", L("Generative AI & LLMs", "Generative KI & LLMs")),
            o("rag", L("RAG & search over internal documents", "RAG & Suche in internen Dokumenten"), L("LLMs grounded in your own research and files", "LLMs auf Basis eigener Research- und Dokumentenbestände")),
            o("agent", L("Agentic AI", "Agentic AI"), L("Autonomous multi-step workflows", "Autonome, mehrstufige Workflows")),
            o("cv", L("Computer vision & document AI", "Computer Vision & Dokumenten-KI"), L("Satellite imagery, OCR, document extraction", "Satellitenbilder, OCR, Dokumentenextraktion")),
            o("speech", L("Speech & voice AI", "Sprach-KI"), L("Call transcription, voice assistants", "Gesprächstranskription, Sprachassistenten")),
            o("graph", L("Knowledge graphs & graph ML", "Wissensgraphen & Graph-ML"), L("Relationships between companies, supply chains, ownership", "Beziehungen zwischen Unternehmen, Lieferketten, Eigentümerstrukturen")),
            o("bayes", L("Bayesian & causal methods", "Bayessche & kausale Methoden"), L("Probabilistic models, causal inference", "Probabilistische Modelle, kausale Inferenz")),
            o("synth", L("Synthetic data & simulation", "Synthetische Daten & Simulation"), L("Generated scenarios, stress tests, data augmentation", "Generierte Szenarien, Stresstests, Datenanreicherung")),
            o("xai", L("Explainable AI (XAI) tools", "Erklärbare KI (XAI)"), L("Model interpretation and monitoring", "Modellinterpretation und -überwachung")),
            o("recsys", L("Recommender & personalisation engines", "Empfehlungs- & Personalisierungssysteme")),
            other(),
            o("dk", L("I don’t know", "Ich weiß es nicht"), L("I’m not sure which technologies are used", "Ich bin nicht sicher, welche Technologien eingesetzt werden"), { exclusive: true })
          ]
        }
      ]
    },
    {
      id: "q3", num: 4, sec: 0,
      title: L("How did adoption evolve?", "Wie hat sich die Einführung entwickelt?"),
      ask: L(
        "How has AI adoption evolved within your organisation, from initial experimentation to integration into existing workflows and core investment processes?",
        "Wie hat sich die KI-Einführung in Ihrer Organisation entwickelt – von den ersten Experimenten bis zur Integration in bestehende Workflows und den Kerninvestmentprozess?"
      ),
      ideas: [
        L("“Two years ago a small data-science team ran notebooks; today analysts use a firm-wide research copilot daily.”", "„Vor zwei Jahren ließ ein kleines Data-Science-Team Notebooks laufen; heute nutzen Analysten täglich einen unternehmensweiten Research-Copilot.“"),
        L("A turning point such as a successful pilot, a new Chief Data Officer, or the arrival of capable LLMs.", "Ein Wendepunkt, etwa ein erfolgreicher Pilot, ein neuer Chief Data Officer oder leistungsfähige LLMs.")
      ],
      blocks: [
        {
          type: "text", key: "q3_text", col: "Q4 · Journey (free text)", rows: 6,
          label: L("Tell us the story in your own words", "Erzählen Sie uns die Geschichte in Ihren eigenen Worten"),
          help: L("From first experiments to today: key steps, turning points, obstacles.", "Von den ersten Experimenten bis heute: wichtige Schritte, Wendepunkte, Hindernisse."),
          ph: L("e.g. 2022: small data-science team running notebooks; 2023: first LLM pilot with analysts; 2024: firm-wide research assistant…", "z. B. 2022: kleines Data-Science-Team mit Notebooks; 2023: erster LLM-Pilot mit Analysten; 2024: unternehmensweiter Research-Assistent …")
        },
        {
          type: "cards", key: "q3_unlock", col: "Q4 · What unlocked progress (ranked)", rank: true,
          label: L("What unlocked progress?", "Was hat Fortschritt ermöglicht?"),
          help: L("Select everything that helped, then order your selection by importance. The first card you tap becomes #1; use the arrows to reorder.", "Wählen Sie alles aus, was geholfen hat, und ordnen Sie Ihre Auswahl nach Bedeutung. Die zuerst gewählte Karte wird zu Platz 1; mit den Pfeilen ändern Sie die Reihenfolge."),
          options: [
            o("sponsor", L("Executive sponsorship", "Unterstützung der Führung")),
            o("strategy", L("A clear AI strategy or roadmap", "Eine klare KI-Strategie bzw. Roadmap")),
            o("budget", L("A dedicated AI budget", "Ein eigenes KI-Budget")),
            o("data", L("Data readiness", "Datenreife")),
            o("infra", L("Cloud and data infrastructure", "Cloud- und Dateninfrastruktur")),
            { ...o("team", L("An AI specialist team", "Ein KI-Spezialistenteam")), count: { l: L("How many people are on the team?", "Wie viele Personen gehören zum Team?"), ph: L("Number of people", "Anzahl Personen"), dk: L("I don't know", "Weiß ich nicht") } },
            o("talent", L("Hiring or upskilling talent", "Einstellung bzw. Weiterbildung von Fachkräften")),
            o("champions", L("Business champions and user buy-in", "Fachbereichs-Champions und Akzeptanz bei Nutzern")),
            o("collab", L("Close collaboration between IT, data and business teams", "Enge Zusammenarbeit von IT, Daten- und Fachbereichen")),
            o("gov", L("AI governance and policies", "KI-Governance und Richtlinien")),
            o("vendor", L("Vendor partnerships", "Anbieter-Partnerschaften")),
            o("oss", L("Open-source or foundation models", "Open-Source- bzw. Foundation-Modelle")),
            o("genai", L("Generative AI breakthroughs", "Durchbrüche bei generativer KI")),
            o("pilot", L("Early pilot successes", "Erfolge früher Piloten")),
            o("client", L("Client demand", "Nachfrage der Kunden")),
            o("comp", L("Competitive pressure", "Wettbewerbsdruck")),
            o("reg", L("Regulatory clarity", "Regulatorische Klarheit")),
            other()
          ]
        },
      ]
    },

    // ───────────── PART 2 ─────────────
    {
      id: "q4a", num: 5, part: "1/2", sec: 1,
      title: L("Your most valuable applications", "Ihre wertvollsten Anwendungen"),
      ask: L(
        "Which one or two AI applications are the most important for your firm today, and what concrete benefits have they brought? Where have expectations not been met?",
        "Welche ein bis zwei KI-Anwendungen sind für Ihr Haus heute am wichtigsten, und welchen konkreten Nutzen haben sie gebracht? Wo wurden Erwartungen nicht erfüllt?"
      ),
      ideas: [
        L("“The research copilot saves each analyst roughly 3 hours a week on first-pass reading.”", "„Der Research-Copilot spart jedem Analysten rund 3 Stunden pro Woche beim ersten Lesen.“"),
        L("Disappointment example: a return-forecasting model that looked strong in backtests but faded out-of-sample.", "Enttäuschung: Ein Renditeprognosemodell, das im Backtest überzeugte, aber out-of-sample verblasste.")
      ],
      blocks: [
        {
          type: "text", key: "q4_apps", col: "Q5 · Most important applications", rows: 3,
          label: L("The one or two most important applications", "Die ein bis zwei wichtigsten Anwendungen"),
          ph: L("Name them and say in a line what they do…", "Nennen Sie sie und beschreiben Sie kurz ihre Funktion …")
        },
        {
          type: "text", key: "q4_benefits_text", col: "Q5 · Benefits delivered (free text)", rows: 4,
          label: L("What benefits have they delivered?", "Welchen Nutzen haben sie gebracht?"),
          ph: L("e.g. time saved, cost, research quality, risk reduction, performance, client experience; with numbers if you can…", "z. B. Zeitersparnis, Kosten, Research-Qualität, Risikoreduktion, Performance, Kundenerlebnis; gern mit Zahlen …")
        },
        {
          type: "cards", key: "q4_notdelivered", col: "Q5 · Benefits NOT delivered",
          label: L("Which of these have NOT been delivered?", "Welche davon wurden NICHT erreicht?"),
          help: L("Select all that apply", "Alle zutreffenden auswählen"),
          options: [
            o("time", L("Time saved", "Zeitersparnis")),
            o("cost", L("Cost reduction", "Kostensenkung")),
            o("research", L("Better research quality", "Bessere Research-Qualität")),
            o("risk", L("Risk reduction", "Risikoreduktion")),
            o("perf", L("Performance", "Performance")),
            o("client", L("Client experience", "Kundenerlebnis")),
            o("alld", L("None — all of them were delivered", "Keine — alle wurden erreicht"), null, { exclusive: true })
          ]
        },
        {
          type: "text", key: "q4_unmet", col: "Q5 · Unmet expectations", rows: 3,
          label: L("Where have expectations not been met?", "Wo wurden Erwartungen nicht erfüllt?"),
          ph: L("Honest answers are the most valuable ones…", "Ehrliche Antworten sind die wertvollsten …")
        }
      ]
    },
    {
      id: "q4b", num: 5, part: "2/2", sec: 1,
      title: L("How do they work in practice?", "Wie funktionieren sie in der Praxis?"),
      ask: L(
        "What data do they use as input and what outputs do they generate? Who uses the outputs and how are they incorporated into daily activities? Are the solutions built in-house, bought, or both?",
        "Welche Daten nutzen sie als Input und welche Outputs erzeugen sie? Wer nutzt die Outputs und wie fließen sie in die tägliche Arbeit ein? Werden die Lösungen intern entwickelt, zugekauft oder beides?"
      ),
      ideas: [
        L("Inputs: filings, transcripts, market data, alternative data. Outputs: summaries, scores, draft memos, alerts.", "Inputs: Filings, Transkripte, Marktdaten, Alternative Data. Outputs: Zusammenfassungen, Scores, Memo-Entwürfe, Alerts."),
        L("Outputs reviewed by analysts each morning before the investment meeting.", "Outputs werden von Analysten jeden Morgen vor dem Investmentmeeting geprüft.")
      ],
      blocks: [
        {
          type: "text", key: "q4_io", col: "Q5 · Inputs and outputs", rows: 3,
          label: L("Inputs and outputs", "Inputs und Outputs"),
          ph: L("What goes in, what comes out?", "Was geht hinein, was kommt heraus?")
        },
        {
          type: "cards", key: "q4_users", col: "Q5 · Who uses the outputs",
          label: L("Who uses the outputs?", "Wer nutzt die Outputs?"),
          help: L("Select all that apply", "Alle zutreffenden auswählen"),
          options: [
            o("pm", L("Portfolio managers", "Portfoliomanager")),
            o("analyst", L("Analysts", "Analysten")),
            o("risk", L("Risk & compliance", "Risiko & Compliance")),
            o("ops", L("Operations", "Operations")),
            o("sales", L("Client-facing teams", "Kundenberater / Vertrieb")),
            o("exec", L("Executives", "Geschäftsleitung"))
          ]
        },
        {
          type: "cards", key: "q4_source", col: "Q5 · Build vs buy", single: true, compact: true,
          label: L("How were the solutions sourced?", "Wie wurden die Lösungen beschafft?"),
          options: [
            o("build", L("Built in-house", "Intern entwickelt")),
            o("buy", L("Bought from providers", "Von Anbietern zugekauft")),
            o("hybrid", L("A combination of both", "Kombination aus beidem")),
            other()
          ]
        },
        {
          type: "text", key: "q4_workflow", col: "Q5 · Daily integration", rows: 3,
          label: L("How do outputs enter daily work?", "Wie fließen die Outputs in den Arbeitsalltag ein?"),
          ph: L("e.g. reviewed before the morning meeting, feeds our risk dashboard…", "z. B. Prüfung vor dem Morgenmeeting, speist unser Risiko-Dashboard …")
        }
      ]
    },
    {
      id: "q5a", num: 6, part: "1/2", sec: 1,
      title: L("How does your firm measure the benefits and impact of AI applications?", "Wie misst Ihr Haus Nutzen und Wirkung von KI-Anwendungen?"),
      ask: L("How does your firm measure the benefits and impact of AI applications?", "Wie misst Ihr Haus Nutzen und Wirkung von KI-Anwendungen?"),
      ideas: [
        L("Hours saved per analyst per week; research coverage per analyst; turnaround time for client reports.", "Eingesparte Stunden pro Analyst und Woche; Research-Abdeckung pro Analyst; Durchlaufzeit von Kundenberichten."),
        L("A/B comparison: one desk with the tool, one without, over a quarter.", "A/B-Vergleich: ein Desk mit Tool, eines ohne, über ein Quartal.")
      ],
      blocks: [
        {
          type: "text", key: "q5_measure", col: "Q6 · How impact is measured (free text)", rows: 6,
          label: L("In your own words", "In Ihren eigenen Worten"),
          ph: L("Describe how you track the benefits and impact of your AI applications…", "Beschreiben Sie, wie Sie Nutzen und Wirkung Ihrer KI-Anwendungen erfassen …")
        }
      ]
    },
    {
      id: "q5", num: 6, part: "2/2", sec: 1,
      title: L("How do you measure the impact?", "Wie messen Sie die Wirkung?"),
      ask: L(
        "Which KPIs are used, do you compare against the previous process or a non-AI alternative, is it quantitative or qualitative, and what is the approximate magnitude of improvement?",
        "Welche KPIs werden genutzt, wird mit dem früheren Prozess oder einer Nicht-KI-Alternative verglichen, quantitativ oder qualitativ, und wie groß ist die Verbesserung ungefähr?"
      ),
      ideas: [
        L("Hours saved per analyst per week; research coverage per analyst; turnaround time for client reports.", "Eingesparte Stunden pro Analyst und Woche; Research-Abdeckung pro Analyst; Durchlaufzeit von Kundenberichten."),
        L("A/B comparison: one desk with the tool, one without, over a quarter.", "A/B-Vergleich: ein Desk mit Tool, eines ohne, über ein Quartal.")
      ],
      blocks: [
        {
          type: "cards", key: "q5_kpis", col: "Q6 · KPIs used", max: 4,
          label: L("Which KPIs do you use?", "Welche KPIs nutzen Sie?"),
          options: [
            o("time", L("Time saved", "Eingesparte Zeit")),
            o("cost", L("Cost reduction", "Kostensenkung")),
            o("perf", L("Risk-adjusted performance", "Risikoadjustierte Performance")),
            o("cov", L("Research coverage & quality", "Research-Abdeckung & -Qualität")),
            o("err", L("Error / incident rates", "Fehler- / Vorfallquoten")),
            o("adopt", L("User adoption & satisfaction", "Nutzung & Zufriedenheit")),
            o("rev", L("Revenue / AUM growth", "Umsatz- / AuM-Wachstum")),
            other()
          ]
        },
        {
          type: "cards", key: "q5_method", col: "Q6 · Measurement approach", single: true, compact: true,
          label: L("How is impact assessed?", "Wie wird die Wirkung bewertet?"),
          options: [
            o("quant", L("Mainly quantitative", "Überwiegend quantitativ")),
            o("both", L("Both", "Beides")),
            o("qual", L("Mainly qualitative", "Überwiegend qualitativ"))
          ]
        },
        {
          type: "cards", key: "q5_baseline", col: "Q6 · Comparison baseline", single: true, compact: true,
          label: L("What do you compare against?", "Womit vergleichen Sie?"),
          options: [
            o("prev", L("The previous process", "Dem früheren Prozess")),
            o("nonai", L("A non-AI alternative", "Einer Nicht-KI-Alternative")),
            o("none", L("No systematic comparison", "Kein systematischer Vergleich"))
          ]
        },
        {
          type: "cards", key: "q5_mag", col: "Q6 · Approx. magnitude of improvement", single: true, compact: true,
          label: L("Approximate magnitude of improvement", "Ungefähre Größenordnung der Verbesserung"),
          help: L("If you can share it", "Sofern Sie das teilen können"),
          options: [
            o("m1", L("< 10%", "< 10 %")),
            o("m2", L("10–25%", "10–25 %")),
            o("m3", L("25–50%", "25–50 %")),
            o("m4", L("> 50%", "> 50 %")),
            o("m5", L("Can’t say / not measurable", "Keine Angabe / nicht messbar"))
          ]
        },
        {
          type: "text", key: "q5_text", col: "Q6 · Example (free text)", rows: 3,
          label: L("An example", "Ein Beispiel"),
          ph: L("e.g. report production fell from 2 days to 3 hours…", "z. B. Berichtserstellung von 2 Tagen auf 3 Stunden verkürzt …")
        }
      ]
    },

    // ───────────── PART 3 ─────────────
    {
      id: "q6", num: 7, sec: 2,
      title: L("How far does AI reach into investment decisions?", "Wie weit reicht KI in Anlageentscheidungen hinein?"),
      ask: L(
        "To what extent does AI already support investment decisions at your firm, and how does this differ from its use for efficiency, such as automation and reporting?",
        "Inwieweit unterstützt KI in Ihrem Haus bereits Anlageentscheidungen, und wie unterscheidet sich das von ihrem Einsatz für Effizienz, etwa Automatisierung und Reporting?"
      ),
      ideas: [
        L("“Informs”: an NLP score appears on the analyst’s screen but nobody is obliged to act on it.", "„Informiert“: Ein NLP-Score erscheint auf dem Bildschirm des Analysten, ohne Handlungspflicht."),
        L("“Recommends”: the model proposes weights; the PM approves or edits.", "„Empfiehlt“: Das Modell schlägt Gewichte vor; der PM genehmigt oder passt an."),
        L("“Decides”: a systematic strategy trades within pre-agreed limits.", "„Entscheidet“: Eine systematische Strategie handelt innerhalb vorab vereinbarter Limits.")
      ],
      blocks: [
        {
          type: "matrix", key: "q6_matrix", col: "Q7 · AI role",
          label: L("For each activity, how much influence does AI have?", "Wie groß ist der Einfluss der KI bei den einzelnen Tätigkeiten?"),
          help: L("Tap the level that fits best. Leave rows blank if not applicable.", "Wählen Sie die passende Stufe. Nicht zutreffende Zeilen bleiben leer."),
          cols: [
            o("none", L("Not used", "Nicht genutzt")),
            o("inform", L("Informs", "Informiert")),
            o("rec", L("Recommends", "Empfiehlt")),
            o("decide", L("Decides", "Entscheidet"))
          ],
          groups: [
            { t: L("Investment decisions", "Anlageentscheidungen"), rows: [
              o("research", L("Research & idea generation", "Research & Ideengenerierung")),
              o("signals", L("Signal generation", "Signalgenerierung")),
              o("forecast", L("Return forecasting", "Renditeprognosen")),
              o("selection", L("Security selection", "Titelselektion")),
              o("alloc", L("Asset allocation", "Asset Allocation")),
              o("construct", L("Portfolio construction", "Portfoliokonstruktion"))
            ]},
            { t: L("Efficiency", "Effizienz"), rows: [
              o("reporting", L("Reporting & client communication", "Reporting & Kundenkommunikation")),
              o("admin", L("Automation & administrative tasks", "Automatisierung & Verwaltungsaufgaben"))
            ]}
          ]
        },
        {
          type: "text", key: "q6_text", col: "Q7 · Comment (free text)", rows: 3,
          label: L("Anything that sets decision support apart from efficiency use?", "Was unterscheidet Entscheidungsunterstützung vom Effizienz-Einsatz?"),
          ph: L("Optional", "Optional")
        }
      ]
    },
    {
      id: "q7", num: 8, part: "1/2", sec: 2,
      title: L("How do you determine which decisions can be automated?", "Wie bestimmen Sie, welche Entscheidungen automatisiert werden können?"),
      ask: L(
        "As AI becomes more involved in investment analysis and portfolio construction, how do you determine which decisions can be automated and which should remain under human control?",
        "Je stärker KI in Investmentanalyse und Portfoliokonstruktion eingebunden wird: Wie bestimmen Sie, welche Entscheidungen automatisiert werden können und welche unter menschlicher Kontrolle bleiben?"
      ),
      ideas: [
        L("Criteria like decision size, explainability, regulatory accountability or model track record.", "Kriterien wie Entscheidungsgröße, Erklärbarkeit, regulatorische Verantwortung oder Modell-Track-Record."),
        L("A formal sign-off policy, e.g. AI may act alone below a position-size limit, never on new asset classes.", "Eine formale Freigaberegel, z. B. KI darf allein unterhalb eines Positionslimits handeln, nie bei neuen Assetklassen.")
      ],
      blocks: [
        {
          type: "text", key: "q7_how", col: "Q8 · How automation vs human control is decided (free text)", rows: 6,
          label: L("In your own words", "In Ihren eigenen Worten"),
          ph: L("How do you decide what AI may do on its own and what needs a human?", "Wie entscheiden Sie, was die KI allein tun darf und was einen Menschen braucht?")
        },
        {
          type: "cards", key: "q7_criteria", col: "Q8 · Criteria for human control", max: 3,
          label: L("What decides whether a human stays in the loop?", "Was entscheidet, ob ein Mensch eingebunden bleibt?"),
          options: [
            o("size", L("Size / materiality of the decision", "Größe / Wesentlichkeit der Entscheidung")),
            o("acct", L("Regulatory & fiduciary accountability", "Regulatorische & treuhänderische Verantwortung")),
            o("expl", L("Explainability of the model", "Erklärbarkeit des Modells")),
            o("track", L("Model track record", "Track Record des Modells")),
            o("regime", L("Market-regime uncertainty", "Unsicherheit über das Marktregime")),
            o("mandate", L("Client mandate / constraints", "Kundenmandat / Vorgaben")),
            other()
          ]
        },
        {
          type: "scale", key: "q7_scale", col: "Q8 · Comfort with AI deciding without human sign-off",
          label: L("How comfortable is your firm with AI acting without human sign-off?", "Wie wohl fühlt sich Ihr Haus damit, dass KI ohne menschliche Freigabe handelt?"),
          points: [
            L("Never", "Nie"),
            L("Rarely", "Selten"),
            L("Low-stakes only", "Nur bei geringem Risiko"),
            L("Often, with monitoring", "Oft, mit Überwachung"),
            L("Broadly", "Weitgehend")
          ]
        },
      ]
    },
    {
      id: "q7b", num: 8, part: "2/2", sec: 2,
      title: L("Have you seen human judgement override AI?", "Gab es Fälle, in denen menschliches Urteil die KI überstimmte?"),
      ask: L(
        "Have you encountered situations where human judgement proved essential in challenging or overriding AI-generated recommendations?",
        "Gab es Situationen, in denen menschliches Urteilsvermögen entscheidend war, um KI-Empfehlungen zu hinterfragen oder zu überstimmen?"
      ),
      ideas: [
        L("An override example: a model signalled “buy” during a market-structure break the data had never seen.", "Override-Beispiel: Ein Modell signalisierte „Kaufen“ bei einem Strukturbruch, den die Daten nie gesehen hatten.")
      ],
      blocks: [
        {
          type: "text", key: "q7_text", col: "Q8 · Human override example", rows: 6,
          label: L("In your own words", "In Ihren eigenen Worten"),
          ph: L("What happened, and what did the human see that the model didn’t?", "Was geschah – und was sah der Mensch, was das Modell nicht sah?")
        }
      ]
    },

    // ───────────── PART 4 ─────────────
    {
      id: "q8", num: 9, sec: 3,
      title: L("What makes an AI edge last?", "Was macht einen KI-Vorsprung dauerhaft?"),
      ask: L(
        "As AI technologies become increasingly accessible, what will determine whether firms can maintain a sustainable competitive advantage through AI?",
        "Da KI-Technologien zunehmend zugänglich werden: Wovon hängt es ab, ob Unternehmen durch KI einen nachhaltigen Wettbewerbsvorteil behalten?"
      ),
      ideas: [
        L("Think about what a competitor could not copy within 12–18 months with a credit card and a cloud account.", "Überlegen Sie, was ein Wettbewerber mit Kreditkarte und Cloud-Konto in 12–18 Monaten nicht kopieren könnte.")
      ],
      blocks: [
        {
          type: "cards", key: "q8_moat", col: "Q9 · Sustainable advantage (ranked)", max: 3, rank: true,
          label: L("Pick the top three, in order of importance", "Wählen Sie die drei wichtigsten, nach Bedeutung geordnet"),
          help: L("The first card you tap becomes #1.", "Die zuerst gewählte Karte wird zu Platz 1."),
          options: [
            o("data", L("Proprietary data", "Proprietäre Daten")),
            o("infra", L("Technological infrastructure", "Technologische Infrastruktur")),
            o("talent", L("Specialised talent & investment expertise", "Spezialisierte Talente & Investmentexpertise")),
            o("models", L("Internally developed models", "Intern entwickelte Modelle")),
            o("integrate", L("Ability to integrate AI into investment processes", "Fähigkeit, KI in Investmentprozesse zu integrieren")),
            o("org", L("Organisational capabilities & execution", "Organisatorische Fähigkeiten & Umsetzung")),
            o("scale", L("Scale & capital to invest", "Größe & Investitionskraft"), L("Budget, compute, ability to fund long-term programmes", "Budget, Rechenleistung, Fähigkeit, langfristige Programme zu finanzieren")),
            o("access", L("Access to frontier models & vendor partnerships", "Zugang zu Spitzenmodellen & Anbieter-Partnerschaften")),
            o("gov", L("Governance, model risk & regulatory readiness", "Governance, Modellrisiko & regulatorische Reife")),
            o("culture", L("Culture & speed of experimentation", "Kultur & Experimentiergeschwindigkeit")),
            o("lead", L("Leadership commitment & strategy", "Engagement der Führung & Strategie")),
            o("client", L("Distribution, brand & client trust", "Vertrieb, Marke & Kundenvertrauen")),
            o("edge", L("Differentiated investment philosophy", "Differenzierte Anlagephilosophie"), L("Human insight that AI alone cannot replicate", "Menschliche Einsicht, die KI allein nicht nachbilden kann")),
            other()
          ]
        },
        {
          type: "text", key: "q8_text", col: "Q9 · Why (free text)", rows: 3,
          label: L("Why these?", "Warum diese?"),
          ph: L("Optional", "Optional")
        }
      ]
    },
    {
      id: "q9", num: 10, sec: 3, optionalQ: true,
      title: L("Will AI favour the giants or the specialists?", "Stärkt KI die Großen oder die Spezialisten?"),
      ask: L(
        "Do you expect AI adoption to reinforce the advantages of large asset management firms, given their greater access to data, capital and technical expertise, or could it allow smaller and more specialised firms to compete more effectively? How might this reshape competition?",
        "Erwarten Sie, dass KI die Vorteile großer Asset Manager stärkt (Zugang zu Daten, Kapital, Know-how), oder können kleinere, spezialisierte Häuser dadurch besser mithalten? Wie könnte das den Wettbewerb verändern?"
      ),
      ideas: [
        L("Big firms: proprietary data, compute budgets, distribution. Small firms: speed, focus, no legacy systems.", "Große Häuser: proprietäre Daten, Rechenbudgets, Vertrieb. Kleine Häuser: Tempo, Fokus, keine Altsysteme.")
      ],
      blocks: [
        {
          type: "scale", key: "q9_scale", col: "Q10 · Large vs small firms",
          label: L("Where do you land?", "Wo stehen Sie?"),
          points: [
            L("Levels the playing field", "Gleicht Wettbewerb an"),
            L("Slightly favours small", "Begünstigt eher Kleine"),
            L("Neutral / mixed", "Neutral / gemischt"),
            L("Slightly favours large", "Begünstigt eher Große"),
            L("Reinforces large firms", "Stärkt Große deutlich")
          ]
        },
        {
          type: "text", key: "q9_text", col: "Q10 · Competition (free text)", rows: 4,
          label: L("How might competition be reshaped?", "Wie könnte sich der Wettbewerb verändern?"),
          ph: L("Optional — especially for those with a broad industry view", "Optional — besonders für Personen mit breitem Branchenblick")
        }
      ]
    },
    {
      id: "q10", num: 11, sec: 3,
      title: L("The next three to five years", "Die nächsten drei bis fünf Jahre"),
      ask: L(
        "Looking ahead over the next three to five years, where do you expect AI to have the greatest impact on the asset management industry? Which applications or capabilities should firms prioritise?",
        "Wo erwarten Sie in den nächsten drei bis fünf Jahren die größte Wirkung von KI auf die Asset-Management-Branche? Welche Anwendungen oder Fähigkeiten sollten Unternehmen priorisieren?"
      ),
      ideas: [
        L("Think in terms of what will be routine by 2030 that is exotic today.", "Denken Sie an das, was 2030 Routine sein wird, heute aber noch exotisch ist.")
      ],
      blocks: [
        {
          type: "cards", key: "q10_apps", col: "Q11 · Applications to become widespread", max: 4,
          label: L("Which applications will become widely adopted?", "Welche Anwendungen werden sich breit durchsetzen?"),
          options: [
            o("copilot", L("Research copilots", "Research-Copiloten")),
            o("agents", L("End-to-end agentic workflows", "Durchgängige Agenten-Workflows")),
            o("alpha", L("Signal generation & forecasting", "Signalgenerierung & Prognosen")),
            o("pc", L("Portfolio construction & optimisation", "Portfoliokonstruktion & Optimierung")),
            o("client", L("Personalised client engagement", "Personalisierte Kundenansprache")),
            o("risk", L("Risk monitoring & early warning", "Risikoüberwachung & Frühwarnung")),
            o("compl", L("Compliance & regulatory automation", "Compliance- & Regulierungsautomatisierung")),
            o("alt", L("Unstructured / alternative data analysis", "Analyse unstrukturierter / alternativer Daten")),
            other()
          ]
        },
        {
          type: "scale", key: "q10_scale", col: "Q11 · AI role in core investment decisions (3-5y)",
          label: L("Will AI play a greater role in core investment decisions?", "Wird KI eine größere Rolle bei zentralen Anlageentscheidungen spielen?"),
          points: [
            L("No", "Nein"),
            L("Slightly", "Leicht"),
            L("Moderately", "Mäßig"),
            L("Substantially", "Deutlich"),
            L("Fundamentally", "Grundlegend")
          ]
        },
        {
          type: "cards", key: "q10_prio", col: "Q11 · Capabilities to prioritise", max: 3,
          label: L("What should firms invest in first?", "Worin sollten Unternehmen zuerst investieren?"),
          options: [
            o("data", L("Proprietary data foundation", "Proprietäre Datenbasis")),
            o("infra", L("Scalable infrastructure", "Skalierbare Infrastruktur")),
            o("talent", L("Talent & upskilling", "Talente & Weiterbildung")),
            o("gov", L("AI governance & model risk", "KI-Governance & Modellrisiko")),
            o("integr", L("Integration into the investment process", "Integration in den Investmentprozess")),
            o("partner", L("Partnerships with providers", "Partnerschaften mit Anbietern")),
            other()
          ]
        },
        {
          type: "text", key: "q10_text", col: "Q11 · Outlook (free text)", rows: 3,
          label: L("Anything you’d add?", "Möchten Sie etwas ergänzen?"),
          ph: L("Optional", "Optional")
        }
      ]
    },
    {
      id: "closing", sec: 3, closing: true,
      title: L("One last thing", "Zum Schluss"),
      ask: L(
        "Is there anything else regarding AI adoption in asset management that you consider important and that we have not covered?",
        "Gibt es noch etwas zur KI-Einführung im Asset Management, das Sie für wichtig halten und das wir nicht behandelt haben?"
      ),
      ideas: [],
      blocks: [
        {
          type: "text", key: "closing_text", col: "Closing · Anything else", rows: 5,
          label: L("Anything we missed?", "Haben wir etwas übersehen?"),
          ph: L("Open floor…", "Freies Feld …")
        }
      ]
    }
  ];

  window.SURVEY = { ui, sections, screens, stages: STAGES };
})();
