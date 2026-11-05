/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║       🎀  SATU-SATUNYA FILE YANG PERLU KAMU UBAH  🎀             ║
  ╚══════════════════════════════════════════════════════════════════╝

  Ubah teks di dalam tanda kutip, jangan hapus tanda koma atau kurung.
  Semua perubahan akan terlihat setelah index.html di-refresh.
  Ingat: jika di-host di GitHub Pages, semua teks & foto bisa diakses publik.
*/
window.BUNNY_CONFIG = {
  // 1) NAMA PENERIMA
  recipientName: "Kamu",

  // 2) KARTU UCAPAN UTAMA (setelah membuka kado)
  birthdayTitle: "Happy Birthday! 🎂",
  birthdayMessage:
    "Semoga hari ini dipenuhi hal-hal kecil yang bikin kamu senyum. " +
    "Semoga apa pun yang lagi kamu usahakan pelan-pelan jadi kenyataan. " +
    "Pokoknya, semoga harimu selembut awan pink dan semanis kue! 🌸",
  signature: "— Dari seseorang yang menyewa kelinci ini 🐰",

  // 3) UCAPAN SAAT KELINCI DITEPUK (opsional; boleh diganti)
  bunnyReactions: [
    "Ehe~ geli! 🐰",
    "Aku kelinci pengantar paket, bukan boneka! 🎀",
    "Psst... misi rahasia menunggu! ✨",
    "Satu elusan = satu keberuntungan! 🌷"
  ],

  // 4) PESAN DI BALIK 3 AMPLOP KEBERUNTUNGAN
  // Penerima hanya memilih SATU; isi yang dipilih akan muncul lagi di akhir.
  luckyNotes: [
    { title: "Bintang Ceria", emoji: "⭐", message: "Semoga ada kabar kecil yang bikin kamu senyum lebar minggu ini." },
    { title: "Bunga Berani", emoji: "🌷", message: "Semoga kamu selalu punya keberanian buat mencoba hal-hal seru." },
    { title: "Awan Tenang", emoji: "☁️", message: "Semoga setiap hari berat punya jeda yang hangat dan nyaman." }
  ],

  // 5) TIGA KARTU PESAN MINI DI BAGIAN AKHIR
  tinyWishes: [
    "Jangan lupa makan enak hari ini! 🍰",
    "Semoga playlist favoritmu selalu pas dengan suasana hati. 🎧",
    "Kalau capek, boleh istirahat. Besok petualangan baru! 🌼"
  ],

  // 6) PESAN RAHASIA (TOMBOL DI AKHIR)
  secretMessage:
    "Fun fact: Kelinci kecil ini kehilangan tiga wortel kesayangannya! " +
    "Makasih sudah membantu menemukannya. 🥕✨",

  // 7) FOTO KENANGAN (PILIHAN, BOLEH KOSONG)
  // Taruh gambar di folder assets/, lalu isi seperti contoh.
  // Contoh: photos: [{ src: "assets/foto1.jpg", caption: "Momen paling lucu!" }]
  // Jangan upload foto pribadi tanpa izin orang di foto.
  photos: [],

  // 8) BUNNY'S SECRET DELIVERY — WAJIB DIISI SEBELUM DIPUBLIKASIKAN!
  // Gunakan EMAIL MILIKMU yang ingin menerima data pengantaran.
  // Setelah deploy, uji form sekali dan AKTIFKAN lewat email konfirmasi FormSubmit.
  // Situs publik akan memperlihatkan email ini di source code dan penjelasan privasi.
  // Jika tidak ingin email terlihat, FormSubmit mendukung token pengganti setelah aktivasi.
  deliveryEmail: "ipangsilenk@gmail.com",

  // Fitur bonus bisa dimatikan: false (tanpa pengumpulan alamat)
  enableDelivery: true,

  // Opsional: personalisasi tulisan fitur bonus
  deliveryQuestion: "Psst... mau kejutan kecil berikutnya? 🎀",
  deliveryDescription:
    "Bunny mungkin masih punya satu kiriman rahasia. Kalau kamu mau, " +
    "pilih tempat yang nyaman untuk menerima kejutan itu. Isinya tetap rahasia! 🐰"
};
