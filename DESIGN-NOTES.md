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
| **Wolt Drive tokeni** | Vercel env | Preskočeno po dogovoru. Kod stoji spreman. |
| **Resend API ključ** | Vercel env `RESEND_API_KEY` | Bez njega porudžbina se **ne šalje** i checkout to jasno kaže. |
| **Prevod naziva proizvoda** | `src/data/products.js` | EN/RU prevode samo interfejs; nazivi i opisi buketa ostaju na srpskom. |

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
mejlom na `cvecaratrofej@gmail.com`, vi je ručno unosite u Wolt dashboard.

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
