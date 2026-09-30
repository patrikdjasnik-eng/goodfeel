<img width="1672" height="941" alt="good feel login" src="https://github.com/user-attachments/assets/2ffe2421-4148-469f-aef0-5a185e466807" />
<img width="1672" height="941" alt="goodfeel home page" src="https://github.com/user-attachments/assets/4cdbb3f7-0546-44a4-84ef-c01d1294097d" />
# Goodfeel

Goodfeel je připravovaná sociální síť, která kombinuje rychlost a přirozenost konverzací ve stylu Threads s profesní hloubkou LinkedInu. Hlavní rozdíl je v důrazu na skutečnou práci: projekty, služby, pracovní příležitosti a reputaci postavenou na ověřitelných výsledcích.

## Vize

Goodfeel má být místo, kde lidé mohou:

- sdílet krátké příspěvky, zkušenosti a postup práce,
- zveřejnit projekt a průběžně ukazovat jeho stav,
- nabídnout vlastní služby,
- vložit pracovní nabídku nebo poptávku po spolupráci,
- nechat dokončený projekt potvrdit klientem,
- budovat `Proof of Work` místo prázdných skill endorsementů,
- najít lidi podle toho, co skutečně vytvořili.

## MVP 0.1

První verze je frontendová webová aplikace/PWA. Je záměrně bez produkčního backendu, aby šlo rychle ověřit produkt, UX a základní workflow.

Aktuálně obsahuje:

- přihlášení a registraci,
- lokální demo účet,
- responzivní Goodfeel dashboard,
- feed s filtry,
- příspěvky, projekty, služby a pracovní příležitosti,
- vytváření nového obsahu,
- `Proof of Work` stav projektu,
- rozlišení `čeká na potvrzení klientem` / `potvrzeno klientem`,
- reakce na příspěvky,
- vyhledávání ve feedu,
- ukládání dat do IndexedDB,
- session v prohlížeči,
- základní PWA manifest a service worker,
- mobilní layout.

### Demo účet

```text
E-mail: demo@goodfeel.local
Heslo: goodfeel
```

Registrace funguje také. Účty vytvořené v MVP zůstávají pouze v daném prohlížeči.

## Stack

- React 18
- TypeScript
- Vite
- IndexedDB
- Service Worker
- CSS3 bez UI frameworku
- Lucide icons

## Lokální spuštění

Požadavky: Node.js 20+ a npm.

```bash
npm install
npm run dev
```

Aplikace poběží standardně na `http://localhost:5173`.

Produkční build:

```bash
npm run build
npm run preview
```

## Architektura další fáze

MVP záměrně neřeší produkční autentizaci ani serverovou autoritu nad ověřením projektů. Další fáze má oddělit frontend od API a přesunout citlivé operace na server.

Plánované oblasti:

- API a produkční autentizace,
- PostgreSQL databáze,
- bezpečné klientské potvrzování dokončených projektů,
- profily a veřejné portfolio,
- follow systém,
- komentáře a vlákna,
- zprávy,
- firemní a klientské profily,
- moderace, rate limiting a audit log,
- AI matching mezi poptávkou a lidmi podle skutečných projektů,
- notifikace a realtime aktualizace.

Pokud zůstane backend v Pythonu, dává smysl FastAPI + PostgreSQL + SQLAlchemy/SQLModel. Pokud se rozhodneme pro plně TypeScript backend, databázová vrstva může přejít na Prisma. Tyto dvě varianty není vhodné míchat v jednom serveru jen kvůli použití konkrétní knihovny.

## Důvěra a Proof of Work

Uživatel si může vytvořit projekt sám, ale tím se projekt nestává ověřeným. Nově vytvořený projekt má stav `pending`. Stav `verified` má v budoucnu vzniknout pouze serverovým potvrzením od klienta nebo oprávněné organizace.

Tím se odděluje:

- co o sobě člověk tvrdí,
- co skutečně zveřejnil,
- co potvrdil zákazník.

## Stav projektu

`MVP 0.1 — aktivní vývoj`
