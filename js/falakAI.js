const chatArea = document.getElementById("chatArea");
const chatInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendBtn");

const WORKER_URL = "https://purple-pond-1b94.abdulghofur234234234.workers.dev/";

// API Key - Harus sama dengan di Worker
const API_KEY = "ngobroldenganfalakai";

const defaultSettings = {
  altitude: 100,
  kriteria: "4",
  latitude: -6.2,
  longitude: 106.816666
};

const namaBulanHijriyah = ["", "Muharram", "Shafar", "Rabiul Awal", "Rabiul Akhir", "Jumadil Ula", "Jumadil Akhirah", "Rajab", "Sya'ban", "Ramadhan", "Syawwal", "Dzulqa'dah", "Dzulhijjah"];

let konteksFalakAI = {
  tahap: "normal",
  bulan: null,
  tahun: null,
  hasilHisab: null
};

let isProcessing = false;

function tampilkanIndikatorMengetik() {
  const indicator = document.createElement("div");
  indicator.className = "message ai typing-indicator";
  indicator.id = "typingIndicator";
  const bubble = document.createElement("div");
  bubble.className = "bubble typing-bubble";
  bubble.innerHTML = `
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
  `;
  indicator.appendChild(bubble);
  chatArea.appendChild(indicator);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function hapusIndikatorMengetik() {
  const indicator = document.getElementById("typingIndicator");
  if (indicator) {
    indicator.remove();
  }
}

function kirimPesanAI(teks, html = false, jedaMs = null) {
  if (jedaMs === null) {
    const panjangTeks = teks.replace(/<[^>]*>/g, "").length;
    jedaMs = Math.min(3000, Math.max(800, panjangTeks * 15));
  }
  tampilkanIndikatorMengetik();
  return new Promise(resolve => {
    setTimeout(() => {
      hapusIndikatorMengetik();
      tambahPesan(teks, "ai", html);
      resolve();
    }, jedaMs);
  });
}

function tambahPesan(teks, tipe = "ai", html = false) {
  const message = document.createElement("div");
  message.className = `message ${tipe}`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  if (html) {
    bubble.innerHTML = teks;
  } else {
    bubble.textContent = teks;
  }
  if (tipe === "ai") {
    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-btn";
    copyBtn.innerHTML = "📋";
    copyBtn.title = "Salin teks";
    copyBtn.onclick = function () {
      salinTeks(teks, copyBtn);
    };
    bubble.appendChild(copyBtn);
  }
  message.appendChild(bubble);
  chatArea.appendChild(message);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function salinTeks(teks, btn) {
  const textarea = document.createElement("textarea");
  textarea.value = teks.replace(/<[^>]*>/g, "");
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    btn.innerHTML = "✅";
    btn.title = "Tersalin!";
    setTimeout(() => {
      btn.innerHTML = "📋";
      btn.title = "Salin teks";
    }, 2000);
  } catch (err) {
    btn.innerHTML = "❌";
    btn.title = "Gagal menyalin";
    setTimeout(() => {
      btn.innerHTML = "📋";
      btn.title = "Salin teks";
    }, 2000);
  }
  document.body.removeChild(textarea);
}

const normalisasi = teks =>
  teks.toLowerCase().trim().replace(/[?!.,]/g, "");

const jawabanYa = teks =>
  ["ya", "iya", "y", "betul", "benar", "oke", "ok"].includes(
    normalisasi(teks)
  );

const jawabanTidak = teks =>
  ["tidak", "ga", "gak", "nggak", "bukan", "no"].includes(
    normalisasi(teks)
  );

async function tanyaFalakAI(teks, settings = defaultSettings) {
  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
      },
      body: JSON.stringify({
        message: teks,
        ...settings
      })
    });
    if (!response.ok) {
      throw new Error("Worker gagal merespons");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error Worker:", error);
    return null;
  }
}

function formatRincianHisab(dataHisab) {
  const d = dataHisab;
  const i = d.ijtimak || {};
  const g = d.ghurub || {};
  const m = d.matahari || {};
  const b = d.bulan || {};
  const t = d.tinggi || {};

  function angka(nilai, digit = 6) {
    if (nilai === null || nilai === undefined || Number.isNaN(Number(nilai))) {
      return "-";
    }
    return Number(nilai).toFixed(digit);
  }

  function jam(nilai) {
    if (nilai === null || nilai === undefined || Number.isNaN(Number(nilai))) {
      return "-";
    }
    let total = Math.round(Number(nilai) * 3600);
    total = (total % 86400 + 86400) % 86400;
    const h = Math.floor(total / 3600);
    const min = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return String(h).padStart(2, "0") + ":" + String(min).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  return `
<div class="hisab-detail">
<h3>📅 Hasil Awal Bulan</h3>
<table>
<tr><td>Bulan Hijriyah</td><td>${d.namaBulanH || "-"}</td></tr>
<tr><td>Awal Bulan</td><td>${d.awal?.hari || "-"} ${d.awal?.pasaran || "-"}, ${d.awal?.tgl || "-"} ${d.awal?.namaBulan || "-"} ${d.awal?.thn || "-"} M</td></tr>
<tr><td>Kriteria</td><td>${d.kriteria || "-"}</td></tr>
<tr><td>Imkan Rukyat</td><td>${d.imkan ? "Memenuhi" : "Belum memenuhi"}</td></tr>
</table>

<h3>🌑 Ijtimak</h3>
<table>
<tr><td>Tanggal</td><td>${i.tgl || "-"} / ${i.bln || "-"} / ${i.thn || "-"}</td></tr>
<tr><td>Jam</td><td>${jam(i.jam)} ${d.zonaNama || ""}</td></tr>
<tr><td>Hari</td><td>${i.hari || "-"}</td></tr>
<tr><td>Pasaran</td><td>${i.pasaran || "-"}</td></tr>
</table>

<h3>🌅 Ghurub Matahari</h3>
<table>
<tr><td>Waktu Ghurub</td><td>${jam(g.sunset)} ${d.zonaNama || ""}</td></tr>
<tr><td>Waktu Terbit</td><td>${jam(g.sunrise)} ${d.zonaNama || ""}</td></tr>
</table>

<h3>☀️ Matahari</h3>
<table>
<tr><td>Asensio Rekta</td><td>${angka(m.ra)}°</td></tr>
<tr><td>Deklinasi</td><td>${angka(m.dec)}°</td></tr>
<tr><td>Azimut</td><td>${angka(m.az)}°</td></tr>
<tr><td>Equation of Time</td><td>${angka(m.perata, 4)} menit</td></tr>
</table>

<h3>🌙 Bulan</h3>
<table>
<tr><td>Asensio Rekta</td><td>${angka(b.ra)}°</td></tr>
<tr><td>Deklinasi</td><td>${angka(b.dec)}°</td></tr>
<tr><td>Azimut</td><td>${angka(b.az)}°</td></tr>
<tr><td>Paralaks</td><td>${angka(b.paralaks)}°</td></tr>
</table>

<h3>🌙 Data Hilal</h3>
<table>
<tr><td>Tinggi Hakiki</td><td>${angka(t.hcHakiki)}°</td></tr>
<tr><td>Tinggi Toposentrik</td><td>${angka(t.htTopo)}°</td></tr>
<tr><td>Refraksi</td><td>${angka(t.refraksi)}°</td></tr>
<tr><td>Dip Ufuk</td><td>${angka(t.dip)}°</td></tr>
<tr><td>Tinggi Mar'i</td><td>${angka(t.tinggiMari)}°</td></tr>
<tr><td>Elongasi</td><td>${angka(d.elongasi)}°</td></tr>
<tr><td>Nurul Hilal</td><td>${d.nurulHilal || "-"}%</td></tr>
<tr><td>Umur Hilal</td><td>${angka(d.umurHilal, 4)} jam</td></tr>
<tr><td>Lama Hilal</td><td>${angka(d.lamaHilal, 4)} jam</td></tr>
</table>
</div>
`;
}

async function prosesPesan(teks) {
  teks = teks.trim();
  if (!teks || isProcessing) {
    return;
  }
  isProcessing = true;
  tambahPesan(teks, "user");
  chatInput.value = "";
  const k = konteksFalakAI;

  if (k.tahap === "konfirmasi_bulan") {
    if (jawabanYa(teks)) {
      await kirimPesanAI("Baik, saya akan menghitungnya...", false, 800);
      const pertanyaanHitung = `Kapan 1 ${namaBulanHijriyah[k.bulan]} ${k.tahun} H`;
      const hasil = await tanyaFalakAI(pertanyaanHitung);
      if (hasil && hasil.intent === "hasil_hisab" && hasil.data) {
        k.hasilHisab = hasil.data;
        k.bulan = hasil.context?.bulan || k.bulan;
        k.tahun = hasil.context?.tahun || k.tahun;
        await kirimPesanAI(hasil.answer, false, 1000);
        k.tahap = "tanya_rincian";
      } else {
        await kirimPesanAI("Maaf, terjadi kesalahan dalam perhitungan.", false, 800);
        k.tahap = "normal";
      }
      isProcessing = false;
      return;
    }
    if (jawabanTidak(teks)) {
      await kirimPesanAI("Baik. Silakan jelaskan kembali pertanyaan Anda.", false, 800);
      k.tahap = "normal";
      k.bulan = null;
      k.tahun = null;
      isProcessing = false;
      return;
    }
    await kirimPesanAI("Mohon jawab Ya atau Tidak.", false, 600);
    isProcessing = false;
    return;
  }

  if (k.tahap === "tanya_rincian") {
    if (jawabanYa(teks)) {
      await kirimPesanAI("Berikut adalah rincian perhitungan hisabnya:", false, 800);
      await kirimPesanAI(formatRincianHisab(k.hasilHisab), true, 1200);
      k.tahap = "normal";
      isProcessing = false;
      return;
    }
    if (jawabanTidak(teks)) {
      await kirimPesanAI("Baik. Silakan tanyakan awal bulan Hijriyah lainnya.", false, 800);
      k.tahap = "normal";
      isProcessing = false;
      return;
    }
    await kirimPesanAI("Mohon jawab Ya jika ingin melihat rincian, atau Tidak jika tidak.", false, 600);
    isProcessing = false;
    return;
  }

  const t = normalisasi(teks);
  if (
    t.includes("assalamualaikum") ||
    t === "halo" ||
    t === "hai"
  ) {
    await kirimPesanAI(
      "Hai Sobat! 👋\n\nSaya adalah FalakAI. Saya dapat membantu menjawab pertanyaan seputar pembahasan Falak dan melakukan perhitungan Awal Bulan Hijriyah menggunakan metode Jean Meeus.",
      false,
      1000
    );
    isProcessing = false;
    return;
  }

  const dataAI = await tanyaFalakAI(teks);
  if (!dataAI) {
    await kirimPesanAI("Maaf, terjadi kesalahan koneksi. Silakan coba lagi.", false, 800);
    isProcessing = false;
    return;
  }

  if (dataAI.intent === "hasil_hisab" && dataAI.data) {
    k.hasilHisab = dataAI.data;
    k.bulan = dataAI.context?.bulan || null;
    k.tahun = dataAI.context?.tahun || null;
    await kirimPesanAI(dataAI.answer, false, 1000);
    k.tahap = "tanya_rincian";
    isProcessing = false;
    return;
  }

  if (dataAI.intent === "hasil_tanggal_masehi") {
    await kirimPesanAI(dataAI.answer || "Tanggal Masehi berhasil dihitung.", false, 800);
    isProcessing = false;
    return;
  }

  if (dataAI.intent === "awal_bulan" && dataAI.context?.bulan) {
    k.bulan = dataAI.context.bulan;
    k.tahun = dataAI.context.tahun || null;
    k.tahap = "konfirmasi_bulan";
    await kirimPesanAI(dataAI.answer || `Apakah Anda ingin mengetahui awal bulan ${namaBulanHijriyah[k.bulan]}?`, false, 800);
    isProcessing = false;
    return;
  }

  if (
    dataAI.intent === "chat" ||
    dataAI.intent === "pengetahuan_falak"
  ) {
    await kirimPesanAI(dataAI.answer || "Maaf, saya belum dapat memberikan jawaban.", false, 800);
    isProcessing = false;
    return;
  }

  if (dataAI.intent === "error") {
    await kirimPesanAI(dataAI.answer || "Terjadi kesalahan.", false, 800);
    isProcessing = false;
    return;
  }

  await kirimPesanAI(
    "Maaf, saya belum memahami pertanyaan tersebut.\n\nContoh pertanyaan:\n\"Kapan puasa tahun depan?\"\n\"Kapan Lebaran?\"\n\"Kapan awal Ramadhan 1448 H?\"\n\"Apa itu hilal?\"",
    false,
    1200
  );
  isProcessing = false;
}

sendButton.addEventListener("click", () => {
  prosesPesan(chatInput.value);
});

chatInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    prosesPesan(chatInput.value);
  }
});