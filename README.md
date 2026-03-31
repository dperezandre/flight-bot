# ✈️ FlightBot — Caçador de Passagens

Bot que busca o voo mais barato por dia para um trecho e período escolhidos.

## Pré-requisitos

- Node.js 18+
- Conta na [SerpAPI](https://serpapi.com) (plano gratuito: 100 buscas/mês)

## Instalação

```bash
cd flight-bot
npm install
```

## Configuração

1. Crie uma conta em https://serpapi.com e copie sua API Key
2. Configure a chave de uma dessas formas:

**Opção A — Variável de ambiente (recomendado):**
```bash
SERPAPI_KEY=sua_chave_aqui node server.js
```

**Opção B — Arquivo .env (instale dotenv):**
```bash
npm install dotenv
```
Crie `.env`:
```
SERPAPI_KEY=sua_chave_aqui
```
Adicione no topo do `server.js`:
```js
require('dotenv').config();
```

**Opção C — Edite direto no server.js:**
```js
const SERPAPI_KEY = 'sua_chave_aqui';
```

## Como usar

```bash
npm start
# ou em modo dev:
npm run dev
```

Acesse: http://localhost:3000

## Como funciona

1. Informe o código IATA de origem (ex: `GRU`)
2. Informe o código IATA de destino (ex: `MIA`)
3. Informe quantos dias para frente quer buscar (1–60)
4. O bot consulta o Google Flights via SerpAPI para cada dia
5. Exibe todos os voos por data, do mais barato ao mais caro
6. Destaca o voo mais barato de todos os dias

## Estrutura

```
flight-bot/
├── server.js        # Backend Express + SerpAPI
├── package.json
└── public/
    └── index.html   # Interface web
```

## Códigos IATA comuns (Brasil)

| Cidade | IATA |
|--------|------|
| São Paulo (Guarulhos) | GRU |
| São Paulo (Congonhas) | CGH |
| Rio de Janeiro (Galeão) | GIG |
| Rio de Janeiro (Santos Dumont) | SDU |
| Brasília | BSB |
| Belo Horizonte | CNF |
| Salvador | SSA |
| Recife | REC |
| Fortaleza | FOR |
| Manaus | MAO |
| Porto Alegre | POA |
| Curitiba | CWB |
