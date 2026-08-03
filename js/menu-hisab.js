const btnMenuHisab   = document.getElementById('menu-hisab');
const overlayHisab   = document.getElementById('hisabOverlay');
const panelHisab     = document.getElementById('panelHisab');
const btnCloseHisab  = document.getElementById('closeHisab');

if (btnMenuHisab) {
  btnMenuHisab.onclick = () => {
    overlayHisab.classList.remove('hidden');
    panelHisab.classList.remove('hidden');
    tabs.forEach(t => t.classList.remove('active'));
    tabs[0].classList.add('active');
    contents.forEach(c => c.classList.add('hidden'));
    inputIjtima.classList.remove('hidden');
    if (panelHasilHisab) panelHasilHisab.classList.add('hidden');
  };
}

function closeHisabPanel(){
  overlayHisab.classList.add('hidden');
  panelHisab.classList.add('hidden');
  if (panelHasilHisab) panelHasilHisab.classList.add('hidden');
}
overlayHisab.onclick  = closeHisabPanel;
btnCloseHisab.onclick = closeHisabPanel;

const tabs = document.querySelectorAll('.hisab-tabs .tab');
const inputIjtima = document.getElementById('hisabAkhirBulan');
const inputWS = document.getElementById('hisabWaktuShalat');
const contents = [inputIjtima, inputWS];

tabs.forEach((tab, index) => {
  tab.onclick = () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    contents.forEach(c => c.classList.add('hidden'));
    contents[index].classList.remove('hidden');
  };
});

const panelHasilHisab = document.getElementById('panelHasilHisab');
const btnBackToIjtima = document.getElementById('btnBackToIjtima');

if (btnBackToIjtima) {
    btnBackToIjtima.addEventListener("click", () => {
        panelHasilHisab.classList.add("hidden");
        panelHisab.classList.remove("hidden");
    });
}
// Menit desimal → Menit & Detik
function menitKeMS(x) {
  const sign = x < 0 ? '−' : '';
  x = Math.abs(x);
  const m = Math.floor(x);
  let s = (x - m) * 60;
  s = Math.round(s * 10) / 10;
  const formattedM = String(m).padStart(2, '0');
  const formattedS = s < 10 ? `0${s}` : s;
  return `${sign}${formattedM}:${formattedS}`;
}


// Derajat → Buruj DMS (30° = 1b)
function keBurujDMS(x){
  const sign = x < 0 ? '-' : '';
  x = Math.abs(x);
  // Normalisasi 0–360
  x = ((x % 360) + 360) % 360;
  const buruj = Math.floor(x / 30);
  const sisa  = x - (buruj * 30);
  let d = Math.floor(sisa);
  const mDecimal = (sisa - d) * 60;
  let m = Math.floor(mDecimal);
  let s = (mDecimal - m) * 60;
  s = Math.round(s * 10) / 10;
  if(s >= 60){s = 0;m += 1;}
  if(m >= 60){m = 0;d += 1;}
  return `${sign}${buruj}<sup>b</sup> ${d}° ${m}′ ${s}″`;}
  // Hari Jam Menit Detik
function keHariJMD(x) {
  const sign = x < 0 ? '-' : '';
  x = Math.abs(x);
  // Normalisasi 0–168 (siklus mingguan)
  x = ((x % 168) + 168) % 168;
  const hari = Math.floor(x / 24);
  const sisaJam = x - (hari * 24);
  let h = Math.floor(sisaJam);
  const mDecimal = (sisaJam - h) * 60;
  let m = Math.floor(mDecimal);
  let s = Math.round((mDecimal - m) * 60); // Dibulatkan ke detik terdekat
  // Koreksi jika detik overflow
  if (s >= 60) {s = 0; m += 1;}
  if (m >= 60) {m = 0; h += 1;}
  if (h >= 24) {h = 0;}
  return `${sign}${hari}<sup>h</sup> ${h}:${m}:${s}`;}

// DESIMAL → DERAJAT MENIT DETIK
function keDMS(nilai) {

    const tanda = nilai < 0 ? "-" : "";
    nilai = Math.abs(nilai);

    const d = Math.floor(nilai);
    const mFloat = (nilai - d) * 60;
    const m = Math.floor(mFloat);
    const s = ((mFloat - m) * 60).toFixed(2);

    return `${tanda}${d}° ${m}' ${s}"`;
}

// DESIMAL JAM → JAM MENIT DETIK
function keJMS(nilai) {

    nilai = ((nilai % 24) + 24) % 24;

    const j = Math.floor(nilai);
    const mFloat = (nilai - j) * 60;
    const m = Math.floor(mFloat);
    const d = Math.round((mFloat - m) * 60);

    return `${String(j).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(d).padStart(2,'0')}`;
}
// DESIMAL JAM → JAM MENIT DETIK (+/-)
function keJMSSelisih(nilai) {
    const isMinus = nilai < 0;
    nilai = Math.abs(nilai);
    const j = Math.floor(nilai);
    const mFloat = (nilai - j) * 60;
    const m = Math.floor(mFloat);
    const d = Math.round((mFloat - m) * 60);
    const tanda = isMinus ? "-" : "";
    return `${tanda}${String(j).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(d).padStart(2,'0')}`;
}


// KONVERSI HIJRI → MASEHI
function hijriKeMasehi(tahun, bulan) {

    const tgl = 1;

    let daor = Math.trunc((tahun - 1) / 30),
        st = (tahun - 1) % 30,
        jth = daor * 10631,
        thst = st * 354;

    const kabisat = [1, 4, 6, 9, 12, 15, 17, 20, 23, 25, 28];
    const ak = kabisat.filter(k => st > k).length;

    const jhdsMap = { 1: 0, 2: 30, 3: 59, 4: 89, 5: 118, 6: 148, 7: 177, 8: 207, 9: 236, 10: 266, 11: 295, 12: 325 };

    let jhds = jhdsMap[bulan],
        jhhk = jth + thst + ak + jhds + tgl,
        jhmk = 227014 + jhhk;

    // Pasaran
    let xp = jhhk % 5;
    let pasaran;

    switch (xp) {
        case 0: pasaran = "Kliwon"; break;
        case 1: pasaran = "Legi"; break;
        case 2: pasaran = "Pahing"; break;
        case 3: pasaran = "Pon"; break;
        case 4: pasaran = "Wage"; break;
    }

    let jhp = Math.round(
        (jhmk / 365.2425 - Math.trunc(jhmk / 365.2425)) * 365.2425
    );

    let tahunMasehi = Math.trunc(jhmk / 365.2425) + 1;

    const batasH = [31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];

    const namaBulan = [
        "Januari", "Februari", "Maret", "April",
        "Mei", "Juni", "Juli", "Agustus",
        "September", "Oktober", "November", "Desember"
    ];

    const bulanMasehi = batasH.findIndex(h => jhp <= h) + 1;

    const awalBulan = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

    let tanggal = Math.round(jhp - awalBulan[bulanMasehi - 1]);

    if (tanggal === 0) tanggal = 31;

    return {
        tanggal,
        bulan: bulanMasehi,
        namaBulan: namaBulan[bulanMasehi - 1],
        tahun: tahunMasehi,
        pasaran
    };

}


// HITUNG WAKTU ZAWAL & MAGHRIB
function hitungWaktuZawalDanMaghrib(data) {

    const d2r = d => d * Math.PI / 180;
    const r2d = r => r * 180 / Math.PI;

    const tahun = data.tahunMasehi;
    const bulan = data.bulanMasehi;
    const tanggal = data.tanggal;

    const φ = data.latitude;
    const λ = data.longitude;
    const zonaWaktu = 7;
    const ihtiyat = (data.ihtiyat || 0) / 60; // menit → jam

    // Koreksi ketinggian
    let dip = 0;
    if (data.useAltitude) {
        dip = 0.0293 * Math.sqrt(data.altitude);
    }

    // Julian Day
    let y = tahun;
    let m = bulan;

    if (m <= 2) {
        y--;
        m += 12;
    }

    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);

    const JD =
        Math.floor(365.25 * (y + 4716)) +
        Math.floor(30.6001 * (m + 1)) +
        tanggal +
        B -
        1524.5;

    // Matahari
    const T = (JD - 2451545) / 36525;

    const L0 = (280.46646 + 36000.76983 * T) % 360;
    const M = 357.52911 + 35999.05029 * T;

    const C =
        (1.914602 - 0.004817 * T) * Math.sin(d2r(M)) +
        0.019993 * Math.sin(d2r(2 * M));

    const lambda = L0 + C;

    const epsilon = 23.439291 - 0.0130042 * T;

    const delta = r2d(
        Math.asin(
            Math.sin(d2r(epsilon)) *
            Math.sin(d2r(lambda))
        )
    );

    const E =
        4 *
        r2d(
            Math.tan(d2r(epsilon / 2)) ** 2 *
                Math.sin(d2r(2 * L0)) -
                2 * 0.016708 * Math.sin(d2r(M))
        );

    const zawal =
        12 +
        zonaWaktu -
        (λ / 15) -
        (E / 60);

    // Busur waktu
    function hitungBusur(h) {

        const pembilang =
            Math.sin(d2r(h)) -
            Math.sin(d2r(φ)) *
                Math.sin(d2r(delta));

        const penyebut =
            Math.cos(d2r(φ)) *
            Math.cos(d2r(delta));

        const arg = pembilang / penyebut;

        if (arg <= -1) return 12;
        if (arg >= 1) return 0;

        return r2d(Math.acos(arg)) / 15;
    }

    // memakai koreksi dip
    const tMaghrib = hitungBusur(-0.833 - dip);

    const maghrib = zawal + tMaghrib + ihtiyat;

    return {
        JD,
        delta,
        equationOfTime: E,
        dip,
        zawal,
        maghrib
    };
}

// PROSES HISAB IJTIMA DARI SEMUA METODE
document.getElementById("btnProsesHisabIjtima")
.addEventListener("click", prosesHisab);

function prosesHisab() {

    const data = {
        tahun: Number(document.getElementById("inputIjtimaTahun").value),
        bulan: Number(document.getElementById("inputIjtimaBulan").value),
        kriteria: Number(document.getElementById("inputIjtimaIrtifa").value),
        metode: document.getElementById("inputIjtimaMetode").value,

        latitude: Number(localStorage.getItem("lat")) || 0,
        longitude: Number(localStorage.getItem("lon")) || 0,
        ihtiyat: Number(localStorage.getItem('ihtiyat')) || 0,
        altitude: Number(localStorage.getItem("altitude")) || 0,
        useAltitude: localStorage.getItem("use_altitude") === "true"
    };

    // Konversi Hijri → Masehi
    const konversi = hijriKeMasehi(data.tahun, data.bulan);

    data.tanggal = konversi.tanggal;
    data.bulanMasehi = konversi.bulan;
    data.namaBulanMasehi = konversi.namaBulan;
    data.tahunMasehi = konversi.tahun;
    data.pasaran = konversi.pasaran;
    
    // Waktu Zawal dan Maghrib
    const waktu = hitungWaktuZawalDanMaghrib(data);

    data.JD = waktu.JD;
    data.zawal = waktu.zawal;
    data.maghrib = waktu.maghrib;

    let hasil;

    switch (data.metode) {

        case "sn":
            hasil = hisabSN(data);
            break;

        case "fr":
            hasil = hisabFR(data);
            break;

        case "jm":
            hasil = hisabJM(data);
            break;

        default:
            return;
    }

    tampilkanHasil(hasil);
}

function tampilkanHasil(hasil){

    document.getElementById("hasilHisabAkhirBulan").innerHTML = `
        <span class="sub">${hasil.metode}</span>
        ${hasil.html}
    `;

    panelHisab.classList.add("hidden");
    panelHasilHisab.classList.remove("hidden");
}