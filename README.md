# Goodfeel

<p>
  <img src="./public/goodfeel-badge.svg" alt="Goodfeel MVP 0.1 DEV" height="36" />
</p>

<p>
  <img src="https://img.shields.io/badge/React-18-14192B?style=flat-square&logo=react&logoColor=61DAFB" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5-14192B?style=flat-square&logo=typescript&logoColor=3178C6" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Vite-5-14192B?style=flat-square&logo=vite&logoColor=9A7BFF" alt="Vite 5" />
  <img src="https://img.shields.io/badge/CSS3-UI-14192B?style=flat-square&logo=css3&logoColor=815CFF" alt="CSS3" />
  <img src="https://img.shields.io/badge/IndexedDB-Local--first-14192B?style=flat-square&logo=googlechrome&logoColor=61D7A1" alt="IndexedDB" />
  <img src="https://img.shields.io/badge/PWA-Service%20Worker-14192B?style=flat-square&logo=pwa&logoColor=9A7BFF" alt="PWA" />
</p>

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

## Developer Preview 0.1

První spustitelná verze je zatím určená pro lokální vývoj a ověření produktu. Nemá produkční backend a nepředstírá serverovou autoritu tam, kde zatím neexistuje.

Aktuálně obsahuje:

- přihlášení a registraci,
- lokální demo účet,
- session uloženou v prohlížeči,
- responzivní Goodfeel dashboard,
- feed s vyhledáváním a filtry,
- příspěvky, projekty, služby a pracovní příležitosti,
- vytváření nového obsahu,
- `Proof of Work` stav projektu,
- rozlišení `čeká na potvrzení klientem` / `potvrzeno klientem`,
- reakce na příspěvky,
- data uložená v IndexedDB,
- lazy loading hlavních obrazovek,
- základní PWA manifest a service worker,
- mobilní layout,
- bezpečnější dev režim bez stale service-worker cache,

### Demo účet

```text
E-mail: demo@goodfeel.local
Heslo: goodfeel
```

Registrace funguje také. Účty vytvořené v této verzi zůstávají pouze v daném prohlížeči.

## Referenční UI

Dashboard:

<img width="1672" height="941" alt="goodfeel home page" src="https://github.com/user-attachments/assets/4cdbb3f7-0546-44a4-84ef-c01d1294097d" />

Přihlášení:

<img width="1672" height="941" alt="good feel login" src="https://github.com/user-attachments/assets/2ffe2421-4148-469f-aef0-5a185e466807" />

UI používá tmavý pracovní prostor, jemné glass panely a fialový Goodfeel accent. Stejný vizuální jazyk používá i vlastní project badge v horní části README.

## Stack

- React 18
- TypeScript 5
- Vite 5
- IndexedDB
- Service Worker / PWA
- CSS3 bez UI frameworku
- Lucide React

## Lokální spuštění

Požadavky: Node.js 20+ a npm.

```bash
git clone https://github.com/patrikdjasnik-eng/goodfeel.git
cd goodfeel
git checkout dev/first-runnable
npm install
npm run dev
```

Aplikace poběží standardně na:

```text
http://localhost:5173
```

Demo přihlášení:

```text
demo@goodfeel.local
goodfeel
```

Produkční build a lokální preview:

```bash
npm run build
npm run preview
```

Při `npm run dev` se případná starší registrace Goodfeel service workeru odregistruje, aby vývoj nezobrazoval zastaralé cachované soubory. Service worker se registruje v produkčním buildu.

## Architektura první verze

```text
src/
├── App.tsx
├── main.tsx
├── styles.css
├── types.ts
├── components/
│   ├── Composer.tsx
│   ├── Dashboard.tsx
│   ├── FeedCard.tsx
│   └── LoginScreen.tsx
├── data/
│   └── demo.ts
└── lib/
    ├── pwa.ts
    └── storage.ts

public/
├── goodfeel-badge.svg
├── icon.svg
├── manifest.webmanifest
└── sw.js
```

`App.tsx` je aplikační bootstrap: inicializuje IndexedDB, načte feed, obnoví session a přepíná mezi loginem a dashboardem. Citlivé budoucí operace, zejména potvrzování projektů klientem, zůstávají mimo lokální autoritu.

## Vývoj a náklady

Průběžná roadmapa, odhady práce, rozpočet do veřejné bety a evidence budoucích provozních nákladů jsou v:

[`docs/development/ROADMAP_AND_COSTS.md`](./docs/development/ROADMAP_AND_COSTS.md)

## Architektura další fáze

Další fáze má oddělit frontend od API a přesunout citlivé operace na server.

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

`Developer Preview 0.1 — první spustitelná lokální verze`
