/* =========================================================================
   DATOS DEL CV  —  este es el único archivo que tenés que editar.
   -------------------------------------------------------------------------
   TEXTOS BILINGÜES: cualquier texto puede ser
     - un string simple  -> se usa igual en español e inglés
         company: "Mercado Libre"
     - un objeto { es, en } -> se muestra según el idioma elegido
         description: { es: "Lideré el equipo...", en: "Led the team..." }
     - en listas (highlights) cada ítem puede ser string u objeto { es, en }

   FECHAS: formato "AAAA-MM" (ej. "2022-03"). end: null = trabajo actual.
   El período ("Marzo 2022 – Actualidad") y la duración ("4 años 8 meses")
   se calculan solos y se traducen solos.

   Ojo con las comas entre elementos y con las comillas dentro de los textos
   (escribilas como \").
   ========================================================================= */
window.CV = {
  meta: {
    url: "https://nicodelara.github.io", // aparece en el PDF
    title: {
      es: "Nicolás de Lara - Senior Backend Engineer | CV",
      en: "Nicolás de Lara - Senior Backend Engineer | Resume",
    },
    description: {
      es: "CV de Nicolás de Lara, Senior Backend Engineer especializado en microservicios, APIs y arquitectura de sistemas con Go, Python y AWS.",
      en: "Résumé of Nicolás de Lara, Senior Backend Engineer specializing in microservices, APIs, and system architecture with Go, Python, and AWS.",
    },
  },

  profile: {
    name: "Nicolás de Lara",
    handle: "nicodelara", // se usa en los detalles "de terminal"
    title: "Senior Backend Engineer",
    // Ubicación: texto visible + datos estructurados (para JSON-LD y resume.json)
    location: {
      es: "Trenque Lauquen, Buenos Aires, Argentina · Remoto",
      en: "Trenque Lauquen, Buenos Aires, Argentina · Remote",
    },
    address: { city: "Trenque Lauquen", region: "Buenos Aires", countryCode: "AR" },
    summary: {
      es: "Senior Backend Engineer con más de 9 años de experiencia, especializado en microservicios backend, desarrollo de APIs y arquitectura de sistemas con Go, Python y AWS. Experiencia construyendo servicios de onboarding, verificación de identidad (KYC), prevención de fraude y autenticación en Ualá, Flat.mx (Clau.com) y Mercado Libre, incluyendo sistemas de alto throughput que sirven a millones de usuarios y flujos financieros críticos como transferencias y crédito, con foco en la escalabilidad, la disponibilidad y la observabilidad.",
      en: "Senior Backend Engineer with 9+ years of experience specializing in backend microservices, API development, and system architecture using Go, Python, and AWS. Experience building onboarding, identity verification (KYC), fraud-prevention, and authentication services at Ualá, Flat.mx (Clau.com), and Mercado Libre, including high-throughput systems serving millions of users and critical financial flows such as transfers and credit, with a focus on scalability, availability, and observability.",
    },
    image: "assets/images/profile.png", // ruta relativa (sin "/" adelante)
    initials: "ND", // se muestran si la foto no carga
  },

  /* ---------------------------------------------------------------------
     EXPERIENCIA — lo más nuevo arriba. Para sumar un trabajo copiá un
     bloque { ... } completo, pegalo arriba de todo y cambiá los datos.
     "highlights" puede quedar vacío: []
     modality: modalidad de trabajo, ej. { es: "Remoto", en: "Remote" }
     Opcionales: location: "Ciudad, País", technologies: ["Go (Golang)", "AWS"]
     Después de editar no hace falta nada más: al hacer push, la GitHub
     Action regenera la página, los PDFs y las versiones para ATS/IA.
     --------------------------------------------------------------------- */
  experience: [
    {
      role: "Senior Backend Engineer",
      company: "Ualá",
      modality: { es: "Remoto", en: "Remote" },
      start: "2025-05",
      end: null, // null = actual
      description: {
        es: "Desarrollo de microservicios backend para la plataforma fintech, primero en el equipo de Onboarding y luego en el equipo de Login/Auth.",
        en: "Backend microservices development for the fintech platform, first on the Onboarding team and then on the Login/Auth team.",
      },
      highlights: [
        { es: "Diseñé e implementé los flujos de alta de usuarios y verificación de identidad en el equipo de Onboarding, integrando proveedores externos de KYC para habilitar la captación de clientes en cumplimiento normativo.", en: "Engineered user sign-up and identity-verification flows on the Onboarding team, integrating external KYC providers to enable compliant customer acquisition." },
        { es: "Fui responsable de los desafíos de autenticación step-up en el camino crítico de las transferencias de dinero (PIN, Face ID / biometría y face match), pensados para baja latencia y una observabilidad sólida en ese flujo.", en: "Owned critical-path step-up authentication challenges (PIN, Face ID / biometrics, and face match) required for money transfers, built for low latency and strong observability in the transfer flow." },
        { es: "Extendí el mecanismo de desafíos para que lo adoptaran muchos otros equipos y se reutilizara en flujos adicionales como créditos y préstamos, cada uno con sus propias reglas y casuísticas.", en: "Expanded the challenge mechanism so it could be adopted by many other teams and reused in additional flows such as credit and loans, each with its own rules and use cases." },
      ],
    },
    {
      role: "Senior Backend Engineer",
      company: "Flat.mx (Clau.com)",
      modality: { es: "Remoto", en: "Remote" },
      start: "2022-03",
      end: "2025-03",
      description: {
        es: "Lideré el desarrollo y mantenimiento de microservicios críticos, asegurando su escalabilidad y disponibilidad.",
        en: "Led the development and maintenance of essential microservices, ensuring scalability and availability.",
      },
      highlights: [
        { es: "Construí un pipeline de ingesta y deduplicación de propiedades que agregaba avisos de alrededor de 10 portales partners, cada uno con miles de propiedades.", en: "Built a property ingestion and deduplication pipeline that aggregated listings from around 10 partner portals, each with thousands of properties." },
        { es: "Detecté avisos duplicados entre portales a partir de atributos clave, y registré disponibilidad, estado de vendido y cambios de precio y de características (como cantidad de baños) sobre un inventario grande.", en: "Detected duplicate listings across portals from key attributes, and tracked availability, sold status, and changes to price and property details (such as bathrooms) across a large inventory." },
      ],
    },
    {
      role: "Backend Engineer",
      company: "Mercado Libre",
      modality: { es: "Presencial", en: "On-site" },
      start: "2019-10",
      end: "2022-03",
      description: {
        es: "Trabajé en el equipo de KYC (Know Your Customer) y Prevención de Fraude.",
        en: "Worked with the KYC (Know Your Customer) and Fraud Prevention team.",
      },
      highlights: [
        { es: "Construí y mantuve el procesamiento de notificaciones de alto throughput para KYC, notificando a millones de usuarios por email, push y notificaciones periódicas.", en: "Built and maintained high-throughput notification processing for KYC, notifying millions of users via email, push, and periodic notifications." },
        { es: "Trabajé en el equipo de KYC (Know Your Customer) y Prevención de Fraude, apoyando las medidas de seguridad y el cumplimiento regulatorio de la verificación de identidad de clientes.", en: "Worked on the KYC (Know Your Customer) and Fraud Prevention team, supporting security measures and regulatory compliance for customer identity verification." },
      ],
    },
    {
      role: "Full Stack Developer",
      company: "Devsar",
      modality: { es: "Presencial", en: "On-site" },
      start: "2019-05",
      end: "2019-10",
      description: {
        es: "Desarrollé y desplegué sitios web para entidades financieras.",
        en: "Developed and deployed websites for financial institutions.",
      },
      highlights: [
        { es: "Desarrollé y desplegué sitios web para entidades financieras en un equipo de software factory, con entregas productivas de alta calidad.", en: "Developed and deployed websites for financial institutions as part of a software-factory team, delivering production-ready sites to a high quality standard." },
      ],
    },
    {
      role: "Full Stack Developer",
      company: "Dirección Provincial de Gobierno Digital",
      modality: { es: "Presencial", en: "On-site" },
      start: "2017-07",
      end: "2019-10",
      description: {
        es: "Brindé soporte digital a la ciudadanía y gestioné información.",
        en: "Provided digital citizen support and information management.",
      },
      highlights: [
        { es: "Brindé soporte digital a la ciudadanía y difundí información oficial por canales digitales, atendiendo las necesidades de los ciudadanos.", en: "Delivered official information and digital citizen support through digital channels, addressing citizen needs." },
        { es: "Gestioné información a través de sistemas digitales en apoyo de los servicios a la ciudadanía.", en: "Managed information through digital systems in support of citizen-facing services." },
      ],
    },
  ],

  education: [
    {
      degree: "Analista Programador Universitario",
      institution: "Facultad de Informática - Universidad Nacional de La Plata",
      start: "2010-01",
      end: "2016-01",
    },
  ],

  /* SKILLS agrupadas por categoría. icon = una clave de assets/js/icons.js */
  skills: [
    {
      category: { es: "Lenguajes", en: "Languages" },
      items: [
        { name: "Go (Golang)", icon: "go" },
        { name: "Python", icon: "python" },
      ],
    },
    {
      category: { es: "Cloud & DevOps", en: "Cloud & DevOps" },
      items: [
        { name: "AWS (Lambda, SQS, SNS, RDS, DynamoDB)", icon: "cloud" },
        { name: "Docker", icon: "cloud" },
        { name: "Kubernetes", icon: "cloud" },
        { name: "Terraform", icon: "terminal" },
        { name: { es: "CI/CD (GitHub Actions; antes Jenkins)", en: "CI/CD (GitHub Actions; previously Jenkins)" }, icon: "code" },
      ],
    },
    {
      category: { es: "Bases de datos", en: "Databases" },
      items: [
        { name: "PostgreSQL", icon: "database" },
        { name: "MySQL", icon: "database" },
        { name: "DynamoDB", icon: "database" },
      ],
    },
    {
      category: { es: "Arquitectura", en: "Architecture" },
      items: [
        { name: { es: "Microservicios", en: "Microservices" }, icon: "microservices" },
        { name: { es: "Arquitectura de sistemas", en: "System Architecture" }, icon: "code" },
        { name: { es: "Desarrollo de APIs", en: "API Development" }, icon: "code" },
      ],
    },
  ],

  languages: [
    { name: { es: "Español", en: "Spanish" }, level: { es: "Nativo", en: "Native" } },
    { name: { es: "Inglés", en: "English" }, level: { es: "Profesional", en: "Professional" } },
  ],

  /* icon: "email" | "linkedin" | "github" (o cualquier clave de icons.js) */
  contact: [
    { label: "Email", url: "mailto:nicodelara@gmail.com", icon: "email" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/nicodelara/", icon: "linkedin" },
    { label: "GitHub", url: "https://github.com/nicodelara", icon: "github" },
  ],

  /* Textos de la interfaz (títulos, botones). Normalmente no hace falta tocarlos. */
  ui: {
    experience: { es: "Experiencia", en: "Experience" },
    education: { es: "Educación", en: "Education" },
    skills: { es: "Skills", en: "Skills" },
    languages: { es: "Idiomas", en: "Languages" },
    contact: { es: "Contacto", en: "Contact" },
    current: { es: "Actual", en: "Current" },
    present: { es: "Actualidad", en: "Present" },
    downloadPdf: { es: "Descargar CV en PDF", en: "Download CV as PDF" },
    pdfShort: { es: "PDF", en: "PDF" },
    toDark: { es: "Activar modo oscuro", en: "Switch to dark mode" },
    toLight: { es: "Activar modo claro", en: "Switch to light mode" },
    language: { es: "Idioma", en: "Language" },
    skipToContent: { es: "Saltar al contenido", en: "Skip to content" },
    photoAlt: { es: "Foto de Nicolás de Lara", en: "Photo of Nicolás de Lara" },
    pdfFileName: { es: "CV - Nicolás de Lara", en: "CV - Nicolás de Lara" },
  },
};
