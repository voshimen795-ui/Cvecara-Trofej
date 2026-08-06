# DESIGN-NOTES

Dnevnik odluka po celinama. Svaka stavka: **šta je urađeno**, **zašto tako**, i
**šta čeka vašu potvrdu**.

> Pravilo rada: ne diramo z-index vrednosti niti stilove koje ubacuju spoljni
> JS fajlovi (`map.js`, `booking.js`, `referral.js` i slični). Trenutno takvih
> fajlova u projektu nema — mapa je naša React komponenta, ne skripta.

---

## ⏳ Čeka vašu potvrdu

| Stavka | Gde | Napomena |
| --- | --- | --- |
| **Tekst za „Porodično"** | `src/components/FamilySection.jsx` → `PARAGRAPHS` | Tri pasusa su placeholder. Zamenite ih i ništa drugo se ne dira. |
| **Instagram handle** | `src/data/shop.js` → `instagram` | `@cvecara_trofej` je pretpostavka. |
| **Nemački jezik** | `src/i18n/locales/` | Beleška nije bila jasna. Radimo SR/EN/RU; DE je jedan JSON fajl kad potvrdite. |
| **`ORDER_EMAIL_TO` na Vercel-u** | Vercel env | Mejl je u kodu ispravljen na `cvecara.trofej@gmail.com`, ali env varijabla ima prednost. Dok je ne promenite, porudžbine idu na staru adresu. |
| **Značenje „Odstupanja"** | `src/i18n/locales/*.json` → `product.mayDiffer` | Pretpostavio sam odstupanje od fotografije. Ako je reč o ceni ili veličini, menja se taj jedan ključ. |
| **Wolt Drive tokeni** | Vercel env | Preskočeno po dogovoru. Kod stoji spreman. |
| **Resend API ključ** | Vercel env `RESEND_API_KEY` | Bez njega porudžbina se **ne šalje** i checkout to jasno kaže. |
| **Prevodi naziva buketa** | `src/i18n/locales/{en,ru}.json` → `products` | Preveo sam svih 36 naziva i opisa. Ako neki naziv treba da ostane na srpskom, obrišite taj unos i sajt automatski vraća original. |
| **Prevodi recenzija** | `src/i18n/locales/{en,ru}.json` → `reviews.items` | Reči mušterija su prevedene, uz vidljivu napomenu „Prevedeno sa srpskog". Ako radije ne prevodimo tuđe reči, javite — vraćam ih na srpski u svim jezicima. |

---

## Celina 12 — Prolaz kroz listu iz sveske

Prošli smo originalnu rukom pisanu listu stavku po stavku. **17 od 21** je bilo
urađeno; jedna („prva stavka") otpada po vašoj reči; ostale dve su ovde.

### Mejl je bio pogrešan — ispravljen

U uokvirenom delu sveske piše `cvecara.trofej@gmail.com`, **sa tačkom**. Na
sajtu je svuda bila verzija bez tačke. Ispravljeno na šest mesta: `shop.js`,
JSON-LD u `index.html`, dva fallback-a u `/api`, i dva podrazumevana u
`.env.example`.

> **Vi morate još jedno:** promeniti `ORDER_EMAIL_TO` u Vercel env
> varijablama. Dok se to ne uradi, produkcija čita staru vrednost iz env-a, a
> ne novu iz koda — pa porudžbine i dalje idu na staru adresu.

Telefon je proveren i ostaje `069/279-0074`.

### „Odstupanje" — napomena uz proizvod

Nova rečenica na stranici proizvoda i u brzom pregledu: cveće je sezonsko, pa
gotov buket može malo da odstupa od fotografije po nijansi i vrsti cveta, uz
istu veličinu i isti utisak.

Stoji na **oba** mesta namerno — većina kupaca dodaje u korpu iz modala i nikad
ne otvori celu stranicu, pa bi je inače propustili. Ikonica je `Info`, ne
`Check`, jer to nije još jedna prednost nego ograda.

**Pretpostavka koju treba da potvrdite.** Na pitanje šta „Odstupanje" znači
rekli ste da nemate preferencu, pa sam uzeo najčešće značenje kod cvećara —
odstupanje od fotografije. Ako ste mislili na odstupanje u **ceni ili
veličini**, menja se jedan ključ (`product.mayDiffer`) i ništa drugo.

### Nepročitano

Poslednja linija u svesci — „Javite nam se / ...?" — druga reč mi nije čitka.
Sekcija „Javite nam se" već postoji na `/o-nama`. Ako je druga reč „cenovnik",
to je zaseban posao i nije urađen.

---

## Celina 11 — Prevod celog sajta, cvetići i pomeranje levo-desno

### 1. Prevod: sada je zaista ceo sajt

**Šta je bilo.** Prevodio se samo header i footer. Sve ostalo — hero, kartice,
korpa, checkout, mapa, recenzije, porudžbenica — ostajalo je na srpskom.

**Šta je sada.** Svaka komponenta i svaka stranica čita tekst iz `t()`. Po
jeziku: **~270 stringova interfejsa + 72 za katalog** (36 naziva i 36 opisa).
Obuhvaćeno je:

- nazive i opise svih 36 proizvoda,
- naslove i uvode svih pet stranica kategorija,
- sve recenzije sa Google-a,
- korpu, checkout, personalizaciju, zakazivanje i porudžbenicu,
- **poruke o greškama** — i one iz `/api` funkcija i one iz geolokacije.

**Kako je urađeno (da se ne pokvari kasnije).** Podaci više ne nose gotov
tekst, nego ključ: `badge: 'novo'` umesto `badge: 'Novo'`, `when: 'months3'`
umesto `'pre 3 meseca'`, `HOURS_DISPLAY[].key`. Novi jezik je i dalje **jedan
JSON fajl + jedna linija** u `LOCALES` — nijedna komponenta se ne dira.

**Množina se računa, ne pogađa.** `21 artikal`, `3 artikla`, `9 artikala` —
kroz `Intl.PluralRules`, pa ruski dobija svoja četiri oblika, engleski dva.
Ručno „ako je 1" bi pogrešilo u oba jezika.

**Šta ostaje na srpskom, namerno:**

- **Ime radnje i imena mušterija u recenzijama** — vlastita imena; Google ih
  tako i prikazuje.
- **Mejl koji stiže vama.** Ako neko poruči na ruskom, u radnju i dalje stiže
  „Povod: Rođendan", ne „Повод". Tu porudžbinu čitate vi, ne kupac.

**Provereno mereno, ne na oko.** Test uzima svaki srpski string iz `sr.json` i
traži ga u vidljivom tekstu stranice na EN i RU — na 7 ruta, uključujući
proizvod, checkout i porudžbenicu. Rezultat: **0 propuštenih**.

### 2. Sajt se pomerao levo-desno — popravljeno

Nije bilo do korpe, do nje se samo videlo. Dva odvojena uzroka:

1. **Header.** Red u navbaru nije mogao da se skupi: naziv „CVEĆARA TROFEJ"
   je bio `whitespace-nowrap`, pa je red tražio više od širine ekrana i gurao
   dugme korpe preko desne ivice. Izmereno: **+45 px na 390 px, +75 px na
   360 px**, na svakoj stranici. Naziv sada sme da se skupi, a pretraga
   (koja ionako još ne pretražuje) se na telefonu skriva.
2. **Grid od 12 kolona.** `gap-8` puta 11 razmaka = 352 px razmaka pre nego
   što ijedna kolona dobije širinu — na ekranu od 320 px to je samo po sebi
   šire od stranice. Grid sada počinje od `lg`, gde 12 kolona i ima smisla;
   na telefonu je jedna kolona, kao što je i izgledalo.

**Provereno:** 0 px prekoračenja na 320 / 360 / 390 / 414 / 768 / 1024 /
1440 px, na svim stranicama, na sva tri jezika, i sa otvorenom korpom.

### 3. Cvetići koji padaju

Osam linijskih cvetova (`ui/DoodleFlowers.jsx`) nacrtanih po vašoj slici:
rada, ruža, aster, petolist sa prašnicima, hrizantema, suncokret, ljiljan i
lala. Samo linija, bez ispune — isti rukopis kao botanika iz logoa.

Padaju u pozadini **stranica kategorija i stranice proizvoda**
(`PetalRain.jsx`), u brend bojama (tirkiz → tamnozelena) i tamnoj, na niskoj
providnosti — ispod su kartica i fotografija buketa, i ne smeju da im smetaju.

**3D, ali čitljivo.** Prva verzija je rotirala pun krug po X i Y osi i
izgledala je loše: ravan oblik u punoj X-rotaciji najveći deo vremena stoji
bočno prema vama, pa su cvetovi treperili kao crtice. Sada pun krug ide samo
po Z osi (ravna rotacija, petlja se zatvara bez trzaja), a X i Y se njišu do
±60° — utisak dubine ostaje, oblik se uvek prepoznaje.

Broj cvetova prati ekran (9 na telefonu, 18 na desktopu), sve se animira samo
kroz `transform`/`opacity` (dakle na grafičkoj, bez preračunavanja layouta), a
uz `prefers-reduced-motion` se **ne renderuje uopšte**.

---

## Celina 6 — Pozadina ispod hero sekcije

**Urađeno.** Gradijent iza „Naši favoriti" zamenjen slojevitom teksturom:
zamućena floralna fotografija + teal preliv + botanički pattern iz logoa +
vinjeta. Fotografija se vrlo sporo uvećava (34 s), pa deluje živo.

**Odluka: slika umesto videa.** Tražili ste 4K video sa cvećem. Nisam ga
stavio iz dva razloga: nemam pristup stokovima iz ovog okruženja, a i da ga
imam, 4K video na početnoj košta više megabajta i troši bateriju na telefonu —
za pozadinu koja je ionako zamućena do neprepoznatljivosti. Umesto toga sam
napravio teksturu **iz vaše fotografije** (`photos/raw/33cb3e5d`), zamućenu i
prebojenu u brend teal. Teži **13 KB**.

**Ako ipak želite video:** ubacite fajl kao `src/assets/hero-loop.mp4` i javite
— zamena je nekoliko linija u `FanDeck.jsx`, a slika ostaje kao poster dok se
video učitava.

---

## Celina 7 — „O nama / Porodično"

**Urađeno.** Nova sekcija `FamilySection.jsx`, na početnoj i na `/o-nama`.
Struktura: srce-ikonica, eyebrow, naslov „Porodično", heart divider iz logoa,
tri pasusa (prvi krupniji, serif), potpis u script fontu. Botanika iz logoa
diskretno u pozadini.

**Placeholder tekst.** Napisao sam tri pasusa da se vidi kako layout diše —
hook, kako radnja radi, obećanje. Vaš finalni tekst ide u `PARAGRAPHS`.

---

## Celina 8 — Dostava

**Urađeno.** Wolt Drive u **web app** režimu: sajt prima porudžbinu, šalje je
mejlom na `cvecara.trofej@gmail.com`, vi je ručno unosite u Wolt dashboard.

- `api/orders/notify.js` — šalje mejl preko Resend-a. Bez `RESEND_API_KEY`
  vraća `mock: true` i checkout **jasno piše da mejl nije poslat**.
- Cena dostave je vaše pravilo (besplatno iznad 4.000 RSD, inače 350 RSD), ne
  Wolt-ova procena — jer bez API-ja Wolt ne daje cenu.
- Kod za Wolt Drive API (`api/wolt/`) ostaje u repo-u, u test režimu.

**Kurirko — izbačen.** Istražio sam: javni API ne postoji. `kurirko.rs` vraća
403, u pretrazi nema ni dokumentacije ni modula za web shop, za razliku od npr.
Kurir Express-a koji ima REST API i module za Magento/PrestaShop. Po vašoj
odluci držimo samo Wolt.

**O vlasništvu nad biznisom:** Wolt Drive tokene Wolt izdaje tek posle
potpisanog ugovora sa firmom, uz registrovan venue u njihovim alatima. To
developer ne može zaobići — vlasnik radnje mora da se prijavi. Vi posle samo
ubacite token u Vercel.

---

## Celina 9 — Višejezičnost

**Urađeno.** SR / EN / RU. Prekidač (globus + kod jezika) u headeru, levo od
pretrage. Izbor se pamti u `localStorage`, `<html lang>` se menja.

- `src/i18n/locales/{sr,en,ru}.json` — po jezik jedan fajl.
- `src/i18n/index.jsx` — provider i `t('checkout.title')`.
- Novi jezik = novi JSON + jedna linija u `LOCALES`. Bez diranja komponenti.

**Srpski je podrazumevani, namerno bez detekcije jezika pregledača.** Prvo sam
bio ubacio `navigator.language` — pa je test pokazao da se beogradska cvećara
otvara na engleskom svakome ko ima telefon na engleskom. Uklonjeno.

**Obim prevoda: interfejs.** Nazivi i opisi buketa, kao i recenzije, ostaju na
srpskom. Poluprevedeni katalog („Prolećna Simfonija — a bouquet of...") čita se
gore nego dosledan original. Kad budete imali prevode, idu u iste JSON fajlove.

---

## Celina 10 — Odštampanje

**Urađeno.** Posle porudžbine se prikazuje porudžbenica (`OrderReceipt.jsx`) sa
brojem, kupcem, terminom, stavkama, zbirom i porukom sa čestitke. Dugme
„Odštampaj porudžbenicu".

**Odluka: `window.print()`, ne PDF biblioteka.** Pregledačev dijalog već nudi
„Sačuvaj kao PDF" na svim platformama, a `jsPDF` + `html2canvas` bi dodali oko
300 KB i lošije bi hvatali dijakritike. Print pravila u `index.css` sakrivaju
ostatak stranice.

Piše „Nije fiskalni račun" — jer nije.

---

## Ranije odluke koje i dalje važe

- **Mapa nije Google iframe.** Probano dvaput, palo dvaput: blokiran iframe
  prikaže Google-ovu „This content is blocked" stranicu, a ta stranica se
  *učita*, pa nema signala kojim bi je razlikovali od prave mape. Sad crtamo
  svoj plan ulice u SVG-u i linkujemo na Google. Uvek se vidi.
- **Recenzije su prekucane, ne screenshot-ovi.** Screenshot nosi Google-ov
  tamni UI, ne prelama se i ne čita se čitačem ekrana.
- **Teal ispune nose taman tekst.** Beli tekst na svetlijem teal-u pada na
  3.25:1. Ne vraćati.
- **Vaučeri se mogu iskoristiti više puta** — nema baze porudžbina.
