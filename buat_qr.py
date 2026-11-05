"""Buat QR code dan kartu cetak untuk Bunny Birthday Surprise.

Penggunaan:
    python buat_qr.py https://USERNAME.github.io/NAMA-REPO/

Menghasilkan:
    qr_bunny.png     -- QR code resolusi tinggi, mudah dipindai
    kartu_qr.png     -- kartu ukuran 1200x1600 dengan QR yang sama
"""

import argparse
from pathlib import Path
from urllib.parse import urlparse

import qrcode
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
PINK = (246, 158, 193)
DARK = (102, 60, 78)
BG = (255, 246, 250)


def font(size: int, bold: bool = False):
    """Pakai font yang tersedia di sistem, dengan fallback aman."""
    candidates = [
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            pass
    return ImageFont.load_default()


def centered(draw: ImageDraw.ImageDraw, text: str, y: int, fnt, fill):
    bounds = draw.textbbox((0, 0), text, font=fnt)
    x = (1200 - (bounds[2] - bounds[0])) // 2
    draw.text((x, y), text, font=fnt, fill=fill)


def main():
    parser = argparse.ArgumentParser(description="Buat kartu QR hadiah ulang tahun Bunny.")
    parser.add_argument("url", help="URL https:// dari website hadiah yang SUDAH terbit")
    args = parser.parse_args()
    parsed = urlparse(args.url.strip())
    if parsed.scheme != "https" or not parsed.netloc:
        parser.error("Masukkan alamat website lengkap yang dimulai dengan https://")
    if "localhost" in parsed.netloc or "127.0.0.1" in parsed.netloc:
        parser.error("URL localhost hanya bisa dibuka dari perangkatmu. Gunakan URL hosting publik.")

    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=16, border=4)
    qr.add_data(args.url.strip())
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color=DARK, back_color="white").convert("RGB")
    qr_img.save(ROOT / "qr_bunny.png")

    card = Image.new("RGB", (1200, 1600), BG)
    draw = ImageDraw.Draw(card)
    draw.rounded_rectangle((50, 50, 1150, 1550), radius=76, outline=(255, 201, 223), width=9, fill=(255, 253, 254))
    for x, y, r in [(160, 185, 32), (1010, 270, 16), (1070, 1320, 27), (138, 1350, 19)]:
        draw.ellipse((x-r, y-r, x+r, y+r), fill=(255, 222, 236))
    centered(draw, "A LITTLE PINK SURPRISE", 194, font(45, True), (195, 108, 149))
    centered(draw, "A gift from Bunny", 276, font(48, True), DARK)
    centered(draw, "Scan me!", 375, font(40), (164, 111, 137))
    # QR hitam keunguan di atas latar putih: kontras dijaga agar mudah dipindai.
    canvas_qr = qr_img.resize((760, 760), Image.Resampling.NEAREST)
    card.paste(canvas_qr, (220, 490))
    centered(draw, "A tiny birthday adventure", 1330, font(39, True), (179, 99, 139))
    centered(draw, "made just for you", 1401, font(32), (167, 126, 146))
    card.save(ROOT / "kartu_qr.png")

    print("Berhasil! File tersimpan di folder proyek:")
    print("- qr_bunny.png")
    print("- kartu_qr.png")
    print("Pastikan QR dicoba dengan kamera HP sebelum dicetak.")


if __name__ == "__main__":
    main()
