"use strict";

(() => {
  const config = window.BUNNY_CONFIG || {};
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const stages = ["welcome", "carrots", "lucky", "cake", "gift", "finale"];
  const dots = $$(".progress-dot");
  const confettiLayer = $("#confettiLayer");
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const defaultNotes = [
    { title: "Bintang Ceria", emoji: "⭐", message: "Semoga ada kabar baik yang bikin kamu tersenyum." },
    { title: "Bunga Berani", emoji: "🌷", message: "Semoga keberanianmu tumbuh setiap hari." },
    { title: "Awan Tenang", emoji: "☁️", message: "Semoga kamu selalu menemukan waktu buat istirahat." }
  ];
  const notes = defaultNotes.map((item, index) => ({ ...item, ...(config.luckyNotes?.[index] || {}) }));
  const wishes = [
    "Makan kue yang enak hari ini! 🍰", "Temukan alasan untuk tertawa. 🎀", "Besok ada hal seru lagi. 🌸"
  ].map((item, index) => String(config.tinyWishes?.[index] || item));
  const reactions = Array.isArray(config.bunnyReactions) && config.bunnyReactions.length
    ? config.bunnyReactions : ["Psst... aku punya kejutan! 🐰"];

  let currentStage = 0;
  let carrots = 0;
  let candles = 0;
  let chosenNote = null;
  let stageTimer = null;
  let soundOn = false;
  let audioContext = null;
  let petCount = 0;

  const readableName = String(config.recipientName || "Kamu").trim() || "Kamu";
  $("#recipientName").textContent = readableName;
  $("#finaleHeading").textContent = config.birthdayTitle || "Happy Birthday! 🎂";
  $("#letterTo").textContent = `Untuk ${readableName} ✨`;
  $("#letterMessage").textContent = config.birthdayMessage || "Selamat ulang tahun! Semoga harimu menyenangkan. 🌸";
  $("#letterSignature").textContent = config.signature || "— dari seseorang 🐰";
  $("#secretMessage").textContent = config.secretMessage || "Jangan lupa tersenyum hari ini! 🥕";
  $$("[data-wish]").forEach((button, i) => {
    button.querySelector(".wish-content").textContent = wishes[i];
  });
  $$("[data-charm]").forEach((button, i) => {
    button.querySelector(".envelope-icon").textContent = notes[i].emoji;
    button.setAttribute("aria-label", `Buka amplop: ${notes[i].title}`);
  });

  function goToStage(index) {
    if (stageTimer !== null) {
      window.clearTimeout(stageTimer);
      stageTimer = null;
    }
    currentStage = index;
    stages.forEach((name, i) => {
      const element = $(`#stage-${name}`);
      element.hidden = i !== index;
      element.classList.toggle("active", i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
      dot.classList.toggle("completed", i < index);
      if (i === index) dot.setAttribute("aria-current", "step");
      else dot.removeAttribute("aria-current");
    });
    window.scrollTo?.({ top: 0, behavior: "instant" });
  }

  function playChime(notesToPlay = [659.25, 783.99, 987.77]) {
    if (!soundOn) return;
    try {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) return;
      if (!audioContext) audioContext = new Context();
      if (audioContext.state === "suspended") audioContext.resume();
      const now = audioContext.currentTime + 0.015;
      notesToPlay.forEach((frequency, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = "sine";
        osc.frequency.value = frequency;
        gain.gain.setValueAtTime(0.001, now + i * 0.13);
        gain.gain.exponentialRampToValueAtTime(0.075, now + i * 0.13 + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.13 + 0.3);
        osc.connect(gain).connect(audioContext.destination);
        osc.start(now + i * 0.13);
        osc.stop(now + i * 0.13 + 0.32);
      });
    } catch (_error) { /* Tidak menghalangi interaksi bila audio tidak didukung. */ }
  }

  function celebrate(amount = 55) {
    confettiLayer.replaceChildren();
    if (reduceMotion) return;
    const palette = ["#f18db6", "#ffc5d8", "#e9a7e9", "#f8d779", "#ffffff", "#cfb0ff"];
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < amount; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.backgroundColor = palette[i % palette.length];
      piece.style.animationDelay = `${Math.random() * 0.8}s`;
      piece.style.animationDuration = `${2.5 + Math.random() * 2.2}s`;
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      fragment.appendChild(piece);
    }
    confettiLayer.appendChild(fragment);
    window.setTimeout(() => {
      if (confettiLayer.childElementCount === amount) confettiLayer.replaceChildren();
    }, 6000);
  }

  $("#soundToggle").addEventListener("click", () => {
    soundOn = !soundOn;
    $("#soundToggle").setAttribute("aria-pressed", String(soundOn));
    $("#soundToggle").setAttribute("aria-label", soundOn ? "Matikan efek suara" : "Aktifkan efek suara");
    $("#soundLabel").textContent = soundOn ? "suara nyala" : "suara mati";
    $("#soundIcon").textContent = soundOn ? "♫" : "♪";
    playChime();
  });

  $("#petBunny").addEventListener("click", () => {
    if (currentStage !== 0) return;
    $("#bunnySpeech").textContent = String(reactions[petCount % reactions.length]);
    petCount++;
    $("#petBunny").classList.remove("petted");
    void $("#petBunny").offsetWidth; // ulangi animasi hati saat diketuk lagi
    $("#petBunny").classList.add("petted");
    playChime([880, 1046.5]);
  });

  $("#startBtn").addEventListener("click", () => {
    playChime([523.25, 659.25]);
    goToStage(1);
  });

  $$("[data-carrot]").forEach((button) => {
    button.addEventListener("click", () => {
      if (currentStage !== 1 || button.disabled) return;
      button.disabled = true;
      button.classList.add("collected");
      carrots++;
      playChime([620 + carrots * 55]);
      $("#carrotScore").textContent = `🥕 ${carrots} / 3 ditemukan`;
      if (carrots === 3) {
        $("#carrotHint").textContent = "Yeay! Bunny punya ide lain buatmu! 🐰";
        stageTimer = window.setTimeout(() => goToStage(2), reduceMotion ? 180 : 780);
      }
    });
  });

  $$("[data-charm]").forEach((button) => {
    button.addEventListener("click", () => {
      if (currentStage !== 2 || chosenNote !== null) return;
      chosenNote = Number(button.dataset.charm);
      const selected = notes[chosenNote];
      $$("[data-charm]").forEach((item) => {
        item.disabled = true;
        item.classList.toggle("selected", item === button);
        item.classList.toggle("unchosen", item !== button);
      });
      $("#luckyEmoji").textContent = selected.emoji;
      $("#luckyTitle").textContent = selected.title;
      $("#luckyMessage").textContent = selected.message;
      $("#luckyReveal").hidden = false;
      $("#luckyHint").textContent = "Suratnya resmi jadi milikmu! ✨";
      $("#finalLuckyTitle").textContent = `${selected.emoji} ${selected.title}`;
      $("#finalLuckyMessage").textContent = selected.message;
      $("#luckyKeepsake").hidden = false;
      playChime([659.25, 783.99, 987.77]);
      celebrate(20);
    });
  });
  $("#nextCakeBtn").addEventListener("click", () => {
    if (currentStage === 2 && chosenNote !== null) goToStage(3);
  });

  $$("[data-candle]").forEach((button) => {
    button.addEventListener("click", () => {
      if (currentStage !== 3 || button.disabled) return;
      button.disabled = true;
      button.classList.add("blown");
      candles++;
      playChime([523.25 + candles * 100]);
      $("#candleScore").textContent = `🕯️ ${candles} / 3 lilin padam`;
      if (candles === 3) {
        $("#candleHint").textContent = "Yeay! Semoga terkabul! ✨";
        celebrate(40);
        stageTimer = window.setTimeout(() => goToStage(4), reduceMotion ? 180 : 920);
      }
    });
  });

  $("#giftBtn").addEventListener("click", () => {
    if (currentStage !== 4 || $("#giftBtn").disabled) return;
    $("#giftBtn").disabled = true;
    $("#giftBtn").classList.add("opened");
    playChime([523.25, 659.25, 783.99, 1046.5]);
    celebrate(90);
    stageTimer = window.setTimeout(() => goToStage(5), reduceMotion ? 180 : 750);
  });

  $$("[data-wish]").forEach((button) => {
    button.addEventListener("click", () => {
      if (currentStage !== 5) return;
      const expanded = button.classList.toggle("revealed");
      button.setAttribute("aria-expanded", String(expanded));
      if (expanded) playChime([740, 880]);
    });
  });

  const photos = Array.isArray(config.photos) ? config.photos.slice(0, 6) : [];
  if (photos.length) {
    photos.forEach((photo) => {
      if (!photo || typeof photo.src !== "string" || !photo.src.trim()) return;
      const figure = document.createElement("figure");
      figure.className = "memory-polaroid";
      const img = document.createElement("img");
      img.src = photo.src.trim();
      img.alt = String(photo.caption || "Foto kenangan");
      img.loading = "lazy";
      img.addEventListener("error", () => {
        figure.remove();
        if (!$("#memoryGallery").childElementCount) $("#memorySection").hidden = true;
      });
      const caption = document.createElement("figcaption");
      caption.textContent = String(photo.caption || "A little memory ♡");
      figure.append(img, caption);
      $("#memoryGallery").append(figure);
    });
    $("#memorySection").hidden = !$("#memoryGallery").childElementCount;
  }

  $("#secretBtn").addEventListener("click", () => {
    playChime([783.99, 987.77]);
    const dialog = $("#secretDialog");
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  });
  function closeDialog() {
    const dialog = $("#secretDialog");
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }
  $("#closeSecretBtn").addEventListener("click", closeDialog);
  $("#secretDialog").addEventListener("click", (event) => {
    if (event.target === $("#secretDialog")) closeDialog();
  });

  // ==============================================================
  // V3: BUNNY'S SECRET DELIVERY
  // Hanya pengisian dan pengiriman manual dengan persetujuan penerima.
  // TIDAK PERNAH mengambil GPS/IP/lokasi browser.
  // ==============================================================
  const rawDeliveryEmail = String(config.deliveryEmail || "").trim();
  const deliveryReady = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawDeliveryEmail)
    && !rawDeliveryEmail.toUpperCase().includes("GANTI_")
    && !/^.*@example\.(com|org|net)$/i.test(rawDeliveryEmail);
  const deliverySection = $("#deliverySection");
  const deliveryForm = $("#deliveryForm");
  const sendButton = $("#sendDeliveryBtn");
  let deliverySubmitted = false;
  let deliveryPending = false;

  $("#deliveryHeading").textContent = config.deliveryQuestion || "Psst... mau kejutan kecil berikutnya? 🎀";
  $("#deliveryDescription").textContent = config.deliveryDescription || "Bunny punya kejutan kecil yang mungkin bisa diantar untukmu! 🐰";
  $("#deliveryRecipientLabel").textContent = deliveryReady ? rawDeliveryEmail : "email pengirim hadiah";
  if (config.enableDelivery === false) deliverySection.hidden = true;

  function displayDeliveryPanel(name) {
    ["deliveryChoice", "deliveryFormWrap", "deliveryDeclined", "deliverySuccess", "deliveryUnconfigured"]
      .forEach((id) => { $("#" + id).hidden = id !== name; });
    $("#deliveryError").hidden = true;
  }
  function openDeliveryForm() {
    if (deliverySubmitted) { displayDeliveryPanel("deliverySuccess"); return; }
    if (!deliveryReady) { displayDeliveryPanel("deliveryUnconfigured"); return; }
    displayDeliveryPanel("deliveryFormWrap");
    playChime([698.46, 880]);
    $("#deliveryFormWrap").scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth", block: "nearest" });
  }
  $("#acceptDeliveryBtn").addEventListener("click", openDeliveryForm);
  $("#declineDeliveryBtn").addEventListener("click", () => {
    displayDeliveryPanel("deliveryDeclined");
    playChime([659.25, 523.25]);
  });
  $("#reconsiderDeliveryBtn").addEventListener("click", openDeliveryForm);
  $("#cancelDeliveryBtn").addEventListener("click", () => {
    if (deliveryPending) return;
    deliveryForm.reset(); // Tidak menyimpan data pribadi yang dibatalkan.
    displayDeliveryPanel("deliveryChoice");
  });

  deliveryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (deliveryPending || deliverySubmitted) return;
    const errorBox = $("#deliveryError");
    errorBox.hidden = true;
    if (!deliveryReady) { displayDeliveryPanel("deliveryUnconfigured"); return; }
    if (!deliveryForm.checkValidity()) {
      errorBox.textContent = "Isi nama dan alamat pengantaran, lalu centang persetujuannya dulu, ya. 🐰";
      errorBox.hidden = false;
      deliveryForm.reportValidity();
      return;
    }
    deliveryPending = true;
    sendButton.disabled = true;
    sendButton.textContent = "Bunny sedang mengirim... 💌";
    const fields = new FormData(deliveryForm);
    const payload = {
      "Nama penerima": String(fields.get("Nama penerima") || "").trim(),
      "Alamat atau titik pengantaran": String(fields.get("Alamat atau titik pengantaran") || "").trim(),
      "WhatsApp penerima (opsional)": String(fields.get("WhatsApp penerima (opsional)") || "").trim() || "(tidak diisi)",
      "Catatan tambahan (opsional)": String(fields.get("Catatan tambahan (opsional)") || "").trim() || "(tidak diisi)",
      "Persetujuan": "Ya, saya menyetujui pengiriman data untuk pengantaran kejutan.",
      "_subject": "🐰 Bunny Birthday Surprise — Titik Pengantaran",
      "_captcha": "false",
      "_template": "table",
      "_honey": "",
      "_url": window.location.origin + window.location.pathname
    };
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(rawDeliveryEmail)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });
      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error(`Respons layanan email tidak valid (HTTP ${response.status}).`);
      }
      const accepted = response.ok && (result.success === true || result.success === "true");
      if (!accepted) {
        throw new Error(
          typeof result.message === "string" && result.message.trim()
            ? result.message.trim()
            : `Layanan email menolak pengiriman (HTTP ${response.status}).`
        );
      }
      deliverySubmitted = true;
      deliveryForm.reset();
      displayDeliveryPanel("deliverySuccess");
      celebrate(24);
      playChime([523.25, 659.25, 880]);
    } catch (error) {
      const detail = String(error?.message || "");
      if (/activat|confirm your form|confirm.*email/i.test(detail)) {
        errorBox.textContent = "Kotak surat Bunny perlu diaktifkan dulu! Pengirim hadiah harus memeriksa email aktivasi FormSubmit di inbox atau Spam. Setelah aktif, coba lagi, ya. 🐰";
      } else if (/web server|HTML files|referer|referrer/i.test(detail)) {
        errorBox.textContent = "FormSubmit belum mengenali website. Buka Bunny lewat link GitHub Pages, bukan file dari laptop, lalu coba lagi. 🐰";
      } else {
        const usefulDetail = detail && !/failed to fetch|networkerror|load failed/i.test(detail)
          ? detail.slice(0, 180) : "Koneksi ke layanan email gagal.";
        errorBox.textContent = `Surat Bunny belum terkirim: ${usefulDetail} Coba lagi atau kabari pengirimnya. 🐰`;
      }
      errorBox.hidden = false;
    } finally {
      deliveryPending = false;
      sendButton.disabled = false;
      sendButton.textContent = "Kirim ke Bunny Courier 💌";
    }
  });

  $("#replayBtn").addEventListener("click", () => {
    carrots = 0;
    candles = 0;
    chosenNote = null;
    petCount = 0;
    $("#bunnySpeech").textContent = "Psst... aku bawa paket buat kamu! ♡";
    $("#petBunny").classList.remove("petted");
    $$("[data-carrot]").forEach((button) => {
      button.disabled = false;
      button.classList.remove("collected");
    });
    $$("[data-charm]").forEach((button) => {
      button.disabled = false;
      button.classList.remove("selected", "unchosen");
    });
    $$("[data-candle]").forEach((button) => {
      button.disabled = false;
      button.classList.remove("blown");
    });
    $$("[data-wish]").forEach((button) => {
      button.classList.remove("revealed");
      button.setAttribute("aria-expanded", "false");
    });
    $("#luckyReveal").hidden = true;
    $("#luckyKeepsake").hidden = true;
    $("#giftBtn").disabled = false;
    $("#giftBtn").classList.remove("opened");
    $("#carrotScore").textContent = "🥕 0 / 3 ditemukan";
    $("#candleScore").textContent = "🕯️ 0 / 3 lilin padam";
    $("#carrotHint").textContent = "Psst... mereka suka bersembunyi di taman.";
    $("#luckyHint").textContent = "Tenang, nggak ada jawaban salah di sini. ♡";
    $("#candleHint").textContent = "Wish, wish, wish... ✨";
    confettiLayer.replaceChildren();
    if (!deliveryPending) {
      if (!deliverySubmitted) deliveryForm.reset();
      displayDeliveryPanel(deliverySubmitted ? "deliverySuccess" : "deliveryChoice");
    }
    goToStage(0);
  });

  goToStage(0);
})();
