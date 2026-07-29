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
    description:
      "Painel com consultas realizadas, documentos processados e saúde dos serviços.",
  },
  {
    icon: Lock,
    title: "Controle e privacidade",
    description:
      "Perfis, permissões e registros de auditoria pensados para instituições públicas.",
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
    description:
      "Mesma fonte de conhecimento para o efetivo inteiro, com histórico auditável.",
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
    cta: "Começar agora",
    features: [
      "20 consultas por mês",
      "Base pública de legislação",
      "Histórico de 7 dias",
      "1 usuário",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: "R$ 49",
    period: "/mês",
    description: "Para o policial que usa a pesquisa jurídica com frequência.",
    cta: "Assinar Starter",
    features: [
      "500 consultas por mês",
      "Upload de até 50 documentos",
      "Histórico ilimitado",
      "Exportação de conversas",
      "Suporte por e-mail",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: "R$ 129",
    period: "/mês",
    description: "Para equipes e seções que precisam de base própria indexada.",
    highlight: true,
    badge: "Mais escolhido",
    cta: "Assinar Professional",
    features: [
      "Consultas ilimitadas",
      "Base de conhecimento própria",
      "Até 10 usuários",
      "Painel de indicadores",
      "Categorias, tags e filtros",
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
  { label: "Consultas mensais", values: ["20", "500", "Ilimitadas", "Ilimitadas"] },
  { label: "Documentos indexados", values: ["—", "50", "1.000", "Ilimitados"] },
  { label: "Usuários", values: ["1", "1", "10", "Ilimitados"] },
  { label: "Histórico de conversas", values: ["7 dias", "Ilimitado", "Ilimitado", "Ilimitado"] },
  { label: "Exportação de conversas", values: ["—", "Sim", "Sim", "Sim"] },
  { label: "Painel de indicadores", values: ["—", "—", "Sim", "Sim"] },
  { label: "Perfis e permissões", values: ["—", "—", "Básico", "Avançado"] },
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
    text:
      "O PAD militar observa prazos definidos no regulamento disciplinar da respectiva corporação, com fase de instrução, defesa e decisão. A contagem começa da ciência formal do acusado.\n\nBase legal: regulamento disciplinar estadual aplicável e Lei nº 9.784/1999 (aplicação subsidiária).\n\nDeseja que eu detalhe esse assunto ou apresente o texto legal correspondente?",
  },
];

export const trustSignals = [
  { icon: Sparkles, label: "Respostas em segundos" },
  { icon: ScrollText, label: "Base legal em toda resposta" },
  { icon: Lock, label: "Dados isolados por unidade" },
];
