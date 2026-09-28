# Design

Documenta o sistema visual em uso. Tokens em `src/styles/global.css`.

## Mundo

CT de treinamento premium: preto de academia à noite, luz lateral dura, piso de borracha, e o amarelo da marca usado como sinal, nunca como fundo de tudo. A origem de todos os elementos é a logo: a barra amarela com 5 estrelas, e o "E" de três barras de PREMIUM.

## Cor

| Token | Valor | Uso |
| --- | --- | --- |
| `--bg` | #0a0a09 | Fundo padrão |
| `--s1` / `--s2` / `--s3` | #111110 / #161614 / #1e1d1b | Seções alternadas, cartões, hover |
| `--line` / `--line2` | #2a2926 / #3d3c38 | Divisores e bordas |
| `--t1` / `--t2` / `--t3` | #fff / #bab8b2 / #8e8c86 | Texto principal, secundário, rótulos |
| `--y` | #ffcc2a | Ação principal, palavra de destaque, placar, barra |

Amarelo sobre preto (13,9:1) sempre. Amarelo sobre branco nunca (1,5:1). Botão amarelo leva texto preto.

## Tipografia

- **Montserrat Variable 900**, caixa-alta: títulos. A mais próxima da letra do "GOFIT". Título principal com no máximo 6rem.
- **Barlow Condensed 600–800**: rótulos, botões e números.
- **Barlow 400–600**: texto corrido.
- Todas hospedadas no próprio site via Fontsource.

## Elementos da marca

- **Barra com 5 estrelas:** no pé da abertura, no selo "Padrão GOFIT" e no medidor do manifesto.
- **Três barras:** o ícone do menu e os marcadores de lista.
- **Placar de 7 segmentos:** números no estilo do cronômetro de parede de um CT.

## Movimento

A gramática é a **varredura** (wipe), tirada da barra da logo:

- a barra amarela passa sobre o título e o revela;
- os botões se preenchem da esquerda para a direita;
- as imagens se revelam por recorte;
- as abas e os cartões ganham a linha amarela.

Momentos com autoria:

1. A abertura: varredura do título e depois a luz que segue o cursor sobre a barra.
2. O manifesto, que acende palavra por palavra com a rolagem.
3. As modalidades, em trilho horizontal no computador.
4. O placar, que conta como cronômetro.
5. As anilhas entrando na barra da calculadora.

Curva padrão `cubic-bezier(.16, 1, .3, 1)`; varreduras em `cubic-bezier(.76, 0, .24, 1)`. Tudo tem alternativa com `prefers-reduced-motion`.

## Forma

Cantos retos em tudo. Nada de sombras decorativas, vidro, gradiente em texto ou rótulo acima de título.
