function hisabSulam(data) {
    
    const tahun = data.tahun;
    const bulan = data.bulan;
    const irtifa = data.irtifa;
    let tahunMabsutoh =  tahun%10,
        tahunMajmuah = tahun - (tahun%10);

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
  
  let aSMJ = daSMJ.find(([batas]) => tahunMajmuah <= batas)?.[1] || 0;
  let hSMJ = dhSMJ.find(([batas]) => tahunMajmuah <= batas)?.[1] || 0;
  let wSMJ = dwSMJ.find(([batas]) => tahunMajmuah <= batas)?.[1] || 0;
  let kSMJ = dkSMJ.find(([batas]) => tahunMajmuah <= batas)?.[1] || 0;
  let mSMJ = dmSMJ.find(([batas]) => tahunMajmuah <= batas)?.[1] || 0;
  
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
    
  let aSMB = daSMB.find(([batas]) => tahunMabsutoh <= batas)?.[1] || 0;
  let hSMB = dhSMB.find(([batas]) => tahunMabsutoh <= batas)?.[1] || 0;
  let wSMB = dwSMB.find(([batas]) => tahunMabsutoh <= batas)?.[1] || 0;
  let kSMB = dkSMB.find(([batas]) => tahunMabsutoh <= batas)?.[1] || 0;
  let mSMB = dmSMB.find(([batas]) => tahunMabsutoh <= batas)?.[1] || 0;
  
  const daB = [[1, 68.067], [2, 0.000], [3, 36.733], [4, 73.467], [5, 110.200], [6, 146.933], [7, 15.667], [8, 52.400], [9, 89.133], [10, 125.867], [11, 162.600], [12, 31.333]];
  const dhB = [[1, 337.383], [2, 0.000], [3, 30.667], [4, 61.333], [5, 92.017], [6, 122.683], [7, 153.350], [8, 184.017], [9, 214.700], [10, 245.367], [11, 276.050], [12, 306.717]];
  const dwB = [[1, 320.167], [2, 0.000], [3, 29.100], [4, 58.217], [5, 87.317], [6, 116.433], [7, 145.533], [8, 174.633], [9, 203.750], [10, 232.850], [11, 261.950], [12, 291.067]];
  const dkB = [[1, 283.983], [2, 0.000], [3, 25.817], [4, 51.633], [5, 77.433], [6, 103.267], [7, 129.083], [8, 154.900], [9, 180.717], [10, 206.533], [11, 232.350], [12, 258.167]];
  const dmB = [[1, 320.167], [2, 0.000], [3, 29.100], [4, 58.217], [5, 87.317], [6, 116.433], [7, 145.533], [8, 174.633], [9, 203.750], [10, 232.850], [11, 261.950], [12, 291.067]];

  let aB = daB.find(([batas]) => bulan <= batas)?.[1] || "0", hB = dhB.find(([batas]) => bulan <= batas)?.[1] || "0", wB = dwB.find(([batas]) => bulan <= batas)?.[1] || "0", kB = dkB.find(([batas]) => bulan <= batas)?.[1] || "0", mB = dmB.find(([batas]) => bulan <= batas)?.[1] || "0";
  
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
  1.933, 1.983, 2.017, 2.050, 2.083, 2.100, 2.133, 2.167, 2.200, 2.233, 2.267, 2.300, 2.317, 2.350, 2.383, 2.417, 2.450, 2.483, 2.517, 2.550, 2.583, 2.617, 2.650, 2.667, 2.700, 2.733, 2.767, 2.800, 2.833, 2.850, 2.883, 2.917, 2.950, 2.967, 2.983, 3.017, 3.050, 3.083, 3.117, 3.133, 3.150, 3.167, 3.200, 3.217, 3.250, 3.267, 3.283, 3.317, 3.333, 3.350, 3.383, 3.400, 3.433, 3.450, 3.467, 3.500, 3.517, 3.533, 3.550, 3.567, 3.583, 3.600, 3.617, 3.633, 3.650, 3.667, 3.683, 3.683, 3.700, 3.717, 3.733, 3.750, 3.767, 3.767, 3.783, 3.800, 3.800, 3.800, 3.817, 3.817, 3.833, 3.833, 3.850, 3.850, 3.850, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.850, 3.850, 3.850, 3.883, 3.883, 3.817, 3.800, 3.800, 3.783, 3.783, 3.767, 3.750, 3.750, 3.733, 3.717, 3.717, 3.700, 3.683, 3.660, 3.650, 3.633, 3.617, 3.600, 3.583, 3.567, 3.550, 3.533, 3.500, 3.483, 3.467, 3.450, 3.417, 3.400, 3.367, 3.350, 3.317, 3.300, 3.283, 3.250, 3.233, 3.200, 3.167, 3.133, 3.117, 3.083, 3.050, 3.017, 2.983, 2.950, 2.933, 2.900, 2.867, 2.850, 2.817, 2.783, 2.750, 2.717, 2.700, 2.667, 2.633, 2.600, 2.567, 2.533, 2.500, 2.467, 2.433, 2.383, 2.350, 2.317, 2.283, 2.250, 2.217, 2.183, 2.150, 2.117, 2.083, 2.050, 2.017, 1.983, 1.933, 1.917, 1.883, 1.850, 1.800, 1.767, 1.733, 1.700, 1.667, 1.633, 1.600, 1.567, 1.533, 1.483, 1.450, 1.417, 1.383, 1.350, 1.317, 1.283, 1.250, 1.217, 1.183, 1.167, 1.133, 1.100, 1.067, 1.033, 1.000, 0.967, 0.933, 0.900, 0.867, 0.833, 0.800, 0.783, 0.750, 0.717, 0.700, 0.667, 0.650, 0.617, 0.600, 0.583, 0.550, 0.533, 0.500, 0.483, 0.467, 0.433, 0.417, 0.400, 0.383, 0.350, 0.333, 0.317, 0.300, 0.283, 0.267, 0.250, 0.233, 0.217, 0.200, 0.183, 0.167, 0.150, 0.150, 0.133, 0.117, 0.117, 0.100, 0.100, 0.083, 0.067, 0.067, 0.050, 0.050, 0.033, 0.017, 0.017, 0.017, 0.017, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.017, 0.017, 0.017, 0.033, 0.033, 0.033, 0.050, 0.050, 0.067, 0.067, 0.083, 0.100, 0.100, 0.117, 0.117, 0.133, 0.150, 0.150, 0.167, 0.183, 0.200, 0.217, 0.233, 0.250, 0.267, 0.283, 0.300, 0.317, 0.333, 0.360, 0.383, 0.400, 0.417, 0.433, 0.467, 0.483, 0.500, 0.517, 0.550, 0.567, 0.600, 0.617, 0.633, 0.667, 0.683, 0.717, 0.733, 0.767, 0.783, 0.817, 0.833, 0.867, 0.883, 0.917, 0.933, 0.967, 1.000, 1.033, 1.067, 1.083, 1.117, 1.150, 1.183, 1.217, 1.233, 1.267, 1.300, 1.333, 1.367, 1.383, 1.400, 1.450, 1.483, 1.517, 1.550, 1.583, 1.617, 1.650, 1.683, 1.717, 1.750, 1.767, 1.800, 1.833, 1.867, 1.900 ];
  if (hss < 0) hss = 0;
  if (hss >= lookupKamyah.length) hss = lookupKamyah.length - 1;let kaq = lookupKamyah[hss]; let xqn = mhfu + kaq;
  let namaBulan = bulanList[bulan - 1] || "Invalid";
  const drjI = data.irtifa;
  const hm = (ih, ii) => hariList[(ii + (ih >= 2 ? 0 : 1)) % 7];
  let hmab = hm(ih, ii), hmab2 = hm(ih >= 3 ? 3 : 0, ii), hmab6 = hm(ih >= 6 ? 6 : 0, ii), hmab7 = hm(ih >= 7 ? 7 : 0, ii), jthab; if (drjI <= 1) {jthab = hmab;} else if (drjI <= 2) {jthab = hmab2;} else if (drjI <= 3) {jthab = hmab6;} else {jthab = hmab7;}
  let sORm = jig <= 12 ? "Malam" : "Hari";
  
  // Sampai sini perhitungan Ijtima Awal Bulan dari Kitab Sulamun Nayirein sudah Selesai!
  // Konversi Hijri ke Masehi (Tambahan Saja)
  
  let tgl = 1, bln = bulan, thn = tahun;
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
  
        // ===== PINDAH PANEL =====
    panelHisab.classList.add('hidden');
    panelHasilHisab.classList.remove('hidden');
    return {
    metode: "Sulamu an-Nayirein",
    tanggal: `${hasilTgl} ${bMN} ${thnm}`,
    jam: toJMD(jig),
    irtifaHilal: ih,
    status: jthab
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

if (btnProsesHisabJM) {
  btnProsesHisabJM.onclick = () => {
    const bln = document.getElementById('bulanhijriyahJM').value;
    const thn = document.getElementById('kstJM').value;
    const tinggi = Number(localStorage.getItem('altitude')) || 0;
    const kriteria = document.getElementById('diJM').value; 
    const latSet = lokasi.lat, lonSet = lokasi.lon, zona = lokasi.tz, lat = desKeDMS(latSet),lon=desKeDMS(lonSet);
    
  class HisabHilal {
    static d2r = Math.PI/180;
    static r2d = 180/Math.PI;
    static sinD(d) { return Math.sin(d*this.d2r); }
    static cosD(d) { return Math.cos(d*this.d2r); }
    static tanD(d) { return Math.tan(d*this.d2r); }
    static asinD(v) { return Math.asin(v)*this.r2d; }
    static acosD(v) { return Math.acos(Math.max(-1,Math.min(1,v)))*this.r2d; }
    static atan2D(y,x) { return Math.atan2(y,x)*this.r2d; }
    static norm(a) { return a-360*Math.floor(a/360); }

    static tanggalKeJD(thn, bln, hari) {
      if(bln<=2){thn--;bln+=12;}
      const A=Math.floor(thn/100), B=2-A+Math.floor(A/4);
      return Math.floor(365.25*(thn+4716))+Math.floor(30.6001*(bln+1))+hari+B-1524.5;
    }
    static jdKeTanggal(jd) {
      jd+=0.5; const Z=Math.floor(jd), F=jd-Z;
      let A; if(Z<2299161)A=Z; else{const a=Math.floor((Z-1867216.25)/36524.25);A=Z+1+a-Math.floor(a/4);}
      const B=A+1524, C=Math.floor((B-122.1)/365.25), D=Math.floor(365.25*C);
      const E=Math.floor((B-D)/30.6001), hari=B-D-Math.floor(30.6001*E)+F;
      const bulan=E<14?E-1:E-13, tahun=bulan>2?C-4716:C-4715;
      return{tahun,bulan,hari};
    }
    static deltaT(thn) {
      if(thn>=2005&&thn<=2050){const t=thn-2000;return 62.92+0.32217*t+0.005589*t*t;}
      if(thn>=1900&&thn<=2005){const u=(thn-1900)/100;return 0.297*u-0.02+0.025184*u*u-0.181133*u*u*u;}
      const r=(thn-2000)/100;return 62.92+32*r*r;
    }

    // Mengembalikan JDE + detail
    static jdeBulanBaruDetail(k) {
      const T=k/1236.85, T2=T*T, T3=T2*T, T4=T3*T;
      let JDE=2451550.09766+29.530588861*k+0.00015437*T2-0.00000015*T3+0.00000000073*T4;
      const M=this.norm(2.5534+29.1053567*k-0.0000014*T2-0.00000011*T3);
      const Maksen=this.norm(201.5643+385.81693528*k+0.0107582*T2+0.00001238*T3-0.000000058*T4);
      const F=this.norm(160.7108+390.67050284*k-0.0016118*T2-0.00000227*T3+0.000000011*T4);
      const Omega=this.norm(124.7746-1.56375588*k+0.0020672*T2+0.00000215*T3);
      const E=1-0.002516*T-0.0000074*T2, E2=E*E;
      const koreksi=[
        [-0.4072,1,Maksen,0],[0.17241,2,M,0],[0.01608,1,2*Maksen,0],[0.01039,1,2*F,0],
        [0.00739,2,Maksen-M,0],[-0.00514,2,Maksen+M,0],[0.00208,3,2*M,0],[-0.00111,1,Maksen-2*F,0],
        [-0.00057,1,Maksen+2*F,0],[0.00056,2,2*Maksen+M,0],[-0.00042,1,3*Maksen,0],[0.00042,2,M+2*F,0],
        [0.00038,2,M-2*F,0],[-0.00024,2,2*Maksen-M,0],[-0.00017,1,Omega,0],[-0.00007,1,Maksen+2*M,0],
        [0.00004,1,2*Maksen-2*F,0],[0.00004,1,3*M,0],[0.00003,1,Maksen+M-2*F,0],[0.00003,1,2*Maksen+2*F,0],
        [-0.00003,1,Maksen+M+2*F,0],[0.00003,1,Maksen-M+2*F,0],[-0.00002,1,Maksen-M-2*F,0],[-0.00002,1,3*Maksen+M,0],
        [0.00002,1,4*Maksen,0]
      ];
      let totalKoreksi=0;
      const detailKoreksi=[];
      koreksi.forEach(kor=>{
        let fak=1; if(kor[1]===2)fak=E; else if(kor[1]===3)fak=E2;
        const val=kor[0]*fak*this.sinD(kor[2]);
        totalKoreksi+=val;
        detailKoreksi.push({rumus:`${kor[0].toFixed(9)} × ${fak===E?'E':fak===E2?'E²':'1'} × sin(${kor[2].toFixed(6)}°)`,nilai:val.toFixed(9)});
      });
      JDE+=totalKoreksi;

      const A = [];
            A[1]  = this.norm(299.77 + 0.107408 * k - 0.009173 * T2);
            A[2]  = this.norm(251.88 + 0.016321 * k);
            A[3]  = this.norm(251.83 + 26.651886 * k);
            A[4]  = this.norm(349.42 + 36.412478 * k);
            A[5]  = this.norm(84.66 + 18.206239 * k);
            A[6]  = this.norm(141.74 + 53.303771 * k);
            A[7]  = this.norm(207.14 + 2.453732 * k);
            A[8]  = this.norm(154.84 + 7.306860 * k);
            A[9]  = this.norm(34.52 + 27.261239 * k);
            A[10] = this.norm(207.19 + 0.121824 * k);
            A[11] = this.norm(291.34 + 1.844379 * k);
            A[12] = this.norm(161.72 + 24.198154 * k);
            A[13] = this.norm(239.56 + 25.513099 * k);
            A[14] = this.norm(331.55 + 3.592518 * k);

      const A1  = A[1], A2  = A[2], A3  = A[3], A4  = A[4], A5  = A[5], A6  = A[6], A7  = A[7], A8  = A[8], A9  = A[9], A10 = A[10], A11 = A[11], A12 = A[12], A13 = A[13], A14 = A[14];

      const P1  = 0.000325 * this.sinD(A1),
            P2  = 0.000165 * this.sinD(A2),
            P3  = 0.000164 * this.sinD(A3),
            P4  = 0.000126 * this.sinD(A4),
            P5  = 0.000110 * this.sinD(A5),
            P6  = 0.000062 * this.sinD(A6),
            P7  = 0.000060 * this.sinD(A7),
            P8  = 0.000056 * this.sinD(A8),
            P9  = 0.000047 * this.sinD(A9),
            P10 = 0.000042 * this.sinD(A10),
            P11 = 0.000040 * this.sinD(A11),
            P12 = 0.000037 * this.sinD(A12),
            P13 = 0.000035 * this.sinD(A13),
            P14 = 0.000023 * this.sinD(A14);
      
      const totalPlanet =
          P1 + P2 + P3 + P4 + P5 + P6 + P7 +
          P8 + P9 + P10 + P11 + P12 + P13 + P14;
      
      JDE += totalPlanet;
      
      return {
          k,
          T,
          JDE_awal: 2451550.09766 + 29.530588861 * k + 0.00015437 * T2 - 0.00000015 * T3 + 0.00000000073 * T4, M, Maksen, F, Omega, E, JDE, totalKoreksi, detailKoreksi, A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13, A14, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, totalPlanet
      };
      
    }

    static perkiraanKDariHijriah(thnH, blnH) {
      const jdP=1948439.5+354.36667*(thnH-1)+29.53059*(blnH-1);
      const k=Math.round((jdP-2451550.09766)/29.530588861);
      return {k,jdPerkiraan:jdP};
    }

    static nutasiDetail(jde) {
      const T=(jde-2451545)/36525;
      const Omega=this.norm(125.04452-1934.136261*T),L=this.norm(280.4665+36000.7698*T),Laksen=this.norm(218.3165+481267.8813*T);
      const dpsi=(-17.2/3600)*this.sinD(Omega)+(-1.32/3600)*this.sinD(2*L)+(-0.23/3600)*this.sinD(2*Laksen)+(0.21/3600)*this.sinD(2*Omega);
      const deps=(9.2/3600)*this.cosD(Omega)+(0.57/3600)*this.cosD(2*L)+(0.10/3600)*this.cosD(2*Laksen)+(-0.09/3600)*this.cosD(2*Omega);
      return {dpsi,deps,Omega,L,Laksen,T};
    }

    static oblikuitasRataRata(jde) {
      const T=(jde-2451545)/36525;
      return 23.439291111-1.300258333*T-0.000430556*T*T+0.555347222*T*T*T-0.014272222*T*T*T*T;
    }

    static posisiMatahari(jd) {
      const thn=this.jdKeTanggal(jd).tahun;
      const T=(jd+this.deltaT(thn)/86400-2451545)/36525,T2=T*T;
      const L0=this.norm(280.46646+36000.76983*T+0.0003032*T2);
      const M=this.norm(357.52911+35999.05029*T-0.0001537*T2);
      const e=0.016708634-0.000042037*T-0.0000001267*T2;
      const C=(1.914602-0.004817*T-0.000014*T2)*this.sinD(M)+(0.019993-0.000101*T)*this.sinD(2*M)+0.000289*this.sinD(3*M);
      const bujur=L0+C, anom=M+C;
      const R=1.000001018*(1-e*e)/(1+e*this.cosD(anom));
      const Omega=this.norm(125.04-1934.136*T);
      const lambda=bujur-0.00569-0.00478*this.sinD(Omega);
      const eps0=this.oblikuitasRataRata(jd),eps=eps0+this.nutasiDetail(jd).deps;
      const ra=this.norm(this.atan2D(this.cosD(eps)*this.sinD(lambda),this.cosD(lambda)));
      const dec=this.asinD(this.sinD(eps)*this.sinD(lambda));
      const y=this.tanD(eps/2),y2=y*y;
      const perata=y2*this.sinD(2*L0)-2*e*this.sinD(M)+4*e*y2*this.sinD(M)*this.cosD(2*L0)-0.5*y2*y2*this.sinD(4*L0)-1.25*e*e*this.sinD(2*M);
      return {lambda,ra,dec,R,perataMenit:4*perata*this.r2d,eps,T};
    }

    static posisiBulan(jd) {
      const thn=this.jdKeTanggal(jd).tahun;
      const T=(jd+this.deltaT(thn)/86400-2451545)/36525,T2=T*T,T3=T2*T,T4=T3*T;
      const Laksen=this.norm(218.3164477+481267.88123421*T-0.0015786*T2+T3/538841-T4/65194000);
      const D=this.norm(297.8501921+445267.1114034*T-0.0018819*T2+T3/545868-T4/113065000);
      const M=this.norm(357.5291092+35999.0502909*T-0.0001536*T2+T3/24490000);
      const Maksen=this.norm(134.9633964+477198.8675055*T+0.0087414*T2+T3/69699-T4/14712000);
      const F=this.norm(93.272095+483202.0175233*T-0.0036539*T2-T3/3526000+T4/863310000);
      const E=1-0.002516*T-0.0000074*T2,E2=E*E;
      return {T,Laksen,D,M,Maksen,F,E,eps:this.oblikuitasRataRata(jd)+this.nutasiDetail(jd).deps};
    }

    static hitungAwalBulanLengkap(blnH, thnH, latD, latM, latS, lonD, lonM, lonS, elev, zona, kriteria) {
    const lintang = latD + (latD < 0 ? -1 : 1) * (Math.abs(latM) / 60 + Math.abs(latS) / 3600);
    const bujur = lonD + lonM / 60 + lonS / 3600;
    const { k, jdPerkiraan } = this.perkiraanKDariHijriah(thnH, blnH);
    const detailJDE = this.jdeBulanBaruDetail(k);
    const jdeNM = detailJDE.JDE;
    const thnMasehi = this.jdKeTanggal(jdeNM).tahun;
    const deltaTVal = this.deltaT(thnMasehi);
    const jdIjtimak = jdeNM - deltaTVal / 86400;
    const tglIjt = this.jdKeTanggal(jdIjtimak);
    let jamIjt = 24 * (tglIjt.hari - Math.floor(tglIjt.hari)) + zona;
    let hariIjt = Math.floor(tglIjt.hari);
    if (jamIjt >= 24) { jamIjt -= 24; hariIjt++; }
    if (jamIjt < 0) { jamIjt += 24; hariIjt--; }
    const jdIjtDate = this.tanggalKeJD(tglIjt.tahun, tglIjt.bulan, hariIjt);
    const indHari = Math.floor(jdIjtimak + 1.5) % 7, indPasar = Math.floor(jdIjtimak + 0.5) % 5;

    const jdApprox = Math.floor(jdIjtimak + zona / 24 + 0.5) - 0.5;
    let sunset = null;
    for (let off = 0; off < 3; off++) {
        const cek = [jdApprox, jdApprox + 1, jdApprox - 1][off];
        const s = this.hitungTerbenam(cek, lintang, bujur, zona, elev);
        if (s !== null) { sunset = s; break; }
    }
    if (sunset === null) sunset = 18;
    const jdGhurub = jdApprox + (sunset - zona) / 24;
    let jamWGB = jamIjt - sunset;
    const sunrise = this.hitungTerbit(jdApprox, lintang, bujur, zona, elev);

    const posMat = this.posisiMatahari(jdGhurub);
    const lst = this.waktuSiderealLokal(jdGhurub, bujur);
    const horMat = this.ekuatorialKeHorizontal(posMat.ra, posMat.dec, lintang, lst);

    const posBulan = this.bulanPosisiPenuh(jdGhurub);
    const topo = this.bulanToposentrik(posBulan, lintang, elev, lst);
    const horBulan = this.ekuatorialKeHorizontal(topo.ra, topo.dec, lintang, lst);
    const horBulanGeo = this.ekuatorialKeHorizontal(posBulan.ra, posBulan.dec, lintang, lst);

    const hcHakiki = horBulanGeo.tinggi, htTopo = horBulan.tinggi;
    let refr = 0; if (hcHakiki > -5) { const ha = hcHakiki + 7.31 / (hcHakiki + 4.4); refr = ha > 0 ? 0.0167 / this.tanD(ha) : 0.575; }
    const dip = elev > 0 ? (1.76 / 60) * Math.sqrt(elev) : 0;
    const tinggiMari = htTopo + refr + dip;
    const elong = this.acosD(this.sinD(posMat.dec) * this.sinD(posBulan.dec) + this.cosD(posMat.dec) * this.cosD(posBulan.dec) * this.cosD(posMat.ra - posBulan.ra));
    const nurul = ((1 - this.cosD(elong)) / 2 * 100).toFixed(2);
    const umur = 24 * (jdGhurub - jdIjtimak);
    let lama = 0; if (horBulan.tinggi > 0) lama = horBulan.tinggi / 15;
    const ijtSebelum = jdIjtimak < jdGhurub;

    // ========== PENENTUAN IMRAN RUKYAT BERDASARKAN KRITERIA ==========
    let imkan = false;
    switch (kriteria) {
        case '1': // Irtifa' 2°
            imkan = (ijtSebelum && tinggiMari >= 2);
            break;
        case '2': // Irtifa' 2° dan Umur Hilal 6 jam
            imkan = (ijtSebelum && tinggiMari >= 2 && umur >= 6);
            break;
        case '3': // Irtifa' 2° dan Umur Hilal 8 jam
            imkan = (ijtSebelum && tinggiMari >= 2 && umur >= 8);
            break;
        case '4': // Irtifa' 3° dan Elongasi 6.4°
            imkan = (ijtSebelum && tinggiMari >= 3 && elong >= 6.4);
            break;
        default:
            imkan = (ijtSebelum && tinggiMari >= 3 && elong >= 6.4);
    }

    const jdAwal = imkan ? jdApprox + 1 + zona / 24 : jdApprox + 2 + zona / 24;
    const tglAwal = this.jdKeTanggal(jdAwal);
    const namaHari = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
    const namaPasaran = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];
    const namaBulanM = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const namaBulanH = ["", "Muharram", "Shafar", "Rabiul Awal", "Rabiul Akhir", "Jumadil Ula", "Jumadil Akhirah", "Rajab", "Sya'ban", "Ramadhan", "Syawwal", "Dzulqa'dah", "Dzulhijjah"];

    return {
        input: { blnH, thnH, lintang, bujur, elev, zona },
        k, jdPerkiraan,
        detailJDE, deltaT: deltaTVal, jdIjtimak,
        ijtimak: { tgl: Math.floor(tglIjt.hari), bln: tglIjt.bulan, thn: tglIjt.tahun, jam: jamIjt, wgb: jamWGB, hari: namaHari[indHari < 0 ? indHari + 7 : indHari], pasaran: namaPasaran[indPasar < 0 ? indPasar + 5 : indPasar], jdIjtDate },
        ghurub: { jdApprox, sunset, sunrise, jdGhurub },
        matahari: { ra: posMat.ra, dec: posMat.dec, az: horMat.azimut, perata: posMat.perataMenit },
        bulan: { ra: posBulan.ra, dec: posBulan.dec, az: horBulan.azimut, paralaks: posBulan.HP },
        tinggi: { hcHakiki, htTopo, refraksi: refr, dip, tinggiMari },
        elongasi: elong, nurulHilal: nurul, umurHilal: umur, lamaHilal: lama, kriteria: kriteria,
        imkan: imkan,
        awal: { hari: namaHari[Math.floor(jdAwal + 1.5) % 7], pasaran: namaPasaran[Math.floor(jdAwal + 0.5) % 5], tgl: Math.floor(tglAwal.hari), bln: tglAwal.bulan, thn: tglAwal.tahun, namaBulan: namaBulanM[tglAwal.bulan] },
        namaBulanH: namaBulanH[blnH], zonaNama: zona === 7 ? "WIB" : zona === 8 ? "WITA" : zona === 9 ? "WIT" : `GMT+${zona}`
    };
}

    static hitungTerbenam(jd,lat,lon,tz,elev){
      const dip=elev>0?(1.76/60)*Math.sqrt(elev):0,h0=-(50/60+dip);
      let s=this.posisiMatahari(jd+0.5);
      let cosH=(this.sinD(h0)-this.sinD(lat)*this.sinD(s.dec))/(this.cosD(lat)*this.cosD(s.dec));
      if(cosH>1||cosH<-1)return null;
      let H=this.acosD(cosH), apr=12-s.perataMenit/60+(15*tz-lon)/15, st=apr+H/15;
      s=this.posisiMatahari(jd+(st-tz)/24);
      cosH=(this.sinD(h0)-this.sinD(lat)*this.sinD(s.dec))/(this.cosD(lat)*this.cosD(s.dec));
      if(Math.abs(cosH)<=1){H=this.acosD(cosH);apr=12-s.perataMenit/60+(15*tz-lon)/15;st=apr+H/15;}
      return st;
    }
    static hitungTerbit(jd,lat,lon,tz,elev){
      const dip=elev>0?(1.76/60)*Math.sqrt(elev):0,h0=-(50/60+dip);
      let s=this.posisiMatahari(jd+0.5);
      let cosH=(this.sinD(h0)-this.sinD(lat)*this.sinD(s.dec))/(this.cosD(lat)*this.cosD(s.dec));
      if(cosH>1||cosH<-1)return null;
      let H=this.acosD(cosH), apr=12-s.perataMenit/60+(15*tz-lon)/15, sr=apr-H/15;
      s=this.posisiMatahari(jd+(sr-tz)/24);
      cosH=(this.sinD(h0)-this.sinD(lat)*this.sinD(s.dec))/(this.cosD(lat)*this.cosD(s.dec));
      if(Math.abs(cosH)<=1){H=this.acosD(cosH);apr=12-s.perataMenit/60+(15*tz-lon)/15;sr=apr-H/15;}
      return sr;
    }
    static ekuatorialKeHorizontal(ra,dec,lat,lst){
      const HA=lst-ra;
      const alt=this.asinD(this.sinD(dec)*this.sinD(lat)+this.cosD(dec)*this.cosD(lat)*this.cosD(HA));
      const az=this.norm(this.atan2D(this.sinD(HA),this.cosD(HA)*this.sinD(lat)-this.tanD(dec)*this.cosD(lat))+180);
      return{tinggi:alt,azimut:az};
    }
    static waktuSiderealLokal(jd,lon){
      const T=(jd-2451545)/36525;
      const gmst=this.norm(280.46061837+360.98564736629*(jd-2451545)+0.000387933*T*T-T*T*T/38710000);
      const nut=this.nutasiDetail(jd),eps=this.oblikuitasRataRata(jd)+nut.deps;
      return this.norm(gmst+nut.dpsi*this.cosD(eps)+lon);
    }
    static bulanPosisiPenuh(jd){
      const thn=this.jdKeTanggal(jd).tahun;
      const T=(jd+this.deltaT(thn)/86400-2451545)/36525,T2=T*T,T3=T2*T,T4=T3*T;
      const L=this.norm(218.3164477+481267.88123421*T-0.0015786*T2+T3/538841-T4/65194000);
      const D=this.norm(297.8501921+445267.1114034*T-0.0018819*T2+T3/545868-T4/113065000);
      const M=this.norm(357.5291092+35999.0502909*T-0.0001536*T2+T3/24490000);
      const Mp=this.norm(134.9633964+477198.8675055*T+0.0087414*T2+T3/69699-T4/14712000);
      const F=this.norm(93.272095+483202.0175233*T-0.0036539*T2-T3/3526000+T4/863310000);
      const E=1-0.002516*T-0.0000074*T2,E2=E*E;
      const sukuBujur=[[0,0,1,0,6288774,-20905355],[2,0,-1,0,1274027,-3699111],[2,0,0,0,658314,-2955968],[0,0,2,0,213618,-569925],[0,1,0,0,-185116,48888],[0,0,0,2,-114332,-3149],[2,0,-2,0,58793,246158],[2,-1,-1,0,57066,-152138],[2,0,1,0,53322,-170733],[2,-1,0,0,45758,-204586],[0,1,-1,0,-40923,-129620],[1,0,0,0,-34720,108743],[0,1,1,0,-30383,104755],[2,0,0,-2,15327,10321],[0,0,1,2,-12528,0],[0,0,1,-2,10980,79661],[4,0,-1,0,10675,-34782],[0,0,3,0,10034,-23210],[4,0,-2,0,8548,-21636],[2,1,-1,0,-7888,24208],[2,1,0,0,-6766,30824],[1,0,-1,0,-5163,-8379],[1,1,0,0,4987,-16675],[2,-1,1,0,4036,-12831],[2,0,2,0,3994,-10445],[4,0,0,0,3861,-11650],[2,0,-3,0,3665,14403],[0,1,-2,0,-2689,-7003],[2,0,-1,2,-2602,0],[2,-1,-2,0,2390,10056],[1,0,1,0,-2348,6322],[2,-2,0,0,2236,-9884],[0,1,2,0,-2120,5751],[0,2,0,0,-2069,0],[2,-2,-1,0,2048,-4950],[2,0,1,-2,-1773,4130],[2,0,0,2,-1595,0],[4,-1,-1,0,1215,-3958],[0,0,2,2,-1110,0],[3,0,-1,0,-892,3258],[2,1,1,0,-810,2616],[4,-1,-2,0,759,-1897],[0,2,-1,0,-713,-2117],[2,2,-1,0,-700,2354],[2,1,-2,0,691,0],[2,-1,0,-2,596,0],[4,0,1,0,549,-1423],[0,0,4,0,537,-1117],[4,-1,0,0,520,-1571],[1,0,-2,0,-487,-1739],[2,1,0,-2,-399,0],[0,0,2,-2,-381,-4421],[1,1,1,0,351,0],[3,0,-2,0,-340,0],[4,0,-3,0,330,0],[2,-1,2,0,327,0],[0,2,1,0,-323,1165],[1,1,-1,0,299,0],[2,0,3,0,294,0],[2,0,-1,-2,0,8752]];
      const sukuLintang=[[0,0,0,1,5128122],[0,0,1,1,280602],[0,0,1,-1,277693],[2,0,0,-1,173237],[2,0,-1,1,55413],[2,0,-1,-1,46271],[2,0,0,1,32573],[0,0,2,1,17198],[2,0,1,-1,9266],[0,0,2,-1,8822],[2,-1,0,-1,8216],[2,0,-2,-1,4324],[2,0,1,1,4200],[2,1,0,-1,-3359],[2,-1,-1,1,2463],[2,-1,0,1,2211],[2,-1,-1,-1,2065],[0,1,-1,-1,-1870],[4,0,-1,-1,1828],[0,1,0,1,-1794],[0,0,0,3,-1749],[0,1,-1,1,-1565],[1,0,0,1,-1491],[0,1,1,1,-1475],[0,1,1,-1,-1410],[0,1,0,-1,-1344],[1,0,0,-1,-1335],[0,0,3,1,1107],[4,0,0,-1,1021],[4,0,-1,1,833],[0,0,1,-3,777],[4,0,-2,1,671],[2,0,0,-3,607],[2,0,2,-1,596],[2,-1,1,-1,491],[2,0,-2,1,-451],[0,0,3,-1,439],[2,0,2,1,422],[2,0,-3,-1,421],[2,1,-1,1,-366],[2,1,0,1,-351],[4,0,0,1,331],[2,-1,1,1,315],[2,-2,0,-1,302],[0,0,1,3,-283],[2,1,1,-1,-229],[1,1,0,-1,223],[1,1,0,1,223],[0,1,-2,-1,-220],[2,1,-1,-1,-220],[1,0,1,1,-185],[2,-1,-2,-1,181],[0,1,2,1,-177],[4,0,-2,-1,176],[4,-1,-1,-1,166],[1,0,1,-1,-164],[4,0,1,-1,132],[1,0,-1,-1,-119],[4,-1,0,-1,115],[2,-2,0,1,107]];
      let sL=0,sR=0;sukuBujur.forEach(t=>{const arg=t[0]*D+t[1]*M+t[2]*Mp+t[3]*F;let f=1;if(Math.abs(t[1])===1)f=E;else if(Math.abs(t[1])===2)f=E2;sL+=t[4]*f*this.sinD(arg);sR+=t[5]*f*this.cosD(arg);});
      let sB=0;sukuLintang.forEach(t=>{const arg=t[0]*D+t[1]*M+t[2]*Mp+t[3]*F;let f=1;if(Math.abs(t[1])===1)f=E;else if(Math.abs(t[1])===2)f=E2;sB+=t[4]*f*this.sinD(arg);});
      const A1=this.norm(119.75+131.849*T),A2=this.norm(53.09+479264.29*T),A3=this.norm(313.45+481266.484*T);
      sL+=3958*this.sinD(A1)+1962*this.sinD(L-F)+318*this.sinD(A2);
      sB+=-2235*this.sinD(L)+382*this.sinD(A3)+175*this.sinD(A1-F)+175*this.sinD(A1+F)+127*this.sinD(L-Mp)-115*this.sinD(L+Mp);
      const lambda=L+sL/1000000,beta=sB/1000000,delta=385000.56+sR/1000;
      const nut=this.nutasiDetail(jd),eps=this.oblikuitasRataRata(jd)+nut.deps,lamApp=lambda+nut.dpsi;
      const ra=this.norm(this.atan2D(this.sinD(lamApp)*this.cosD(eps)-this.tanD(beta)*this.sinD(eps),this.cosD(lamApp)));
      const dec=this.asinD(this.sinD(beta)*this.cosD(eps)+this.cosD(beta)*this.sinD(eps)*this.sinD(lamApp));
      const HP=this.asinD(6378.14/delta);
      return{lambda:lamApp,beta,delta,ra,dec,HP,eps};
    }
    static bulanToposentrik(bulan,lat,elev,lst){
      const HA=lst-bulan.ra, sinHP=this.sinD(bulan.HP), cosLat=this.cosD(lat), sinLat=this.sinD(lat);
      const dRA=this.atan2D(-cosLat*sinHP*this.sinD(HA),this.cosD(bulan.dec)-cosLat*sinHP*this.cosD(HA));
      const dec=this.atan2D((this.sinD(bulan.dec)-sinLat*sinHP)*this.cosD(dRA),this.cosD(bulan.dec)-cosLat*sinHP*this.cosD(HA));
      return{ra:bulan.ra+dRA,dec};
    }
    static keDMS(d){const s=d<0?-1:1,a=Math.abs(d);let D=Math.floor(a),M=Math.floor(60*(a-D)),S=Math.round(60*(60*(a-D)-M));if(S===60){M++;S=0;}if(M===60){D++;M=0;}return`${s<0?'-':''}${D}° ${M}' ${S}"`;}
    static keHMS(j){const s=j<0?-1:1,a=Math.abs(j);let h=Math.floor(a),m=Math.floor(60*(a-h)),d=Math.round(60*(60*(a-h)-m));if(d===60){m++;d=0;}if(m===60){h++;m=0;}return`${s<0?'-':''}${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(d).padStart(2,'0')}`;}
  }

  function desKeDMS(des){const s=des<0?-1:1,a=Math.abs(des);const d=Math.floor(a),m=Math.floor((a-d)*60),det=((a-d)*60-m)*60;return{d:s*d,m:s*m,s:s*det};}
    const hasil = HisabHilal.hitungAwalBulanLengkap(
      bln, thn, lat.d, lat.m, lat.s, lon.d, lon.m, lon.s, tinggi, zona, kriteria
  );

  const d = hasil;
  const vis = d.imkan ? "Berpotensi Terlihat" : "Sulit Teramati";
  const panel = document.getElementById("hasilHisabAkhirBulanJM");

    panel.innerHTML=`
    <div class="hisab-list">
      <div class="row"><span>Koordinat</span><span>${latSet} LS || ${lonSet} BT</span></div>
      <div class="row"><span>Altitude & Zona</span><span>${tinggi} M || GMT+${zona} WIB</span></div>
      <div class="row"><span>Julian Day</span><span>${d.jdPerkiraan.toFixed(6)}</span></div>
      <div class="row"><span>Jumlah Konjungsi</span><span>${d.k} Kali Ijtimak</span></div>
    
      <div class="row"><span>Adad Julian</span><span>${d.detailJDE.T.toFixed(9)}</span></div>
      <div class="row"><span>Julian Day Ephemeris</span><span>${d.detailJDE.JDE_awal.toFixed(6)}</span></div>
      <div class="row"><span>Anomali Matahari</span><span>${d.detailJDE.M.toFixed(6)}°</span></div>
      <div class="row"><span>Anomali Bulan </span><span>${d.detailJDE.Maksen.toFixed(6)}°</span></div>
      <div class="row"><span>Argumen Lintang</span><span>${d.detailJDE.F.toFixed(6)}°</span></div>
      <div class="row"><span>Bujur Node</span><span>${d.detailJDE.Omega.toFixed(6)}°</span></div>
      <div class="row"><span>Eksentrisitas</span><span>${d.detailJDE.E.toFixed(9)}</span></div>
      <div class="row"><span>Koreksi A1</span><span>${d.detailJDE.detailKoreksi[1].nilai}</span></div>
      <div class="row"><span>Koreksi A2</span><span>${d.detailJDE.detailKoreksi[2].nilai}</span></div>
      <div class="row"><span>Koreksi A3</span><span>${d.detailJDE.detailKoreksi[3].nilai}</span></div>
      <div class="row"><span>Koreksi A4</span><span>${d.detailJDE.detailKoreksi[4].nilai}</span></div>
      <div class="row"><span>Koreksi A5</span><span>${d.detailJDE.detailKoreksi[5].nilai}</span></div>
      <div class="row"><span>Koreksi A6</span><span>${d.detailJDE.detailKoreksi[6].nilai}</span></div>
      <div class="row"><span>Koreksi A7</span><span>${d.detailJDE.detailKoreksi[7].nilai}</span></div>
      <div class="row"><span>Koreksi A8</span><span>${d.detailJDE.detailKoreksi[8].nilai}</span></div>
      <div class="row"><span>Koreksi A9</span><span>${d.detailJDE.detailKoreksi[9].nilai}</span></div>
      <div class="row"><span>Koreksi A10</span><span>${d.detailJDE.detailKoreksi[10].nilai}</span></div>
      <div class="row"><span>Koreksi A11</span><span>${d.detailJDE.detailKoreksi[11].nilai}</span></div>
      <div class="row"><span>Koreksi A12</span><span>${d.detailJDE.detailKoreksi[12].nilai}</span></div>
      <div class="row"><span>Koreksi A13</span><span>${d.detailJDE.detailKoreksi[13].nilai}</span></div>
      <div class="row"><span>Koreksi A14</span><span>${d.detailJDE.detailKoreksi[14].nilai}</span></div>
      <div class="row"><span>Koreksi Periodik</span><span>${d.detailJDE.totalKoreksi.toFixed(9)}<sup>h</sup></span></span></div>
      
      <div class="row"><span>Koreksi P1</span><span>${d.detailJDE.P1.toFixed(9)}</span></div>
      <div class="row"><span>Koreksi P2</span><span>${d.detailJDE.P2.toFixed(9)}</span></div>
      <div class="row"><span>Koreksi P3</span><span>${d.detailJDE.P3.toFixed(9)}</span></div>
      <div class="row"><span>Koreksi P4</span><span>${d.detailJDE.P4.toFixed(9)}</span></div>
      <div class="row"><span>Koreksi P5</span><span>${d.detailJDE.P5.toFixed(9)}</span></div>
      <div class="row"><span>Koreksi P6</span><span>${d.detailJDE.P6.toFixed(9)}</span></div>
      <div class="row"><span>Koreksi P7</span><span>${d.detailJDE.P7.toFixed(9)}</span></div>
      <div class="row"><span>Koreksi P8</span><span>${d.detailJDE.P8.toFixed(9)}</span></div>
      <div class="row"><span>Koreksi P9</span><span>${d.detailJDE.P9.toFixed(9)}</span></div>
      <div class="row"><span>Koreksi P10</span><span>${d.detailJDE.P10.toFixed(9)}</span></div>
      <div class="row"><span>Koreksi P11</span><span>${d.detailJDE.P11.toFixed(9)}</span></div>
      <div class="row"><span>Koreksi P12</span><span>${d.detailJDE.P12.toFixed(9)}</span></div>
      <div class="row"><span>Koreksi P13</span><span>${d.detailJDE.P13.toFixed(9)}</span></div>
      <div class="row"><span>Koreksi P14</span><span>${d.detailJDE.P14.toFixed(9)}</span></div>
      <div class="row"><span>Koreksi Planet</span><span>${d.detailJDE.totalPlanet.toFixed(9)}<sup>h</sup></span></div>
      
      <div class="row"><span>JDE Akhir</span><span>${d.detailJDE.JDE.toFixed(9)}</span></div>
      <div class="row"><span>Delta</span><span>${d.deltaT}<sup>d</sup></span></div>
      <div class="row"><span>JD Ijtimak</span><span>${d.jdIjtimak.toFixed(9)}</span></div>
    
      <div class="row"><span>JD Ijtimak</span><span>${d.jdIjtimak.toFixed(9)}</span></div>
      <div class="row"><span>Tanggal Ijtimak</span><span>${d.ijtimak.tgl} ${["","Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"][d.ijtimak.bln]} ${d.ijtimak.thn}</span></div>
      <div class="row"><span>Jam Ijtimak</span><span>${HisabHilal.keHMS(d.ijtimak.jam)} ${d.zonaNama}</span></div>
      <div class="row"><span>Hari Ijtima</span><span>${d.ijtimak.hari} ${d.ijtimak.pasaran}</span></div>
    
      <div class="row"><span>Waktu Terbit</span><span>${d.ghurub.sunrise!==null?HisabHilal.keHMS(d.ghurub.sunrise):'N/A'} ${d.zonaNama}</span></div>
      <div class="row"><span>Waktu Terbenam</span><span>${HisabHilal.keHMS(d.ghurub.sunset)} ${d.zonaNama}</span></div>
      <div class="row"><span>Asensio Rekta Matahari</span><span>${HisabHilal.keHMS(d.matahari.ra/15)}</span></div>
      <div class="row"><span>Deklinasi Matahari</span><span>${HisabHilal.keDMS(d.matahari.dec)}</span></div>
      <div class="row"><span>Azimut Matahari</span><span>${HisabHilal.keDMS(d.matahari.az)}</span></div>
      <div class="row"><span>Perata Waktu</span><span>${HisabHilal.keHMS(d.matahari.perata)}</span></div>
    
      <div class="row"><span>Asensio Rekta Bulan</span><span>${HisabHilal.keHMS(d.bulan.ra/15)}</span></div>
      <div class="row"><span>Deklinasi Bulan</span><span>${HisabHilal.keDMS(d.bulan.dec)}</span></div>
      <div class="row"><span>Azimut Bulan</span><span>${HisabHilal.keDMS(d.bulan.az)}</span></div>
      <div class="row"><span>Paralaks Horizontal</span><span>${HisabHilal.keDMS(d.bulan.paralaks)}</span></div>
      <div class="row"><span>Tinggi Hakiki</span><span>${HisabHilal.keDMS(d.tinggi.hcHakiki)}</span></div>
      <div class="row"><span>Tinggi Toposentrik</span><span>${HisabHilal.keDMS(d.tinggi.htTopo)}</span></div>
      <div class="row"><span>Refraksi</span><span>${HisabHilal.keDMS(d.tinggi.refraksi)}</span></div>
      <div class="row"><span>Kerendahan Ufuk</span><span>${HisabHilal.keDMS(d.tinggi.dip)}</span></div>
      <div class="row"><span>Tinggi Mar'i</span><span>${HisabHilal.keDMS(d.tinggi.tinggiMari)}</span></div>
    
      <div class="row"><span>Elongasi</span><span>${HisabHilal.keDMS(d.elongasi)}</span></div>
      <div class="row"><span>Cahaya Hilal</span><span>${HisabHilal.keDMS(d.nurulHilal)}</span></div>
      <div class="row"><span>Umur Hilal</span><span>${HisabHilal.keHMS(d.umurHilal)}</span></div>
      <div class="row"><span>Lama Hilal</span><span>${d.lamaHilal>0?HisabHilal.keHMS(d.lamaHilal):'00:00:00'}</span></div>
      <div class="row"><span>Kriteria Imkan Rukyat</span><span>${d.kriteria === '1' ? 'Irtifa\' 2°' : d.kriteria === '2' ? 'Irtifa\' 2° Umur Hilal 6 jam' : d.kriteria === '3' ? 'Irtifa\' 2° Umur Hilal 8 jam' : 'Irtifa\' 3° Elongasi 6.4°'}</span></div>
      <div class="row"><span>Status Imkan</span><span>${d.imkan ? 'Terpenuhi' : 'Tidak Terpenuhi'}</span></div>
    <div class="ringkasan"><b>* RINGKASAN *</b></div>
      <div class="row"><span>Awal Bulan</span><span>${d.namaBulanH} ${d.input.thnH} H</span></div>
      <div class="row"><span>Jatuh Pada Hari</span><span>${d.awal.hari} ${d.awal.pasaran}, ${d.awal.tgl} ${d.awal.namaBulan} ${d.awal.thn} M</span></div>
      <div class="row"><span>Ijtima Terjadi Pada</span><span>${d.ijtimak.hari} ${d.ijtimak.pasaran}, ${d.ijtimak.tgl} ${["","Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"][d.ijtimak.bln]} ${d.ijtimak.thn} M</span></div>
      <div class="row"><span>Waktu Ijtimak</span><span>${HisabHilal.keHMS(d.ijtimak.jam)} ${d.zonaNama} || ${HisabHilal.keHMS(d.ijtimak.wgb)} WGB</span></div>
      <div class="row"><span>Waktu Maghrib Saat Ijtima</span><span>${HisabHilal.keHMS(d.ghurub.sunset)} ${d.zonaNama}</span></div>
      <div class="row"><span>Ketinggian Hilal Setelah Maghrib</span><span>${HisabHilal.keDMS(d.tinggi.tinggiMari)}</span></div>
      <div class="row"><span>Lama Hilal di atas Ufuq setelah Ghurub</span><span>${d.lamaHilal>0?HisabHilal.keHMS(d.lamaHilal):'00:00:00'}</span></div>
      <div class="row"><span>Elongasi</span><span>${d.elongasi.toFixed(2)}</span></div>
      
  </div>
    `;
    panelHisab.classList.add('hidden');
    panelHasilHisabJM.classList.remove('hidden');
    
  };
}

if (btnBackToIjtimaJM) {
  btnBackToIjtimaJM.onclick = () => {
    panelHasilHisabJM.classList.add('hidden');
    panelHisab.classList.remove('hidden');
  };
}

if (btnProsesHisabFR) {
  btnProsesHisabFR.onclick = () => {
    
    const panel = document.getElementById("hasilHisabAkhirBulanFR");

    panel.innerHTML=`
    <div class="feature-unavailable">
    <!-- Partikel -->
    <div class="particles" id="particles"></div>
    <!-- Container -->
    <div class="feature-container">
    <!-- Code Snippet -->
        <div class="code-snippet" id="codeSnippet">
<span class="comment">// Status fitur</span>
<span class="keyword">const</span> <span class="property">featureStatus</span> = {
<span class="property">  available</span>: <span class="keyword">false</span>,
<span class="property">  estimatedRelease</span>: <span class="string">"Segera"</span>,
<span class="property">  message</span>: <span class="string">"Dalam pengerjaan"</span>
};
<span class="function">checkFeature</span>() → <span class="string">"403 - Belum Tersedia"</span>
            <span class="copy-indicator" id="copyIndicator">Tersalin!</span>
        </div>

        <!-- Footer -->
        <p class="footer-note">
            Kode status: <span>403 • Fitur Belum Tersedia. </p>
    </div>
</div>
`;
  panelHisab.classList.add('hidden');
  panelHasilHisabFR.classList.remove('hidden');

  };
}

if (btnBackToIjtimaFR) {
  btnBackToIjtimaFR.onclick = () => {
    panelHasilHisabFR.classList.add('hidden');
    panelHisab.classList.remove('hidden');
  };
}