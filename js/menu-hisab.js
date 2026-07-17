const btnMenuHisab   = document.getElementById('menu-hisab');
const overlayHisab   = document.getElementById('hisabOverlay');
const panelHisab     = document.getElementById('panelHisab');
const btnCloseHisab  = document.getElementById('closeHisab');

if (btnMenuHisab) {
  btnMenuHisab.onclick = () => {
    overlayHisab.classList.remove('hidden');
    panelHisab.classList.remove('hidden');

    // reset tab
    tabs.forEach(t => t.classList.remove('active'));
    tabs[0].classList.add('active');

    contents.forEach(c => c.classList.add('hidden'));
    inputIjtima.classList.remove('hidden');

    // pastikan panel hasil tertutup
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

/* ===============================
   TAB & KONTEN HISAB IJTIMA
================================ */
const tabs = document.querySelectorAll('.hisab-tabs .tab');

const inputIjtima   = document.getElementById('hisabAkhirBulan');
const inputIjtimaFR   = document.getElementById('hisabAkhirBulanFR');
const inputIjtimaJM   = document.getElementById('hisabAkhirBulanJM');

const contents = [inputIjtima, inputIjtimaFR, inputIjtimaJM];

/* ===============================
   TAB HANDLER
================================ */
tabs.forEach((tab, index) => {
  tab.onclick = () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    contents.forEach(c => c.classList.add('hidden'));
    contents[index].classList.remove('hidden');
  };
});

// SULAMUN NAYIREIN
const panelHasilHisab = document.getElementById('panelHasilHisab');
const btnProsesHisab  = document.getElementById('btnProsesHisab');
const btnBackToIjtima = document.getElementById('btnBackToIjtima');

if (btnProsesHisab) {
  btnProsesHisab.onclick = () => {
  const lon = 107.178, lat = -6.786;
  
  // KONVERSI SUDUT & WAKTU
  const toDMS = x => {
    const sign = x < 0 ? '-' : '';
    x = Math.abs(x);
    const d = Math.floor(x);
    const mDecimal = (x - d) * 60;
    const m = Math.floor(mDecimal);
    let s = (mDecimal - m) * 60;
    s = Math.round(s * 10) / 10;
    return `${sign}${d}° ${m}′ ${s}″`;
  };
  
  // Jam desimal → HH:MM:SS
  const toHMS = x => {
    x = (x + 24) % 24;
    const h = Math.floor(x);
    const mDecimal = (x - h) * 60;
    const m = Math.floor(mDecimal);
    let s = (mDecimal - m) * 60;
    s = Math.round(s);
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };
  
  const toJMD = x => {
    const sign = x < 0 ? '-' : '';
    const absX = Math.abs(x);
    const h = Math.floor(absX);
    const mDecimal = (absX - h) * 60;
    const m = Math.floor(mDecimal);
    let s = (mDecimal - m) * 60;
    s = Math.round(s);
    if (s === 60) {
      s = 0;
    }
    return `${sign}${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  // Menit desimal → Menit & Detik
  function menitKeMS(x){
    const sign = x < 0 ? '−' : '';
    x = Math.abs(x);
    const m = Math.floor(x);
    let s = (x - m) * 60;
    s = Math.round(s * 10) / 10;
    return `${sign}${m}′ ${s}″`;
  }
  
  // Derajat → Buruj DMS (30° = 1b)
  function toBurujDMS(x){
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
  function toHariJMD(x) {
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
    
  const kst = document.getElementById('kst').value;
  let tMB =  kst%10, tMJ = kst - (kst%10), b = document.getElementById('bulanhijriyah').value;
  
  const bulanList = ["Muharom", "Sopar", "Robiul Awal", "Robiul Akhir", "Jumadil Awal", "Jumadil Akhir", "Rojab", "Sya'ban", "Romadhon", "Syawal", "Dzul Qo'dah", "Dzul Hijjah"];
  const hariList = ["Sabtu", "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at"];
  
  const daSMJ = [
    [1410, 161.900], [1420, 33.983], [1430, 74.067], [1440, 114.150], [1450, 154.233], [1460, 26.317], [1470, 66.400], [1480, 106.483], 
    [1490, 146.566], [1500, 18.649], [1510, 58.732], [1520, 98.815], [1530, 138.898], [1540, 10.981], [1550, 51.064]]; 
  const dhSMJ = [
    [1410, 197.550], [1420, 278.050], [1430, 358.550], [1440, 79.050], [1450, 159.550], [1460, 240.050], [1470, 320.550], [1480, 41.050], 
    [1490, 121.550], [1500, 202.050], [1510, 282.550], [1520, 3.050], [1530, 83.550], [1540, 164.050], [1550, 244.550]];
  const dwSMJ = [
    [1410, 162.000], [1420, 54.800], [1430, 307.600], [1440, 200.400], [1450, 93.200], [1460, 346.000], [1470, 238.800], [1480, 131.600], 
    [1490, 24.400], [1500, 277.200], [1510, 170.000], [1520, 62.800], [1530, 315.600], [1540, 208.400], [1550, 101.200]];
  const dkSMJ = [
    [1410, 322.217], [1420, 180.217], [1430, 38.217], [1440, 256.217], [1450, 114.217], [1460, 332.217], [1470, 190.217], [1480, 48.217], 
    [1490, 266.217], [1500, 124.217], [1510, 342.217], [1520, 3.050], [1530, 83.550], [1540, 164.050], [1550, 244.550]];
  const dmSMJ = [
    [1410, 59.833], [1420, 312.500], [1430, 205.167], [1440, 97.833], [1450, 350.500], [1460, 243.167], [1470, 135.833], [1480, 28.500], 
    [1490, 281.167], [1500, 173.833], [1510, 66.500], [1520, 319.167], [1530, 211.834], [1540, 104.501], [1550, 357.168]];
  
  let aSMJ = daSMJ.find(([batas]) => tMJ <= batas)?.[1] || 0;
  let hSMJ = dhSMJ.find(([batas]) => tMJ <= batas)?.[1] || 0;
  let wSMJ = dwSMJ.find(([batas]) => tMJ <= batas)?.[1] || 0;
  let kSMJ = dkSMJ.find(([batas]) => tMJ <= batas)?.[1] || 0;
  let mSMJ = dmSMJ.find(([batas]) => tMJ <= batas)?.[1] || 0;
  
  const daSMB = [
  [1, 104.800], [2, 41.617], [3, 146.417], [4, 83.233], [5, 20.033], [6, 124.850], [7, 61.650], [8, 166.467], [9, 103.267], [10, 40.083]];
  const dhSMB = [
    [1, 8.050], [2, 16.100], [3, 24.150], [4, 32.200], [5, 40.250], [6, 48.300], [7, 56.350], [8, 64.400], [9, 72.450], [10, 80.500]];
  const dwSMB = [
    [1, 349.267], [2, 338.567], [3, 327.833], [4, 317.117], [5, 306.400], [6, 295.683], [7, 284.967], [8, 274.233], [9, 263.517], [10, 252.800]]; 
  const dkSMB = [
    [1, 309.800], [2, 259.600], [3, 209.400], [4, 159.200], [5, 109.000], [6, 58.800], [7, 8.600], [8, 318.400], [9, 268.200], [10, 218.000]];
  const dmSMB = [
    [1, 349.267], [2, 338.533], [3, 327.800], [4, 317.067], [5, 306.333], [6, 295.600], [7, 284.867], [8, 274.133], [9, 263.400], [10, 252.667]];
    
  let aSMB = daSMB.find(([batas]) => tMB <= batas)?.[1] || 0;
  let hSMB = dhSMB.find(([batas]) => tMB <= batas)?.[1] || 0;
  let wSMB = dwSMB.find(([batas]) => tMB <= batas)?.[1] || 0;
  let kSMB = dkSMB.find(([batas]) => tMB <= batas)?.[1] || 0;
  let mSMB = dmSMB.find(([batas]) => tMB <= batas)?.[1] || 0;
  
  const daB = [[1, 68.067], [2, 0.000], [3, 36.733], [4, 73.467], [5, 110.200], [6, 146.933], [7, 15.667], [8, 52.400], [9, 89.133], [10, 125.867], [11, 162.600], [12, 31.333]];
  const dhB = [[1, 337.383], [2, 0.000], [3, 30.667], [4, 61.333], [5, 92.017], [6, 122.683], [7, 153.350], [8, 184.017], [9, 214.700], [10, 245.367], [11, 276.050], [12, 306.717]];
  const dwB = [[1, 320.167], [2, 0.000], [3, 29.100], [4, 58.217], [5, 87.317], [6, 116.433], [7, 145.533], [8, 174.633], [9, 203.750], [10, 232.850], [11, 261.950], [12, 291.067]];
  const dkB = [[1, 283.983], [2, 0.000], [3, 25.817], [4, 51.633], [5, 77.433], [6, 103.267], [7, 129.083], [8, 154.900], [9, 180.717], [10, 206.533], [11, 232.350], [12, 258.167]];
  const dmB = [[1, 320.167], [2, 0.000], [3, 29.100], [4, 58.217], [5, 87.317], [6, 116.433], [7, 145.533], [8, 174.633], [9, 203.750], [10, 232.850], [11, 261.950], [12, 291.067]];

  let aB = daB.find(([batas]) => b <= batas)?.[1] || "0";
  let hB = dhB.find(([batas]) => b <= batas)?.[1] || "0";
  let wB = dwB.find(([batas]) => b <= batas)?.[1] || "0";
  let kB = dkB.find(([batas]) => b <= batas)?.[1] || "0";
  let mB = dmB.find(([batas]) => b <= batas)?.[1] || "0";
  
  let ta = (aSMJ + aSMB + aB) % 168,
    th = (hSMJ + hSMB + hB) % 360,
    tw = (wSMJ + wSMB + wB) % 360,
    tk = Math.round((kSMJ + kSMB + kB) % 360),
    tm = Math.round((mSMB + mSMJ + mB) % 360);

  const lookupTadilKhosoh = [
    4.983, 4.900, 4.833, 4.750, 4.667, 4.583, 4.500, 4.417, 4.333, 4.250, // 0 - 9
    4.183, 4.100, 4.017, 3.933, 3.850, 3.783, 3.717, 3.633, 3.550, 3.467, // 10 - 19
    3.400, 3.317, 3.250, 3.183, 3.117, 3.050, 2.967, 2.900, 2.817, 2.750, // 20 - 29
    2.683, 2.600, 2.533, 2.467, 2.400, 2.333, 2.250, 2.183, 2.117, 2.050, // 30 - 39
    1.983, 1.917, 1.850, 1.783, 1.717, 1.667, 1.600, 1.550, 1.483, 1.433, // 40 - 49
    1.383, 1.317, 1.267, 1.217, 1.167, 1.117, 1.067, 1.017, 0.967, 0.917, // 50 - 59
    0.867, 0.817, 0.783, 0.733, 0.683, 0.633, 0.600, 0.567, 0.533, 0.483, // 60 - 69
    0.450, 0.433, 0.417, 0.383, 0.350, 0.300, 0.283, 0.267, 0.250, 0.217, // 70 - 79
    0.183, 0.150, 0.133, 0.117, 0.100, 0.083, 0.067, 0.050, 0.050, 0.033, // 80 - 89
    0.033, 0.033, 0.017, 0.017, 0.000, 0.000, 0.000, 0.000, 0.017, 0.017, // 90 - 99
    0.033, 0.033, 0.050, 0.067, 0.083, 0.100, 0.117, 0.133, 0.150, 0.167, // 100 - 109
    0.183, 0.200, 0.250, 0.267, 0.300, 0.317, 0.350, 0.383, 0.417, 0.450, // 110 - 119
    0.500, 0.533, 0.583, 0.617, 0.667, 0.717, 0.767, 0.817, 0.867, 0.917, // 120 - 129
    0.967, 1.033, 1.083, 1.150, 1.200, 1.250, 1.317, 1.383, 1.450, 1.517, // 130 - 139
    1.583, 1.650, 1.717, 1.783, 1.850, 1.933, 2.000, 2.083, 2.150, 2.233, // 140 - 149
    2.317, 2.383, 2.450, 2.533, 2.617, 2.717, 2.800, 2.950, 2.967, 3.050, // 150 - 159
    3.133, 3.217, 3.317, 3.400, 3.483, 3.583, 3.667, 3.750, 3.850, 3.933, // 160 - 169
    4.033, 4.117, 4.200, 4.283, 4.367, 4.450, 4.550, 4.650, 4.767, 4.867, // 170 - 179
    4.983, 5.083, 5.183, 5.267, 5.367, 5.450, 5.550, 5.650, 5.750, 5.833, // 180 - 189
    5.933, 6.033, 6.133, 6.217, 6.317, 6.400, 6.500, 6.583, 6.667, 6.750, // 190 - 199
    6.833, 6.933, 7.017, 7.100, 7.183, 7.267, 7.350, 7.433, 7.517, 7.600, // 200 - 209
    7.683, 7.767, 7.833, 7.917, 7.983, 8.050, 8.133, 8.200, 8.283, 8.350, // 210 - 219
    8.417, 8.483, 8.550, 8.617, 8.683, 8.733, 8.800, 8.850, 8.900, 8.967, // 220 - 229
    9.017, 9.067, 9.117, 9.167, 9.217, 9.267, 9.317, 9.350, 9.383, 9.433, // 230 - 239
    9.483, 9.517, 9.550, 9.600, 9.633, 9.667, 9.683, 9.700, 9.733, 9.767, // 240 - 249
    9.800, 9.817, 9.833, 9.850, 9.867, 9.883, 9.900, 9.917, 9.933, 9.950, // 250 - 259
    9.950, 9.967, 9.967, 9.983, 9.983, 10.000, 10.000, 10.000, 9.983, 9.983, // 260 - 269
    9.983, 9.983, 9.967, 9.950, 9.950, 9.933, 9.900, 9.883, 9.867, 9.833, // 270 - 279
    9.800, 9.783, 9.767, 9.733, 9.717, 9.683, 9.650, 9.617, 9.583, 9.550, // 280 - 289
    9.517, 9.483, 9.450, 9.417, 9.383, 9.333, 9.283, 9.250, 9.217, 9.167, // 290 - 299
    9.117, 9.067, 9.017, 8.967, 8.917, 8.867, 8.817, 8.767, 8.717, 8.667, // 300 - 309
    8.600, 8.550, 8.483, 8.417, 8.367, 8.300, 8.250, 8.183, 8.117, 8.050, // 310 - 319
    7.983, 7.917, 7.850, 7.783, 7.717, 7.650, 7.583, 7.517, 7.450, 7.383, // 320 - 329
    7.300, 7.233, 7.150, 7.083, 7.000, 6.933, 6.867, 6.800, 6.717, 6.650, // 330 - 339
    6.583, 6.500, 6.400, 6.350, 6.267, 6.183, 6.100, 6.017, 5.950, 5.867, // 340 - 349
    5.783, 5.700, 5.617, 5.550, 5.467, 5.383, 5.300, 5.217, 5.150, 5.067  // 350 - 359
  ];
  let index = Math.ceil(tk);if (index < 0) index = 0;if (index >= lookupTadilKhosoh.length) index = lookupTadilKhosoh.length - 1;let tadilkhosoh = lookupTadilKhosoh[index];
  
  const lookupTadilMarkaz = [
  1.933, 1.983, 2.017, 2.050, 2.083, 2.100, 2.133, 2.167, 2.200, 2.233, // 0 - 9
  2.267, 2.300, 2.317, 2.350, 2.383, 2.417, 2.450, 2.483, 2.517, 2.550, // 10 - 19
  2.583, 2.617, 2.650, 2.667, 2.700, 2.733, 2.767, 2.800, 2.833, 2.850, // 20 - 29
  2.883, 2.917, 2.950, 2.967, 2.983, 3.017, 3.050, 3.083, 3.117, 3.133, // 30 - 39
  3.150, 3.167, 3.200, 3.217, 3.250, 3.267, 3.283, 3.317, 3.333, 3.350, // 40 - 49
  3.383, 3.400, 3.433, 3.450, 3.467, 3.500, 3.517, 3.533, 3.550, 3.567, // 50 - 59
  3.583, 3.600, 3.617, 3.633, 3.650, 3.667, 3.683, 3.683, 3.700, 3.717, // 60 - 69
  3.733, 3.750, 3.767, 3.767, 3.783, 3.800, 3.800, 3.800, 3.817, 3.817, // 70 - 79
  3.833, 3.833, 3.850, 3.850, 3.850, 3.867, 3.867, 3.867, 3.867, 3.867, // 80 - 89
  3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, // 90 - 99
  3.867, 3.850, 3.850, 3.850, 3.833, 3.833, 3.817, 3.800, 3.800, 3.783, // 100 - 109
  3.783, 3.767, 3.750, 3.750, 3.733, 3.717, 3.717, 3.700, 3.683, 3.660, // 110 - 119
  3.650, 3.633, 3.617, 3.600, 3.583, 3.567, 3.550, 3.533, 3.500, 3.483, // 120 - 129
  3.467, 3.450, 3.417, 3.400, 3.367, 3.350, 3.317, 3.300, 3.283, 3.250, // 130 - 139
  3.233, 3.200, 3.167, 3.133, 3.117, 3.083, 3.050, 3.017, 2.983, 2.950, // 140 - 149
  2.933, 2.900, 2.867, 2.850, 2.817, 2.783, 2.750, 2.717, 2.700, 2.667, // 150 - 159
  2.633, 2.600, 2.567, 2.533, 2.500, 2.467, 2.433, 2.383, 2.350, 2.317, // 160 - 169
  2.283, 2.250, 2.217, 2.183, 2.150, 2.117, 2.083, 2.050, 2.017, 1.983, // 170 - 179
  1.933, 1.900, 1.883, 1.850, 1.800, 1.767, 1.733, 1.700, 1.667, 1.633, // 180 - 189
  1.600, 1.567, 1.533, 1.483, 1.450, 1.417, 1.383, 1.350, 1.317, 1.283, // 190 - 199
  1.250, 1.217, 1.183, 1.167, 1.133, 1.100, 1.067, 1.033, 1.000, 0.967, // 200 - 209
  0.933, 0.900, 0.867, 0.833, 0.800, 0.783, 0.750, 0.717, 0.700, 0.667, // 210 - 219
  0.650, 0.617, 0.600, 0.583, 0.550, 0.533, 0.500, 0.483, 0.467, 0.433, // 220 - 229
  0.417, 0.400, 0.383, 0.350, 0.333, 0.317, 0.300, 0.283, 0.267, 0.250, // 230 - 239
  0.233, 0.217, 0.200, 0.183, 0.167, 0.150, 0.150, 0.133, 0.117, 0.117, // 240 - 249
  0.100, 0.100, 0.083, 0.067, 0.067, 0.050, 0.050, 0.033, 0.033, 0.017, // 250 - 259
  0.017, 0.017, 0.017, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, // 260 - 269
  0.000, 0.000, 0.000, 0.000, 0.017, 0.017, 0.017, 0.033, 0.033, 0.033, // 270 - 279
  0.050, 0.050, 0.067, 0.067, 0.083, 0.100, 0.100, 0.117, 0.117, 0.133, // 280 - 289
  0.150, 0.150, 0.167, 0.183, 0.200, 0.217, 0.233, 0.250, 0.267, 0.283, // 290 - 209
  0.300, 0.317, 0.333, 0.360, 0.383, 0.400, 0.417, 0.433, 0.467, 0.483, // 300 - 309
  0.500, 0.517, 0.550, 0.567, 0.600, 0.617, 0.633, 0.667, 0.683, 0.717, // 310 - 319
  0.733, 0.767, 0.783, 0.817, 0.833, 0.867, 0.883, 0.917, 0.933, 0.967, // 320 - 329
  1.000, 1.033, 1.067, 1.083, 1.117, 1.150, 1.183, 1.217, 1.233, 1.267, // 330 - 339
  1.300, 1.333, 1.367, 1.383, 1.400, 1.450, 1.483, 1.517, 1.550, 1.583, // 340 - 349
  1.617, 1.650, 1.683, 1.717, 1.750, 1.767, 1.800, 1.833, 1.867, 1.900  // 350 - 359
];
  let index2 = Math.ceil(tm);if (index2 < 0) index2 = 0;if (index2 >= lookupTadilMarkaz.length) index2 = lookupTadilMarkaz.length - 1;let tadilmarkaz = lookupTadilMarkaz[index2];
  let bgm = tadilkhosoh + tadilmarkaz, hsd = 5/60 * bgm, tws = hsd + tadilmarkaz, ms = tw - tws;
  
  const lookupTadilayyam = [
  { min: 355, value: 0.050 }, { min: 350, value: 0.050 }, { min: 345, value: 0.033 },
  { min: 340, value: 0.017 }, { min: 335, value: 0.017 }, { min: 330, value: 0.000 },
  { min: 325, value: 0.000 }, { min: 320, value: 0.000 }, { min: 315, value: 0.000 },
  { min: 310, value: 0.017 }, { min: 305, value: 0.017 }, { min: 300, value: 0.033 },
  { min: 295, value: 0.050 }, { min: 290, value: 0.067 }, { min: 285, value: 0.083 },
  { min: 280, value: 0.100 }, { min: 275, value: 0.117 }, { min: 270, value: 0.150 },
  { min: 265, value: 0.167 }, { min: 260, value: 0.183 }, { min: 255, value: 0.217 },
  { min: 250, value: 0.233 }, { min: 245, value: 0.250 }, { min: 240, value: 0.267 },
  { min: 235, value: 0.267 }, { min: 230, value: 0.283 }, { min: 225, value: 0.283 },
  { min: 220, value: 0.283 }, { min: 215, value: 0.283 }, { min: 210, value: 0.283 },
  { min: 205, value: 0.267 }, { min: 200, value: 0.267 }, { min: 195, value: 0.250 },
  { min: 190, value: 0.233 }, { min: 185, value: 0.217 }, { min: 180, value: 0.217 },
  { min: 175, value: 0.200 }, { min: 170, value: 0.183 }, { min: 165, value: 0.187 },
  { min: 160, value: 0.150 }, { min: 155, value: 0.133 }, { min: 150, value: 0.117 },
  { min: 145, value: 0.117 }, { min: 140, value: 0.110 }, { min: 135, value: 0.100 },
  { min: 130, value: 0.100 }, { min: 125, value: 0.083 }, { min: 120, value: 0.100 },
  { min: 115, value: 0.100 }, { min: 110, value: 0.100 }, { min: 105, value: 0.117 },
  { min: 100, value: 0.117 }, { min: 95, value: 0.133 }, { min: 90, value: 0.133 },
  { min: 85, value: 0.150 }, { min: 80, value: 0.150 }, { min: 75, value: 0.167 },
  { min: 70, value: 0.167 }, { min: 65, value: 0.183 }, { min: 60, value: 0.183 },
  { min: 55, value: 0.183 }, { min: 50, value: 0.183 }, { min: 45, value: 0.183 },
  { min: 40, value: 0.167 }, { min: 35, value: 0.167 }, { min: 30, value: 0.150 },
  { min: 25, value: 0.150 }, { min: 20, value: 0.133 }, { min: 15, value: 0.117 },
  { min: 10, value: 0.100 }, { min: 5, value: 0.083 }, { min: 0, value: 0.067 }
];
  let tadilayyam = lookupTadilayyam.find(item => Math.round(ms) >= item.min)?.value ?? 0;
  let bm = bgm - tadilayyam;
  const lookupHissohsaah = [
    { min: 355, value: 2.200 }, { min: 350, value: 2.200 }, { min: 345, value: 2.200 },
    { min: 340, value: 2.183 }, { min: 335, value: 2.167 }, { min: 330, value: 2.150 },
    { min: 325, value: 2.133 }, { min: 320, value: 2.117 }, { min: 315, value: 2.100 },
    { min: 310, value: 2.100 }, { min: 305, value: 2.067 }, { min: 300, value: 2.050 },
    { min: 295, value: 2.033 }, { min: 290, value: 2.017 }, { min: 285, value: 2.000 },
    { min: 280, value: 1.983 }, { min: 275, value: 1.983 }, { min: 270, value: 1.967 },
    { min: 265, value: 1.933 }, { min: 260, value: 1.917 }, { min: 255, value: 1.900 },
    { min: 250, value: 1.883 }, { min: 245, value: 1.867 }, { min: 240, value: 1.850 },
    { min: 235, value: 1.833 }, { min: 230, value: 1.800 }, { min: 225, value: 1.800 },
    { min: 220, value: 1.783 }, { min: 215, value: 1.767 }, { min: 210, value: 1.767 },
    { min: 205, value: 1.750 }, { min: 200, value: 1.750 }, { min: 195, value: 1.750 },
    { min: 190, value: 1.750 }, { min: 185, value: 1.750 }, { min: 180, value: 1.750 },
    { min: 175, value: 1.750 }, { min: 170, value: 1.767 }, { min: 165, value: 1.767 },
    { min: 160, value: 1.783 }, { min: 155, value: 1.800 }, { min: 150, value: 1.817 },
    { min: 145, value: 1.833 }, { min: 140, value: 1.833 }, { min: 135, value: 1.867 },
    { min: 130, value: 1.883 }, { min: 125, value: 1.900 }, { min: 120, value: 1.917 },
    { min: 115, value: 1.933 }, { min: 110, value: 1.950 }, { min: 105, value: 1.983 },
    { min: 100, value: 2.017 }, { min: 95, value: 2.033 }, { min: 90, value: 2.050 },
    { min: 85, value: 2.067 }, { min: 80, value: 2.083 }, { min: 75, value: 2.100 },
    { min: 70, value: 2.117 }, { min: 65, value: 2.133 }, { min: 60, value: 2.150 },
    { min: 55, value: 2.167 }, { min: 50, value: 2.167 }, { min: 45, value: 2.167 },
    { min: 40, value: 2.183 }, { min: 35, value: 2.200 }, { min: 30, value: 2.200 },
    { min: 25, value: 2.200 }, { min: 20, value: 2.200 }, { min: 15, value: 2.217 },
    { min: 10, value: 2.217 }, { min: 5, value: 2.217 }, { min: 0, value: 2.217 }
  ];
  let hs = lookupHissohsaah.find(range => tk >= range.min).value;
  let tax = bm * hs, xx = ta - tax, aJ = xx <= 0 ? xx + 168 : xx, aL = (lon -106.81666) /15 + aJ +1, xy = Math.floor(Math.trunc(aL/24))%7, ii = xy +1, jig = aL % 24, dig = 24 - jig, ih = dig /2;
  let mhfu = ih * 0.0667, hss = Math.round(th)
  let yi = hariList[xy], msi = hariList[ii];
  const lookupKamyah = [
  1.933, 1.983, 2.017, 2.050, 2.083, 2.100, 2.133, 2.167, 2.200, 2.233, // 0 - 9
  2.267, 2.300, 2.317, 2.350, 2.383, 2.417, 2.450, 2.483, 2.517, 2.550, // 10 - 19
  2.583, 2.617, 2.650, 2.667, 2.700, 2.733, 2.767, 2.800, 2.833, 2.850, // 20 - 29
  2.883, 2.917, 2.950, 2.967, 2.983, 3.017, 3.050, 3.083, 3.117, 3.133, // 30 - 39
  3.150, 3.167, 3.200, 3.217, 3.250, 3.267, 3.283, 3.317, 3.333, 3.350, // 40 - 49
  3.383, 3.400, 3.433, 3.450, 3.467, 3.500, 3.517, 3.533, 3.550, 3.567, // 50 - 59
  3.583, 3.600, 3.617, 3.633, 3.650, 3.667, 3.683, 3.683, 3.700, 3.717, // 60 - 69
  3.733, 3.750, 3.767, 3.767, 3.783, 3.800, 3.800, 3.800, 3.817, 3.817, // 70 - 79
  3.833, 3.833, 3.850, 3.850, 3.850, 3.867, 3.867, 3.867, 3.867, 3.867, // 80 - 89
  3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, // 90 - 99
  3.867, 3.850, 3.850, 3.850, 3.883, 3.883, 3.817, 3.800, 3.800, 3.783, // 100 - 109
  3.783, 3.767, 3.750, 3.750, 3.733, 3.717, 3.717, 3.700, 3.683, 3.660, // 110 - 119
  3.650, 3.633, 3.617, 3.600, 3.583, 3.567, 3.550, 3.533, 3.500, 3.483, // 120 - 129
  3.467, 3.450, 3.417, 3.400, 3.367, 3.350, 3.317, 3.300, 3.283, 3.250, // 130 - 139
  3.233, 3.200, 3.167, 3.133, 3.117, 3.083, 3.050, 3.017, 2.983, 2.950, // 140 - 149
  2.933, 2.900, 2.867, 2.850, 2.817, 2.783, 2.750, 2.717, 2.700, 2.667, // 150 - 159
  2.633, 2.600, 2.567, 2.533, 2.500, 2.467, 2.433, 2.383, 2.350, 2.317, // 160 - 169
  2.283, 2.250, 2.217, 2.183, 2.150, 2.117, 2.083, 2.050, 2.017, 1.983, // 170 - 179
  1.933, 1.917, 1.883, 1.850, 1.800, 1.767, 1.733, 1.700, 1.667, 1.633, // 180 - 189
  1.600, 1.567, 1.533, 1.483, 1.450, 1.417, 1.383, 1.350, 1.317, 1.283, // 190 - 199
  1.250, 1.217, 1.183, 1.167, 1.133, 1.100, 1.067, 1.033, 1.000, 0.967, // 200 - 209
  0.933, 0.900, 0.867, 0.833, 0.800, 0.783, 0.750, 0.717, 0.700, 0.667, // 210 - 219
  0.650, 0.617, 0.600, 0.583, 0.550, 0.533, 0.500, 0.483, 0.467, 0.433, // 220 - 229
  0.417, 0.400, 0.383, 0.350, 0.333, 0.317, 0.300, 0.283, 0.267, 0.250, // 230 - 239
  0.233, 0.217, 0.200, 0.183, 0.167, 0.150, 0.150, 0.133, 0.117, 0.117, // 240 - 249
  0.100, 0.100, 0.083, 0.067, 0.067, 0.050, 0.050, 0.033, 0.017, 0.017, // 250 - 259
  0.017, 0.017, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, // 260 - 269
  0.000, 0.000, 0.000, 0.000, 0.017, 0.017, 0.017, 0.033, 0.033, 0.033, // 270 - 279
  0.050, 0.050, 0.067, 0.067, 0.083, 0.100, 0.100, 0.117, 0.117, 0.133, // 280 - 289
  0.150, 0.150, 0.167, 0.183, 0.200, 0.217, 0.233, 0.250, 0.267, 0.283, // 290 - 299
  0.300, 0.317, 0.333, 0.360, 0.383, 0.400, 0.417, 0.433, 0.467, 0.483, // 300 - 309
  0.500, 0.517, 0.550, 0.567, 0.600, 0.617, 0.633, 0.667, 0.683, 0.717, // 310 - 319
  0.733, 0.767, 0.783, 0.817, 0.833, 0.867, 0.883, 0.917, 0.933, 0.967, // 320 - 329
  1.000, 1.033, 1.067, 1.083, 1.117, 1.150, 1.183, 1.217, 1.233, 1.267, // 330 - 339
  1.300, 1.333, 1.367, 1.383, 1.400, 1.450, 1.483, 1.517, 1.550, 1.583, // 340 - 349
  1.617, 1.650, 1.683, 1.717, 1.750, 1.767, 1.800, 1.833, 1.867, 1.900  // 350 - 359 
];
  if (hss < 0) hss = 0;
  if (hss >= lookupKamyah.length) hss = lookupKamyah.length - 1;let kaq = lookupKamyah[hss]; let xqn = mhfu + kaq;
  let namaBulan = bulanList[b - 1] || "Invalid";
  const drjI = document.getElementById('drjIFR').value;
  const hm = (ih, ii) => hariList[(ii + (ih >= 2 ? 0 : 1)) % 7];
  let hmab = hm(ih, ii), hmab2 = hm(ih >= 3 ? 3 : 0, ii), hmab6 = hm(ih >= 6 ? 6 : 0, ii), hmab7 = hm(ih >= 7 ? 7 : 0, ii), jthab; if (drjI <= 1) {jthab = hmab;} else if (drjI <= 2) {jthab = hmab2;} else if (drjI <= 3) {jthab = hmab6;} else {jthab = hmab7;}
  let sORm = jig <= 12 ? "Malam" : "Hari";
  
  // Sampai sini perhitungan Ijtima Awal Bulan dari Kitab Sulamun Nayirein sudah Selesai!
  // Konversi Hijri ke Masehi (Tambahan Saja)
  
  let tgl = 1, bln = b, thn = kst;
  let daor = Math.trunc((thn -1)/30),
      st = (thn -1) % 30, jth = daor * 10631, 
      thst = st * 354;

  const kabisat = [1, 4, 6, 9, 12, 15, 17, 20, 23, 25, 28];
  const ak = kabisat.filter(k => st > k).length;
    
    const jhdsMap = { 
        1: 0, 2: 30, 3: 59, 4: 89, 5: 118, 
        6: 148, 7: 177, 8: 207, 9: 236, 
        10: 266, 11: 295, 12: 325 
    };
    
    let jhds = jhdsMap[bln],
        jhhk = jth + thst + ak + jhds + tgl,
        jhmk = 227014 + jhhk; 
    
  let xp = jhhk % 5, ps; 
  switch(xp){
    case 0: ps = "Kliwon"; break;
    case 1: ps = "Legi";   break;
    case 2: ps = "Pahing"; break;
    case 3: ps = "Pon";    break;
    case 4: ps = "Wage";   break;
  }
  
  let jhp = Math.round((jhmk / 365.2425 - Math.trunc(jhmk / 365.2425)) * 365.2425),
      thnm = Math.trunc(jhmk / 365.2425) + 1;
  
  const batasH = [31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
  const xbln = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  
  const bM = batasH.findIndex(h => jhp <= h) + 1;
  const bMN = xbln[bM - 1];
  
  let x_tglmm;
  switch(bM) {
      case 1: x_tglmm = 0; break;
      case 2: x_tglmm = 31; break;
      case 3: x_tglmm = 59; break;
      case 4: x_tglmm = 90; break;
      case 5: x_tglmm = 120; break;
      case 6: x_tglmm = 151; break;
      case 7: x_tglmm = 181; break;
      case 8: x_tglmm = 212; break;
      case 9: x_tglmm = 243; break;
      case 10: x_tglmm = 273; break;
      case 11: x_tglmm = 304; break;
      case 12: x_tglmm = 334; break;
      default: x_tglmm = 0;
  }
  
  let tglmm = Math.round(jhp - x_tglmm);
  let hasilTgl = tglmm === 0 ? 31 : tglmm;
  
   document.getElementById('hasilHisabAkhirBulan').innerHTML = `
   
   <div class="hisab-list">
    <div class="row"><span>Total Khosoh</span><span>${toBurujDMS(tk)}</span></div>
    <div class="row"><span>Total Markaz</span><span>${toBurujDMS(tm)}</span></div>
    <div class="row"><span>Ta'dil Khosoh (Tabel)</span><span>${toDMS(tadilkhosoh)}</span></div>
    <div class="row"><span>Ta'dil Markaz (Tabel)</span><span>${toDMS(tadilmarkaz)}</span></div>
    <div class="row"><span>Bu'du Goer Muadal</span><span>${toDMS(bgm)}</span></div>
    <div class="row"><span>Hasil Dorob</span><span>${toDMS(hsd)}</span></div>
    <div class="row"><span>Ta'dil Wasath</span><span>${toDMS(tws)}</span></div>
    <div class="row"><span>Muqowam Syamsi</span><span>${toBurujDMS(ms)}</span></div>
    <div class="row"><span>Daqoiq Ta'dil Ayyam (Tabel)</span><span>${toDMS(tadilayyam)}</span></div>
    <div class="row"><span>Bu'du al-Muadal</span><span>${toDMS(bm)}</span></div>
    <div class="row"><span>Hissoh Saah (Tabel)</span><span>${toDMS(hs)}</span></div>
    <div class="row"><span>Total Alamah</span><span>${toBurujDMS(ta)}</span></div>
    <div class="row"><span>Ta'dil Alamah</span><span>${toDMS(tax)}</span></div>
    <div class="row"><span>Total Wasath</span><span>${toBurujDMS(tw)}</span></div>
    <div class="row"><span>Alamah Muadalah Jakarta</span><span>${toHariJMD(aJ)}</span></div>
    <div class="row"><span>Alamah Muadalah Lokal</span><span>${toHariJMD(aL)}</span></div>
    <div class="row"><span>Irtifa Hilal Ba'dal Ghurub</span><span>${toDMS(ih)}</span></div>
    <div class="row"><span>Muktsul Hilal Fauqol Ufq</span><span>${toDMS(mhfu)}</span></div>
    <div class="row"><span>Total Hissoh</span><span>${toBurujDMS(th)}</span></div>
    <div class="row"><span>Kamyah Ardl Qomar</span><span>${toDMS(kaq)}</span></div>
    <div class="row"><span>Qous Nuril Hilal</span><span>${toDMS(xqn)}</span></div>
    
   <div class="ringkasan"><b>* RINGKASAN *</b></div>
    <div class="poinHasilHisab">
    <div class="row"><span>Awal Bulan </span>
    <span>${namaBulan} ${kst} H</span></div>
    <div class="row"><span>Jatuh Pada Hari </span>
    <span>${jthab} ${ps}, ${hasilTgl} ${bMN} ${thnm} M</span></div>
    <div class="row"><span>Ijtima Terjadi pada </span>
    <span>${sORm} ${yi}</span></div>
    <div class="row"><span>Jam Ijtima</span>
    <span>${toJMD(jig)} WGB</span></div>
    
   <div class="note"><small>* Penangalan masehi memakai hisab Istilahi</small></div>
   </div>
   
   `;
  
    // ===== PINDAH PANEL =====
    panelHisab.classList.add('hidden');
    panelHasilHisab.classList.remove('hidden');
  };
}

if (btnBackToIjtima) {
  btnBackToIjtima.onclick = () => {
    panelHasilHisab.classList.add('hidden');
    panelHisab.classList.remove('hidden');

    // pastikan kembali ke tab Ijtima
    tabs.forEach(t => t.classList.remove('active'));
    tabs[0].classList.add('active');

    contents.forEach(c => c.classList.add('hidden'));
    inputIjtima.classList.remove('hidden');
  };
}
