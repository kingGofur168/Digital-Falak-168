const btnProsesWaktuSholat = document.getElementById("btnProsesWaktuSholat");
const panelHasilHisabSholat = document.getElementById("panelHasilHisabSholat");
const btnBackToHitungSholat = document.getElementById("btnBackToHitungSholat");
const hasilHisabWaktuSholat = document.getElementById("hasilHisabWaktuSholat");

if (btnProsesWaktuSholat) {
  btnProsesWaktuSholat.onclick = () => {
    panelInputSholat.classList.add("hidden");
    panelHasilHisabSholat.classList.remove("hidden");

    // =====================
    // INPUT DATA
    // =====================
    const tahun = parseInt(document.getElementById('inputTahun').value) || 2026;
    const bulan = parseInt(document.getElementById('inputBulan').value) || 1;
    const tanggal = parseInt(document.getElementById('inputTanggal').value) || 18;
    const zonaWaktu = 7;
    
    const φ = lokasi.lat;
    const λ = lokasi.lon;
    
    const φKaaba = 21.4225;
    const λKaaba = 39.8262;
    
    const iht = document.getElementById('ihtiyatSholat').value;
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
    // =====================
    // HITUNGAN
    // =====================
    let y = tahun;
    let m = bulan;
    if (m <= 2) { y--; m += 12; }
    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);
    const JD = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + tanggal + B - 1524.5;
    
    const T = (JD - 2451545) / 36525;
    const L0 = (280.46646 + 36000.76983 * T) % 360;
    const M = 357.52911 + 35999.05029 * T;
    const C = (1.914602 - 0.004817 * T) * Math.sin(d2r(M)) + 0.019993 * Math.sin(d2r(2 * M));
    const λ_matahari = L0 + C;
    const ε = 23.439291 - 0.0130042 * T;
    const δ = r2d(Math.asin(Math.sin(d2r(ε)) * Math.sin(d2r(λ_matahari))));
    const E = 4 * r2d(Math.tan(d2r(ε/2))**2 * Math.sin(d2r(2*L0)) - 2 * 0.016708 * Math.sin(d2r(M)));
    const zawal = 12 + zonaWaktu - (λ / 15) - (E / 60);
    
    const hitungBusur = (h) => {
      const pembilang = Math.sin(d2r(h)) - Math.sin(d2r(φ)) * Math.sin(d2r(δ));
      const penyebut = Math.cos(d2r(φ)) * Math.cos(d2r(δ));
      const arg = pembilang / penyebut;
      
      if (arg <= -1) return 12;
      if (arg >= 1) return 0;
      
      return r2d(Math.acos(arg)) / 15;
    };
    
    const tMaghrib = hitungBusur(-0.833);
    const tIsya = hitungBusur(-18);
    const tSubuh = hitungBusur(-20);
    const tTerbit = hitungBusur(-0.833);
    const tDhuha = hitungBusur(4.5);
    
    const z = Math.tan(d2r(Math.abs(φ - δ)));
    const hAshar = r2d(Math.atan(1 / (1 + z)));
    const tAshar = hitungBusur(hAshar);
    
    // =====================
    // WAKTU SHOLAT 
    // =====================
    const subuh = zawal - tSubuh + ihtiyat;
    const terbit = zawal - tTerbit - ihtiyat;
    const dhuha = zawal - tDhuha + ihtiyat;
    const dzuhur = zawal + ihtiyat;
    const ashar = zawal + tAshar + ihtiyat;
    const maghrib = zawal + tMaghrib + ihtiyat;
    const isya = zawal + tIsya + ihtiyat;
    
    // Nishfu Qaus Lail
    let subuhAdj = zawal - tSubuh;
    if (subuhAdj < maghrib) subuhAdj += 24;
    const nishfuLail = ((maghrib + subuhAdj) / 2) % 24;
    
    // Arah Kiblat
    const Δλ = λKaaba - λ;
    const arahQiblat = r2d(
      Math.atan2(
        Math.sin(d2r(Δλ)),
        Math.cos(d2r(φ)) * Math.tan(d2r(φKaaba)) - 
        Math.sin(d2r(φ)) * Math.cos(d2r(Δλ))
      )
    );
    const arahQiblatNorm = (arahQiblat + 360) % 360;
    

hasilHisabWaktuSholat.innerHTML = `
<div class="card hisab-list">
  <div class="row">
    <span>Tanggal (d-m-y)</span>
    <span>${tanggal}-${bulan}-${tahun}</span>
  </div>
  <div class="row">
    <span>Arudh Balad (φ)</span>
    <span>${toDMS(φ)}</span>
  </div>
  <div class="row">
    <span>Thul Balad (λ)</span>
    <span>${toDMS(λ)}</span>
  </div>
  <div class="row">
    <span>Ihtiyath (+WS)</span>
    <span>${toHMS(ihtiyat)}</span>
  </div>
  <div class="row">
    <span>Zaman Julian (T)</span>
    <span>${T.toFixed(8)}</span>
  </div>
 </div>
<div class="card hisab-list">
  <div class="row">
    <span>Julian Day (JD)</span>
    <span>${JD.toFixed(6)}</span>
  </div>
  <div class="row">
    <span>Thul Syamsi Wasithi (L₀)</span>
    <span>${toDMS(L0)}</span>
  </div>
  
  <div class="row">
    <span>Anomali Wasithi (M)</span>
    <span>${toDMS(M)}</span>
  </div>
  
  <div class="row">
    <span>Khosshah Syamsi (C)</span>
    <span>${toDMS(C)}</span>
  </div>
  
  <div class="row">
    <span>Thul Haqiqi (λ_Matahari)</span>
    <span>${toDMS(λ_matahari)}</span>
  </div>

  <div class="row">
    <span>Mail Syamsi (ε)</span>
    <span>${toDMS(ε)}</span>
  </div>
  
  <div class="row">
    <span>Mail Haqiqi (δ)</span>
    <span>${toDMS(δ)}</span>
  </div>
  
  <div class="row">
    <span>Daqoiq Tafawut (E)</span>
    <span>${toHMS(E)}</span>
  </div>
  <div class="row">
  <span>Daqāʾiq Tafāwut (E)</span>
  <span>${menitKeMS(E)}</span>
</div>
  <div class="row">
    <span>Zawal Syamsi (Dzuhur)</span>
    <span>${toHMS(zawal)}</span>
  </div>
  <div class="row">
    <span>Irtfa' Ashar</span>
    <span>${toDMS(hAshar)}</span>
  </div>
</div>


<div class="card hisab-list">
  <div class="row">
    <span>Nishfu Qaus Nahr (Zawal -› Maghrib)</span>
    <span>${toHMS(tMaghrib)}</span>
  </div>
  <div class="row">
    <span>Nishfu Qausil Lail (Maghrib ‹-› Subuh)</span>
    <span>${toHMS(nishfuLail)}</span>
  </div>
  <div class="row">
    <span>Qaus Isya (Zawal -› Isya)</span>
    <span>${toHMS(tIsya)}</span>
  </div>
  
  <div class="row">
    <span>Qaus Subuh (Subuh -› Zawal)</span>
    <span>${toHMS(tSubuh)}</span>
  </div>
  
  <div class="row">
    <span>Qaus Ashar (Zawal -› Ashar)</span>
    <span>${toHMS(tAshar)}</span>
  </div>
</div>


<div class="card hisab-list">
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


<div class="card hisab-list">
  <div class="row">
    <span>Lintang Ka'bah (φ)</span>
    <span>${toDMS(φKaaba, true)}</span>
  </div>
  
  <div class="row">
    <span>Bujur Ka'bah (λ)</span>
    <span>${toDMS(λKaaba)}</span>
  </div>
  
  <div class="row">
    <span>Selisih Bujur (Δλ)</span>
    <span>${toDMS(Δλ)}</span>
  </div>
  
  <div class="row">
    <span>Arah Kiblat (Q)</span>
    <span>${toDMS(arahQiblatNorm)}</span>
  </div>
</div>

`;
    
  };
}

if (btnBackToHitungSholat) {
  btnBackToHitungSholat.onclick = () => {
    panelInputSholat.classList.remove("hidden");
    panelHasilHisabSholat.classList.add("hidden");
  };
}