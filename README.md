# GOFIT Premium Gym

Site da GOFIT Premium Gym, centro de treinamento premium com unidades em Realeza, Francisco Beltrão e Pato Branco (PR).

Feito com [Astro](https://astro.build) e [GSAP](https://gsap.com). Publicado na Vercel: cada `git push` na branch `main` atualiza o site.

## Páginas

| Rota | Conteúdo |
| --- | --- |
| `/` | Home: abertura, placar, manifesto, método, modalidades, teste "Qual treino é o seu?", estrutura, calculadora de carga, unidades, comunidade, primeira vez e FAQ |
| `/realeza/`, `/francisco-beltrao/`, `/pato-branco/` | Página de cada unidade, otimizada para buscas como "academia em Pato Branco" |
| `/404` | Página não encontrada |

## Onde editar

Quase tudo o que muda fica em **`src/data/site.ts`**:

- `whatsapp` de cada unidade: só dígitos, com 55 e DDD (ex.: `5546999999999`). Enquanto estiver `null`, os botões abrem o WhatsApp com a mensagem pronta, mas sem contato definido.
- `hours` de cada unidade: quando preenchido, aparece na seção Unidades e na página da cidade.
- `CTA.label`: texto do botão principal. Hoje é "Agendar visita". Troque para "Agendar aula experimental" quando a GOFIT confirmar a oferta.
- `MODALITIES`, `FAQ`, `POSTS`: modalidades, perguntas frequentes e posts do Instagram.

Imagens ficam em `public/img/` em WebP e JPG, em várias larguras. As atuais são renders 3D ilustrativos. Troque pelas fotos reais mantendo os mesmos nomes.

## Pendências com a GOFIT

Nada disso aparece no site até ser confirmado:

- [ ] WhatsApp de cada unidade (ou central) e quem responde
- [ ] Horário de funcionamento de cada unidade
- [ ] Existe aula experimental? É gratuita? (muda o botão principal)
- [ ] Confirmar os endereços de F. Beltrão e Pato Branco, que vieram do cadastro de CNPJ
- [ ] Validar as 4 etapas do Método (Avaliação, Plano, Execução, Reavaliação)
- [ ] Marcas de equipamento de Realeza e F. Beltrão
- [ ] Equipe: nomes, fotos, registro no CREF e autorização de imagem (a seção de equipe volta quando houver fotos)
- [ ] Planos e preços, e se o Plano Estudante de Pato Branco continua valendo
- [ ] Fotos e vídeos reais das três unidades em alta resolução
- [ ] Domínio próprio (ex.: gofitpremiumgym.com.br)

## Rodar localmente

```bash
npm install
npm run dev
```
