export interface Subject {
    id: string;
    title: string;
    description: string;
    notebookUrl: string;
}

export interface Module {
    id: string;
    code: string;
    title: string;
    description: string;
    subjects: Subject[];
}

export const courses: Module[] = [
    {
        id: "gm21",
        code: "GM21",
        title: "Módulo Agronómico",
        description: "Industria y Agronomía Digital del Cannabis. Enfocado en técnicas de cultivo, optimización y gestión agronómica.",
        subjects: [
            {
                id: "gm21-1",
                title: "Fundamentos de la Industria y negocio del cannabis",
                description: "Bases del conocimiento sobre la cadena de valor y el negocio.",
                notebookUrl: "https://notebooklm.google.com/notebook/10b81259-110c-4609-a04d-8ea6ce9af080"
            },
            {
                id: "gm21-2",
                title: "Cultivo en Interior",
                description: "Técnicas y tecnologías para la producción en entornos controlados (Indoor).",
                notebookUrl: "https://notebooklm.google.com/notebook/87f0e5e2-c0cf-4897-8975-8e1f866b9324"
            },
            {
                id: "gm21-3",
                title: "Cultivo al Aire libre",
                description: "Estrategias para el cultivo exterior eficiente y sostenible.",
                notebookUrl: "https://notebooklm.google.com/notebook/730c1de6-5727-44b6-b111-5c3d1dca85fe"
            },
            {
                id: "gm21-4",
                title: "Aprovechamiento del cultivo",
                description: "Fibra, alimentario, industrial y biomasa.",
                notebookUrl: "https://notebooklm.google.com/notebook/25c3acaa-49f7-4271-9a0f-047ab6ad806e"
            }
        ]
    },
    {
        id: "gm20",
        code: "GM20",
        title: "Módulo Tecnológico y de Mercado",
        description: "Industria y Agronomía Digital del Cannabis. Centrado en digitalización, normativa y oportunidades de negocio.",
        subjects: [
            {
                id: "gm20-1",
                title: "Digitalización de Procesos y Agricultura de Precisión (Carmen Rocamora)",
                description: "Uso de tecnologías habilitadoras digitales para la optimización.",
                notebookUrl: "https://notebooklm.google.com/notebook/3bb67a64-34c9-48c4-9b3c-4070bc00de5d"
            },
            {
                id: "gm20-2",
                title: "Análisis de Oportunidades de Mercado (S. De la Fuente)",
                description: "Identificación de nichos y tendencias de futuro.",
                notebookUrl: "https://notebooklm.google.com/notebook/9f6ca868-aeb4-4784-a2c4-1e451a370bb9"
            },
            {
                id: "gm20-3",
                title: "Negocio, Comercio y Distribución (Miguel G. / Noemí M.)",
                description: "Fundamentos comerciales y logísticos del sector.",
                notebookUrl: "https://notebooklm.google.com/notebook/09877603-88c3-4586-a89c-da80657795e6"
            },
            {
                id: "gm20-4",
                title: "Normativa y Legislación en el Sector (Martí C.)",
                description: "Marco legal vigente para el uso industrial y medicinal.",
                notebookUrl: "https://notebooklm.google.com/notebook/725b8d51-1b7d-4691-9729-3507f25cce7f"
            },
            {
                id: "gm20-5",
                title: "Uso Medicinal del Cannabis (M. Á. Torres / C. Rocamora)",
                description: "Aplicaciones terapéuticas y regulación específica.",
                notebookUrl: "https://notebooklm.google.com/notebook/ca11fc7d-2bab-40a5-b1bc-2ed547e5ae0e"
            }
        ]
    }
];
