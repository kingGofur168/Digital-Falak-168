/* ===============================
   ELEMENT UTAMA KALKULATOR
================================ */
const btnMenuKalkulator   = document.getElementById('menu-kalkulator'); // footer
const overlayKalkulator   = document.getElementById('kalkulatorOverlay');
const panelKalkulator     = document.getElementById('panelKalkulator');
const btnCloseKalkulator  = document.getElementById('closeKalkulator');
/* ===============================
   OPEN PANEL KALKULATOR
================================ */
if (btnMenuKalkulator) {
  btnMenuKalkulator.onclick = () => {
    overlayKalkulator.classList.remove('hidden');
    panelKalkulator.classList.remove('hidden');
    tabsK.forEach(t => t.classList.remove('active'));
    tabsK[0].classList.add('active');
  };
}
function closeKalkulatorPanel(){
  overlayKalkulator.classList.add('hidden');
  panelKalkulator.classList.add('hidden');
  if (panelHasilHariTahlil) panelHasilHariTahlil.classList.add('hidden');
}
overlayKalkulator.onclick  = closeKalkulatorPanel;
closeKalkulator.onclick = closeKalkulatorPanel;

/* ===============================
   HISAB URFI - KONVERSI HIJRI KE MASEHI
================================ */
const btnProsesKonversiH_M = document.getElementById("btnProsesKonversiH_M");
const panelHasilKonversiH_M  = document.getElementById("panelHasilKonversiH_M");
const btnBackToKonversiH_M = document.getElementById("btnBackToKonversiH_M");
const hasilKonversiH_M  = document.getElementById("hasilKonversiH_M");

if(btnProsesKonversiH_M){
  btnProsesKonversiH_M.onclick=()=>{contentKonversiH_M.classList.add("hidden");panelHasilKonversiH_M.classList.remove("hidden");const tgl=parseInt(document.getElementById('inputTanggalHM').value);const bln=parseInt(document.getElementById('inputBulanHM').value);const thn=parseInt(document.getElementById('inputTahunHM').value);const bulanHijriyah={1:"Muharram",2:"Safar",3:"Rabiul Awal",4:"Rabiul Akhir",5:"Jumadil Awal",6:"Jumadil Akhir",7:"Rajab",8:"Sya'ban",9:"Ramadhan",10:"Syawal",11:"Dzulqo'dah",12:"Dzulhijjah"};const namaBulanHijri=bulanHijriyah[bln]||`Bulan ${bln}`;let tth=thn-1;let daor=Math.trunc(tth/30);let st=tth%30;let jth=daor*10631;let thst=st*354;let ak;if(st<=4)ak=1;else if(st<=6)ak=2;else if(st<=9)ak=3;else if(st<=12)ak=4;else if(st<=15)ak=5;else if(st<=17)ak=6;else if(st<=20)ak=7;else if(st<=23)ak=8;else if(st<=25)ak=9;else if(st<=29)ak=10;const jhdsMap={1:0,2:30,3:59,4:89,5:118,6:148,7:177,8:207,9:236,10:266,11:295,12:325};let jhds=jhdsMap[bln];let jhhk=jth+thst+ak+jhds+tgl;let jhmk=227014+jhhk;let tkt_ttM=jhmk/365.2425;let ttM=Math.trunc(tkt_ttM);let sttm=tkt_ttM-ttM;let jhp=Math.round(sttm*365.2425);let thnm=ttM+1;let b_masehi,b_masehi_nama;if(jhp<=31){b_masehi=1;b_masehi_nama="Januari";}else if(jhp<=59){b_masehi=2;b_masehi_nama="Februari";}else if(jhp<=90){b_masehi=3;b_masehi_nama="Maret";}else if(jhp<=120){b_masehi=4;b_masehi_nama="April";}else if(jhp<=151){b_masehi=5;b_masehi_nama="Mei";}else if(jhp<=181){b_masehi=6;b_masehi_nama="Juni";}else if(jhp<=212){b_masehi=7;b_masehi_nama="Juli";}else if(jhp<=243){b_masehi=8;b_masehi_nama="Agustus";}else if(jhp<=273){b_masehi=9;b_masehi_nama="September";}else if(jhp<=304){b_masehi=10;b_masehi_nama="Oktober";}else if(jhp<=334){b_masehi=11;b_masehi_nama="November";}else{b_masehi=12;b_masehi_nama="Desember";}let x_tglmm;switch(b_masehi){case 1:x_tglmm=0;break;case 2:x_tglmm=31;break;case 3:x_tglmm=59;break;case 4:x_tglmm=90;break;case 5:x_tglmm=120;break;case 6:x_tglmm=151;break;case 7:x_tglmm=181;break;case 8:x_tglmm=212;break;case 9:x_tglmm=243;break;case 10:x_tglmm=273;break;case 11:x_tglmm=304;break;case 12:x_tglmm=334;break;default:x_tglmm=0;}let tglmm=Math.round(jhp-x_tglmm);let xh=jhhk%7;let hari;switch(xh){case 0:hari="Kamis";break;case 1:hari="Jumat";break;case 2:hari="Sabtu";break;case 3:hari="Minggu";break;case 4:hari="Senin";break;case 5:hari="Selasa";break;case 6:hari="Rabu";break;default:hari="-";}let xp=jhhk%5;let pasar;switch(xp){case 0:pasar="Kliwon";break;case 1:pasar="Legi";break;case 2:pasar="Pahing";break;case 3:pasar="Pon";break;case 4:pasar="Wage";break;default:pasar="-";}let hasilTgl=tglmm===0?31:tglmm;hasilKonversiH_M.innerHTML=`<div class="card hisab-list"><div class="row"><span>ttH</span><span>${tth}</span></div><div class="row"><span>daor</span><span>${daor}</span></div><div class="row"><span>st</span><span>${st}</span></div><div class="row"><span>jth</span><span>${jth}</span></div><div class="row"><span>thst</span><span>${thst}</span></div><div class="row"><span>ak</span><span>${ak}</span></div><div class="row"><span>jhds</span><span>${jhds}</span></div><div class="row"><span>jhhk</span><span>${jhhk}</span></div><div class="row"><span>jhmk</span><span>${jhmk}</span></div><div class="row"><span>tkt(ttM)</span><span>${tkt_ttM.toFixed(6)}</span></div><div class="row"><span>ttM</span><span>${ttM}</span></div><div class="row"><span>sttm</span><span>${sttm.toFixed(6)}</span></div><div class="row"><span>jhp</span><span>${Math.round(jhp)}</span></div><div class="row"><span>thnm</span><span>${thnm}</span></div><div class="row"><span>b-masehi</span><span>${b_masehi_nama}</span></div><div class="row"><span>x(tglmm)</span><span>${x_tglmm}</span></div><div class="row"><span>tglmm</span><span>${tglmm}</span></div><div class="row"><span>xh</span><span>${xh}</span></div><div class="row"><span>h</span><span>${hari}</span></div><div class="row"><span>xp</span><span>${xp}</span></div><div class="row"><span>p</span><span>${pasar}</span></div><div class="poinHasilHisab"><div><span>${tgl} ${namaBulanHijri} ${thn}</span></div><div><span>${hari} ${pasar}, ${hasilTgl} ${b_masehi_nama} ${thnm}</span></div></div>`;};}



if (btnBackToKonversiH_M) {
  btnBackToKonversiH_M.onclick = () => {
    contentKonversiH_M.classList.remove("hidden");
    panelHasilKonversiH_M.classList.add("hidden");
  };
}

/* ===============================
   HISAB URFI - KONVERSI MASEHI KE HIJRI
================================ */

const btnProsesKonversiM_H = document.getElementById("btnProsesKonversiM_H");
const panelHasilKonversiM_H  = document.getElementById("panelHasilKonversiM_H");
const btnBackToKonversiM_H = document.getElementById("btnBackToKonversiM_H");
const hasilKonversiM_H  = document.getElementById("hasilKonversiM_H");

if(btnProsesKonversiM_H){btnProsesKonversiM_H.onclick=()=>{contentKonversiM_H.classList.add("hidden");panelHasilKonversiM_H.classList.remove("hidden");const v1=parseInt(document.getElementById('inputTanggalMH').value);const v2=parseInt(document.getElementById('inputBulanMH').value);const v3=parseInt(document.getElementById('inputTahunMH').value);const mN={1:"Muharram",2:"Safar",3:"Rabiul Awal",4:"Rabiul Akhir",5:"Jumadil Awal",6:"Jumadil Akhir",7:"Rajab",8:"Sya'ban",9:"Ramadhan",10:"Syawal",11:"Dzulqo'dah",12:"Dzulhijjah"};const mM={1:"Januari",2:"Februari",3:"Maret",4:"April",5:"Mei",6:"Juni",7:"Juli",8:"Agustus",9:"September",10:"Oktober",11:"November",12:"Desember"};let a=Math.trunc((14-v2)/12);let y=v3+4800-a;let m=v2+12*a-3;let jdn=v1+Math.trunc((153*m+2)/5)+365*y+Math.trunc(y/4)-Math.trunc(y/100)+Math.trunc(y/400)-32045;let jh=jdn-1948439;let d=Math.trunc(jh/10631);let s=jh%10631;let ts=Math.trunc((s-1)/354);let ht=(s-1)%354;let k=Math.trunc((11*ts+3)/30);if(ht>=k){ht-=k;}let th=d*30+ts+1;let b;if(ht<30)b=1;else if(ht<59)b=2;else if(ht<89)b=3;else if(ht<118)b=4;else if(ht<148)b=5;else if(ht<177)b=6;else if(ht<207)b=7;else if(ht<236)b=8;else if(ht<266)b=9;else if(ht<295)b=10;else if(ht<325)b=11;else b=12;const ab=[0,0,30,59,89,118,148,177,207,236,266,295,325];let t=ht-ab[b]+1;hasilKonversiM_H.innerHTML=`<div class="card hisab-list"><div class="row"><span>a</span><span>${a}</span></div><div class="row"><span>y</span><span>${y}</span></div><div class="row"><span>m</span><span>${m}</span></div><div class="row"><span>JDN</span><span>${jdn}</span></div><div class="row"><span>jh</span><span>${jh}</span></div><div class="row"><span>daur</span><span>${d}</span></div><div class="row"><span>Sisa Hari</span><span>${s}</span></div><div class="row"><span>Tahun Sisa</span><span>${ts}</span></div><div class="row"><span>kabisat</span><span>${k}</span></div><div class="row"><span>h-Tahun</span><span>${ht}</span></div><div class="row"><span>bulan</span><span>${mN[b]}</span></div><div class="row"><span>tglH</span><span>${t}</span></div><div class="poinHasilHisab"><div><span>${v1} ${mM[v2]} ${v3}</span></div><div><span>${t} ${mN[b]} ${th}</span></div></div></div>`;};}



if (btnBackToKonversiM_H) {
  btnBackToKonversiM_H.onclick = () => {
    contentKonversiM_H.classList.remove("hidden");
    panelHasilKonversiM_H.classList.add("hidden");
  };
}

/* ===============================
   TAB & KONTEN KALKULATOR
================================ */
const tabsK = document.querySelectorAll('.kalkulator-tabs .tab');
const inputHariTahlil  = document.getElementById('inputHariTahlil');
const inputHariLahir  = document.getElementById('inputHariLahir');
const contentKonversiH_M  = document.getElementById('konveriH_M');
const contentKonversiM_H  = document.getElementById('konveriM_H');
const contentsK = [inputHariTahlil, inputHariLahir, contentKonversiH_M, contentKonversiM_H];
/* ===============================
   PANEL HASIL KALKULATOR > HARI TAHLIL
================================ */
const panelHasilHariTahlil = document.getElementById('panelHasilHariTahlil');
const btnHitungTahlilH  = document.getElementById('btnHitungTahlilH');
const btnBackHariTahlil = document.getElementById('btnBackHariTahlil');
const hasilHariTahlil = document.getElementById('hasilHariTahlil');

/* ===============================
   TAB HANDLER
================================ */
tabsK.forEach((tab, index) => {
  tab.onclick = () => {
    tabsK.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    contentsK.forEach(c => c.classList.add('hidden'));
    contentsK[index].classList.remove('hidden');
  };
});

if (btnHitungTahlilH) {
  btnHitungTahlilH.onclick = () => {

    inputHariTahlil.classList.add("hidden");
    panelHasilHariTahlil.classList.remove("hidden");

    // ambil nilai input
    const tglWafat = parseInt(document.getElementById("tglWafat").value);
    const blnWafat = parseInt(document.getElementById("blnWafat").value);
    const thnWafat = parseInt(document.getElementById("thnWafat").value);

    const namaBulanH = [
      "", "Muharram","Shafar","Rabiul Awal","Rabiul Akhir",
      "Jumadil Awal","Jumadil Akhir","Rajab","Sya'ban",
      "Ramadhan","Syawal","Dzulqa'dah","Dzulhijjah"
    ];

    function hariBulanH(bulan) {
      return bulan % 2 === 1 ? 30 : 29;
    }

    function tambahHariH(t, b, y, n) {
      while (n > 0) {
        let sisa = hariBulanH(b) - t;
        if (n <= sisa) {
          t += n;
          n = 0;
        } else {
          n -= (sisa + 1);
          t = 1;
          b++;
          if (b > 12) {
            b = 1;
            y++;
          }
        }
      }
      return { t, b, y };
    }

    const agenda = [
      { nama: "1 Hari", h: 0 },
      { nama: "3 Hari", h: 2 },
      { nama: "7 Hari", h: 6 },
      { nama: "40 Hari", h: 39 },
      { nama: "100 Hari", h: 99 },
      { nama: "Haul (1 Tahun)", y: 1 }
    ];
let html = `
  <div class="card">
    <table class="tahlil-table">
      <thead>
        <tr>
          <th>Amalan</th>
          <th>Tanggal Hijriyah</th>
        </tr>
      </thead>
      <tbody>
`;

agenda.forEach(a => {
  let r;
  if (a.y) {
    r = { t: tglWafat, b: blnWafat, y: thnWafat + a.y };
  } else {
    r = tambahHariH(tglWafat, blnWafat, thnWafat, a.h);
  }

  html += `
    <tr>
      <td><span>${a.nama}</span></td>
      <td>${r.t} ${namaBulanH[r.b]} ${r.y} H</td>
    </tr>
  `;
});

html += `
      </tbody>
    </table>
    <div class="note">
      <small>* Perhitungan berdasarkan Hijriyah (hisab urfi)</small>
    </div>
  </div>
`;

hasilHariTahlil.innerHTML = html;
    
  };
}

if (btnBackHariTahlil) {
  btnBackHariTahlil.onclick = () => {
    inputHariTahlil.classList.remove("hidden");
    panelHasilHariTahlil.classList.add("hidden");
  };
}

const btnHitungHari = document.getElementById('calculateDays')
if (btnHitungHari) {
  btnHitungHari.onclick = () => { 
    
    const birthdate = document.getElementById('birthdate').value;
      const resultDays = document.getElementById('resultDays');
      const resultYearsMonthsDays = document.getElementById('resultYearsMonthsDays');
      if (birthdate) {
        const birthDateObj = new Date(birthdate);
        const currentDate = new Date();
        const timeDifference = currentDate - birthDateObj;
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        resultDays.value = daysDifference;

        // Calculate years, months, and days
        let years = currentDate.getFullYear() - birthDateObj.getFullYear();
        let monthsL = currentDate.getMonth() - birthDateObj.getMonth();
        let daysL = currentDate.getDate() - birthDateObj.getDate();

        if (daysL < 0) {
          monthsL--;
          daysL += new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        }

        if (monthsL < 0) {
          years--;
          monthsL += 12;
        }

        resultYearsMonthsDays.value = `${years} Tahun, ${monthsL} Bulan, ${daysL} Hari`;
      } else {
        resultDays.value = 'Please enter a valid date';
        resultYearsMonthsDays.value = '';
      }
    
  }
}

