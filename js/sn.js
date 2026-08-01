function hisabSN(data) {
  
  const bulanList = ["Muharom", "Sopar", "Robiul Awal", "Robiul Akhir", "Jumadil Awal", "Jumadil Akhir", "Rojab", "Sya'ban", "Romadhon", "Syawal", "Dzul Qo'dah", "Dzul Hijjah"];
  const hariList = ["Sabtu", "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at"];
  
  let lat = data.latitude, lon = data.longitude;
  let tmb = data.tahun % 10, tmj = data.tahun - tmb, bulan = data.bulan, kriteria = data.kriteria;
  let aj = (18.647 + ((tmj - 1500) / 10) * 40.083) % 168; if (aj < 0) aj += 168;
  let hj = (202.050 + ((tmj - 1500) / 10) * 80.5) % 360; if (hj < 0) hj += 360;
  let wj = (277.200 + ((tmj - 1500) / 10) * 252.8) % 360; if (wj < 0) wj += 360;
  let kj = (124.217 + ((tmj - 1500) / 10) * 218) % 360; if (kj < 0) kj += 360;
  let mj = (173.833 + ((tmj - 1500) / 10) * 252.667) % 360; if (mj < 0) mj += 360;
  
  const v1 = [
  [1, 104.800], [2, 41.617], [3, 146.417], [4, 83.233], [5, 20.033], [6, 124.850], [7, 61.650], [8, 166.467], [9, 103.267], [10, 40.083]];
  const w1 = [
    [1, 8.050], [2, 16.100], [3, 24.150], [4, 32.200], [5, 40.250], [6, 48.300], [7, 56.350], [8, 64.400], [9, 72.450], [10, 80.500]];
  const x1 = [
    [1, 349.267], [2, 338.567], [3, 327.833], [4, 317.117], [5, 306.400], [6, 295.683], [7, 284.967], [8, 274.233], [9, 263.517], [10, 252.800]]; 
  const y1 = [
    [1, 309.800], [2, 259.600], [3, 209.400], [4, 159.200], [5, 109.000], [6, 58.800], [7, 8.600], [8, 318.400], [9, 268.200], [10, 218.000]];
  const z1 = [
    [1, 349.267], [2, 338.533], [3, 327.800], [4, 317.067], [5, 306.333], [6, 295.600], [7, 284.867], [8, 274.133], [9, 263.400], [10, 252.667]];
    
  let ab = v1.find(([batas]) => tmb <= batas)?.[1] || 0;
  let hb = w1.find(([batas]) => tmb <= batas)?.[1] || 0;
  let wb = x1.find(([batas]) => tmb <= batas)?.[1] || 0;
  let kb = y1.find(([batas]) => tmb <= batas)?.[1] || 0;
  let mb = z1.find(([batas]) => tmb <= batas)?.[1] || 0;
  
  const v2 = [[1, 68.067], [2, 0.000], [3, 36.733], [4, 73.467], [5, 110.200], [6, 146.933], [7, 15.667], [8, 52.400], [9, 89.133], [10, 125.867], [11, 162.600], [12, 31.333]];
  const w2 = [[1, 337.383], [2, 0.000], [3, 30.667], [4, 61.333], [5, 92.017], [6, 122.683], [7, 153.350], [8, 184.017], [9, 214.700], [10, 245.367], [11, 276.050], [12, 306.717]];
  const x2 = [[1, 320.167], [2, 0.000], [3, 29.100], [4, 58.217], [5, 87.317], [6, 116.433], [7, 145.533], [8, 174.633], [9, 203.750], [10, 232.850], [11, 261.950], [12, 291.067]];
  const y2 = [[1, 283.983], [2, 0.000], [3, 25.817], [4, 51.633], [5, 77.433], [6, 103.267], [7, 129.083], [8, 154.900], [9, 180.717], [10, 206.533], [11, 232.350], [12, 258.167]];
  const z2 = [[1, 320.167], [2, 0.000], [3, 29.100], [4, 58.217], [5, 87.317], [6, 116.433], [7, 145.533], [8, 174.633], [9, 203.750], [10, 232.850], [11, 261.950], [12, 291.067]];

  let aB = v2.find(([batas]) => bulan <= batas)?.[1] || "0";
  let hB = w2.find(([batas]) => bulan <= batas)?.[1] || "0";
  let wB = x2.find(([batas]) => bulan <= batas)?.[1] || "0";
  let kB = y2.find(([batas]) => bulan <= batas)?.[1] || "0"
  let mB = z2.find(([batas]) => bulan <= batas)?.[1] || "0";
  
  let ta = (aj + ab + aB) % 168,
      th = (hj + hb + hB) % 360,
      tw = (wj + wb + wB) % 360,
      tk = Math.round((kj + kb + kB) % 360),
      tm = Math.round((mj + mb + mB) % 360);
      
  const lookupTadilKhosoh = [4.983, 4.900, 4.833, 4.750, 4.667, 4.583, 4.500, 4.417, 4.333, 4.250, 4.183, 4.100, 4.017, 3.933, 3.850, 3.783, 3.717, 3.633, 3.550, 3.467, 3.400, 3.317, 3.250, 3.183, 3.117, 3.050, 2.967, 2.900, 2.817, 2.750, 2.683, 2.600, 2.533, 2.467, 2.400, 2.333, 2.250, 2.183, 2.117, 2.050, 1.983, 1.917, 1.850, 1.783, 1.717, 1.667, 1.600, 1.550, 1.483, 1.433, 1.383, 1.317, 1.267, 1.217, 1.167, 1.117, 1.067, 1.017, 0.967, 0.917, 0.867, 0.817, 0.783, 0.733, 0.683, 0.633, 0.600, 0.567, 0.533, 0.483, 0.450, 0.433, 0.417, 0.383, 0.350, 0.300, 0.283, 0.267, 0.250, 0.217, 0.183, 0.150, 0.133, 0.117, 0.100, 0.083, 0.067, 0.050, 0.050, 0.033, 0.033, 0.033, 0.017, 0.017, 0.000, 0.000, 0.000, 0.000, 0.017, 0.017, 0.033, 0.033, 0.050, 0.067, 0.083, 0.100, 0.117, 0.133, 0.150, 0.167, 0.183, 0.200, 0.250, 0.267, 0.300, 0.317, 0.350, 0.383, 0.417, 0.450, 0.500, 0.533, 0.583, 0.617, 0.667, 0.717, 0.767, 0.817, 0.867, 0.917, 0.967, 1.033, 1.083, 1.150, 1.200, 1.250, 1.317, 1.383, 1.450, 1.517, 1.583, 1.650, 1.717, 1.783, 1.850, 1.933, 2.000, 2.083, 2.150, 2.233, 2.317, 2.383, 2.450, 2.533, 2.617, 2.717, 2.800, 2.950, 2.967, 3.050, 3.133, 3.217, 3.317, 3.400, 3.483, 3.583, 3.667, 3.750, 3.850, 3.933, 4.033, 4.117, 4.200, 4.283, 4.367, 4.450, 4.550, 4.650, 4.767, 4.867, 4.983, 5.083, 5.183, 5.267, 5.367, 5.450, 5.550, 5.650, 5.750, 5.833, 5.933, 6.033, 6.133, 6.217, 6.317, 6.400, 6.500, 6.583, 6.667, 6.750, 6.833, 6.933, 7.017, 7.100, 7.183, 7.267, 7.350, 7.433, 7.517, 7.600, 7.683, 7.767, 7.833, 7.917, 7.983, 8.050, 8.133, 8.200, 8.283, 8.350, 8.417, 8.483, 8.550, 8.617, 8.683, 8.733, 8.800, 8.850, 8.900, 8.967, 9.017, 9.067, 9.117, 9.167, 9.217, 9.267, 9.317, 9.350, 9.383, 9.433, 9.483, 9.517, 9.550, 9.600, 9.633, 9.667, 9.683, 9.700, 9.733, 9.767, 9.800, 9.817, 9.833, 9.850, 9.867, 9.883, 9.900, 9.917, 9.933, 9.950, 9.950, 9.967, 9.967, 9.983, 9.983, 10.000, 10.000, 10.000, 9.983, 9.983, 9.983, 9.983, 9.967, 9.950, 9.950, 9.933, 9.900, 9.883, 9.867, 9.833, 9.800, 9.783, 9.767, 9.733, 9.717, 9.683, 9.650, 9.617, 9.583, 9.550, 9.517, 9.483, 9.450, 9.417, 9.383, 9.333, 9.283, 9.250, 9.217, 9.167, 9.117, 9.067, 9.017, 8.967, 8.917, 8.867, 8.817, 8.767, 8.717, 8.667, 8.600, 8.550, 8.483, 8.417, 8.367, 8.300, 8.250, 8.183, 8.117, 8.050, 7.983, 7.917, 7.850, 7.783, 7.717, 7.650, 7.583, 7.517, 7.450, 7.383, 7.300, 7.233, 7.150, 7.083, 7.000, 6.933, 6.867, 6.800, 6.717, 6.650, 6.583, 6.500, 6.400, 6.350, 6.267, 6.183, 6.100, 6.017, 5.950, 5.867, 5.783, 5.700, 5.617, 5.550, 5.467, 5.383, 5.300, 5.217, 5.150, 5.067 ];
  
  if (tk < 0) tk = 0; if (tk >= lookupTadilKhosoh.length) tk = lookupTadilKhosoh.length - 1; let tadilkhosoh = lookupTadilKhosoh[tk];
  
  const lookupTadilMarkaz = [1.933, 1.983, 2.017, 2.050, 2.083, 2.100, 2.133, 2.167, 2.200, 2.233, 2.267, 2.300, 2.317, 2.350, 2.383, 2.417, 2.450, 2.483, 2.517, 2.550, 2.583, 2.617, 2.650, 2.667, 2.700, 2.733, 2.767, 2.800, 2.833, 2.850, 2.883, 2.917, 2.950, 2.967, 2.983, 3.017, 3.050, 3.083, 3.117, 3.133, 3.150, 3.167, 3.200, 3.217, 3.250, 3.267, 3.283, 3.317, 3.333, 3.350, 3.383, 3.400, 3.433, 3.450, 3.467, 3.500, 3.517, 3.533, 3.550, 3.567, 3.583, 3.600, 3.617, 3.633, 3.650, 3.667, 3.683, 3.683, 3.700, 3.717, 3.733, 3.750, 3.767, 3.767, 3.783, 3.800, 3.800, 3.800, 3.817, 3.817, 3.833, 3.833, 3.850, 3.850, 3.850, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.850, 3.850, 3.850, 3.833, 3.833, 3.817, 3.800, 3.800, 3.783, 3.783, 3.767, 3.750, 3.750, 3.733, 3.717, 3.717, 3.700, 3.683, 3.660, 3.650, 3.633, 3.617, 3.600, 3.583, 3.567, 3.550, 3.533, 3.500, 3.483, 3.467, 3.450, 3.417, 3.400, 3.367, 3.350, 3.317, 3.300, 3.283, 3.250, 3.233, 3.200, 3.167, 3.133, 3.117, 3.083, 3.050, 3.017, 2.983, 2.950, 2.933, 2.900, 2.867, 2.850, 2.817, 2.783, 2.750, 2.717, 2.700, 2.667, 2.633, 2.600, 2.567, 2.533, 2.500, 2.467, 2.433, 2.383, 2.350, 2.317, 2.283, 2.250, 2.217, 2.183, 2.150, 2.117, 2.083, 2.050, 2.017, 1.983, 1.933, 1.900, 1.883, 1.850, 1.800, 1.767, 1.733, 1.700, 1.667, 1.633, 1.600, 1.567, 1.533, 1.483, 1.450, 1.417, 1.383, 1.350, 1.317, 1.283, 1.250, 1.217, 1.183, 1.167, 1.133, 1.100, 1.067, 1.033, 1.000, 0.967, 0.933, 0.900, 0.867, 0.833, 0.800, 0.783, 0.750, 0.717, 0.700, 0.667, 0.650, 0.617, 0.600, 0.583, 0.550, 0.533, 0.500, 0.483, 0.467, 0.433, 0.417, 0.400, 0.383, 0.350, 0.333, 0.317, 0.300, 0.283, 0.267, 0.250, 0.233, 0.217, 0.200, 0.183, 0.167, 0.150, 0.150, 0.133, 0.117, 0.117, 0.100, 0.100, 0.083, 0.067, 0.067, 0.050, 0.050, 0.033, 0.033, 0.017, 0.017, 0.017, 0.017, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.017, 0.017, 0.017, 0.033, 0.033, 0.033, 0.050, 0.050, 0.067, 0.067, 0.083, 0.100, 0.100, 0.117, 0.117, 0.133, 0.150, 0.150, 0.167, 0.183, 0.200, 0.217, 0.233, 0.250, 0.267, 0.283, 0.300, 0.317, 0.333, 0.360, 0.383, 0.400, 0.417, 0.433, 0.467, 0.483, 0.500, 0.517, 0.550, 0.567, 0.600, 0.617, 0.633, 0.667, 0.683, 0.717, 0.733, 0.767, 0.783, 0.817, 0.833, 0.867, 0.883, 0.917, 0.933, 0.967, 1.000, 1.033, 1.067, 1.083, 1.117, 1.150, 1.183, 1.217, 1.233, 1.267, 1.300, 1.333, 1.367, 1.383, 1.400, 1.450, 1.483, 1.517, 1.550, 1.583, 1.617, 1.650, 1.683, 1.717, 1.750, 1.767, 1.800, 1.833, 1.867, 1.900];
  
  if (tm < 0) tm = 0; if (tm >= lookupTadilMarkaz.length) tm = lookupTadilMarkaz.length - 1; let tadilmarkaz = lookupTadilMarkaz[tm];
  
  let bgm = tadilkhosoh + tadilmarkaz, hsd = 5/60 * bgm, tsm = hsd + tadilmarkaz, ms = tw - tsm;
  
  const lookupTadilayyam = [{ min: 355, value: 0.050 }, { min: 350, value: 0.050 }, { min: 345, value: 0.033 }, { min: 340, value: 0.017 }, { min: 335, value: 0.017 }, { min: 330, value: 0.000 }, { min: 325, value: 0.000 }, { min: 320, value: 0.000 }, { min: 315, value: 0.000 }, { min: 310, value: 0.017 }, { min: 305, value: 0.017 }, { min: 300, value: 0.033 }, { min: 295, value: 0.050 }, { min: 290, value: 0.067 }, { min: 285, value: 0.083 }, { min: 280, value: 0.100 }, { min: 275, value: 0.117 }, { min: 270, value: 0.150 }, { min: 265, value: 0.167 }, { min: 260, value: 0.183 }, { min: 255, value: 0.217 }, { min: 250, value: 0.233 }, { min: 245, value: 0.250 }, { min: 240, value: 0.267 }, { min: 235, value: 0.267 }, { min: 230, value: 0.283 }, { min: 225, value: 0.283 }, { min: 220, value: 0.283 }, { min: 215, value: 0.283 }, { min: 210, value: 0.283 }, { min: 205, value: 0.267 }, { min: 200, value: 0.267 }, { min: 195, value: 0.250 }, { min: 190, value: 0.233 }, { min: 185, value: 0.217 }, { min: 180, value: 0.217 }, { min: 175, value: 0.200 }, { min: 170, value: 0.183 }, { min: 165, value: 0.187 }, { min: 160, value: 0.150 }, { min: 155, value: 0.133 }, { min: 150, value: 0.117 }, { min: 145, value: 0.117 }, { min: 140, value: 0.110 }, { min: 135, value: 0.100 }, { min: 130, value: 0.100 }, { min: 125, value: 0.083 }, { min: 120, value: 0.100 }, { min: 115, value: 0.100 }, { min: 110, value: 0.100 }, { min: 105, value: 0.117 }, { min: 100, value: 0.117 }, { min: 95, value: 0.133 }, { min: 90, value: 0.133 }, { min: 85, value: 0.150 }, { min: 80, value: 0.150 }, { min: 75, value: 0.167 }, { min: 70, value: 0.167 }, { min: 65, value: 0.183 }, { min: 60, value: 0.183 }, { min: 55, value: 0.183 }, { min: 50, value: 0.183 }, { min: 45, value: 0.183 }, { min: 40, value: 0.167 }, { min: 35, value: 0.167 }, { min: 30, value: 0.150 }, { min: 25, value: 0.150 }, { min: 20, value: 0.133 }, { min: 15, value: 0.117 }, { min: 10, value: 0.100 }, { min: 5, value: 0.083 }, { min: 0, value: 0.067 }];
  
  let tadilayyam = lookupTadilayyam.find(item => Math.round(ms) >= item.min)?.value ?? 0; let bm = bgm - tadilayyam;
  
  const lookupHissohsaah = [
    { min: 355, value: 2.200 }, { min: 350, value: 2.200 }, { min: 345, value: 2.200 }, { min: 340, value: 2.183 }, { min: 335, value: 2.167 }, { min: 330, value: 2.150 }, { min: 325, value: 2.133 }, { min: 320, value: 2.117 }, { min: 315, value: 2.100 }, { min: 310, value: 2.100 }, { min: 305, value: 2.067 }, { min: 300, value: 2.050 }, { min: 295, value: 2.033 }, { min: 290, value: 2.017 }, { min: 285, value: 2.000 }, { min: 280, value: 1.983 }, { min: 275, value: 1.983 }, { min: 270, value: 1.967 }, { min: 265, value: 1.933 }, { min: 260, value: 1.917 }, { min: 255, value: 1.900 }, { min: 250, value: 1.883 }, { min: 245, value: 1.867 }, { min: 240, value: 1.850 }, { min: 235, value: 1.833 }, { min: 230, value: 1.800 }, { min: 225, value: 1.800 }, { min: 220, value: 1.783 }, { min: 215, value: 1.767 }, { min: 210, value: 1.767 }, { min: 205, value: 1.750 }, { min: 200, value: 1.750 }, { min: 195, value: 1.750 }, { min: 190, value: 1.750 }, { min: 185, value: 1.750 }, { min: 180, value: 1.750 }, { min: 175, value: 1.750 }, { min: 170, value: 1.767 }, { min: 165, value: 1.767 }, { min: 160, value: 1.783 }, { min: 155, value: 1.800 }, { min: 150, value: 1.817 }, { min: 145, value: 1.833 }, { min: 140, value: 1.833 }, { min: 135, value: 1.867 }, { min: 130, value: 1.883 }, { min: 125, value: 1.900 }, { min: 120, value: 1.917 }, { min: 115, value: 1.933 }, { min: 110, value: 1.950 }, { min: 105, value: 1.983 }, { min: 100, value: 2.017 }, { min: 95, value: 2.033 }, { min: 90, value: 2.050 }, { min: 85, value: 2.067 }, { min: 80, value: 2.083 }, { min: 75, value: 2.100 }, { min: 70, value: 2.117 }, { min: 65, value: 2.133 }, { min: 60, value: 2.150 }, { min: 55, value: 2.167 }, { min: 50, value: 2.167 }, { min: 45, value: 2.167 }, { min: 40, value: 2.183 }, { min: 35, value: 2.200 }, { min: 30, value: 2.200 }, { min: 25, value: 2.200 }, { min: 20, value: 2.200 }, { min: 15, value: 2.217 }, { min: 10, value: 2.217 }, { min: 5, value: 2.217 }, { min: 0, value: 2.217 }];
    
  let hs = lookupHissohsaah.find(range => tk >= range.min).value;
  let tax = bm * hs, xx = ta - tax, aJ = xx <= 0 ? xx + 168 : xx, sft = (lon -106.81666) /15, aL = sft + aJ +1, xy = Math.floor(Math.trunc(aL/24))%7, ii = xy +1, jig = aL % 24, mig = 24- jig, ih = mig /2;
  let mhfu = ih * 0.0667, hss = Math.round(th);
  let yi = hariList[xy], msi = hariList[ii];
  
  const lookupKamyah = [
  1.933, 1.983, 2.017, 2.050, 2.083, 2.100, 2.133, 2.167, 2.200, 2.233, 2.267, 2.300, 2.317, 2.350, 2.383, 2.417, 2.450, 2.483, 2.517, 2.550, 2.583, 2.617, 2.650, 2.667, 2.700, 2.733, 2.767, 2.800, 2.833, 2.850, 2.883, 2.917, 2.950, 2.967, 2.983, 3.017, 3.050, 3.083, 3.117, 3.133, 3.150, 3.167, 3.200, 3.217, 3.250, 3.267, 3.283, 3.317, 3.333, 3.350, 3.383, 3.400, 3.433, 3.450, 3.467, 3.500, 3.517, 3.533, 3.550, 3.567, 3.583, 3.600, 3.617, 3.633, 3.650, 3.667, 3.683, 3.683, 3.700, 3.717, 3.733, 3.750, 3.767, 3.767, 3.783, 3.800, 3.800, 3.800, 3.817, 3.817, 3.833, 3.833, 3.850, 3.850, 3.850, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.867, 3.850, 3.850, 3.850, 3.883, 3.883, 3.817, 3.800, 3.800, 3.783, 3.783, 3.767, 3.750, 3.750, 3.733, 3.717, 3.717, 3.700, 3.683, 3.660, 3.650, 3.633, 3.617, 3.600, 3.583, 3.567, 3.550, 3.533, 3.500, 3.483, 3.467, 3.450, 3.417, 3.400, 3.367, 3.350, 3.317, 3.300, 3.283, 3.250, 3.233, 3.200, 3.167, 3.133, 3.117, 3.083, 3.050, 3.017, 2.983, 2.950, 2.933, 2.900, 2.867, 2.850, 2.817, 2.783, 2.750, 2.717, 2.700, 2.667, 2.633, 2.600, 2.567, 2.533, 2.500, 2.467, 2.433, 2.383, 2.350, 2.317, 2.283, 2.250, 2.217, 2.183, 2.150, 2.117, 2.083, 2.050, 2.017, 1.983, 1.933, 1.917, 1.883, 1.850, 1.800, 1.767, 1.733, 1.700, 1.667, 1.633, 1.600, 1.567, 1.533, 1.483, 1.450, 1.417, 1.383, 1.350, 1.317, 1.283, 1.250, 1.217, 1.183, 1.167, 1.133, 1.100, 1.067, 1.033, 1.000, 0.967, 0.933, 0.900, 0.867, 0.833, 0.800, 0.783, 0.750, 0.717, 0.700, 0.667, 0.650, 0.617, 0.600, 0.583, 0.550, 0.533, 0.500, 0.483, 0.467, 0.433, 0.417, 0.400, 0.383, 0.350, 0.333, 0.317, 0.300, 0.283, 0.267, 0.250, 0.233, 0.217, 0.200, 0.183, 0.167, 0.150, 0.150, 0.133, 0.117, 0.117, 0.100, 0.100, 0.083, 0.067, 0.067, 0.050, 0.050, 0.033, 0.017, 0.017, 0.017, 0.017, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.017, 0.017, 0.017, 0.033, 0.033, 0.033, 0.050, 0.050, 0.067, 0.067, 0.083, 0.100, 0.100, 0.117, 0.117, 0.133, 0.150, 0.150, 0.167, 0.183, 0.200, 0.217, 0.233, 0.250, 0.267, 0.283, 0.300, 0.317, 0.333, 0.360, 0.383, 0.400, 0.417, 0.433, 0.467, 0.483, 0.500, 0.517, 0.550, 0.567, 0.600, 0.617, 0.633, 0.667, 0.683, 0.717, 0.733, 0.767, 0.783, 0.817, 0.833, 0.867, 0.883, 0.917, 0.933, 0.967, 1.000, 1.033, 1.067, 1.083, 1.117, 1.150, 1.183, 1.217, 1.233, 1.267, 1.300, 1.333, 1.367, 1.383, 1.400, 1.450, 1.483, 1.517, 1.550, 1.583, 1.617, 1.650, 1.683, 1.717, 1.750, 1.767, 1.800, 1.833, 1.867, 1.900 ];
  if (hss < 0) hss = 0;
  if (hss >= lookupKamyah.length) hss = lookupKamyah.length - 1;let kaq = lookupKamyah[hss]; let xqn = mhfu + kaq;
  let elongasi = 0.51 * mig + 0.8;
  let namaBulan = bulanList[bulan - 1] || "Invalid";
  const hm = (syarat, ii) => hariList[(ii + (syarat ? 0 : 1)) % 7];

  let hmab  = hm(ih >= 2, ii),             
      hmab2 = hm(ih >= 3, ii), 
      hmab3 = hm(ih >= 2 && mig >= 8, ii),
      hmab4 = hm(ih >= 3 && elongasi >= 6.4, ii);
  let jthab;
  if (kriteria <= 1) {jthab = hmab;} else if (kriteria <= 2) {jthab = hmab2;} else if (kriteria <= 3) {jthab = hmab3;} else {jthab = hmab4;}
  let sk;
  if (kriteria <= 1) {sk = '2°';} else if (kriteria <= 2) {sk = '3°';} else if (kriteria <= 3) {sk = '2°, Umur Hilal 8 Jam';} else {sk = '3°, Elongasi 6.4';}
  let sORm = jig <= 12 ? "Malam" : "Hari";

    return {

        metode: "Sullamu an-Nayyirain",

        html: `
            <div class="hisab-list">
                <div class="row">
                    <span>1. Majmuah al-Khosshoh (${tmj})</span>
                    <span>${keBurujDMS(kj)}</span>
                </div>
                <div class="row">
                    <span>2. Mabsutoh al-Khosshoh (${tmb})</span>
                    <span>${keBurujDMS(kb)}</span>
                </div>
                <div class="row">
                    <span>3. Bulan al-Khosshoh (${bulan})</span>
                    <span>${keBurujDMS(kB)}</span>
                </div>
                <div class="row">
                    <span>4. Harokat al-Khosshoh</span>
                    <span>${keBurujDMS(tk)}</span>
                </div>
                <div class="tbl">
                    <span>5. Tad'il Khosoh</span>
                    <span>${keDMS(tadilkhosoh)}</span>
                </div>
                <div class="row">
                    <span>6. Majmuah al-Markaz (${tmj})</span>
                    <span>${keBurujDMS(mj)}</span>
                </div>
                <div class="row">
                    <span>7. Mabsutoh al-Markaz (${tmb})</span>
                    <span>${keBurujDMS(mb)}</span>
                </div>
                <div class="row">
                    <span>8. Bulan al-Markaz (${bulan})</span>
                    <span>${keBurujDMS(mB)}</span>
                </div>
                <div class="row">
                    <span>9. Harokat al-Markaz</span>
                    <span>${keBurujDMS(tm)}</span>
                </div>
                <div class="tbl">
                    <span>10. Ta'dil Markaz</span>
                    <span>${keDMS(tadilmarkaz)}</span>
                </div>
                <div class="row">
                    <span>11. Bu'du Goer Muadal</span>
                    <span>${keDMS(bgm)}</span>
                </div>
                <div class="row">
                    <span>12. Kali 5 Daqiqoh</span>
                    <span>${keDMS(hsd)}</span>
                </div>
                <div class="tbl">
                    <span>13. Ta'dil Syamsi</span>
                    <span>${keDMS(tsm)}</span>
                </div>
                <div class="row">
                    <span>14. Majmuah al-Wasath (${tmj})</span>
                    <span>${keBurujDMS(wj)}</span>
                </div>
                <div class="row">
                    <span>15. Mabshutoh al-Wasath (${tmb})</span>
                    <span>${keBurujDMS(wb)}</span>
                </div>
                <div class="row">
                    <span>16. Bulan al-Wasath (${bulan})</span>
                    <span>${keBurujDMS(wB)}</span>
                </div>
                <div class="row">
                    <span>17. Harokat al-Wasath</span>
                    <span>${keBurujDMS(tw)}</span>
                </div>
                <div class="tbl">
                    <span>18. Muqowam Syamsi</span>
                    <span>${keBurujDMS(ms)}</span>
                </div>
                <div class="row">
                    <span>19. Ta'dil Ayyam (Tabel)</span>
                    <span>${menitKeMS(tadilayyam)}</span>
                </div>
                <div class="row">
                    <span>20. Bu'du al-Muadal</span>
                    <span>${keDMS(bm)}</span>
                </div>
                <div class="row">
                    <span>21. Hissoh Sa'ah</span>
                    <span>${keDMS(hs)}</span>
                </div>
                <div class="tbl">
                    <span>22. Ta'dil Alamah</span>
                    <span>${keHariJMD(tax)}</span>
                </div>
                <div class="row">
                    <span>23. Majmuah al-Alamah (${tmj})</span>
                    <span>${keHariJMD(aj)}</span>
                </div>
                <div class="row">
                    <span>24. Mabshutoh al-Alamah (${tmb})</span>
                    <span>${keHariJMD(ab)}</span>
                </div>
                <div class="row">
                    <span>25. Bulan al-Alamah (${bulan})</span>
                    <span>${keHariJMD(aB)}</span>
                </div>
                <div class="row">
                    <span>26. Harokat al-Alamah</span>
                    <span>${keHariJMD(ta)}</span>
                </div>
                <div class="row">
                    <span>27. Alamah Muadalah Betawi</span>
                    <span>${keHariJMD(aJ)}</span>
                </div>
                <div class="row">
                    <span>28. Saatu Fadl al-Thulain</span>
                    <span>${keJMSSelisih(sft)}</span>
                </div>
                <div class="tbl">
                    <span>29. Alamah Muadalah Lokal</span>
                    <span>${keHariJMD(aL)} WGB</span>
                </div>
                <div class="row">
                    <span>30. Minal Ijtima Ilal Ghurub</span>
                    <span>${keJMS(mig)}</span>
                </div>
                <div class="tbl">
                    <span>31. Irtifa' Hilal Ba'dal Ghurub</span>
                    <span>${keDMS(ih)}</span>
                </div>
                <div class="tbl">
                    <span>32. Muktsul Hilal Fauqol Ufq</span>
                    <span>${keDMS(mhfu)}</span>
                </div>
                <div class="row">
                    <span>33. Majmuah al-Hisshoh (${tmj})</span>
                    <span>${keBurujDMS(hj)}</span>
                </div>
                <div class="row">
                    <span>34. Mabsutoh al-Hisshoh (${tmb})</span>
                    <span>${keBurujDMS(hb)}</span>
                </div>
                <div class="row">
                    <span>35. Bulan al-Hissoh (${bulan})</span>
                    <span>${keBurujDMS(hB)}</span>
                </div>
                <div class="row">
                    <span>35. Harokat al-Hisshoh</span>
                    <span>${keBurujDMS(th)}</span>
                </div>
                <div class="row">
                    <span>36. Kamyah Ard al-Qomar</span>
                    <span>${keDMS(kaq)}</span>
                </div>
                <div class="tbl">
                    <span>37. Qousu Nuril Hilal</span>
                    <span>${keDMS(xqn)}</span>
                </div>
                <div class="row">
                    <span>38. Elongasi</span>
                    <span>${keDMS(elongasi)}</span>
                </div>
            </div>
            <span class="sub">Ringkasan</span>
            <div class="hisab-list">
                <div class="tbl">
                    <span>Awal Bulan</span>
                    <span>${namaBulan} ${data.tahun} H</span>
                </div>                
                <div class="tbl">
                    <span>Jatuh Pada Hari</span>
                    <span>${jthab} ${data.pasaran}, ${data.tanggal} ${data.namaBulanMasehi} ${data.tahunMasehi} M</span>
                </div>                
                <div class="tbl">
                    <span>Ijtima Terjadi Pada</span>
                    <span>${sORm} ${yi}</span>
                </div>
                <div class="tbl">
                    <span>Jam Ijtima</span>
                    <span>${keJMS(aL)} WGB</span>
                </div>
                <div class="tbl">
                    <span>Ketinggian Hilal</span>
                    <span>${keDMS(ih)}</span>
                </div>
                <div class="tbl">
                    <span>Lama Hilal di atas ufuq</span>
                    <span>${keDMS(mhfu)}</span>
                </div>
                <div class="tbl">
                    <span>Cahaya Hilal</span>
                    <span>${keDMS(xqn)}</span>
                </div>
                <div class="tbl">
                    <span>Elongasi</span>
                    <span>${keDMS(elongasi)}</span>
                </div>
                <div class="tbl">
                    <span>Kriteria Imkan Rukyat</span>
                    <span>${sk}</span>
                </div>
                <div class="tbl">
                    <span>Waktu Maghrib Setelah Ijtima</span>
                    <span>${keJMS(data.maghrib)}</span>
                </div>
                <div class="tbl">
                    <span>Koordinat</span>
                    <span>${keDMS(lat)} || ${keDMS(lon)}</span>
                </div>
                
            </div>
            
        `
    };

}