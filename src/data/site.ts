// Conteúdo do site. Tudo o que muda com frequência mora aqui.
// Pendências para confirmar com a GOFIT estão listadas no README.

export type UnitKey = 'rz' | 'fb' | 'pb';

export interface Unit {
  key: UnitKey;
  slug: string;
  name: string;
  short: string;
  city: string;
  role: string;
  since: string;
  quote: string;
  address: string;
  district: string;
  cep: string;
  mods: string[];
  highlights: string[];
  instagram: string;
  followers: string;
  maps: string;
  /** WhatsApp só com dígitos (55 + DDD + número). null abre o WhatsApp sem contato definido. */
  whatsapp: string | null;
  /** Ex.: 'Seg a sex 5h às 23h · Sáb 8h às 12h'. null esconde a linha. */
  hours: string | null;
  pitch: string;
  seoTitle: string;
  seoDescription: string;
  story: { title: string; text: string };
  map: { x: number; y: number };
}

// Ação principal. Troque para 'Agendar aula experimental' quando a GOFIT confirmar a oferta.
export const CTA = {
  label: 'Agendar visita',
  labelLong: 'Agendar uma visita',
  message: (unit: string, mod?: string | null) =>
    `Olá, GoFit! Quero agendar uma visita na unidade ${unit}.${mod ? ` Tenho interesse em ${mod}.` : ''}`,
};

export const UNITS: Record<UnitKey, Unit> = {
  rz: {
    key: 'rz',
    slug: 'realeza',
    name: 'Realeza',
    short: 'Realeza',
    city: 'Realeza',
    role: 'A origem',
    since: '2016',
    quote: 'A primeira GOFIT. Onde o padrão nasceu.',
    address: 'Rua Belém, 2454',
    district: 'Centro Cívico',
    cep: '85770-000',
    mods: ['Musculação', 'Cross', 'Spinning', 'Fit dance'],
    highlights: ['Primeira unidade da rede, desde 2016', 'Musculação, cross, spinning e fit dance', 'Mascote da casa: o Sheriff, um caramelo'],
    instagram: 'gofit_realeza',
    followers: '4,1 mil',
    maps: 'Rua Belém, 2454, Realeza, PR',
    whatsapp: null,
    hours: null,
    pitch: 'Realeza reúne musculação, cross, spinning e fit dance no mesmo endereço.',
    seoTitle: 'Academia em Realeza · GoFit Premium Gym',
    seoDescription: 'GOFIT Realeza, a primeira unidade da rede. Musculação, cross, spinning e fit dance na Rua Belém, 2454. Agende sua visita pelo WhatsApp.',
    story: {
      title: 'Onde tudo começou.',
      text: 'A GOFIT nasceu em Realeza em 2016. Foi aqui que o padrão da casa tomou forma, antes de chegar a Francisco Beltrão e Pato Branco. Tem até mascote: o Sheriff, um caramelo adotado pela equipe.',
    },
    map: { x: 116, y: 84 },
  },
  fb: {
    key: 'fb',
    slug: 'francisco-beltrao',
    name: 'Francisco Beltrão',
    short: 'F. Beltrão',
    city: 'Francisco Beltrão',
    role: 'A arena',
    since: '2023',
    quote: 'O maior centro de treinamento do Sudoeste.',
    address: 'Av. Luiz Antonio Faedo, 1922',
    district: 'São Cristóvão',
    cep: '85601-275',
    mods: ['Musculação', 'Funcional', 'Fit dance'],
    highlights: ['Estacionamento próprio com cerca de 60 vagas', 'Vestiários com chuveiro', 'Avaliação física com treino personalizado'],
    instagram: 'gofitfb',
    followers: '7,6 mil',
    maps: 'Av. Luiz Antonio Faedo, 1922, Francisco Beltrão, PR',
    whatsapp: null,
    hours: null,
    pitch: 'Em Francisco Beltrão você começa com avaliação física e treino personalizado, e estaciona na porta.',
    seoTitle: 'Academia em Francisco Beltrão · GoFit Premium Gym',
    seoDescription: 'GOFIT Francisco Beltrão: musculação, funcional e fit dance, avaliação física e estacionamento próprio. Av. Luiz Antonio Faedo, 1922. Agende sua visita.',
    story: {
      title: 'Espaço para treinar sem esperar.',
      text: 'Área ampla de musculação, espaço de funcional, estacionamento para cerca de 60 carros e vestiários com chuveiro para você treinar e seguir o dia.',
    },
    map: { x: 321, y: 237 },
  },
  pb: {
    key: 'pb',
    slug: 'pato-branco',
    name: 'Pato Branco',
    short: 'Pato Branco',
    city: 'Pato Branco',
    role: 'O padrão',
    since: '2025',
    quote: 'Uma premium gym no coração de Pato Branco.',
    address: 'Av. Tupi, 1644',
    district: 'Centro',
    cep: '85501-039',
    mods: ['Musculação', 'Personal'],
    highlights: ['Máquinas Panatta, da Itália', 'Linha Real Leader USA', 'Vagas limitadas'],
    instagram: 'gofit_patobranco',
    followers: '4,5 mil',
    maps: 'Av. Tupi, 1644, Pato Branco, PR',
    whatsapp: null,
    hours: null,
    pitch: 'Pato Branco tem máquinas Panatta, da Itália, e Real Leader USA, com vagas limitadas.',
    seoTitle: 'Academia em Pato Branco · GoFit Premium Gym',
    seoDescription: 'GOFIT Pato Branco: máquinas Panatta (Itália) e Real Leader USA no Centro, Av. Tupi, 1644. Vagas limitadas. Agende sua visita pelo WhatsApp.',
    story: {
      title: 'De Roma para o Sudoeste.',
      text: 'Em 2022, em Roma, o fundador teve o primeiro contato com uma Panatta e prometeu que a GOFIT teria uma. Em julho de 2026, as máquinas chegaram a Pato Branco.',
    },
    map: { x: 484, y: 311 },
  },
};

export const UNIT_ORDER: UnitKey[] = ['rz', 'fb', 'pb'];

export interface Modality {
  name: string;
  tag: string;
  text: string;
  units: UnitKey[];
  img?: { base: string; alt: string; pos?: string };
  art?: 'rpm' | 'bpm' | 'one';
}

export const MODALITIES: Modality[] = [
  { name: 'Musculação', tag: 'Peso livre e máquinas', text: 'Hipertrofia, força e condicionamento com equipamento de marca.', units: ['rz', 'fb', 'pb'], img: { base: 'musculacao', alt: 'Fileira de máquinas de musculação pretas e amarelas diante do painel GOFIT', pos: '30% 50%' } },
  { name: 'Funcional', tag: 'Kettlebell e peso do corpo', text: 'Circuitos para ganhar força que você usa fora da academia.', units: ['fb'], img: { base: 'kettlebells', alt: 'Dois kettlebells sob luz lateral', pos: '38% 50%' } },
  { name: 'Cross', tag: 'Barra, anilha e cronômetro', text: 'Treino intenso, com começo, meio e placar.', units: ['rz'], img: { base: 'anilha', alt: 'Anilha e presilha amarela em close', pos: '60% 40%' } },
  { name: 'Spinning', tag: 'Bike e ritmo', text: 'Cardio em grupo, com a carga na sua mão.', units: ['rz'], art: 'rpm' },
  { name: 'Fit dance', tag: 'Coreografia em grupo', text: 'Energia alta do início ao fim. Quem chega tímido sai dançando.', units: ['rz', 'fb'], img: { base: 'fitdance', alt: 'Turma sorrindo e dançando em aula de fit dance sob luzes coloridas', pos: '52% 40%' } },
  { name: 'Personal', tag: 'Um profissional para você', text: 'Atenção total, do aquecimento à última série.', units: ['pb'], art: 'one' },
];

// cta: botão dentro da resposta aberta. 'wa' abre o WhatsApp da unidade; 'page' leva à página da unidade escolhida.
export interface FaqItem { q: string; a: string[]; cta?: { label: string; kind: 'wa' | 'page'; mod?: string } }
export const FAQ: FaqItem[] = [
  {
    q: 'Posso conhecer antes de me matricular?',
    a: ['Claro! Agende uma visita e venha conhecer de perto a estrutura, os equipamentos, as modalidades e o ambiente da GOFIT. Nossa equipe apresenta a unidade e ajuda você a encontrar o treino ideal para os seus objetivos. Escolha a unidade mais próxima e venha viver a experiência GOFIT.'],
    cta: { label: 'Agendar visita', kind: 'wa' },
  },
  {
    q: 'Tem avaliação física?',
    a: ['Sim! A avaliação física identifica seu ponto de partida, suas necessidades e seus objetivos. A partir dela, você recebe um treino personalizado, desenvolvido para tornar sua evolução mais segura, eficiente e alinhada ao resultado que deseja alcançar.'],
    cta: { label: 'Quero começar meu treino', kind: 'wa', mod: 'começar meu treino com avaliação física' },
  },
  {
    q: 'Quais equipamentos vou encontrar?',
    a: [
      'Todas as unidades contam com uma estrutura completa e equipamentos de alto padrão. Em Francisco Beltrão e Realeza, você encontra equipamentos Cimerian, que se destacam pela construção robusta, conforto, estabilidade e movimentos precisos durante o exercício.',
      'São máquinas pensadas para proporcionar uma execução mais segura e eficiente, atendendo tanto quem está começando quanto quem já treina em alta intensidade. Venha conhecer a unidade mais próxima e sentir essa diferença na prática.',
    ],
    cta: { label: 'Conhecer a estrutura', kind: 'page' },
  },
  {
    q: 'Quanto custa?',
    a: ['Os valores variam conforme a unidade e o plano escolhido. Nossa equipe pode apresentar as opções e ajudar você a encontrar a que melhor combina com sua rotina e seus objetivos. Chame no WhatsApp ou agende uma visita para conhecer a academia antes de decidir.'],
    cta: { label: 'Consultar planos e valores', kind: 'wa', mod: 'planos e valores' },
  },
];

// Avaliações do carrossel "A GOFIT por dentro". Só entram falas reais de alunos.
// Para adicionar: { text, who, source } — who pode ser só o primeiro nome ou "Aluno(a)".
export const REVIEWS: { text: string; who: string; source: string }[] = [
  { text: 'Estrutura padrão ouro.', who: 'Aluno(a) GOFIT', source: 'Comentário no Instagram' },
  { text: 'Um sonho de academia.', who: 'Aluno(a) GOFIT', source: 'Comentário no Instagram' },
  { text: 'Impecável.', who: 'Aluno(a) GOFIT', source: 'Comentário no Instagram' },
  { text: 'A top 1 de Pato, sem igual.', who: 'Aluno(a) GOFIT', source: 'Comentário no Instagram' },
  { text: 'Uma verdadeira Premium Gym.', who: 'Aluno(a) GOFIT', source: 'Comentário no Instagram' },
  { text: 'Academia totalmente diferenciada, não tem nada igual.', who: 'Aluno(a) GOFIT', source: 'Comentário no Instagram' },
  { text: 'A melhor do Sudoeste.', who: 'Aluno(a) GOFIT', source: 'Comentário no Instagram' },
];

export const LEGAL = [
  { unit: 'Realeza', cnpj: '26.602.646/0001-32' },
  { unit: 'Francisco Beltrão', cnpj: '49.732.586/0001-78' },
  { unit: 'Pato Branco', cnpj: '62.159.577/0001-06' },
];

// A mensagem vai exatamente como o aluno a vê, sem marcação de origem no fim.
export function waHref(key: UnitKey, text: string, _origin?: string) {
  const u = UNITS[key];
  return `${u.whatsapp ? `https://wa.me/${u.whatsapp}` : 'https://wa.me/'}?text=${encodeURIComponent(text)}`;
}

export function mapsHref(key: UnitKey) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('GOFIT ' + UNITS[key].maps)}`;
}
