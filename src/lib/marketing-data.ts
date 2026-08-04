import {
  BookOpen,
  FileSearch,
  Gavel,
  LineChart,
  Lock,
  MessagesSquare,
  ScrollText,
  Sparkles,
  Timer,
  Users,
} from "lucide-react";

export type Feature = {
  icon: typeof BookOpen;
  title: string;
  description: string;
};

export const features: Feature[] = [
  {
    icon: MessagesSquare,
    title: "Chat jurídico especializado",
    description:
      "Respostas objetivas em até 150 palavras, com base legal citada e opção de aprofundamento.",
  },
  {
    icon: FileSearch,
    title: "Pesquisa em documentos",
    description:
      "Envie portarias, diretrizes e manuais e consulte o conteúdo indexado em segundos.",
  },
  {
    icon: BookOpen,
    title: "Base de conhecimento",
    description:
      "Acervo organizado por categorias, com status de indexação e histórico de atualizações.",
  },
  {
    icon: ScrollText,
    title: "Citações e referências",
    description:
      "Cada resposta indica a norma correspondente para conferência na legislação oficial.",
  },
  {
    icon: LineChart,
    title: "Indicadores de uso",
    description: "Painel com consultas realizadas, documentos processados e saúde dos serviços.",
  },
  {
    icon: Lock,
    title: "Controle e privacidade",
    description: "Perfis, permissões e registros de auditoria pensados para instituições públicas.",
  },
];

export const benefits = [
  {
    icon: Timer,
    title: "Menos tempo procurando norma",
    description:
      "O que levava dezenas de minutos em PDFs dispersos passa a caber em uma consulta direta.",
    metric: "-72%",
    metricLabel: "tempo médio de pesquisa",
  },
  {
    icon: Gavel,
    title: "Mais segurança na decisão",
    description:
      "Fundamentação e base legal explícitas em toda resposta, sempre com ressalva de conferência.",
    metric: "100%",
    metricLabel: "respostas com base legal",
  },
  {
    icon: Users,
    title: "Padrão para toda a equipe",
    description: "Mesma fonte de conhecimento para o efetivo inteiro, com histórico auditável.",
    metric: "1 base",
    metricLabel: "compartilhada pela unidade",
  },
];

export type Plan = {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  highlight?: boolean;
  badge?: string;
  cta: string;
  features: string[];
};

export const plans: Plan[] = [
  {
    id: "free",
    name: "Gratuito",
    price: "R$ 0",
    period: "/mês",
    description: "Para conhecer a plataforma e testar consultas do dia a dia.",
    cta: "Começar gratuitamente",
    features: [
      "10 consultas por mês",
      "Base pública de legislação",
      "Histórico de 7 dias",
      "1 usuário",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: "R$ 19",
    period: "/mês",
    description: "Para o policial que usa a pesquisa jurídica com frequência.",
    cta: "Assinar Starter",
    features: [
      "500 consultas por mês",
      "Upload de até 20 documentos",
      "Histórico ilimitado",
      "Exportação de conversas",
      "Suporte por e-mail",
    ],
  },
  {
    id: "professional",
    name: "Profissional",
    price: "R$ 49",
    period: "/mês",
    description: "Para equipes e seções que precisam de base própria indexada.",
    highlight: true,
    badge: "Mais escolhido",
    cta: "Assinar Profissional",
    features: [
      "Consultas ilimitadas",
      "Base jurídica privada",
      "Upload ilimitado de documentos",
      "Pesquisa RAG avançada",
      "Histórico ilimitado",
      "Categorias, tags e filtros",
      "Exportação completa",
      "Suporte prioritário",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Sob consulta",
    period: "",
    description: "Para corporações, batalhões e órgãos com governança própria.",
    cta: "Falar com especialista",
    features: [
      "Usuários ilimitados",
      "Perfis e permissões avançadas",
      "Logs de auditoria completos",
      "Integrações e SSO",
      "Ambiente dedicado",
      "Gerente de conta",
    ],
  },
];

export type ComparisonRow = {
  label: string;
  values: [string, string, string, string];
};

export const comparison: ComparisonRow[] = [
  { label: "Consultas mensais", values: ["10", "500", "Ilimitadas", "Ilimitadas"] },
  { label: "Documentos indexados", values: ["—", "20", "Ilimitados", "Ilimitados"] },
  { label: "Usuários", values: ["1", "1", "Ilimitados", "Ilimitados"] },
  { label: "Histórico de conversas", values: ["7 dias", "Ilimitado", "Ilimitado", "Ilimitado"] },
  { label: "Exportação de conversas", values: ["—", "Sim", "Sim", "Sim"] },
  { label: "Painel de indicadores", values: ["—", "—", "Sim", "Sim"] },
  { label: "Perfis e permissões", values: ["—", "—", "Sim", "Avançado"] },
  { label: "Logs de auditoria", values: ["—", "—", "30 dias", "Completo"] },
  { label: "Suporte", values: ["Comunidade", "E-mail", "Prioritário", "Dedicado"] },
];

export const faq = [
  {
    q: "O QAP IA substitui a consulta à legislação oficial?",
    a: "Não. As respostas têm caráter informativo e de apoio. Toda decisão deve ser confirmada no texto legal vigente, e a plataforma sempre indica a base normativa para essa conferência.",
  },
  {
    q: "Quais fontes o assistente utiliza?",
    a: "Legislação brasileira aplicável à atividade policial militar e os documentos que a própria unidade envia para a base de conhecimento, como portarias, diretrizes e manuais internos.",
  },
  {
    q: "Meus documentos ficam disponíveis para outras unidades?",
    a: "Não. Cada base de conhecimento é isolada por organização. Documentos enviados ficam restritos aos usuários autorizados daquela conta.",
  },
  {
    q: "É possível usar em celular durante o serviço?",
    a: "Sim. A interface é responsiva e pode ser instalada na tela inicial do celular, funcionando como um aplicativo.",
  },
  {
    q: "Como funciona a cobrança?",
    a: "Os planos são mensais e podem ser cancelados a qualquer momento. Para corporações, o plano Enterprise é contratado sob medida.",
  },
  {
    q: "Vocês tratam dados pessoais conforme a LGPD?",
    a: "Sim. Coletamos o mínimo necessário para operar a plataforma e disponibilizamos canais para exercício dos direitos do titular. Detalhes na página de LGPD.",
  },
];

export const demoConversation = [
  {
    role: "user" as const,
    text: "Quais são os prazos do processo administrativo disciplinar militar?",
  },
  {
    role: "assistant" as const,
    text: "O PAD militar observa prazos definidos no regulamento disciplinar da respectiva corporação, com fase de instrução, defesa e decisão. A contagem começa da ciência formal do acusado.\n\nBase legal: regulamento disciplinar estadual aplicável e Lei nº 9.784/1999 (aplicação subsidiária).\n\nDeseja que eu detalhe esse assunto ou apresente o texto legal correspondente?",
  },
];

export const trustSignals = [
  { icon: Sparkles, label: "Respostas em segundos" },
  { icon: ScrollText, label: "Base legal em toda resposta" },
  { icon: Lock, label: "Dados isolados por unidade" },
];

export const howItWorks = [
  {
    step: "01",
    title: "Pergunte em linguagem natural",
    description:
      "Digite a dúvida como você falaria com um colega mais experiente. Não é preciso saber o número da norma.",
  },
  {
    step: "02",
    title: "O QAP IA consulta as fontes",
    description:
      "A pergunta é cruzada com a legislação aplicável e com os documentos indexados pela sua unidade.",
  },
  {
    step: "03",
    title: "Receba resposta objetiva",
    description:
      "Resumo direto em até 150 palavras, fundamentação e a base legal correspondente para conferência.",
  },
  {
    step: "04",
    title: "Aprofunde quando precisar",
    description:
      "Peça o texto legal completo, exporte a conversa ou salve nos favoritos para consultar depois.",
  },
];

export const differentials = [
  {
    title: "Feito para a atividade policial militar",
    description:
      "Vocabulário, rotinas e normas do dia a dia da corporação — não é um chatbot genérico adaptado.",
  },
  {
    title: "Resposta curta por padrão",
    description:
      "Limite de 150 palavras com convite para aprofundar, pensado para consulta durante o serviço.",
  },
  {
    title: "Base legal sempre visível",
    description:
      "Cada resposta destaca a norma citada em um cartão de fonte, pronto para conferência oficial.",
  },
  {
    title: "Base documental da unidade",
    description: "Portarias, diretrizes e manuais internos indexados e isolados por organização.",
  },
];

export const metrics = [
  { value: "12.940", label: "consultas realizadas" },
  { value: "128", label: "documentos indexados" },
  { value: "1,4s", label: "tempo médio de resposta" },
  { value: "99,9%", label: "disponibilidade do serviço" },
];

export const screenshots = [
  {
    title: "Chat Jurídico",
    description: "Consulta com base legal citada, cópia rápida e exportação da conversa.",
    tone: "azure" as const,
  },
  {
    title: "Dashboard institucional",
    description: "Uso, integridade dos serviços e produtividade da unidade em um só painel.",
    tone: "navy" as const,
  },
  {
    title: "Base de conhecimento",
    description: "Upload, categorização e acompanhamento do status de indexação.",
    tone: "steel" as const,
  },
];
