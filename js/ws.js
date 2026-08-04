const btnProsesWS = document.getElementById("btnProsesWS");
const panelHasilHisabWS = document.getElementById("panelHasilHisabWS");
const btnBackToWS = document.getElementById("btnBackToWS");
const hasilHisabWS = document.getElementById("hasilHisabWS");

if (btnProsesWS) {
  btnProsesWS.onclick = () => {
    panelHisab.classList.add("hidden");
    panelHasilHisabWS.classList.remove("hidden");

    // =====================
    // INPUT DATA
    // =====================
    const tahun = parseInt(document.getElementById('inputWSTahun').value) || 2026;
    const bulan = parseInt(document.getElementById('inputWSBulan').value) || 1;
    const tanggal = parseInt(document.getElementById('inputWSTanggal').value) || 18;
    const zonaWaktu = parseInt(document.getElementById('inputWSTZ').value) || 18;
    const iht = Number(localStorage.getItem('ihtiyat')) || 0;
    const φ = lokasi.lat;
    const λ = lokasi.lon;
    const ihtiyat = iht / 60;
    
    // =====================
    // FUNGSI BANTU
    // =====================
    const d2r = d => d * Math.PI / 180;
    const r2d = r => r * 180 / Math.PI;
    
    const toDMS = x => {
      const sign = x < 0 ? '-' : '';
      x = Math.abs(x);
      const d = Math.floor(x);
      const m = Math.floor((x - d) * 60);
      const s = ((x - d - m/60) * 3600).toFixed(1);
      return `${sign}${d}° ${m}′ ${s}″`;
    };
    
    const toHMS = x => {
      x = (x + 24) % 24;
      const h = Math.floor(x);
      const m = Math.floor((x - h) * 60);
      const s = Math.round(((x - h) * 60 - m) * 60);
      return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    };
    
    function menitKeMS(x){
    const sign = x < 0 ? '−' : '';
    x = Math.abs(x);

    const m = Math.floor(x);
    const s = ((x - m) * 60).toFixed(1);

    return `${sign}${m}′ ${s}″`;
    }

    // HITUNGAN
    let y = tahun;
    let m = bulan;
    if (m <= 2) { y--; m += 12; }
    let A = Math.floor(y / 100);
    let A2 = Math.floor(A / 4);
    let B = 2 - A + A2;
    let x1 = y + 4716;
    let x2 = Math.floor(365.25 * x1);
    let x3 = m + 1;
    let x4 = Math.floor(30.6001 * x3);
    let x5 = tanggal + B - 1524.5;
    let JD = x2 + x4 + x5;
    let T = (JD - 2451545) / 36525;
    let L0 = (280.46646 + 36000.76983 * T) % 360;
    let M = 357.52911 + 35999.05029 * T;
    let C1 = 1.914602 - 0.004817 * T;
    let C2 = Math.sin(d2r(M));
    let C3 = Math.sin(d2r(2 * M));
    let C = C1 * C2 + 0.019993 * C3;
    let λ_matahari = L0 + C;
    let ε = 23.439291 - 0.0130042 * T;
    let δ1 = Math.sin(d2r(ε));
    let δ2 = Math.sin(d2r(λ_matahari));
    let δ3 = δ1 * δ2;
    let δ = r2d(Math.asin(δ3));
    
    let E1 = Math.tan(d2r(ε/2)) **2;
    let E2 = Math.sin(d2r(2*L0));
    let E = 4 * r2d(E1 * E2 - 2 * 0.016708 * C2);
    
    let zawal = 12 + zonaWaktu - (λ / 15) - (E / 60);
    
    const hitungBusur = (h) => {
      const pembilang = Math.sin(d2r(h)) - Math.sin(d2r(φ)) * Math.sin(d2r(δ));
      const penyebut = Math.cos(d2r(φ)) * Math.cos(d2r(δ));
      const arg = pembilang / penyebut;
      
      if (arg <= -1) return 12;
      if (arg >= 1) return 0;
      
      return r2d(Math.acos(arg)) / 15;
    };
    
    let z = Math.tan(d2r(Math.abs(φ - δ)));
    let tAshar = r2d(Math.atan(1 / (1 + z)));
    let tMT = -0.833;
    let tIsya = -18;
    let tShubuh = -20;
    let tDhuha = 4.5;
    
    let hAshar = hitungBusur(tAshar);
    let hMaghrib = hitungBusur(tMT);
    let hIsya = hitungBusur(tIsya);
    let hShubuh = hitungBusur(tShubuh);
    let hTerbit = hitungBusur(tMT);
    let hDhuha = hitungBusur(tDhuha);
    
    // =====================
    // WAKTU SHOLAT 
    // =====================
    let shubuh = zawal - hShubuh + ihtiyat;
    let terbit = zawal - hTerbit - ihtiyat;
    let dhuha = zawal - hDhuha + ihtiyat;
    let dzuhur = zawal + ihtiyat;
    let ashar = zawal + hAshar + ihtiyat;
    let maghrib = zawal + hMaghrib + ihtiyat;
    let isya = zawal + hIsya + ihtiyat;
    

hasilHisabWS.innerHTML = `
<div class="hisab-list">
  <div class="row">
    <span>Tanggal Masehi</span>
    <span>${tanggal}-${bulan}-${tahun}</span>
  </div>
  <div class="row">
    <span>Lintang Tempat (φ)</span>
    <span>${toDMS(φ)}</span>
  </div>
  <div class="row">
    <span>Bujur Tempat (λ)</span>
    <span>${toDMS(λ)}</span>
  </div>
  <div class="row">
    <span>Ihtiyath (++)</span>
    <span>${toHMS(ihtiyat)}</span>
  </div>
</div>

<div class="hisab-list">
  <div class="row">
    <span>Tahun Perhitungan (Y)</span>
    <span>${y}</span>
  </div>
  <div class="row">
    <span>Bulan Perhitungan (M)</span>
    <span>${m}</span>
  </div>
  <div class="row">
    <span>Abad (A)</span>
    <span>${A}</span>
  </div>
  <div class="row">
    <span>Kabisat Abad (A/4)</span>
    <span>${A2}</span>
  </div>
  <div class="tbl">
    <span>Koreksi Gregorian (B)</span>
    <span>${B}</span>
  </div>
  <div class="row">
    <span>Tahun Julian Dasar</span>
    <span>${x1}</span>
  </div>
  <div class="row">
    <span>Akumulasi Hari dari Tahun</span>
    <span>${x2}</span>
  </div>
  <div class="row">
    <span>Indeks Bulan Julian</span>
    <span>${x3}</span>
  </div>
  <div class="row">
    <span>Akumulasi Hari dari Bulan</span>
    <span>${x4}</span>
  </div>
  <div class="row">
    <span>Komponen Tanggal Julian</span>
    <span>${x5}</span>
  </div>
  <div class="tbl">
    <span>Julian Day (JD)</span>
    <span>${JD}</span>
  </div>
  <div class="row">
    <span>Julian Century (T)</span>
    <span>${T.toFixed(8)}</span>
  </div>
  <div class="row">
    <span>Bujur Rata-rata Matahari (L₀)</span>
    <span>${toDMS(L0)}</span>
  </div>
  <div class="row">
    <span>Anomali Rata-rata Matahari (M)</span>
    <span>${M}</span>
  </div>
  <div class="row">
    <span>Persamaan Pusat Matahari (C)</span>
    <span>${toDMS(C)}</span>
  </div>
  <div class="tbl">
    <span>Bujur Sebenarnya Matahari (λ)</span>
    <span>${toDMS(λ_matahari)}</span>
  </div>
  <div class="row">
    <span>Kemiringan Ekliptika (ε)</span>
    <span>${toDMS(ε)}</span>
  </div>
  <div class="tbl">
    <span>Deklinasi Matahari (δ)</span>
    <span>${toDMS(δ)}</span>
  </div>
  <div class="row">
    <span>tan²(ε/2)</span>
    <span>${E1.toFixed(6)}</span>
  </div>
  <div class="row">
    <span>sin(2L₀)</span>
    <span>${E2.toFixed(6)}</span>
  </div>
  <div class="row">
    <span>Perata Waktu (E)</span>
    <span>${menitKeMS(E)}</span>
  </div>
  <div class="tbl">
    <span>Waktu Zawal</span>
    <span>${toHMS(zawal)}</span>
  </div>
  <div class="row">
    <span>Selisih Lintang & Deklinasi</span>
    <span>${toDMS(z)}</span>
  </div>
  <div class="tbl">
    <span>irtifa' Ashar (T?)</span>
    <span>${toDMS(tAshar)}</span>
  </div>
  <div class="row">
    <span>Jarak Ashar (HA)</span>
    <span>${toHMS(hAshar)}</span>
  </div>
  <div class="tbl">
    <span>Waktu Ashar</span>
    <span>${toHMS(ashar)}</span>
  </div>
  <div class="row">
    <span>irtifa' Maghrib & Terbit (T0.833)</span>
    <span>${toDMS(tMT)}</span>
  </div>
  <div class="row">
    <span>Jarak Maghrib (HM)</span>
    <span>${toHMS(hMaghrib)}</span>
  </div>
  <div class="tbl">
    <span>Waktu Maghrib</span>
    <span>${toHMS(maghrib)}</span>
  </div>
  <div class="row">
    <span>Jarak Terbit (HT)</span>
    <span>${toHMS(hTerbit)}</span>
  </div>
  <div class="tbl">
    <span>Waktu Terbit</span>
    <span>${toHMS(terbit)}</span>
  </div>
  <div class="row">
    <span>irtifa' Isya (T-18)</span>
    <span>${toDMS(tIsya)}</span>
  </div>
  <div class="row">
    <span>Jarak Isya (HI)</span>
    <span>${toHMS(hIsya)}</span>
  </div>
  <div class="tbl">
    <span>Waktu Isya</span>
    <span>${toHMS(isya)}</span>
  </div>
  <div class="row">
    <span>irtifa' Shubuh (T-20)</span>
    <span>${toDMS(tShubuh)}</span>
  </div>
  <div class="row">
    <span>Jarak Shubuh (HS)</span>
    <span>${toHMS(hShubuh)}</span>
  </div>
  <div class="tbl">
    <span>Waktu Shubuh</span>
    <span>${toHMS(shubuh)}</span>
  </div>
  <div class="row">
    <span>irtifa' Dhuha (T4.5)</span>
    <span>${toDMS(tDhuha)}</span>
  </div>
  <div class="row">
    <span>Jarak Dhuha (HD)</span>
    <span>${toHMS(hDhuha)}</span>
  </div>
  <div class="tbl">
    <span>Waktu Dhuha</span>
    <span>${toHMS(hDhuha)}</span>
  </div>
</div>

<span class="sub">Walhasil</span>
<div class="hisab-list">
  <div class="tbl">
    <span>Shubuh</span>
    <span>${toHMS(shubuh)}</span>
  </div>

  <div class="tbl">
    <span>Terbit</span>
    <span>${toHMS(terbit)}</span>
  </div>

  <div class="tbl">
    <span>Dhuha</span>
    <span>${toHMS(dhuha)}</span>
  </div>

  <div class="tbl">
    <span>Dzuhur</span>
    <span>${toHMS(dzuhur)}</span>
  </div>

  <div class="tbl">
    <span>Ashar</span>
    <span>${toHMS(ashar)}</span>
  </div>

  <div class="tbl">
    <span>Maghrib</span>
    <span>${toHMS(maghrib)}</span>
  </div>

  <div class="tbl">
    <span>Isya</span>
    <span>${toHMS(isya)}</span>
  </div>
</div>
`;
    
  };
}

if (btnBackToWS) {
  btnBackToWS.onclick = () => {
    panelHisab.classList.remove("hidden");
    panelHasilHisabWS.classList.add("hidden");
  };
}