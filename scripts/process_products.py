#!/usr/bin/env python3
"""
Priprema fotografija buketa za katalog Cvećare Trofej.

Za svaku ulaznu fotografiju:
  1. uklanja pozadinu (ruka, zid, pod, police) pomoću rembg,
  2. kropuje na bounding box samog cveća uz padding,
  3. centrira na kvadratno platno fiksne dimenzije, RGBA/transparentno,
  4. snima kao PNG sa čistim imenom (slug).

Primeri:
    python scripts/process_products.py --review
    python scripts/process_products.py --only prolecna-simfonija --alpha-matting
    python scripts/process_products.py --web            # + optimizovan WebP za sajt

Zahtevi:  pip install rembg onnxruntime pillow numpy scipy
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image

try:
    from scipy import ndimage
except ImportError:  # cleanup je opcion — bez scipy se preskače
    ndimage = None


REPO = Path(__file__).resolve().parent.parent
DEFAULT_INPUT = REPO / "photos" / "raw"
DEFAULT_OUTPUT = REPO / "photos" / "catalog"
DEFAULT_WEB = REPO / "src" / "assets" / "products"


@dataclass
class Item:
    """Jedna fotografija: izvorni fajl, slug i kategorija u katalogu."""

    source: str
    slug: str
    category: str
    # Neke fotografije (tanke stabljike, prozirni celofan) traže precizniju
    # ivicu — za njih uključujemo alpha matting pojedinačno.
    alpha_matting: bool = False
    # Model po slici, kad podrazumevani ne odvoji dobro baš tu fotografiju.
    model: str | None = None
    # rembg drži ruku i rukav uz buket jer ih vidi kao isti objekat, a
    # person-segmentacija ovde nije upotrebljiva (brka roze cveće sa kožom).
    # Zato se dno seče deterministički, kao udeo visine isečenog objekta.
    trim_bottom: float = 0.0
    trim_top: float = 0.0
    # Prag za brisanje vrlo tamnih piksela (0-255). Za tamne rukave koji stoje
    # bočno uz buket, gde sečenje dna ne pomaže a da ne pojede i cveće.
    drop_dark: int = 0
    note: str = ""


# Redosled prati katalog; slug postaje ime fajla i ključ proizvoda.
MANIFEST: list[Item] = [
    Item("14f47173-10382.jpg", "crveni-akcenat", "buketi", trim_bottom=0.27),
    Item("a1f264b8-10374.jpg", "prolecna-simfonija", "buketi", trim_bottom=0.24, drop_dark=64),
    Item("b7727708-10371.jpg", "nezne-lale", "buketi", trim_bottom=0.37, note="tanke stabljike lala"),
    Item("204d0102-10366.jpg", "suncano-jutro", "buketi", trim_bottom=0.21),
    Item("cc05469f-10276.jpg", "ljubicasti-san", "buketi"),
    Item("7016c7d9-10272.jpg", "roze-oblak", "buketi", trim_bottom=0.14),
    Item("33cb3e5d-10279.jpg", "livada-u-cvatu", "buketi", trim_bottom=0.23),
    Item("7287e75c-10284.jpg", "lavanda-i-krem", "buketi"),
    Item("ab1a11ba-10228.jpg", "zlatna-jesen", "buketi", trim_bottom=0.20),
    Item("258b9e43-10368.jpg", "medveni-zagrljaj", "aranzmani"),
    Item("535e59ab-10347.jpg", "ruzicasti-ljiljan", "aranzmani"),
    Item("aa289012-10345.jpg", "divlja-basta", "aranzmani", note="razgranato zelenilo"),
    Item("87d6bcd0-10343.jpg", "strastveni-trenutak", "aranzmani"),
    Item("e971620d-10354.jpg", "korpa-iznenadjenja", "aranzmani", trim_top=0.23),
    # Ove dve su zadržane radi kompletnosti, ali nisu upotrebljive kao
    # product kartice — vidi --review i README napomenu.
    Item("a53f013c-10386.png", "prolecna-simfonija-screenshot", "skip",
         note="screenshot telefona; isti buket kao prolecna-simfonija"),
    Item("33821699-10358.jpg", "lale-izlog", "skip",
         note="izlog sa mnogo buketa, nije jedan proizvod"),
]


def build_session(model: str):
    from rembg import new_session

    return new_session(model)


def remove_background(img: Image.Image, session, alpha_matting: bool) -> Image.Image:
    from rembg import remove

    kwargs = {}
    if alpha_matting:
        kwargs = dict(
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=15,
            alpha_matting_erode_size=8,
        )
    return remove(img, session=session, **kwargs).convert("RGBA")


def drop_specks(rgba: Image.Image, min_ratio: float) -> tuple[Image.Image, int]:
    """Briše sitne odvojene ostrvke alfe (ostaci ruke, mrlje sa zida).

    Zadržava sve komponente veće od `min_ratio` najveće — dovoljno labavo da
    preživi odvojena stabljika ili list koji ne dodiruje glavni buket.
    """
    if ndimage is None or min_ratio <= 0:
        return rgba, 0

    a = np.array(rgba)
    mask = a[..., 3] > 12
    labels, n = ndimage.label(mask)
    if n <= 1:
        return rgba, 0

    sizes = ndimage.sum(mask, labels, range(1, n + 1))
    keep = {i + 1 for i, s in enumerate(sizes) if s >= sizes.max() * min_ratio}
    removed = n - len(keep)
    if removed:
        drop = ~np.isin(labels, list(keep))
        a[..., 3][drop] = 0
        rgba = Image.fromarray(a, "RGBA")
    return rgba, removed


def drop_dark_pixels(rgba: Image.Image, threshold: int) -> Image.Image:
    """Briše skoro-crne piksele — tamna odeća koju rembg zadrži uz buket."""
    if threshold <= 0:
        return rgba
    a = np.array(rgba)
    dark = a[..., :3].max(axis=-1) < threshold
    a[..., 3][dark] = 0
    return Image.fromarray(a, "RGBA")


def trim_edges(rgba: Image.Image, bottom: float, top: float) -> Image.Image:
    """Briše traku pri dnu/vrhu objekta — tu su ruka, rukav i natpisi iz izloga."""
    if bottom <= 0 and top <= 0:
        return rgba

    a = np.array(rgba)
    ys, xs = np.nonzero(a[..., 3] > 12)
    if len(ys) == 0:
        return rgba

    y0, y1 = ys.min(), ys.max()
    height = y1 - y0 + 1
    if bottom > 0:
        a[..., 3][int(y1 - height * bottom) : , :] = 0
    if top > 0:
        a[..., 3][: int(y0 + height * top), :] = 0
    return Image.fromarray(a, "RGBA")


def crop_and_centre(rgba: Image.Image, size: int, pad_pct: float) -> Image.Image:
    """Kropuje na cveće, dodaje padding i centrira na kvadratno platno."""
    alpha = np.array(rgba)[..., 3]
    ys, xs = np.nonzero(alpha > 12)
    if len(xs) == 0:
        raise ValueError("prazna maska — rembg nije našao objekat")

    box = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
    cropped = rgba.crop(box)

    # Padding se računa iz duže stranice, pa je vizuelno jednak na svim slikama.
    pad = int(round(max(cropped.size) * pad_pct))
    inner = size - 2 * pad
    if inner <= 0:
        raise ValueError("padding je veći od izlazne dimenzije")

    scale = min(inner / cropped.width, inner / cropped.height)
    new = (max(1, round(cropped.width * scale)), max(1, round(cropped.height * scale)))
    cropped = cropped.resize(new, Image.LANCZOS)

    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.paste(cropped, ((size - new[0]) // 2, (size - new[1]) // 2))
    return canvas


def checkerboard(size: tuple[int, int], step: int = 16) -> Image.Image:
    """Podloga za pregled — providnost se vidi kao šah polje."""
    w, h = size
    tile = np.zeros((h, w), np.uint8)
    yy, xx = np.mgrid[0:h, 0:w]
    tile[((yy // step) + (xx // step)) % 2 == 0] = 255
    tile[tile == 0] = 216
    return Image.fromarray(np.dstack([tile] * 3), "RGB")


def write_review_sheet(results: list[tuple[str, Path]], out: Path, cols: int = 4) -> None:
    from PIL import ImageDraw, ImageFont

    thumb = 300
    rows = (len(results) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * thumb, rows * (thumb + 26)), (245, 245, 245))
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 15)
    except OSError:
        font = ImageFont.load_default()

    for i, (slug, path) in enumerate(results):
        im = Image.open(path).convert("RGBA")
        im.thumbnail((thumb, thumb), Image.LANCZOS)
        bg = checkerboard(im.size)
        bg.paste(im, (0, 0), im)
        x, y = (i % cols) * thumb, (i // cols) * (thumb + 26)
        sheet.paste(bg, (x + (thumb - bg.width) // 2, y + 26 + (thumb - bg.height) // 2))
        draw.rectangle([x, y, x + thumb, y + 24], fill=(20, 40, 38))
        draw.text((x + 6, y + 4), slug, font=font, fill=(255, 255, 255))

    sheet.save(out)


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--input-dir", type=Path, default=DEFAULT_INPUT)
    p.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT)
    p.add_argument("--size", type=int, default=1200, help="stranica kvadratnog platna (px)")
    p.add_argument("--padding", type=float, default=0.05, help="udeo paddinga, npr. 0.05 = 5%%")
    p.add_argument("--model", default="birefnet-general",
                   help="rembg model; birefnet-general drži cele aranžmane, u2net je brži")
    p.add_argument("--alpha-matting", action="store_true",
                   help="uključi alpha matting za SVE slike (preciznija ivica, sporije)")
    p.add_argument("--no-clean", action="store_true", help="ne briši sitne odvojene mrlje")
    p.add_argument("--no-trim", action="store_true",
                   help="ne seci dno/vrh (ostavi ruku i rukav na slici)")
    p.add_argument("--min-island", type=float, default=0.02,
                   help="prag za brisanje mrlja, kao udeo najveće komponente")
    p.add_argument("--only", default="", help="obradi samo ove slugove (zarezom odvojeno)")
    p.add_argument("--include-skipped", action="store_true",
                   help="obradi i stavke označene kao category=skip")
    p.add_argument("--review", action="store_true",
                   help="napravi review kontakt-list na šah podlozi")
    p.add_argument("--web", action="store_true",
                   help="dodatno snimi optimizovanu WebP verziju za sajt")
    p.add_argument("--web-dir", type=Path, default=DEFAULT_WEB)
    p.add_argument("--web-size", type=int, default=800)
    p.add_argument("--web-quality", type=int, default=82)
    args = p.parse_args()

    wanted = {s.strip() for s in args.only.split(",") if s.strip()}
    items = [
        it for it in MANIFEST
        if (not wanted or it.slug in wanted)
        and (args.include_skipped or wanted or it.category != "skip")
    ]
    if not items:
        print("Nema stavki za obradu.", file=sys.stderr)
        return 1

    args.output_dir.mkdir(parents=True, exist_ok=True)
    if args.web:
        args.web_dir.mkdir(parents=True, exist_ok=True)

    print(f"Model: {args.model}  •  {len(items)} slika  •  {args.size}x{args.size}px")
    sessions: dict[str, object] = {}

    def session_for(name: str):
        if name not in sessions:
            sessions[name] = build_session(name)
        return sessions[name]

    results, manifest_out, failures = [], [], []
    for i, item in enumerate(items, 1):
        src = args.input_dir / item.source
        if not src.exists():
            print(f"  [{i}/{len(items)}] {item.slug}: NEDOSTAJE {src}", file=sys.stderr)
            failures.append(item.slug)
            continue

        matting = args.alpha_matting or item.alpha_matting
        model = item.model or args.model
        t0 = time.time()
        try:
            with Image.open(src) as fh:
                cut = remove_background(fh.convert("RGB"), session_for(model), matting)
            removed = 0
            if not args.no_clean:
                cut, removed = drop_specks(cut, args.min_island)
            cut = drop_dark_pixels(cut, item.drop_dark)
            if not args.no_trim:
                cut = trim_edges(cut, item.trim_bottom, item.trim_top)
                # Sečenje može odvojiti nove sitne krpice — počisti još jednom.
                if not args.no_clean:
                    cut, extra = drop_specks(cut, args.min_island)
                    removed += extra
            final = crop_and_centre(cut, args.size, args.padding)
        except Exception as exc:  # noqa: BLE001 — prijavi i nastavi sa ostalima
            print(f"  [{i}/{len(items)}] {item.slug}: GREŠKA {exc}", file=sys.stderr)
            failures.append(item.slug)
            continue

        dest = args.output_dir / f"{item.slug}.png"
        final.save(dest, optimize=True)

        web_kb = ""
        if args.web:
            web = final.copy()
            web.thumbnail((args.web_size, args.web_size), Image.LANCZOS)
            wdest = args.web_dir / f"{item.slug}.webp"
            web.save(wdest, "WEBP", quality=args.web_quality, method=6)
            web_kb = f"  web {wdest.stat().st_size / 1024:>5.0f} KB"

        coverage = float((np.array(final)[..., 3] > 12).mean())
        results.append((item.slug, dest))
        manifest_out.append({
            "slug": item.slug, "category": item.category, "source": item.source,
            "alpha_matting": matting, "model": model, "coverage": round(coverage, 4),
        })
        flags = " +matting" if matting else ""
        flags += f" [{model}]" if model != args.model else ""
        if not args.no_trim and (item.trim_bottom or item.trim_top):
            flags += f" trim↓{item.trim_bottom:.2f}" if item.trim_bottom else ""
            flags += f" trim↑{item.trim_top:.2f}" if item.trim_top else ""
        flags += f" -{removed} mrlja" if removed else ""
        print(f"  [{i}/{len(items)}] {item.slug:<32} {dest.stat().st_size / 1024:>6.0f} KB"
              f"{web_kb}  pokrivenost {coverage:5.1%}  {time.time() - t0:4.1f}s{flags}")

        # Vrlo niska pokrivenost obično znači da je rembg pojeo buket.
        if coverage < 0.12:
            print(f"      ⚠ mala pokrivenost — proveri i probaj --only {item.slug} --alpha-matting")

    (args.output_dir / "manifest.json").write_text(
        json.dumps(manifest_out, ensure_ascii=False, indent=2), encoding="utf-8")

    if args.review and results:
        sheet = args.output_dir / "_review.png"
        write_review_sheet(results, sheet)
        print(f"\nReview sheet: {sheet}")

    print(f"\nGotovo: {len(results)} uspešno, {len(failures)} neuspešno.")
    if failures:
        print("Neuspešno:", ", ".join(failures), file=sys.stderr)
    return 0 if not failures else 2


if __name__ == "__main__":
    raise SystemExit(main())
