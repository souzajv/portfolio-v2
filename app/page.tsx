'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState, type ElementType, type FormEvent } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Observer } from 'gsap/Observer';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  BrainCircuit,
  Code,
  ExternalLink,
  Github,
  Layers,
  Linkedin,
  Mail,
  MessageSquare,
  Palette,
  Phone,
  Server,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';
import PillNav, { type PillNavItem } from '@/components/PillNav';
import TiltedCard from '@/components/TiltedCard';
import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline';
import { Timeline } from '@/components/ui/timeline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type HighlightCard = {
  title: string;
  description: string;
  icon: ElementType;
};

type OrbitalSkill = {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: ElementType;
  relatedIds: number[];
  status: 'completo' | 'em-progresso' | 'pendente';
  energy: number;
};

type ExperienceItem = {
  title: string;
  subtitle?: string;
  period: string;
  description: string;
  highlights: string[];
};

type ProjectCard = {
  title: string;
  description: string;
  stack: string[];
  image: string;
  link?: string;
};

type CertificationItem = {
  title: string;
  issuer: string;
  year: string;
};

type ImpactItem = {
  title: string;
  description: string;
  icon: ElementType;
};

type ContactLink = {
  label: string;
  href: string;
  icon: ElementType;
};

const TikTokIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M13 3a1 1 0 0 1 1-1h1.3a1 1 0 0 1 1 .84 4.8 4.8 0 0 0 2.86 3.6 1 1 0 0 1 .64.93v1.5a1 1 0 0 1-1.33.94 7.1 7.1 0 0 1-2.17-.94v6.24A6.17 6.17 0 1 1 10 9.5v3.12a2.17 2.17 0 1 0 2.17 2.17V3Z" />
  </svg>
);

const navItems: PillNavItem[] = [
  { label: 'Início', href: '#hero' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experiências', href: '#experiencias' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Contato', href: '#contato' }
];

const heroSocials: ContactLink[] = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/joao-souza-campos/',
    icon: Linkedin
  },
  {
    label: 'GitHub',
    href: 'https://github.com/souzajv',
    icon: Github
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@souza.json',
    icon: TikTokIcon
  }
];

const aboutHighlights: HighlightCard[] = [
  {
    title: 'Front-end & UX/UI',
    description: 'Estudante de Engenharia de Software no Inteli, bolsista integral e focado em experiências digitais.',
    icon: Code
  },
  {
    title: 'Interesses',
    description: 'Automação, usabilidade, segurança e como tecnologia aproxima pessoas e negócios.',
    icon: BrainCircuit
  },
  {
    title: 'Meta pessoal',
    description: 'Atingir R$1 milhão investido até os 40 anos, construindo com consistência e propósito.',
    icon: TrendingUp
  }
];

const skillOrbitData: OrbitalSkill[] = [
  {
    id: 1,
    title: 'Front-end Engineering',
    date: 'Desde 2019',
    content: 'React.js, Next.js, TypeScript e Tailwind CSS com microinterações em Framer Motion e GSAP.',
    category: 'Front-end',
    icon: Code,
    relatedIds: [2, 3, 5],
    status: 'completo',
    energy: 92
  },
  {
    id: 2,
    title: 'UX/UI & Design Systems',
    date: 'Desde 2020',
    content: 'Figma, Design Ops, UX Writing e prototipação orientada a sistemas escaláveis.',
    category: 'Design',
    icon: Palette,
    relatedIds: [1, 3],
    status: 'completo',
    energy: 88
  },
  {
    id: 3,
    title: 'Product Ops',
    date: '2021 — atual',
    content: 'Criação de playbooks, governança de componentes e alinhamento entre produto, engenharia e negócio.',
    category: 'DesignOps',
    icon: Layers,
    relatedIds: [1, 2, 5],
    status: 'em-progresso',
    energy: 84
  },
  {
    id: 4,
    title: 'Automação & RPA',
    date: '2022 — atual',
    content: 'Bots, RPA e low-code para liberar tempo do time e garantir processos confiáveis.',
    category: 'Automation',
    icon: Bot,
    relatedIds: [1, 5],
    status: 'em-progresso',
    energy: 78
  },
  {
    id: 5,
    title: 'Back-end & Infra',
    date: 'Desde 2021',
    content: 'Node.js, Docker, SQL, integrações e arquitetura orientada a dados com foco em segurança.',
    category: 'Engineering',
    icon: Server,
    relatedIds: [1, 4, 6],
    status: 'completo',
    energy: 81
  },
  {
    id: 6,
    title: 'Data & IA aplicada',
    date: '2023 — atual',
    content: 'Modelos preditivos, análise de dados e storytelling visual para tomada de decisão.',
    category: 'Data',
    icon: BarChart3,
    relatedIds: [1, 5],
    status: 'pendente',
    energy: 74
  }
];

const experiencesData: ExperienceItem[] = [
  {
    title: 'Visagio v(dev)',
    subtitle: 'Desenvolvedor Back-end',
    period: '2024',
    description:
      'Experiência em back-end com C#/.NET, aplicando princípios SOLID e evoluindo um código legado complexo.',
    highlights: ['SOLID', 'DevOps', 'Refatoração']
  },
  {
    title: 'Freelancer',
    subtitle: 'Desenvolvedor Front-end e UX/UI Designer',
    period: '2024 • Atual',
    description:
      'Crio landing pages modernas com Next.js e Tailwind alinhadas à identidade e aos resultados desejados pelos clientes.',
    highlights: ['Design to Code', 'Performance web', 'Relacionamento com clientes']
  },
  {
    title: 'CamelSec',
    subtitle: 'Desenvolvedor Front-end e UX/UI Designer',
    period: '2025',
    description:
      'Contribui para o crescimento da plataforma da startup unindo UX Design e Front-end. Estruturei o Design System e atuei com times de produto e segurança.',
    highlights: ['Design System', 'Next.js + Tailwind', 'Produto & Segurança']
  },
  {
    title: 'Inteli Júnior',
    subtitle: 'Desenvolvedor Front-end e UX/UI Designer',
    period: '2025 • Atual',
    description:
      'Desenvolvimento de soluções digitais do Figma ao código, sempre com cadência ágil e foco em entregas de impacto.',
    highlights: ['Metodologias ágeis', 'Discovery contínuo', 'UX Research']
  },
  {
    title: 'TanTech',
    subtitle: 'Diretor da TanTech',
    period: '2024 • Atual',
    description:
      'Desenvolvo tecnologias para ampliar o alcance digital da Atlética, explorando stacks modernas e operações colaborativas.',
    highlights: ['Liderança técnica', 'Automação', 'Branding digital']
  },

];

const createPlaceholder = (label: string) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='#0f172a'/><stop offset='100%' stop-color='#312e81'/></linearGradient></defs><rect width='600' height='400' rx='32' fill='url(#g)'/><text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle' fill='white' font-family="JetBrains Mono, monospace" font-size='24'>${label}</text></svg>`
  )}`;

const projectCards: ProjectCard[] = [
  {
    title: 'Compass | Modelo preditivo',
    description: 'Modelo preditivo para apoiar a retenção de clientes com insights claros e acionáveis.',
    stack: ['Python', 'Machine Learning', 'Data Analysis'],
    image: createPlaceholder(''),
    link: '#'
  },
  {
    title: 'Parceiros Voluntários | Plataforma Social',
    description: 'Ecosistema digital para conectar pessoas e causas com foco em impacto social.',
    stack: ['JavaScript', 'Sails.js', 'PostgreSQL', 'UX'],
    image: createPlaceholder(''),
    link: '#'
  },
  {
    title: 'Vision Academy | Game Educacional',
    description: 'Game imersivo para potencializar aprendizagem com gamificação e storytelling.',
    stack: ['Phaser', 'UX Design', 'Gamificação'],
    image: createPlaceholder(''),
    link: '#'
  },
  {
    title: 'CamelSec | Dashboard ISO/LGPD',
    description: 'Painel para gestão de conformidade, facilitando decisões com dados confiáveis.',
    stack: ['React.js', 'Data Visualization', 'UX'],
    image: createPlaceholder(''),
    link: '#'
  }
];

const certifications: CertificationItem[] = [
  { title: 'Desenvolvimento Web Front-end', issuer: 'Rocketseat', year: '2023' },
  { title: 'NLW Unite — React.js', issuer: 'Rocketseat', year: '2024' },
  { title: 'Data Analysis with Python', issuer: 'FreeCodeCamp', year: '2024' }
];

const impactItems: ImpactItem[] = [
  {
    title: 'Mentor na Comunidade Wave',
    description: 'Preparo jovens para o processo seletivo do Inteli, compartilhando estratégias e acolhimento.',
    icon: Sparkles
  },
  {
    title: 'Diretor da TanTech',
    description: 'Coordeno iniciativas tecnológicas da Atlética Tantera, garantindo execução com impacto real.',
    icon: MessageSquare
  },
  {
    title: 'Foco em propósito',
    description: 'Tecnologia com empatia para conectar pessoas, negócios e resultados de forma sustentável.',
    icon: Target
  }
];


const careerTimeline = experiencesData.map(experience => ({
  title: experience.title,
  content: (
    <Card className="bg-(--background-80) border-(--stroke-color) backdrop-blur-md">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl">{experience.subtitle}</CardTitle>
        <p className="text-sm text-muted-foreground">{experience.period}</p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>{experience.description}</p>
        <div className="flex flex-wrap gap-2">
          {experience.highlights.map(item => (
            <Badge
              key={`${experience.title}-${item}`}
              variant="outline"
              className="border-border bg-transparent text-(--foreground-80)"
            >
              {item}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}));

const experienceTimeline = [...careerTimeline];

const contactLinks: ContactLink[] = [
  ...heroSocials,
  { label: 'E-mail', href: 'mailto:contato.souzacamposjv@gmail.com', icon: Mail },
  { label: 'WhatsApp', href: 'https://wa.me/5531971957015', icon: Phone }
];

export default function Home() {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const pageRef = useRef<HTMLElement | null>(null);
  const heroMediaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer);

    const ctx = gsap.context(() => {
      const heroTargets = gsap.utils.toArray<HTMLElement>('[data-animate="hero"]');
      if (heroTargets.length) {
        gsap.from(heroTargets, {
          autoAlpha: 0,
          y: 40,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.12,
          delay: 0.2
        });
      }

      if (heroMediaRef.current) {
        gsap.fromTo(
          heroMediaRef.current,
          { autoAlpha: 0, rotate: -8, y: 60 },
          {
            autoAlpha: 1,
            rotate: 0,
            y: 0,
            duration: 1.1,
            ease: 'power4.out',
            delay: 0.3
          }
        );
      }

      const sectionTargets = gsap.utils.toArray<HTMLElement>('[data-animate="section"]');
      sectionTargets.forEach(element => {
        gsap.set(element, { autoAlpha: 0, y: 60 });
        gsap.to(element, {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      });

      const itemTargets = gsap.utils.toArray<HTMLElement>('[data-animate="item"]');
      if (itemTargets.length) {
        gsap.set(itemTargets, { autoAlpha: 0, y: 20 });
        ScrollTrigger.batch(itemTargets, {
          start: 'top 90%',
          onEnter: batch => {
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              stagger: 0.12
            });
          }
        });
      }

      ScrollTrigger.refresh();
    }, pageRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let ticking = false;

    const evaluateVisibility = () => {
      const currentY = window.scrollY;
      const secondSection = document.getElementById('sobre');
      const isWithinSecondSection = (() => {
        if (!secondSection) return false;
        const sectionTop = secondSection.offsetTop;
        const sectionBottom = sectionTop + secondSection.offsetHeight;
        const viewportCenter = currentY + window.innerHeight / 2;
        return viewportCenter >= sectionTop && viewportCenter <= sectionBottom;
      })();

      const isScrollingUp = currentY < lastScrollY.current;
      const nearTop = currentY < 40;
      const shouldShow = isScrollingUp || nearTop || isWithinSecondSection;

      setIsNavVisible(prev => (prev === shouldShow ? prev : shouldShow));

      lastScrollY.current = currentY;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(() => {
          evaluateVisibility();
          ticking = false;
        });
      }
    };

    evaluateVisibility();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    if (isTouchDevice) return;

    let scrollTween: gsap.core.Tween | null = null;
    let scrollTarget = window.scrollY;

    const maxScrollY = () => document.documentElement.scrollHeight - window.innerHeight;

    const syncScrollTarget = () => {
      scrollTarget = window.scrollY;
    };

    const observer = Observer.create({
      target: window,
      type: 'wheel',
      preventDefault: true,
      allowClicks: true,
      onChangeY: self => {
        const event = self.event as WheelEvent | undefined;
        if (event?.ctrlKey) {
          scrollTarget = window.scrollY;
          return;
        }

        const deltaY = self.deltaY;
        if (!deltaY) return;

        scrollTarget = gsap.utils.clamp(0, maxScrollY(), scrollTarget + deltaY * 45);

        scrollTween?.kill();
        scrollTween = gsap.to(window, {
          scrollTo: { y: scrollTarget },
          duration: 1.05,
          ease: 'power3.out',
          overwrite: 'auto',
          onUpdate: ScrollTrigger.update
        });
      }
    });

    window.addEventListener('scroll', syncScrollTarget, { passive: true });

    return () => {
      observer.kill();
      scrollTween?.kill();
      window.removeEventListener('scroll', syncScrollTarget);
    };
  }, []);

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main ref={pageRef} className="relative min-h-screen text-foreground">

      <PillNav
        logo="/logo-jvsc.svg"
        items={navItems}
        baseColor=""
        pillColor="rgba(25,34,56,0.78)"
        hoveredPillTextColor="var(--text-on-dark)"
        pillTextColor="var(--text-muted-dark)"
        className="max-w-4xl mx-auto"
        isVisible={isNavVisible}
      />

      <section id="hero" className="relative flex min-h-screen items-center overflow-x-hidden px-6 py-24">

        <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-16 md:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6" data-animate="hero">
            <Badge variant="secondary" className="bg-background text-(--text-muted-dark)">
              [Design Engineer]
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              João Victor de Souza Campos, <br /> Front-end & UX/UI
            </h1>
            <p className="text-lg text-(--foreground-80) md:text-xl">
              Transformo ideias em interfaces que unem design, tecnologia e propósito. Minha missão é construir produtos
              que gerem conexão real entre pessoas e negócios.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild size="lg" className="gap-2">
                  <Link href="#projetos">
                    Ver projetos
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild variant="secondary" size="lg" className="gap-2">
                  <Link href="#contato">
                    Contato
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {heroSocials.map(({ label, href, icon: Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-(--stroke-color) bg-(--surface-glass) text-(--text-muted-dark) transition hover:border-(--stroke-color) hover:text-(--text-on-dark)"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          <div ref={heroMediaRef} className="relative mx-auto w-full max-w-[360px]">
            <TiltedCard
              imageSrc="/eu.svg"
              altText="Retrato de João Victor Souza Campos"
              containerWidth="420px"
              containerHeight="520px"
              imageWidth="420px"
              imageHeight="520px"
              rotateAmplitude={10}
              scaleOnHover={1.06}
              showMobileWarning={false}
              imageClassName="rounded-3xl border-2 border-(--stroke-color) shadow-[0_30px_80px_rgba(15,23,42,0.35)]"
              overlayContent={
                <div className="pointer-events-none relative flex h-[520px] w-full items-end justify-center">
                  <span className="w-[90%] mb-6 rounded-full border border-(--stroke-color) bg-(--muted-foreground)/20 px-6 py-3 text-sm uppercase tracking-widest text-(--text-on-dark) backdrop-blur-sm text-center">
                    Futurismo • Empatia • Impacto
                  </span>
                </div>
              }
              displayOverlayContent
            />
          </div>
        </div>
      </section>

      <section id="sobre" className="px-6 py-24" data-animate="section">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 md:flex-row">
          <div className="md:w-2/3 space-y-6">
            <Badge variant="secondary" className="bg-background text-(--foreground-80)">
              [Sobre mim]
            </Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">
              Sou João Victor, filho único de uma mãe mineira que me ensinou o valor do trabalho e da persistência.
            </h2>
            <div className="space-y-4 text-(--foreground-80)">
              <p>
                Hoje estudo Engenharia de Software no Inteli como bolsista integral e atuo como Design Engineer. Minha
                zona de impacto está na interseção entre front-end e UX/UI, onde consigo prototipar, testar e entregar com
                velocidade.
              </p>
              <p>
                Gosto de unir tecnologia e empatia para criar experiências que realmente conectem pessoas e negócios. Com
                uma visão analítica e prática, levo estratégia de produto, consistência visual e engenharia para o mesmo
                lugar.
              </p>
            </div>
          </div>

          <div className="md:w-1/3 grid gap-4">
            {aboutHighlights.map(({ title, description, icon: Icon }) => (
              <Card key={title} data-animate="item" className="border-(--stroke-color) bg-(--background-60) backdrop-blur">
                <CardContent className="flex items-start gap-3 py-5">
                  <div className="rounded-full bg-(--primary-10) p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
                    <p className="text-sm text-(--foreground-80)">{description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="px-6 py-24" data-animate="section">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 items-center justify-center">
          <div className="space-y-4 text-center">
            <Badge variant="secondary" className="mx-auto bg-background text-(--foreground-80)">
              [Skills em órbita]
            </Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Domínio técnico com visão sistêmica</h2>
            <p className="mx-auto max-w-2xl text-base text-(--foreground-70)">
              Um mapa interativo das minhas principais habilidades e como elas se conectam para entregar produtos com
              consistência, velocidade e impacto.
            </p>
          </div>

          <div className="w-full max-w-4xl text-(--text-on-dark)">
            <RadialOrbitalTimeline timelineData={skillOrbitData} minHeight="32rem" className="rounded-3xl" />
          </div>
        </div>
      </section>

      <section id="experiencias" className="px-6 mt-[-80px]" data-animate="section">
        <div className="mx-auto w-full max-w-6xl">
          <Timeline
            data={experienceTimeline}
            title="Experiências"
            description="Evoluo entregando ponta a ponta: da descoberta ao ship, do protótipo ao código em produção."
            className="bg-transparent"
          />
        </div>
      </section>

      <section id="projetos" className="px-6 py-24" data-animate="section">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-10">
          <div className="space-y-4">
            <Badge variant="secondary" className="bg-background text-(--foreground-80)">
              [Projetos]
            </Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Construo experiências que contam histórias e entregam resultado</h2>
            <p className="max-w-3xl text-base text-(--foreground-70)">
              De modelos preditivos a jogos sérios, cada projeto traz escolhas de design, tecnologia e estratégia para
              resolver problemas reais.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3 auto-rows-[520px]">
            {projectCards.map(project => (
              <div
                key={project.title}
                data-animate="item"
                className="relative h-full overflow-visible rounded-3xl border border-(--stroke-color) bg-(--background-60) p-6 backdrop-blur"
              >
                <TiltedCard
                  imageSrc={project.image}
                  containerHeight="100%"
                  imageHeight="100%"
                  imageWidth="100%"
                  overlayContent={
                    <div
                      className="flex h-full w-full flex-col justify-between rounded-[15px] border border-(--stroke-color) p-6 text-left shadow-[inset_0_1px_20px_rgba(255,255,255,0.08)]"
                      style={{ background: 'linear-gradient(180deg, var(--surface-panel) 0%, rgba(15,23,42,0.82) 100%)' }}
                    >
                      <div className="space-y-3">
                        <Badge
                          variant="outline"
                          className="border-(--status-border) bg-(--status-complete-bg) text-(--text-on-dark)"
                        >
                          Destaque
                        </Badge>
                        <h3 className="text-lg font-semibold text-(--text-on-dark)">{project.title}</h3>
                        <p className="text-sm text-(--text-muted-dark)">{project.description}</p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.stack.map(stack => (
                          <span
                            key={`${project.title}-${stack}`}
                            className="rounded-full border border-(--stroke-color) px-3 py-1 text-xs uppercase tracking-wide text-(--text-muted-dark)"
                          >
                            {stack}
                          </span>
                        ))}
                      </div>
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="mt-6 self-start border border-(--stroke-color) bg-(--surface-glass) text-(--text-on-dark) hover:border-(--stroke-color) hover:bg-(--status-progress-bg)"
                      >
                        <Link href={project.link ?? '#'} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                          Ver case
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  }
                  displayOverlayContent
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="certificacoes" className="px-6 py-24 mt-[-80px]" data-animate="section">
        <div className="mx-auto w-full max-w-6xl space-y-10">
          <div className="space-y-4">
            <Badge variant="secondary" className="bg-background text-(--foreground-80)">
              [Certificações]
            </Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Aprendizado contínuo e versátil</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {certifications.map(certification => (
              <Card
                key={certification.title}
                data-animate="item"
                className="border-border bg-(--background-70) p-6 text-sm backdrop-blur transition hover:border-(--stroke-color)"
              >
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{certification.issuer}</p>
                <h3 className="mt-3 text-lg font-semibold">{certification.title}</h3>
                <p className="mt-6 text-xs text-(--foreground-60)">{certification.year}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="impacto" className="px-6 py-24" data-animate="section">
        <div className="mx-auto w-full max-w-6xl space-y-10">
          <div className="space-y-4">
            <Badge variant="secondary" className="bg-background text-(--foreground-80)">
              [Atividades & Impacto]
            </Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Liderança, comunidade e propósito</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {impactItems.map(({ title, description, icon: Icon }) => (
              <Card
                key={title}
                data-animate="item"
                className="border-(--stroke-color) bg-(--background-70) p-6 text-sm backdrop-blur"
              >
                <div className="mb-4 inline-flex rounded-full bg-(--primary-10) p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm text-(--foreground-70)">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="px-6 py-24" data-animate="section">
        <div className="mx-auto grid w-full max-w-6xl gap-12 rounded-3xl border border-(--stroke-color) bg-(--background-80) p-10 backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6" data-animate="item">
            <Badge variant="secondary" className="bg-background text-(--foreground-80)">
              [Contato]
            </Badge>
            <h2 className="text-3xl font-semibold md:text-4xl">Vamos construir algo com propósito?</h2>
            <p className="text-base text-(--foreground-70)">
              Gosto de trabalhar com propósito e com pessoas curiosas. Se quiser trocar uma ideia sobre design, tecnologia
              ou impacto, me chama.
            </p>

            <div className="space-y-3">
              {contactLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer' : undefined}
                  className="group flex items-center gap-3 text-sm text-(--foreground-70) transition hover:text-primary"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-(--stroke-color)">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                  <ArrowUpRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>

          <form onSubmit={handleContactSubmit} className="grid gap-5" data-animate="item">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-xs uppercase tracking-widest text-muted-foreground">
                Nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="rounded-2xl border border-(--stroke-color) bg-(--background-70) px-4 py-3 text-sm text-foreground focus:border-(--stroke-color) focus:outline-none focus:ring-2 focus:ring-(--stroke-color)"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="rounded-2xl border border-(--stroke-color) bg-(--background-70) px-4 py-3 text-sm text-foreground focus:border-(--stroke-color) focus:outline-none focus:ring-2 focus:ring-(--stroke-color)"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="message" className="text-xs uppercase tracking-widest text-muted-foreground">
                Mensagem
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="resize-none rounded-2xl border border-(--stroke-color) bg-(--background-70) px-4 py-3 text-sm text-foreground focus:border-(--stroke-color) focus:outline-none focus:ring-2 focus:ring-(--stroke-color)"
              />
            </div>
            <Button type="submit" className="flex items-center justify-between gap-2">
              Enviar mensagem
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>

  <footer className="px-6 pb-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 border-t border-(--stroke-color) pt-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} João Victor Souza Campos. Todos os direitos reservados.</span>
          <span className="text-(--muted-foreground-70)">Design + Código por João Victor, impulsionado por curiosidade e propósito.</span>
        </div>
      </footer>
    </main>
  );
}
