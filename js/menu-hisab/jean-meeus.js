/* JEAN MEEUS */
const panelHasilHisabJM = document.getElementById("panelHasilHisabJM");
const btnProsesHisabJM = document.getElementById("btnProsesHisabJM");
const btnBackToIjtimaJM = document.getElementById("btnBackToIjtimaJM");

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
      <div class="row"><span>Jumlah Konjungsi</span><span>${d.k} kali Ijtimak</span></div>
    
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