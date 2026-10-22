/* =========================================================================
   DATOS DEL CV  —  este es el único archivo que tenés que editar.
   -------------------------------------------------------------------------
   - Cada sección es una lista: agregá, borrá o reordená elementos.
   - Se muestran en el mismo orden en que están acá (lo más nuevo arriba).
   - Cuidado con las comas entre elementos y las comillas en los textos.
   - Para usar comillas dobles dentro de un texto, escribilas como \"
   ========================================================================= */
window.CV = {
  profile: {
    name: "Nicolás de Lara",
    title: "Senior Backend Engineer",
    summary:
      "Backend developer passionate about creating scalable and efficient solutions. Experience in system architecture and API development.",
    image: "assets/images/profile.png", // ruta relativa (no empieces con "/")
    initials: "ND", // se muestran si la foto no carga
  },

  /* ---------------------------------------------------------------------
     EXPERIENCIA — para sumar un trabajo, copiá un bloque { ... }, pegalo
     arriba de todo y cambiá los textos. "highlights" puede quedar vacío: []
     --------------------------------------------------------------------- */
  experience: [
    {
      role: "Senior Backend Engineer",
      company: "Flat.mx (Clau.com)",
      period: "March 2022 - Present",
      description:
        "Led the development and maintenance of essential microservices, ensuring scalability and availability.",
      highlights: [
        "Collaborated with multidisciplinary teams",
        "Contributed to system architecture design",
        "Optimized existing infrastructure",
      ],
    },
    {
      role: "Ssr Backend Engineer",
      company: "Mercado Libre",
      period: "October 2019 - March 2022",
      description:
        "Worked with the KYC (Know Your Customer) and Fraud Prevention team.",
      highlights: [
        "Enhanced security measures",
        "Ensured compliance with regulatory requirements",
      ],
    },
    {
      role: "Full Stack Developer",
      company: "Devsar",
      period: "May 2019 - October 2019",
      description: "Developed and deployed websites for financial institutions.",
      highlights: [
        "Worked in a software factory team",
        "Ensured high-quality delivery",
      ],
    },
    {
      role: "Full Stack Developer",
      company: "Dirección Provincial de Gobierno Digital",
      period: "July 2017 - October 2019",
      description:
        "Provided digital citizen support and information management.",
      highlights: [
        "Addressed citizen needs",
        "Delivered important information through digital channels",
      ],
    },
  ],

  education: [
    {
      degree: "Analista Programador Universitario",
      institution: "Facultad de Informática - Universidad Nacional de La Plata",
      period: "January 2010 - January 2016",
    },
  ],

  skills: ["Golang", "Python", "SQL/NoSQL", "Scripting", "Microservices"],

  languages: ["Spanish (Native)", "English (Professional)"],

  /* icon: "email" | "linkedin" | "github"  (o dejalo vacío: "") */
  contact: [
    { label: "Email", url: "mailto:nicodelara@gmail.com", icon: "email" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/nicodelara/", icon: "linkedin" },
    { label: "GitHub", url: "https://github.com/nicodelara", icon: "github" },
  ],
};
