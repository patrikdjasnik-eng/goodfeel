# DEV-NOTES

<p>
  <img src="./public/goodfeel-badge.svg" alt="Goodfeel DEV Notes" height="36" />
</p>

<p>
  <img src="https://img.shields.io/badge/Branch-dev%2Ffirst--runnable-14192B?style=flat-square&logo=git&logoColor=9A7BFF" alt="Branch dev/first-runnable" />
  <img src="https://img.shields.io/badge/Status-Active%20Development-14192B?style=flat-square&logo=github&logoColor=61D7A1" alt="Active Development" />
  <img src="https://img.shields.io/badge/Focus-Workmoji%20%7C%20Feed%20%7C%20E2EE%20Messages-14192B?style=flat-square&logo=protonmail&logoColor=9A7BFF" alt="Workmoji Feed E2EE Messages" />
  <img src="https://img.shields.io/badge/Updated-2026--09--30-14192B?style=flat-square&logo=markdown&logoColor=61DAFB" alt="Updated 2026-09-30" />
</p>

Vývojový deník projektu Goodfeel  
Větev: `dev/first-runnable`  
Datum: 2026-09-30

## Cíl dne

Dnešním cílem bylo posunout první spustitelnou verzi Goodfeelu z funkčního prototypu blíž k produktu, který má vlastní vizuální identitu, základní správu obsahu a první použitelný systém soukromých zpráv.

Práce probíhala po vrstvách:

1. sjednocení a dotažení Workmoji,
2. správa vlastních statusů,
3. první verze soukromých zpráv,
4. základ bezpečnostního modelu,
5. sjednocení avatarů napříč aplikací.

Toto pořadí bylo zvoleno záměrně. Nejprve se stabilizoval vizuální jazyk existujících prvků, následně se doplnily chybějící základní interakce feedu a až potom se přidala nová větší funkce – zprávy. Tím se snižovalo riziko, že nový modul bude stavět na ještě nestabilním UI.

---

## 1. Workmoji – přechod z ikon na vlastní vizuální systém

### Původní stav

Workmoji už existovaly a fungovaly v pickeru i ve feedu, ale vizuálně působily spíš jako sada samostatných line ikon než jako vlastní identita Goodfeelu.

Hlavní problémy:

- rozdílná optická hmotnost jednotlivých symbolů,
- příliš generické motivy,
- různá úroveň detailu,
- nejednotný glow,
- některé symboly působily výrazně slabší než jiné,
- při malém zobrazení nebyla sada dostatečně konzistentní.

### Zvolený postup

Místo dalšího zesilování glow nebo jednoduchých kosmetických změn byl zaveden společný „artifact“ systém.

Každá Workmoji nyní staví na stejných principech:

- společný shell,
- aura,
- hlavní glyph,
- jemný glint,
- mikro detail,
- konzistentnější optická hmotnost,
- individuální tuning velikosti a pozice glyphu.

Důvodem tohoto přístupu bylo zabránit tomu, aby se sada dál rozcházela kus po kusu. Každá ikona může být originální, ale zároveň musí být na první pohled součástí stejného systému.

### Co bylo upraveno

Přepracovány byly mimo jiné:

- Good Spark,
- Proof,
- Flow,
- Brainhit,
- Stackling,
- Bugbite,
- Mergey,
- Green Build,
- Pixel Bloom,
- Perfect Curve,
- Grid Soul,
- Thinkloop,
- Agent Awake,
- Context Full,
- Ghostwall,
- Zero Trace,
- Hunt Mark,
- Client Glow,
- Scope Clear,
- Delivered,
- Flowlock,
- Route Pulse,
- Zero Backlog,
- Respect Pulse,
- Good Vibe,
- Support Link.

Každý glyph má nyní vlastní optický tuning.

### Důležité commity

- `0ca35d5` – jednotný artifact systém Workmoji
- `138ef26` – glow, hloubka a mikroanimace
- `acb98fb` – dokončení charakteru celé sady

---

## 2. Editace a mazání vlastních statusů

### Cíl

Uživatel potřeboval možnost:

- upravit vlastní publikovaný status,
- smazat vlastní publikovaný status.

### Implementace

Do `FeedCard` bylo přidáno vlastní menu dostupné pouze autorovi příspěvku.

Menu obsahuje:

- Upravit
- Smazat

Editace probíhá inline přímo ve feedu.

Při editaci:

- se načte aktuální text,
- je možné jej upravit,
- je dodržen limit 1200 znaků,
- změna se zapíše do IndexedDB,
- feed se okamžitě aktualizuje bez reloadu.

Při smazání:

- zobrazí se potvrzení,
- záznam se odstraní z IndexedDB,
- položka okamžitě zmizí z feedu.

### Bezpečnost

Kontrola není pouze v UI.

Do storage vrstvy byla přidána kontrola vlastnictví:

- `updateOwnedFeedItem`
- `deleteFeedItem(itemId, actorUserId)`

Storage vrstva ověřuje, že:

`storedItem.author.id === actorUserId`

Tím se zabraňuje tomu, aby běžná aplikační cesta upravila nebo smazala cizí příspěvek pouze změnou UI.

### Důležité commity

- `6f4cde6` – editace a mazání vlastních příspěvků
- `bff9a92` – napojení změn do aplikace
- `aaad64a` – kontrola vlastnictví ve storage
- `20fdae2` – napojení autorizované správy statusů

---

## 3. První verze soukromých zpráv

### Cíl

Vytvořit základ zpráv inspirovaný Telegramem:

- seznam kontaktů,
- konverzace,
- zprávy v bublinách,
- vlastní a cizí zprávy vizuálně oddělené,
- responzivní mobilní verze,
- soukromí jako základní princip.

### UI

Byl vytvořen samostatný `MessagesView`.

Obsahuje:

- levý panel s kontakty,
- vyhledávání,
- aktivní kontakt,
- hlavičku konverzace,
- indikátor E2EE,
- message thread,
- čas zpráv,
- message composer,
- mobilní zobrazení.

### Důležité commity

- `d8c06c6` – Telegram-like rozhraní zpráv
- `288b209` – napojení zpráv do dashboardu
- `50158d9` – dokončení vizuální části zpráv

---

## 4. První E2EE prototyp

### Zvolený model

Pro první lokální prototyp byly použity Web Crypto API primitivy:

- ECDH
- křivka P-256
- AES-GCM
- 256bit symetrický klíč
- náhodný 12bajtový IV

Zpráva se:

1. validuje na zařízení odesílatele,
2. zašifruje před uložením,
3. uloží jako ciphertext.

Do message store se ukládá pouze:

- `id`
- `senderId`
- `recipientId`
- `ciphertext`
- `iv`
- `createdAt`

Plaintext zprávy se do IndexedDB message store neukládá.

### Proč byl tento postup zvolen

Cílem bylo ověřit uživatelský tok a kryptografický tok bez okamžitého zavádění backend infrastruktury.

To umožňuje:

- rychle ověřit UX zpráv,
- ověřit Web Crypto integraci,
- oddělit plaintext od message storage,
- připravit rozhraní pro pozdější serverový transport.

Toto řešení je ale pouze první lokální prototyp a není ještě produkční E2EE architektura.

---

## 5. Safety filtr před zašifrováním

### Rozhodnutí

Goodfeel má zachovat E2EE, proto server nemá číst plaintext zpráv.

Safety kontrola proto probíhá před zašifrováním na zařízení odesílatele.

Aktuální filtr blokuje několik vysoce rizikových explicitních kategorií.

### Proč nebyla kontrola přesunuta na server

Pokud by server kontroloval obsah zprávy před doručením, znamenalo by to, že server plaintext zná.

To by bylo v rozporu s tvrzením:

> obsah může číst pouze odesílatel a příjemce

Proto byla zvolena kombinace:

- E2EE
- client-side safety pre-filter
- budoucí server-side kontrola metadata/rate limitů
- budoucí reporting uživatelem

### Známé omezení

Client-side filtr není možné technicky vynutit proti plně upravenému klientovi.

Uživatel, který si vytvoří vlastní klient nebo modifikuje JavaScript, může lokální kontrolu odstranit.

Proto safety model nemůže stát pouze na klientském regex filtru.

---

## 6. Bezpečnostní rozhodnutí pro další vývoj zpráv

Produkční model by měl oddělit:

### Na zařízení uživatele

- privátní klíč
- šifrování
- dešifrování
- lokální pre-filter

### Na serveru

- veřejné klíče zařízení
- autorizace
- session
- rate limiting
- abuse metadata
- delivery metadata
- ciphertext
- device registry

Server nesmí mít privátní klíč uživatele.

### Klíčový problém současného prototypu

Aktuální lokální implementace dokáže vytvořit message identity pro oba uživatele v jednom browser storage.

To je vhodné pouze pro lokální demo.

V produkci musí platit:

- privátní klíč příjemce nikdy nevzniká na zařízení odesílatele,
- každý uživatel generuje vlastní privátní klíč,
- na server se publikuje pouze veřejný klíč,
- odesílatel získá veřejný klíč příjemce z key directory.

---

## 7. Avatar systém

### Původní problém

V seznamu zpráv byly profily zobrazené jako obyčejná kruhová kolečka s písmenem.

To působilo jako placeholder.

### Řešení

Byla vytvořena nová komponenta:

`AvatarToken.tsx`

Nový avatar systém používá:

- soft squircle,
- glass/neon efekt,
- monogram,
- deterministický barevný tón podle jména,
- active state,
- online indicator,
- více velikostí.

Varianty:

- sm
- md
- lg
- xl

Použití bylo sjednoceno v:

- feedu,
- composeru,
- zprávách,
- profilu,
- top baru.

### Důležité commity

- `3acbfbf` – první AvatarToken komponenta
- `912a55f` – použití ve feedu
- `2f517ea` – použití v dashboardu
- `ceacbb6` – použití ve zprávách
- `73a655f` – použití v composeru
- `cf797dc` – finální vizuální polish avatar tokenů

---

## 8. Databázové změny

IndexedDB byla navýšena:

`databaseVersion = 2`

Byly přidány nové stores:

- `messages`
- `message-identities`

Message store používá indexy:

- senderId
- recipientId
- createdAt

Toto je připravené pro další vývoj konverzací, ale dlouhodobě nebude lokální IndexedDB zdrojem pravdy pro zprávy.

---

## 9. Známé problémy a technický dluh

### 9.1 Chybí automatické CI

Větev aktuálně nemá workflow, které by po každém commitu automaticky spouštělo:

- TypeScript build,
- Vite build,
- lint,
- testy.

To znamená, že změny jsou kontrolované staticky při editaci, ale nebylo možné ze současného prostředí potvrdit lokální `npm run build`.

### Priorita

Vysoká.

Další větší vývoj by měl začít zavedením CI.

---

### 9.2 E2EE je zatím pouze lokální prototyp

Současný model je vhodný pro ověření UX a kryptografického toku.

Není ještě vhodný pro skutečný multi-device messaging.

Je potřeba:

- key directory,
- vlastní device identity,
- public key distribution,
- key rotation,
- revoked devices,
- encrypted key backup,
- session management.

---

### 9.3 Chybí server-side authorization

Aktuální projekt používá hlavně IndexedDB.

Jakmile přibude backend, musí server ověřovat:

- kdo smí měnit post,
- kdo smí mazat post,
- kdo smí odeslat zprávu,
- komu zpráva patří,
- ownership každého objektu.

Klientské kontroly jsou pouze UX vrstva.

---

### 9.4 Client-side safety filtr lze obejít

Toto je očekávané omezení.

Další safety vrstva může pracovat s:

- rate limity,
- abuse patterns,
- metadata,
- spam heuristikou,
- account trust score,
- reporty příjemců.

Server však nemá dostávat plaintext, pokud chceme zachovat skutečné E2EE.

---

### 9.5 Reporting E2EE zpráv

Je potřeba navrhnout reporting tak, aby příjemce mohl dobrovolně nahlásit konkrétní zprávu.

Možný model:

1. uživatel klikne Nahlásit,
2. klient zobrazí přesně, co bude sdíleno,
3. uživatel potvrdí,
4. klient odešle plaintext vybrané zprávy + metadata moderaci.

Bez explicitního reportu server plaintext nevidí.

---

### 9.6 Multi-device

Aktuální koncept předpokládá jednu lokální identitu.

Produkční Goodfeel musí počítat s:

- mobile,
- desktop,
- další browser,
- ztracené zařízení,
- výměna zařízení.

Doporučený směr je device keys místo jednoho jediného account key.

---

### 9.7 Správa příspěvků

Aktuálně lze upravit body statusu.

Do budoucna bude vhodné umožnit editaci také:

- title,
- tags,
- type-specific fields.

U upraveného příspěvku bude vhodné přidat malé označení:

`Upraveno`

---

## 10. Doporučené další kroky

### Fáze 1 – stabilizace současného stavu

1. přidat GitHub Actions,
2. spouštět `npm ci`,
3. spouštět `npm run build`,
4. přidat lint,
5. přidat první unit testy,
6. opravit všechny nalezené TypeScript/build problémy.

Toto by mělo proběhnout před dalším větším feature vývojem.

---

### Fáze 2 – messaging architecture

1. oddělit message crypto do samostatného modulu,
2. vytvořit `crypto/messages.ts`,
3. zavést device identity,
4. publikovat pouze public key,
5. vytvořit key directory model,
6. přidat key fingerprint,
7. zobrazit bezpečnostní info konverzace.

---

### Fáze 3 – messaging UX

Doplnit:

- unread count,
- poslední zprávu v seznamu,
- typing indicator,
- delivered/read stav,
- timestamp groups,
- automatický scroll,
- Enter = send,
- Shift+Enter = nový řádek,
- attachments,
- Workmoji ve zprávách.

---

### Fáze 4 – abuse protection

Doplnit:

- report message,
- block user,
- mute,
- spam rate limit,
- account-level trust,
- abuse metadata,
- možnost revokovat zařízení.

---

### Fáze 5 – backend

Jakmile bude frontend stabilní:

- API,
- persistent users,
- posts,
- encrypted messages,
- public key directory,
- WebSocket nebo jiný realtime transport.

Důležitý princip:

> backend zprávy doručuje, ale nerozšifrovává.

---

### Fáze 6 – profily

AvatarToken je pouze fallback.

Další krok:

- upload vlastní profilové fotografie,
- crop,
- resize,
- fallback na AvatarToken,
- lazy loading,
- storage strategie.

---

## 11. Dnešní hlavní architektonická rozhodnutí

### Workmoji

Vlastní design systém místo závislosti na běžné icon library.

### Statusy

Ownership kontrolovat nejen v komponentě, ale i ve storage vrstvě.

### Messages

Soukromí je výchozí vlastnost, ne doplněk přidaný později.

### Safety

Nesnažit se tvrdit zároveň:

- server nikdy nevidí zprávy,
- server čte každou zprávu kvůli moderaci.

Místo toho používat transparentní kombinaci:

- E2EE,
- lokální safety,
- metadata protection,
- reporting.

### Avatary

Jeden společný identity systém místo různých placeholder avatarů v jednotlivých částech UI.

---

## 12. Stav na konci dne

Aktuální větev:

`dev/first-runnable`

Poslední commit dnešního feature vývoje před tímto dokumentem:

`cf797dce47699219b85afabd3c221f10e56687a3`

Aktuálně jsou v první runnable verzi připravené:

- registrace a session,
- offline feed,
- posty,
- projekty,
- služby,
- pracovní příležitosti,
- Workmoji,
- editace vlastních statusů,
- mazání vlastních statusů,
- první messaging UI,
- lokální E2EE prototyp,
- klientský safety pre-filter,
- Goodfeel AvatarToken systém.

Nejdůležitější příští technická priorita:

> Než bude přidán další velký modul, zavést automatický build/CI a následně oddělit messaging kryptografii od lokální demo implementace do produkčně navrženého device-key modelu.
