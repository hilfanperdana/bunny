# FIX V3 — Pengiriman Bunny

Fitur Secret Delivery **aktif**, dengan penerima email yang sudah diatur di `config.js`.
Jika tampil tulisan **“Bunny masih menyiapkan kotak suratnya”**, artinya browser **tidak membaca email yang valid dari config.js**. Itu terjadi *sebelum* pengiriman FormSubmit, bukan masalah inbox.

## Cara menjalankan
1. Ekstrak ZIP **seluruhnya**. Jangan membuka `index.html` dari dalam arsip ZIP tanpa diekstrak.
2. Buka `index.html` dari folder hasil ekstrak. Pastikan `config.js`, `script.js`, dan `style.css` ada di folder yang sama.
3. Jika memakai GitHub Pages, unggah **seluruh isi** folder Fix ke cabang/folder yang benar (biasanya branch `main`, root). Pastikan menggantikan file lama.
4. Buka website dengan penyamaran/incognito atau tekan **Ctrl+Shift+R** setelah deploy. Tag versi pada `index.html` membantu menghindari cache JS lama.
5. Tes tombol “Mauu, penasaran!”: formulir harus tampil.
6. Lakukan submit **dengan data contoh, bukan alamat asli** untuk aktivasi FormSubmit melalui email; setelah aktivasi, kirim tes lagi dan cek inbox/spam.

## Pemeriksaan cepat via browser PC (F12 → Console)
Ketik `window.BUNNY_CONFIG?.deliveryEmail` lalu Enter. Harus menampilkan `ipangsilenk@gmail.com`.
Jika hasilnya `undefined`, kemungkinan `config.js` tidak ditemukan, belum diunggah, atau website membuka folder/versi lama.
Jika muncul email lain, periksa `config.js` di alamat publik, contohnya `https://USERNAME.github.io/NAMA_REPO/config.js` dan lokasi deploy GitHub Pages.

## Privasi
Form meminta persetujuan dan **tidak melacak lokasi GPS/IP**. Data pengantaran hanya dikirim bila penerima sengaja mengisi lalu mengirim. FormSubmit adalah layanan pihak ketiga dan alamat email pemilik dapat terlihat dari kode publik.

---

# Bunny Birthday Surprise V3 🐰🎀

Hadiah ulang tahun digital pastel pink yang bisa dimainkan dari HP melalui QR Code.

**BARU V3: Bunny's Secret Delivery.** Setelah hadiah digital selesai, penerima bebas memilih:
- **Mauu, penasaran! 🎁** → mengisi nama + titik pengantaran yang nyaman, WhatsApp (opsional), catatan (opsional), dan mencentang persetujuan untuk mengirim ke email pengirim.
- **Hadiah digitalnya cukup 🩷** → selesai tanpa mengirim data, bisa berubah pikiran.

Form tidak mengambil GPS, IP browser, maupun titik lokasi secara diam-diam. Pengirim belum otomatis memesan barang atau makanan; website hanya meneruskan informasi pengantaran yang diisi secara sukarela.

## 📌 WAJIB: cara mengatur alamat email penerima

1. Buka **`config.js`** di VS Code atau Notepad.
2. Cari baris:

```javascript
deliveryEmail: "ipangsilenk@gmail.com",
```

3. Ganti dengan email MILIKMU, misalnya (contoh fiktif):

```javascript
deliveryEmail: "emailku@gmail.com",
```

4. Simpan. Kalau `deliveryEmail` masih berisi placeholder, tombol hadiah bonus akan menampilkan status belum siap, dan form tidak akan mengirim data.
5. **Penting:** URL FormSubmit berisi email yang kamu masukkan, sehingga alamat email itu bisa dilihat di sumber halaman publik. Jika privasi email pribadi menjadi perhatian, lihat opsi token pengganti dari dokumentasi FormSubmit; implementasi dasar proyek ini memakai email langsung.

## 🚀 Cara menerbitkan website

1. Siapkan repository GitHub (mis. `bunny-surprise`).
2. Unggah `index.html`, `style.css`, `script.js`, `config.js`, `assets/`, dan `.nojekyll` ke root repository. **Jangan upload alamat pengantaran atau data pribadi apa pun ke GitHub.**
3. Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save.
4. Setelah aktif, link biasanya berupa `https://USERNAME.github.io/bunny-surprise/`.
5. Buka dengan HP dan selesaikan permainan sampai muncul bagian "Bunny's Secret Delivery".

## ✉️ Aktifkan email FormSubmit — HARUS SEBELUM DIPAKAI DOI

Website memakai **FormSubmit.co**: https://formsubmit.co/ (bukan FormSubmit.io).
FormSubmit membantu mengirim isi formulir dari halaman statis ke emailmu.

1. Setelah situs benar-benar online, isi form **dengan data uji palsu**, misalnya nama "TES BUNNY" dan titik "Alamat Tes, bukan alamat nyata". Centang persetujuan, lalu kirim.
2. Buka inbox email yang kamu isi di `config.js` dan cari email **aktivasi/konfirmasi dari FormSubmit**. Periksa folder spam juga.
3. **Klik tautan aktivasi.** Tanpa langkah ini kamu bisa tidak menerima kiriman form sesungguhnya.
4. Kirim satu kali form tes lagi dari website; cek sampai email berisi hasil tes benar-benar masuk.
5. Barulah bagikan QR ke doi. Jangan menjadikan percobaan pertama dari doi sebagai aktivasi.
6. Bila email tidak masuk, periksa Spam dan dokumentasi https://formsubmit.co/help.

**Catatan:** Integrasi ke API email menggunakan `fetch()` FormSubmit AJAX, dan hasil responnya diperiksa. Pengujian otomatis proyek menggunakan server simulasi (tanpa mengirim email sungguhan). Pastikan uji end-to-end setelah deployment dan aktivasi, karena pengiriman email nyata tidak bisa dijamin sebelum itu.

## 📝 Satu file untuk semua personalisasi: `config.js`

| Bagian | Yang bisa kamu ganti |
| --- | --- |
| `recipientName` | Nama panggilan doi |
| `birthdayTitle`, `birthdayMessage`, `signature` | Judul, isi, tanda tangan kartu |
| `bunnyReactions` | Respons ketika kelinci dielus |
| `luckyNotes` | Isi tiga amplop |
| `tinyWishes` | Isi tiga kartu mini |
| `secretMessage` | Pesan rahasia (sudah diselaraskan dengan game wortel) |
| `photos` | Galeri foto opsional, biarkan `[]` jika kosong |
| `deliveryEmail` | **Sudah diisi: ipangsilenk@gmail.com (bisa diganti jika diperlukan)** |
| `enableDelivery` | `true` untuk aktif, `false` untuk mematikan formulir |
| `deliveryQuestion` | Pertanyaan kelinci di bagian akhir |
| `deliveryDescription` | Narasi fitur bonus |

Kamu juga bisa mengubah CSS dan urutan game, tapi jangan perlu jika hanya personalisasi.

## 🔒 Privasi & batasan

- Penerima diminta persetujuan **secara eksplisit** sebelum data dikirim.
- Penerima bisa memilih lokasi pengantaran mana pun, tidak harus rumah.
- Data dikirim ke layanan **pihak ketiga FormSubmit.co**, lalu diteruskan ke emailmu. Menurut dokumentasinya, data submission dipertahankan sampai **30 hari** di layanan tersebut.
- Karena halaman publik dapat diakses orang lain, siapa pun berpotensi mengirim data palsu. **Verifikasi dengan penerima lewat WhatsApp sebelum benar-benar mengirim sesuatu.**
- Jangan publikasikan data alamat yang diterima, jangan gunakan untuk melacak penerima, dan hapus setelah pengantaran selesai.
- Data form tidak disimpan di localStorage atau di dalam repository. Tombol pengiriman hanya aktif setelah isi form dan checkbox persetujuan valid.
- Fitur pengiriman ke email bukan fitur pemesanan kurir atau makanan. Kamu tetap memesan secara manual setelah menerima data.
- Secara teknis browser mengakses FormSubmit sehingga layanan tersebut dapat menerima metadata koneksi lazim seperti IP ketika form dikirim; ini berbeda dari mengambil koordinat GPS. Jangan menganggap pengiriman melalui penyedia pihak ketiga sebagai sistem tanpa metadata.

## 🧪 Cara mencoba dari laptop

Ekstrak ZIP. Untuk gameplay, `index.html` bisa dibuka langsung. **Namun untuk form email, pastikan tes melalui situs HTTPS yang sudah diterbitkan**; FormSubmit mendokumentasikan kendala pada halaman yang dibuka sebagai `file://`.

## 🧾 Python pembuat QR

Setelah punya URL publik:

```bash
python -m pip install -r requirements.txt
python buat_qr.py "https://USERNAME.github.io/bunny-surprise/"
```

Dihasilkan `qr_bunny.png` dan `kartu_qr.png` untuk dibagikan atau dicetak. URL harus alamat website publik, bukan file lokal.

## Struktur file

```
index.html        Halaman dan semua layar permainan
style.css         Gaya/animasi pastel pink
script.js         Interaksi mini-game dan kirim form email
config.js         ← EDIT INI untuk nama, ucapan, EMAIL
assets/bunny.svg  Ilustrasi kelinci
assets/favicon.svg
buat_qr.py        Python generator QR setelah website online
requirements.txt  Library Python QR
.nojekyll         Memudahkan deploy GitHub Pages
README.md         Dokumentasi
```

## Dokumentasi rujukan

- FormSubmit: https://formsubmit.co/
- FormSubmit AJAX: https://formsubmit.co/ajax-documentation
- FormSubmit help/activation: https://formsubmit.co/help
- FormSubmit documentation: https://formsubmit.co/documentation
- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
