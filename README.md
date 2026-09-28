# GOFIT Premium Gym

Site do CT de treinamento premium GOFIT, com unidades em Realeza, Francisco Beltrão e Pato Branco (PR).

Site estático: um `index.html` com imagens em `img/`. Não precisa de build. A Vercel publica direto da raiz.

## Onde editar

- **WhatsApp e horários das unidades:** no `index.html`, procure `var UNITS=` e preencha `wa` (só dígitos, com 55 e DDD, ex.: `5546999999999`) e `hours` de cada unidade.
- **Itens "a confirmar":** procure `class="pend"` para achar todos os conteúdos que dependem de confirmação da GOFIT.
- **Imagens:** as de `img/` são renders ilustrativos. Troque pelas fotos reais mantendo os mesmos nomes de arquivo.

## Publicação

Cada `git push` na branch `main` publica automaticamente na Vercel.
