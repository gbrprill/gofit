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
    `Olá, GOFIT! Quero agendar uma visita na unidade ${unit}.${mod ? ` Tenho interesse em ${mod}.` : ''}`,
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
    highlights: ['Primeira unidade da rede, desde 2016', 'Musculação, cross, spinning e fit dance', 'Aroma próprio no ambiente'],
    instagram: 'gofit_realeza',
    followers: '4,1 mil',
    maps: 'Rua Belém, 2454, Realeza, PR',
    whatsapp: null,
    hours: null,
    pitch: 'Realeza reúne musculação, cross, spinning e fit dance no mesmo endereço.',
    seoTitle: 'Academia em Realeza · GOFIT Premium Gym',
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
    seoTitle: 'Academia em Francisco Beltrão · GOFIT Premium Gym',
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
    seoTitle: 'Academia em Pato Branco · GOFIT Premium Gym',
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
  { name: 'Musculação', tag: 'Peso livre e máquinas', text: 'Hipertrofia, força e condicionamento com equipamento de marca.', units: ['rz', 'fb', 'pb'], img: { base: 'halter', alt: 'Halter sextavado e anilhas empilhadas no piso de borracha', pos: '40% 50%' } },
  { name: 'Funcional', tag: 'Kettlebell e peso do corpo', text: 'Circuitos para ganhar força que você usa fora da academia.', units: ['fb'], img: { base: 'kettlebells', alt: 'Dois kettlebells sob luz lateral', pos: '38% 50%' } },
  { name: 'Cross', tag: 'Barra, anilha e cronômetro', text: 'Treino intenso, com começo, meio e placar.', units: ['rz'], img: { base: 'anilha', alt: 'Anilha e presilha amarela em close', pos: '60% 40%' } },
  { name: 'Spinning', tag: 'Bike e ritmo', text: 'Cardio em grupo, com a carga na sua mão.', units: ['rz'], art: 'rpm' },
  { name: 'Fit dance', tag: 'Coreografia em grupo', text: 'Energia alta do início ao fim. Quem chega tímido sai dançando.', units: ['rz', 'fb'], art: 'bpm' },
  { name: 'Personal', tag: 'Um profissional para você', text: 'Atenção total, do aquecimento à última série.', units: ['pb'], art: 'one' },
];

export const POSTS = [
  { date: '28 jul 2026', unit: 'Pato Branco', title: 'A chegada da Panatta', url: 'https://www.instagram.com/p/DbVySNUTO1i/' },
  { date: '24 jul 2026', unit: 'F. Beltrão', title: 'Tour pela estrutura', url: 'https://www.instagram.com/p/DbLWdx6hWta/' },
  { date: '13 jun 2026', unit: 'Realeza', title: 'Novo layout a caminho', url: 'https://www.instagram.com/p/DZh4290kdi3/' },
  { date: '24 nov 2025', unit: 'Pato Branco', title: 'A inauguração', url: 'https://www.instagram.com/p/DRdBDmOEujj/' },
];

export const FAQ = [
  { q: 'Posso conhecer antes de me matricular?', a: 'Pode. Escolha a unidade, chame no WhatsApp e combine o melhor horário para visitar.' },
  { q: 'Tem estacionamento?', a: 'Em Francisco Beltrão, sim: estacionamento próprio com cerca de 60 vagas. Nas outras unidades, pergunte à equipe.' },
  { q: 'Tem avaliação física?', a: 'Em Francisco Beltrão, a avaliação física vem com treino personalizado. Nas outras unidades, consulte no WhatsApp.' },
  { q: 'Quais equipamentos vou encontrar?', a: 'Pato Branco tem máquinas Panatta, da Itália, e a linha Real Leader USA. Todas as unidades têm peso livre e máquinas de musculação.' },
  { q: 'Quanto custa?', a: 'Cada unidade tem seus planos. Chame a unidade no WhatsApp e monte o plano certo para a sua rotina.' },
];

export const COMMENTS = ['Estrutura padrão ouro', 'Um sonho de academia', 'Impecável'];

export const LEGAL = [
  { unit: 'Realeza', cnpj: '26.602.646/0001-32' },
  { unit: 'Francisco Beltrão', cnpj: '49.732.586/0001-78' },
  { unit: 'Pato Branco', cnpj: '62.159.577/0001-06' },
];

export function waHref(key: UnitKey, text: string, origin?: string) {
  const u = UNITS[key];
  const full = origin ? `${text}\n\n#site-${origin}` : text;
  return `${u.whatsapp ? `https://wa.me/${u.whatsapp}` : 'https://wa.me/'}?text=${encodeURIComponent(full)}`;
}

export function mapsHref(key: UnitKey) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('GOFIT ' + UNITS[key].maps)}`;
}
