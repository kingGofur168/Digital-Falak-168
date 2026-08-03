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
    
    let tMaghrib = hitungBusur(-0.833);
    let tIsya = hitungBusur(-18);
    let tSubuh = hitungBusur(-20);
    let tTerbit = hitungBusur(-0.833);
    let tDhuha = hitungBusur(4.5);
    
    let z = Math.tan(d2r(Math.abs(φ - δ)));
    let hAshar = r2d(Math.atan(1 / (1 + z)));
    let tAshar = hitungBusur(hAshar);
    
    // =====================
    // WAKTU SHOLAT 
    // =====================
    let subuh = zawal - tSubuh + ihtiyat;
    let terbit = zawal - tTerbit - ihtiyat;
    let dhuha = zawal - tDhuha + ihtiyat;
    let dzuhur = zawal + ihtiyat;
    let ashar = zawal + tAshar + ihtiyat;
    let maghrib = zawal + tMaghrib + ihtiyat;
    let isya = zawal + tIsya + ihtiyat;
    

hasilHisabWS.innerHTML = `
<div class="hisab-list">
  <div class="row">
    <span>D-Y-M</span>
    <span>${tanggal}-${bulan}-${tahun}</span>
  </div>
  <div class="row">
    <span>Latitude (φ)</span>
    <span>${toDMS(φ)}</span>
  </div>
  <div class="row">
    <span>Longitude (λ)</span>
    <span>${toDMS(λ)}</span>
  </div>
  <div class="row">
    <span>Ihtiyath (+WS)</span>
    <span>${toHMS(ihtiyat)}</span>
  </div>
 </div>
<div class="hisab-list">
  <div class="row">
    <span>Logika (Y)</span>
    <span>${y}</span>
  </div>
  <div class="row">
    <span>Logika (M)</span>
    <span>${m}</span>
  </div>
  <div class="row">
    <span>Jumlah Abad (A100)</span>
    <span>${A}</span>
  </div>
  <div class="row">
    <span>Jumlah Siklus (A400)</span>
    <span>${A2}</span>
  </div>
  <div class="tbl">
    <span>Koreksi Abad (B)</span>
    <span>${B}</span>
  </div>
  <div class="row">
    <span>Pergeseran Titik Awal (X1)</span>
    <span>${x1}</span>
  </div>
  <div class="row">
    <span>Konversi Tahun ke Hari (X2)</span>
    <span>${x2}</span>
  </div>
  <div class="row">
    <span>Pergeseran Indeks Bulan (X3)</span>
    <span>${x3}</span>
  </div>
  <div class="row">
    <span>Akumulasi Hari per Bulan (X4)</span>
    <span>${x4}</span>
  </div>
  <div class="row">
    <span>Penyelarasan Akhir (X5)</span>
    <span>${x5}</span>
  </div>
  <div class="tbl">
    <span>Hari Julian (JD)</span>
    <span>${JD}</span>
  </div>
  <div class="row">
    <span>Zaman Julian (T)</span>
    <span>${T.toFixed(8)}</span>
  </div>
  <div class="row">
    <span>Bujur rata-rata Matahari (L₀)</span>
    <span>${toDMS(L0)}</span>
  </div>
  
  <div class="row">
    <span>Anomali Matahari (M)</span>
    <span>${(M)}</span>
  </div>
  
  <div class="row">
    <span>Persamaan Pusat Matahari (C)</span>
    <span>${toDMS(C)}</span>
  </div>
  
  <div class="tbl">
    <span>Tinggi Matahari Haqiqi (λ)</span>
    <span>${toDMS(λ_matahari)}</span>
  </div>

  <div class="row">
    <span>Mail Awal (ε)</span>
    <span>${toDMS(ε)}</span>
  </div>
  
  <div class="tbl">
    <span>Mail Haqiqi (δ)</span>
    <span>${toDMS(δ)}</span>
  </div>
  <div class="row">
    <span>E1</span>
    <span>${menitKeMS(E1)}</span>
  </div>
  <div class="row">
    <span>E2</span>
    <span>${menitKeMS(E2)}</span>
  </div>
  <div class="row">
    <span>Selisih Menit (E)</span>
    <span>${menitKeMS(E)}</span>
  </div>
  <div class="tbl">
    <span>Zawal Syamsi (Dzuhur)</span>
    <span>${toHMS(zawal)}</span>
  </div>
  <div class="row">
    <span>Irtfa' Ashar</span>
    <span>${toDMS(hAshar)}</span>
  </div>
  <div class="row">
    <span>tMaghrib</span>
    <span>${toDMS(tMaghrib)}</span>
  </div>
  <div class="row">
    <span>tIsya</span>
    <span>${toDMS(tIsya)}</span>
  </div>
  <div class="row">
    <span>tSubuh</span>
    <span>${toDMS(tSubuh)}</span>
  </div>
  <div class="row">
    <span>tTerbit</span>
    <span>${toDMS(tTerbit)}</span>
  </div>
</div>
<div class="hisab-list">
  <div class="row">
    <span>Subuh</span>
    <span>${toHMS(subuh)}</span>
  </div>
  
  <div class="row">
    <span>Terbit</span>
    <span>${toHMS(terbit)}</span>
  </div>
  
  <div class="row">
    <span>Dhuha</span>
    <span>${toHMS(dhuha)}</span>
  </div>
  
  <div class="row">
    <span>Dzuhur</span>
    <span>${toHMS(dzuhur)}</span>
  </div>
  
  <div class="row">
    <span>Ashar</span>
    <span>${toHMS(ashar)}</span>
  </div>
  
  <div class="row">
    <span>Maghrib</span>
    <span>${toHMS(maghrib)}</span>
  </div>
  
  <div class="row">
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