# Meu Portfólio (João Victor Souza Campos)

Este repositório contém a versão em Next.js do portfólio pessoal de João Victor Souza Campos. O objetivo é apresentar projetos, experiências e habilidades com microinterações modernas, design escuro e animações suaves.

---

## Visão geral

- Framework: Next.js (App Router)
- Linguagem: TypeScript / React
- Estilo: Tailwind CSS (utilitários customizados)
- Animações: GSAP (ScrollTrigger, ScrollToPlugin, Observer) + Framer Motion para microinterações
- Componentes principais: `PillNav`, `TiltedCard`, `RadialOrbitalTimeline`, `BlobCursor`

---

## Estrutura do projeto (resumo)

```
components/
  BlobCursor.tsx            # Cursor customizado (globally mounted)
  PillNav.tsx              # Navegação fixa (scroll + visibilidade)
  TiltedCard.tsx           # Cartões com efeito 3D/tilt
  Galaxy.tsx
  RadialOrbitalTimeline.tsx# Visualização em órbita (skills)
  ...
app/
  layout.tsx               # Layout global (inclui Squares e BlobCursor)
  page.tsx                 # Página principal (hero, sections, project cards)
components/ui/
  badge.tsx
  button.tsx
  card.tsx
  timeline.tsx
lib/
  utils.ts
public/
  assets (imagens, svg)
README.md
package.json
next.config.ts
```

> Observação: o arquivo `components/ui/radial-orbital-timeline.tsx` foi re-escrito durante o desenvolvimento para suportar nós maiores e interação com cards.

---

## Fluxos e comportamento

### 1) Inicialização (app/layout.tsx)
- O `BlobCursor` é montado globalmente dentro do `layout`, com `cursor: none` aplicado ao `body` para ocultar o cursor nativo.
- Um background de grade é adicionado via `Squares` em `pointer-events-none` atrás do conteúdo.

### 2) Hero + GSAP (app/page.tsx)
- GSAP é registrado com `ScrollTrigger`, `ScrollToPlugin` e `Observer`.
- Animações iniciais do `hero` utilizam `gsap.from`/`fromTo` para `autoAlpha`, `y` e `rotate`.
- Seções configuradas com `data-animate="section"` e itens com `data-animate="item"` usam `ScrollTrigger.batch` para reveals com stagger.

### 3) Scroll suave e navegação
- Utilizamos `Observer` + `ScrollToPlugin` para interceptar eventos de roda e animar o scroll com `gsap.to(window, { scrollTo: { y }, duration, ease })`.
- A navegação `PillNav` chama `gsap.to(window, { scrollTo: section })` para rolar suavemente a página.

### 4) TiltedCard
- `TiltedCard` usa `motion/react` (motion values + springs) para rotacionar os cartões de projeto com base na posição do mouse.
- Suporta `overlayContent` que é renderizado com `translateZ` para dar profundidade.
- Parâmetros úteis: `rotateAmplitude`, `scaleOnHover`, `containerHeight`, `imageClassName`.

### 5) RadialOrbitalTimeline (skills)
- Representa skills como nós orbitais com auto-rotacionamento.
- Cada nó é clicável e expande um `Card` com detalhes -> ativa efeito de pulso nos nós relacionados.
- Gerencia rotação automática (interval) e recentraliza a vista ao focar um nó.

### 6) BlobCursor (cursor customizado)
- Implementado como componente que monta elementos absolutos que são animados via GSAP.
- Opera através de `window.mousemove` / `touchmove` e não bloqueia interações (`pointer-events-none` aplicado ao wrapper no `layout`).
- Opções usadas por padrão no projeto: quadrado (`blobType='square'`), cinza, menor, com 3 camadas.

---

## Como rodar

Pré-requisitos: Node.js (16+), npm

1. Instalar dependências

```bash
npm install
```

2. Rodar em modo dev

```bash
npm run dev
# aberto em http://localhost:3001 (ou 3000 se disponível)
```

3. Linters

```bash
npm run lint
```

4. Build e start

```bash
npm run build
npm run start
```

---

## Notas de desenvolvimento e dicas

- O `BlobCursor` foi ajustado para não interferir na usabilidade. Se quiser desativá-lo em mobile, condicione a montagem ao detectar `pointer: fine`.
- Para ajustar a responsividade do `TiltedCard`, manipule `containerHeight` e `imageClassName` quando usado em grids.
- A timeline radial foi reescrita durante a sessão para corrigir problemas de parsing e melhorar legibilidade — revise os valores `BASE_NODE_SIZE`, `ORBIT_DIAMETER` e `GLOW_EXTRA` se quiser alterar o visual.

---

## Testes rápidos (manual)
- Verificar hero: animação de entrada e movimento sutil do retrato (TiltedCard).
- Rolagem: tentar rolar com roda do mouse/trackpad e com os botões do `PillNav`.
- Tiles de projetos: passar mouse sobre um TiltedCard e confirmar animação 3D.
- Skills: abrir um nó do `RadialOrbitalTimeline` e confirmar que o card expande e marcas relacionadas pulsam.
- Cursor: checar que o cursor do sistema está oculto e o blob quadrado segue o ponteiro.

---

## Próximos passos / melhorias
- Tornar o `BlobCursor` acessível: esconder durante navegação por teclado (Tab), ou ao detectar `prefers-reduced-motion`.
- Adicionar testes unitários e E2E leves (Vitest + Playwright) para as interações críticas.
- Extrair constantes visuais (tokens) para um arquivo de design tokens para facilitar ajuste de tema.

---
