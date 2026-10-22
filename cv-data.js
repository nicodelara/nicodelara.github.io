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
      es: "Portfolio de Nicolás de Lara, Senior Backend Engineer especializado en desarrollo de APIs y arquitectura de sistemas.",
      en: "Personal portfolio of Nicolás de Lara, Senior Backend Engineer specialized in API development and system architecture.",
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
      es: "Desarrollador backend apasionado por crear soluciones escalables y eficientes. Experiencia en arquitectura de sistemas y desarrollo de APIs.",
      en: "Backend developer passionate about creating scalable and efficient solutions. Experience in system architecture and API development.",
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
        { es: "Onboarding: desarrollo de los flujos de alta de usuarios y validación de identidad", en: "Onboarding: built user sign-up and identity verification flows" },
        { es: "Onboarding: integración con proveedores externos de verificación (KYC)", en: "Onboarding: integrated external verification (KYC) providers" },
        { es: "Login/Auth: desarrollo de servicios de autenticación", en: "Login/Auth: built authentication services" },
        { es: "Login/Auth: participación clave en la re-autenticación de usuarios en flujos sensibles", en: "Login/Auth: key contributor to user re-authentication in sensitive flows" },
        { es: "Foco en escalabilidad, disponibilidad y observabilidad de servicios críticos", en: "Focus on scalability, availability and observability of critical services" },
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
        { es: "Colaboración con equipos multidisciplinarios", en: "Collaborated with multidisciplinary teams" },
        { es: "Participación en el diseño de la arquitectura de sistemas", en: "Contributed to system architecture design" },
        { es: "Optimización de la infraestructura existente", en: "Optimized existing infrastructure" },
      ],
    },
    {
      role: "Ssr Backend Engineer",
      company: "Mercado Libre",
      modality: { es: "Presencial", en: "On-site" },
      start: "2019-10",
      end: "2022-03",
      description: {
        es: "Trabajé en el equipo de KYC (Know Your Customer) y Prevención de Fraude.",
        en: "Worked with the KYC (Know Your Customer) and Fraud Prevention team.",
      },
      highlights: [
        { es: "Mejora de las medidas de seguridad", en: "Enhanced security measures" },
        { es: "Cumplimiento de los requisitos regulatorios", en: "Ensured compliance with regulatory requirements" },
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
        { es: "Trabajo en un equipo de software factory", en: "Worked in a software factory team" },
        { es: "Entregas de alta calidad", en: "Ensured high-quality delivery" },
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
        { es: "Atención de las necesidades de la ciudadanía", en: "Addressed citizen needs" },
        { es: "Difusión de información relevante por canales digitales", en: "Delivered important information through digital channels" },
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
      category: { es: "Lenguajes", en: "Programming" },
      items: [
        { name: "Go (Golang)", icon: "go" },
        { name: "Python", icon: "python" },
        { name: "Scripting", icon: "bash" },
      ],
    },
    {
      category: { es: "Datos", en: "Data" },
      items: [{ name: "SQL/NoSQL", icon: "database" }],
    },
    {
      category: { es: "Arquitectura", en: "Architecture" },
      items: [{ name: { es: "Microservicios", en: "Microservices" }, icon: "microservices" }],
    },
    {
      category: { es: "Cloud", en: "Cloud" },
      items: [{ name: "AWS", icon: "cloud" }],
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
