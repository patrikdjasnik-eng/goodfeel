# Goodfeel — vývoj, roadmapa a náklady

> Interní vývojový dokument pro plánování Goodfeel.
>
> Aktualizováno: 30. 9. 2026  
> Aktivní vývojová větev: `dev/first-runnable`

## Účel dokumentu

Tento soubor průběžně mapuje:

- aktuální stav produktu,
- dokončené části,
- práci zbývající do první veřejné verze,
- odhad vývojových hodin,
- reálné náklady placené z kapsy,
- orientační hodnotu odvedené vývojářské práce,
- budoucí provozní náklady,
- rozhodnutí, která mohou rozpočet výrazně změnit.

Částky jsou plánovací odhady, ne účetní nebo smluvní kalkulace. Před placeným nasazením se mají ceny konkrétních poskytovatelů znovu ověřit.

## Aktuální stav

Aktuální milník:

`Developer Preview 0.1 — první lokálně spustitelná verze`

Stav cesty k první veřejné betě:

`orientačně 30–40 %`

Goodfeel už není pouze UI koncept. Současná verze má funkční frontendovou aplikační vrstvu a lokální persistenci, ale zatím nemá produkční backend ani serverovou autoritu.

## Co už je hotové

### Produkt a UI

- schválený vizuální směr Goodfeel,
- login obrazovka,
- registrace,
- hlavní dashboard,
- levá navigace,
- horní vyhledávání,
- pravý profilový panel,
- trendy,
- Proof of Work panel,
- responzivní mobilní rozhraní,
- vlastní Goodfeel project badge,
- README technologické badge.

### Obsah sítě

Uživatel může lokálně:

- vytvořit účet,
- přihlásit se,
- odhlásit se,
- procházet feed,
- vyhledávat ve feedu,
- filtrovat obsah,
- vytvořit příspěvek,
- vytvořit projekt,
- nabídnout službu,
- zveřejnit pracovní příležitost,
- přidat tagy,
- reagovat pomocí Like,
- vidět stav projektu,
- vidět `pending` a `verified` Proof of Work stav.

### Technický základ

- React 18,
- TypeScript 5,
- Vite 5,
- CSS3,
- IndexedDB,
- lokální session,
- Service Worker,
- PWA manifest,
- lazy loading hlavních obrazovek,
- loading a error bootstrap,
- oddělená PWA registrace,
- ochrana vývoje proti stale Service Worker cache.

## Co je zatím pouze připravené v UI

Tyto části jsou viditelné nebo naznačené, ale zatím nejsou plnohodnotně implementované:

- zprávy,
- komentáře a vlákna,
- sdílení,
- uložené položky,
- komunity,
- události,
- notifikace,
- veřejné profily,
- follow systém,
- firemní profily,
- samostatné stránky projektů,
- samostatné stránky služeb,
- samostatné stránky pracovních nabídek.

## Cíl první veřejné verze

První veřejná verze nemá obsahovat všechno, co je ve finální vizi Goodfeel.

Cíl je:

`Goodfeel Public Beta 0.1`

Uživatel musí být schopný bezpečně přijít na web, založit účet, vytvořit profil, publikovat obsah a vrátit se později ke stejným datům z jiného zařízení.

### Minimum před otevřením lidem

- produkční backend,
- PostgreSQL,
- produkční registrace a přihlášení,
- bezpečné ukládání hesel nebo externí Auth provider,
- ověření e-mailu,
- reset hesla,
- skutečné veřejné uživatelské profily,
- persistentní feed uložený na serveru,
- serverové příspěvky,
- serverové projekty,
- serverové služby,
- serverové pracovní příležitosti,
- likes,
- komentáře,
- základní follow systém,
- serverová autorita pro Proof of Work,
- základní reportování závadného obsahu,
- rate limiting,
- validace a sanitace vstupů,
- základní audit log,
- bezpečné environment variables,
- error logging,
- zálohování databáze,
- produkční doména,
- HTTPS,
- základní monitoring,
- privacy/terms minimum podle způsobu provozu.

## Co není nutné pro Public Beta 0.1

Tyto funkce je vhodné nechat až po prvních uživatelích:

- plnohodnotný chat,
- WebSocket realtime messaging,
- komunity,
- události,
- pokročilé notifikace,
- mobilní native aplikace,
- firemní administrace,
- placené účty,
- marketplace payments,
- doporučovací algoritmus,
- AI matching,
- AI moderace,
- rozsáhlé analytické dashboardy.

Tím se snižují náklady a riziko vývoje funkcí, které uživatelé nemusí chtít.

## Doporučená architektura Public Beta

### Frontend

- React,
- TypeScript,
- Vite,
- PWA,
- CSS3.

### Backend

Preferovaná jednoduchá varianta pro první veřejnou verzi:

- FastAPI,
- PostgreSQL,
- SQLAlchemy nebo SQLModel,
- REST API,
- serverová validace,
- rate limiting,
- audit log.

Alternativní plně TypeScript varianta:

- Node.js / TypeScript,
- Prisma,
- PostgreSQL.

Pro jednu backendovou vrstvu se má zvolit jeden hlavní přístup. FastAPI a Prisma není potřeba kombinovat jen kvůli použití obou technologií.

## Odhad zbývající práce do Public Beta

| Oblast | Odhad |
| --- | ---: |
| Datový model + PostgreSQL | 6–12 h |
| Backend API základ | 10–18 h |
| Produkční autentizace | 8–14 h |
| Profily | 5–10 h |
| Přesun feedu z IndexedDB na API | 6–10 h |
| Projekty / služby / práce | 5–10 h |
| Likes + komentáře | 5–9 h |
| Follow systém | 4–7 h |
| Proof of Work serverová logika | 6–12 h |
| Validace, sanitace, rate limiting | 5–10 h |
| Reportování obsahu | 3–6 h |
| Error handling + logging | 3–6 h |
| Deployment + environment | 3–7 h |
| Testy kritických workflow | 6–12 h |
| Finální mobilní QA | 3–5 h |

Celkový orientační rozsah:

`60–120 hodin`

Rozsah je záměrně široký. Při změnách scope nebo při přidání messagingu před veřejným spuštěním se může výrazně zvýšit.

## Hodnota vývoje

Pro interní plánování lze počítat s referenční vývojářskou sazbou:

`1 650 Kč / hod`

Při zbývajících 60–120 hodinách:

| Varianta | Hodiny | Orientační hodnota |
| --- | ---: | ---: |
| Spodní odhad | 60 h | 99 000 Kč |
| Střed | 90 h | 148 500 Kč |
| Horní odhad | 120 h | 198 000 Kč |

To není nutně částka, kterou Goodfeel skutečně zaplatí. Jde o odhad hodnoty práce, pokud by byla účtována externě touto sazbou.

## Reálné peníze do prvního spuštění

Protože je vývoj prováděný interně, hlavní hotovostní náklady tvoří infrastruktura a doména.

### Jednorázově / při startu

| Položka | Orientační rozpočet |
| --- | ---: |
| Doména | 200–500 Kč |
| Základní produkční nastavení | 0 Kč při vlastním vývoji |
| Drobné služby / testovací výdaje | 0–2 000 Kč |
| Rezerva | 1 000–2 500 Kč |

Doporučený hotovostní rozpočet do prvního veřejného spuštění:

`2 000–5 000 Kč`

## Měsíční provoz Public Beta

### Úsporná beta

Při použití free tierů a malé návštěvnosti:

`orientačně 0–500 Kč / měsíc`

Vhodné pouze pro první testovací uživatele a podle podmínek konkrétních služeb.

### Stabilnější veřejná beta

Při placeném hostingu/databázi a rezervě na e-mail nebo monitoring:

`orientačně 1 000–2 000 Kč / měsíc`

### Co může náklady později zvednout

- rychle rostoucí počet uživatelů,
- fotografie a video,
- velký počet API requestů,
- realtime chat,
- WebSocket infrastruktura,
- vysoký e-mailový provoz,
- fulltextové vyhledávání,
- AI inference,
- moderace,
- analytika,
- observability,
- větší databáze,
- zálohy,
- CDN a object storage.

## Náklady, které teď nechceme

Před validací produktu není důvod platit za:

- Kubernetes,
- vlastní velké servery,
- microservices architekturu,
- drahý AI cluster,
- enterprise monitoring,
- samostatné mobilní aplikace,
- velký tým,
- komplikovaný event streaming,
- více databázových technologií bez jasného důvodu.

První verze má být jednoduchá, auditovatelná a levná.

## Vývojové milníky

### Milník 0 — UI koncept

Stav: `HOTOVO`

- základní produktová vize,
- referenční UI,
- login/dashboard design.

### Milník 1 — Developer Preview 0.1

Stav: `HOTOVO / aktivní kontrola`

- lokální aplikace,
- IndexedDB,
- session,
- feed,
- composer,
- projekty,
- služby,
- práce,
- Proof of Work demo,
- PWA základ,
- responsive UI.

### Milník 2 — Backend Foundation

Stav: `ČEKÁ`

- PostgreSQL,
- API,
- migrations,
- produkční auth,
- modely uživatelů a obsahu.

### Milník 3 — Social Core

Stav: `ČEKÁ`

- profily,
- follow,
- comments,
- likes,
- serverový feed,
- základní notifikace.

### Milník 4 — Trust Layer

Stav: `ČEKÁ`

- serverový Proof of Work,
- potvrzení klientem,
- audit trail,
- reporting,
- moderation minimum.

### Milník 5 — Public Beta 0.1

Stav: `ČEKÁ`

- produkční deploy,
- doména,
- HTTPS,
- monitoring,
- backup,
- test kritických cest,
- první reální uživatelé.

### Milník 6 — Post-beta

Stav: `BUDOUCNOST`

Podle chování skutečných uživatelů se rozhodne o:

- zprávách,
- komunitách,
- událostech,
- AI matchingu,
- firemních účtech,
- monetizaci,
- dalších typech reputace.

## Pravidlo pro další vývoj

Každá větší funkce by měla před implementací odpovědět na tři otázky:

1. Potřebujeme ji před Public Beta?
2. Pomůže ověřit hlavní myšlenku Goodfeel?
3. Zvyšuje zásadně infrastrukturu, bezpečnostní riziko nebo provozní cenu?

Pokud je odpověď na první dvě otázky `ne`, funkce se přesouvá za Public Beta.

## Evidence nákladů

Od začátku placeného provozu zapisovat reálné náklady sem:

| Datum | Služba | Účel | Jednorázově | Měsíčně | Poznámka |
| --- | --- | --- | ---: | ---: | --- |
| — | — | — | — | — | Zatím bez zaznamenaných produkčních výdajů |

## Evidence odpracovaného vývoje

Pro přesnější hodnotu projektu lze průběžně zapisovat větší bloky práce:

| Datum | Oblast | Hodiny | Referenční sazba | Hodnota |
| --- | --- | ---: | ---: | ---: |
| — | — | — | 1 650 Kč/h | — |

## Definition of Done — Public Beta 0.1

Goodfeel je připravený pro první veřejné uživatele, až když:

- registrace funguje na čistém zařízení,
- login funguje na čistém zařízení,
- reset hesla funguje,
- uživatel může upravit svůj profil,
- příspěvek se uloží na server,
- projekt se uloží na server,
- služba se uloží na server,
- pracovní nabídka se uloží na server,
- data jsou dostupná po přihlášení z jiného zařízení,
- uživatel může komentovat,
- uživatel může reagovat,
- Proof of Work nelze lokálně podvrhnout,
- server validuje vstupy,
- základní abuse ochrana je aktivní,
- produkční secrets nejsou ve frontend bundle ani v repu,
- existuje záloha databáze,
- kritická chyba je dohledatelná v logu,
- mobilní i desktopová verze projdou základním QA,
- aplikace má veřejnou HTTPS adresu.

Až potom označit stav:

`Goodfeel Public Beta 0.1 — OPEN`
