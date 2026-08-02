# Design System Oficial — QAP IA

> Fundação visual do QAP IA. Inspiração: Apple Human Interface Guidelines.
> Princípios: premium, extremamente limpo, muito espaço em branco, tipografia
> elegante, aparência corporativa, foco em legibilidade, sensação de software
> enterprise.
>
> **Fonte única de verdade dos tokens:** `src/styles.css`.
> Nenhum componente deve usar cores literais (`text-white`, `bg-[#0f1b3d]`).
> Sempre usar tokens semânticos.

---

## 1. Princípios

| Princípio | Aplicação prática |
| --- | --- |
| Clareza | Hierarquia por tamanho e peso de fonte, nunca por cor decorativa. |
| Deferência | A interface some, o conteúdo (a resposta jurídica) domina. |
| Profundidade | Elevação por sombra suave e camadas, nunca por bordas grossas. |
| Respiro | Espaço em branco é componente. Preferir densidade baixa. |
| Contenção | Máximo 1 cor de destaque por tela (azul institucional). |

---

## 2. Paleta oficial

Identidade PMESP (azul institucional + prata) combinada à marca QAP IA
(grafite naval, azul elétrico, prata escovada). Todos os valores em `oklch`.

### 2.1 Cores de marca

| Token | Classe Tailwind | Uso |
| --- | --- | --- |
| `--navy` | `text-navy` / `bg-navy` | Grafite naval institucional (cabeçalhos, superfícies escuras). |
| `--navy-light` | `bg-navy-light` | Variação de hover em superfícies navais. |
| `--navy-dark` | `bg-navy-dark` | Emblema, faixas escuras, fundo do logo. |
| `--azure` | `text-azure` | Azul institucional PMESP — destaque principal. |
| `--azure-light` | `text-azure-light` | Realce em fundo escuro, gradientes. |
| `--azure-dark` | `text-azure-dark` | Texto de destaque sobre fundo claro (contraste AA). |
| `--steel` | `bg-steel` | Prata — separadores, elementos secundários. |
| `--steel-light` | `bg-steel-light` | Prata clara, superfícies neutras. |
| `--steel-dark` | `bg-steel-dark` | Prata escura, ícones inativos. |

### 2.2 Cores semânticas (obrigatórias em componentes)

`background`, `foreground`, `card`, `card-foreground`, `popover`,
`primary`, `primary-foreground`, `secondary`, `secondary-foreground`,
`muted`, `muted-foreground`, `accent`, `accent-foreground`,
`destructive`, `destructive-foreground`, `border`, `input`, `ring`.

### 2.3 Estados

| Token | Classe | Uso |
| --- | --- | --- |
| `--success` | `text-success` / `bg-success` | Indexação concluída, serviço conectado. |
| `--warning` | `bg-warning` | Configuração pendente, cota próxima do limite. |
| `--info` | `bg-info` | Avisos informativos e dicas. |
| `--destructive` | `bg-destructive` | Falha de API, exclusão, erro de RAG. |

### 2.4 Regra de uso de cor

1. Fundo sempre `background` / `card`. Nunca cor de marca em área grande no modo claro.
2. Azul apenas em: ação primária, rota ativa, foco, dado em destaque.
3. Vermelho, verde e âmbar apenas para estado — nunca para decoração.
4. Prata/grafite fazem toda a hierarquia neutra.

---

## 3. Tipografia

| Papel | Família | Token |
| --- | --- | --- |
| Títulos | Space Grotesk | `font-display` |
| Corpo / UI | Inter | `font-body` |
| Dados técnicos, IDs, logs | JetBrains Mono | `font-mono` |

- Tracking de títulos: `-0.02em` (já aplicado em `h1`–`h6`).
- Tracking de corpo: `-0.005em` (aplicado em `body`).
- Largura máxima de leitura: `max-w-3xl` (~72 caracteres).

### 3.1 Escala de fontes

| Classe | Tamanho | Uso |
| --- | --- | --- |
| `text-display` | 48px / 50px | Herói da landing page. |
| `text-title1` | 36px / 40px | Título de página (H1). |
| `text-title2` | 28px / 34px | Seção principal (H2). |
| `text-title3` | 22px / 28px | Bloco/cartão (H3). |
| `text-headline` | 18px / 26px | Cabeçalho de cartão, ênfase. |
| `text-callout` | 16px / 26px | Texto de destaque, respostas do chat. |
| `text-body` | 15px / 25px | Corpo padrão da interface. |
| `text-footnote` | 13px / 19px | Metadados, legendas de tabela. |
| `text-caption` | 12px / 18px | Badges, chips, rótulos. |
| `text-caption2` | 11px / 16px | Eyebrow em maiúsculas, aviso legal. |

Pesos permitidos: 400 (corpo), 500 (rótulo), 600 (subtítulo), 700 (título).
Nunca usar 800/900.

---

## 4. Espaçamentos

Grade base de **4px** (`--spacing: 0.25rem`).

| Escala | Valor | Uso |
| --- | --- | --- |
| `1` | 4px | Ajuste óptico entre ícone e texto. |
| `2` | 8px | Espaço interno compacto. |
| `3` | 12px | Padding de item de lista. |
| `4` | 16px | Padding padrão de card em mobile. |
| `6` | 24px | Padding padrão de card em desktop / gutter. |
| `8` | 32px | Distância entre blocos. |
| `12` | 48px | Distância entre subseções. |
| `14`–`20` | 56–80px | Distância entre seções (`section-spacing`). |

Tokens auxiliares: `--spacing-gutter` (24px), `--spacing-section` (80px),
`--spacing-content` (1152px, largura máxima de conteúdo).

Utilitários prontos: `container-content`, `section-spacing`.

---

## 5. Border radius

`--radius: 0.875rem` (14px) como base.

| Classe | Valor | Uso |
| --- | --- | --- |
| `rounded-sm` | 10px | Badge, chip pequeno, tag. |
| `rounded-md` | 12px | Input, botão pequeno, skeleton. |
| `rounded-lg` | 14px | Botão padrão, item de lista. |
| `rounded-xl` | 18px | Card padrão (`surface-panel`). |
| `rounded-2xl` | 22px | Painel elevado, modal (`surface-raised`). |
| `rounded-3xl` | 26px | Bloco de herói, superfície destacada. |
| `rounded-full` | — | Avatar, chip, indicador de status. |

---

## 6. Sombras e superfícies

| Utilitário | Uso |
| --- | --- |
| `shadow-soft` | Elevação 1 — cards em repouso. |
| `shadow-elevated` | Elevação 2 — popovers, dropdowns, modais. |
| `shadow-azure` | Elevação de ação primária (azul). |
| `ring-azure` | Anel de foco de 3px. |
| `surface-panel` | Card padrão: fundo, borda 1px, raio xl, sombra soft. |
| `surface-raised` | Painel elevado: raio 2xl, sombra mais difusa. |
| `interactive-card` / `hover-lift` | Elevação em hover (−2px / −3px). |

Regra: no máximo **dois** níveis de elevação visíveis simultaneamente.

---

## 7. Animações e duração das transições

| Token | Valor | Uso |
| --- | --- | --- |
| `--duration-instant` | 80ms | Feedback de pressão (`active`). |
| `--duration-fast` | 140ms | Hover, foco, mudança de cor. |
| `--duration-base` | 220ms | Transição padrão de componente. |
| `--duration-slow` | 360ms | Entrada de painel, drawer, modal. |
| `--duration-ambient` | 640ms | Loop ambiente (pulse, shimmer). |

Easing: `--ease-standard` (padrão), `--ease-emphasized` (entrada destacada),
`--ease-exit` (saída).

Animações disponíveis: `animate-rise`, `shimmer-line`, `caret-blink`,
`skeleton-block`, `animate-accordion-down/up`.

`prefers-reduced-motion: reduce` já neutraliza todas as animações globalmente.

---

## 8. Componentes padrão

Base: shadcn/ui em `src/components/ui/*`. Variantes novas devem ser criadas via
`cva` no próprio componente — nunca com classes ad-hoc na tela.

### 8.1 Cards
- Padrão: `surface-panel p-4 sm:p-6`.
- Interativo: acrescentar `interactive-card`.
- Destacado: `surface-raised`.
- Cabeçalho: `text-headline` + descrição `text-footnote text-muted-foreground`.

### 8.2 Botões
| Variante | Aparência |
| --- | --- |
| `primary` | `bg-gradient-azure text-primary-foreground shadow-azure`. |
| `secondary` | `bg-secondary text-secondary-foreground`. |
| `outline` | `border border-input bg-background hover:bg-accent`. |
| `ghost` | Sem fundo, `hover:bg-muted`. |
| `destructive` | `bg-destructive text-destructive-foreground`. |

Alturas: `sm` 32px, `default` 36px, `lg` 44px, `icon` 36×36px.
Foco sempre visível (`focus-visible` + `ring`). Uma única ação primária por tela.

### 8.3 Inputs
- `rounded-md border border-input bg-background text-body`, altura 36–40px.
- Placeholder em `text-muted-foreground`.
- Foco: `ring` azul, sem deslocamento de layout.
- Erro: `border-destructive` + mensagem `text-caption text-destructive`.
- Rótulo sempre presente (`text-footnote font-medium`); `aria-label` quando visualmente oculto.

### 8.4 Badges
Semânticos e estáticos: `neutral` (muted), `info`, `success`, `warning`,
`destructive`. Sempre `text-caption font-semibold rounded-sm px-2 py-0.5`.

### 8.5 Chips
Interativos/filtráveis. Utilitários `chip-base` e `chip-accent` (estado ativo).
Chips são clicáveis; badges não.

### 8.6 Tabelas
- Cabeçalho: `text-caption uppercase tracking-wide text-muted-foreground`.
- Linhas: utilitário `table-row-base` (borda inferior + hover).
- Números e IDs alinhados à direita, em `font-mono`.
- Densidade confortável: `py-3`. Sem zebra striping.

### 8.7 Listas
Utilitário `list-row-base`. Estrutura: ícone/avatar → título + descrição →
metadado à direita. Separador apenas quando houver mais de 5 itens.

### 8.8 Estados de loading
- Skeleton: `skeleton-block` com o formato real do conteúdo (nunca spinner de página inteira).
- Ação em andamento: botão desabilitado + `aria-busy` + texto no gerúndio.
- Streaming de resposta: `caret-blink`.

### 8.9 Estados de erro
- Bloco: `state-surface state-error` com título, causa em linguagem simples e ação de repetir.
- Erro técnico (status/provedor) em `font-mono text-caption`, recolhido por padrão.
- Nunca ocultar falhas atrás de resposta genérica.

### 8.10 Estados vazios
- Bloco: `state-surface` com ícone (`h-10 w-10 text-muted-foreground`), título
  `text-headline`, apoio `text-footnote` e uma ação primária.
- Texto orientado à próxima ação, nunca "Nenhum dado".

---

## 9. Modo claro e modo escuro

- Claro: fundo quase branco (`oklch(0.985 …)`), cards brancos puros, prata nos separadores.
- Escuro: grafite naval (`oklch(0.16 …)`), cards um passo acima do fundo, azul mais luminoso.
- Ambos os temas definem o mesmo conjunto de tokens em `:root` e `.dark` — nenhum
  componente precisa de variante `dark:` para cor.
- Alternância: `ThemeProvider` (`src/components/theme-provider.tsx`), persistida em
  `localStorage` sob `qapia-theme`.
- Contraste mínimo: 4.5:1 para texto, 3:1 para ícones e bordas em ambos os temas.

---

## 10. Acessibilidade

- Foco visível global: `:focus-visible` com anel de 2px + offset.
- Alvos de toque com no mínimo 40×40px em mobile.
- Todo ícone isolado precisa de `aria-label`.
- Um único `h1` por rota; hierarquia de cabeçalhos sem saltos.
- Estados nunca comunicados apenas por cor (usar ícone e/ou texto).

---

## 11. Convenções para as próximas PRs

1. Novo valor visual → primeiro token em `src/styles.css`, depois uso.
2. Nenhuma cor literal em componentes.
3. Utilitários repetidos ≥ 3 vezes → transformar em `@utility` ou componente.
4. Página nova → `container-content` + `section-spacing`.
5. Qualquer lista/tabela precisa de suas três variações: loading, vazio e erro.
