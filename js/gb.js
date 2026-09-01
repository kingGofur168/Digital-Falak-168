function hisabGB(datagerhana){
  const thn=Number(datagerhana.tahun)||2000,tinggi=Number(datagerhana.altitude)||0,lat=Number(datagerhana.latitude)||0,lon=Number(datagerhana.longitude)||0,zona=Number(datagerhana.zona)||0,PI=Math.PI;
  const rad=x=>x*PI/180,deg=x=>x*180/PI,sinD=x=>Math.sin(rad(x)),cosD=x=>Math.cos(rad(x)),tanD=x=>Math.tan(rad(x));
  const asinD=x=>deg(Math.asin(Math.max(-1,Math.min(1,x)))),atan2D=(y,x)=>deg(Math.atan2(y,x)),mod360=x=>((x%360)+360)%360;

  function deltaT(t){let y=t/100;
    if(t<500)return 10583.6-1014.41*y+33.78311*y*y-5.952053*y**3-0.1798452*y**4+0.022174192*y**5+0.0090316521*y**6;
    if(t<1600){y=(t-1000)/100;return 1574.2-556.01*y+71.23472*y*y+0.319781*y**3-0.8503463*y**4-0.005050998*y**5+0.0083572073*y**6}
    if(t<1700){y=t-1600;return 120-0.9808*y-0.01532*y*y+y**3/7129}
    if(t<1800){y=t-1700;return 8.83+0.1603*y-0.0059285*y*y+0.00013336*y**3-y**4/1174000}
    if(t<1860){y=t-1800;return 13.72-0.332447*y+0.0068612*y*y+0.0041116*y**3-0.00037436*y**4+0.0000121272*y**5-0.0000001699*y**6+0.000000000875*y**7}
    if(t<1900){y=t-1860;return 7.62+0.5737*y-0.251754*y*y+0.01680668*y**3-0.0004473624*y**4+y**5/233174}
    if(t<1920){y=t-1900;return -2.79+1.494119*y-0.0598939*y*y+0.0061966*y**3-0.000197*y**4}
    if(t<1941){y=t-1920;return 21.20+0.84493*y-0.076100*y*y+0.0020936*y**3}
    if(t<1961){y=t-1950;return 29.07+0.407*y-y*y/233+y**3/2547}
    if(t<1986){y=t-1975;return 45.45+1.067*y-y*y/260-y**3/718}
    if(t<2005){y=t-2000;return 63.86+0.3345*y-0.060374*y*y+0.0017275*y**3+0.000651814*y**4+0.00002373599*y**5}
    if(t<2050){y=t-2000;return 62.92+0.32217*y+0.005589*y*y}
    if(t<2150)return -20+32*((t-1820)/100)**2-0.5628*(2150-t);
    return -20+32*((t-1820)/100)**2;
  }

  function jdKeTanggal(jd){if(!Number.isFinite(jd))return {tahun:0,bulan:1,hari:1,jam:0,menit:0,detik:0};
    let z=Math.floor(jd+0.5),f=jd+0.5-z,a=z;
    if(z>=2299161){const al=Math.floor((z-1867216.25)/36524.25);a=z+1+al-Math.floor(al/4)}
    const b=a+1524,c=Math.floor((b-122.1)/365.25),d=Math.floor(365.25*c),e=Math.floor((b-d)/30.6001),hariDec=b-d-Math.floor(30.6001*e)+f,bulan=e<14?e-1:e-13,tahun=bulan>2?c-4716:c-4715;
    let hari=Math.floor(hariDec),td=Math.round((hariDec-hari)*86400);
    if(td>=86400){td-=86400;hari++}
    const tgl=new Date(Date.UTC(tahun,bulan-1,hari));
    return {tahun:tgl.getUTCFullYear(),bulan:tgl.getUTCMonth()+1,hari:tgl.getUTCDate(),jam:Math.floor(td/3600),menit:Math.floor((td%3600)/60),detik:td%60};
  }

  const bln=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const ft=d=>d&&d.bulan>=1&&d.bulan<=12?String(d.hari).padStart(2,"0")+" "+bln[d.bulan-1]+" "+d.tahun:"-";
  const fw=d=>d?String(d.jam).padStart(2,"0")+":"+String(d.menit).padStart(2,"0")+":"+String(d.detik).padStart(2,"0"):"-";

  function posisiBulan(jd){const T=(jd-2451545.0)/36525,T2=T*T,T3=T2*T,T4=T3*T,E=1-0.002516*T-0.0000074*T2;
    let Lp=mod360(218.3164477+481267.88123421*T-0.0015786*T2+T3/538841-T4/65194000),D=mod360(297.8501921+445267.1114034*T-0.0018819*T2+T3/545868-T4/113065000),M=mod360(357.5291092+35999.0502909*T-0.0001536*T2+T3/24490000),Mp=mod360(134.9633964+477198.8675055*T+0.0087414*T2+T3/69699-T4/14712000),F=mod360(93.2720950+483202.0175233*T-0.0036539*T2-T3/3526000+T4/863310000);
    const lon=Lp+6.289*sinD(Mp)+1.274*sinD(2*D-Mp)+0.658*sinD(2*D)+0.214*sinD(2*Mp)-0.186*E*sinD(M)-0.059*sinD(2*D-2*Mp)-0.057*E*sinD(2*D-M-Mp)+0.053*sinD(2*D+Mp)+0.046*E*sinD(2*D-M)+0.041*E*sinD(M-Mp)-0.035*sinD(D)-0.031*E*sinD(M+Mp)-0.015*sinD(2*F-2*D)-0.011*sinD(2*D-4*Mp);
    const latB=5.128*sinD(F)+0.280*sinD(Mp+F)+0.277*sinD(Mp-F)+0.173*sinD(2*D-F)+0.055*sinD(2*D-Mp+F)+0.046*sinD(2*D-Mp-F)+0.033*sinD(2*D+F)+0.017*sinD(2*Mp+F);
    const dist=385000.56-20905.355*cosD(Mp)-3699.111*cosD(2*D-Mp)-2955.968*cosD(2*D)-569.925*cosD(2*Mp)+48.888*E*cosD(M);
    return {longitude:mod360(lon),latitude:latB,distance:dist};
  }

  function gmst(jd){const T=(jd-2451545.0)/36525;return mod360(280.46061837+360.98564736629*(jd-2451545.0)+0.000387933*T*T-T*T*T/38710000)}

  function posisiToposentrikBulan(jd){const bl=posisiBulan(jd),T=(jd-2451545.0)/36525,eps=23.439291-0.0130042*T,lam=bl.longitude,beta=bl.latitude;
    const ra=mod360(atan2D(sinD(lam)*cosD(eps)-tanD(beta)*sinD(eps),cosD(lam))),dec=asinD(sinD(beta)*cosD(eps)+cosD(beta)*sinD(eps)*sinD(lam)),par=asinD(Math.min(1,6378.14/bl.distance)),phi=rad(lat),u=Math.atan(0.99664719*Math.tan(phi));
    const rhoSin=0.99664719*Math.sin(u)+(tinggi/6378137)*Math.sin(phi),rhoCos=Math.cos(u)+(tinggi/6378137)*Math.cos(phi);
    let H=mod360(gmst(jd)+lon-ra);if(H>180)H-=360;
    const dAl=atan2D(-rhoCos*Math.sin(rad(par))*Math.sin(rad(H)),Math.cos(rad(dec))-rhoCos*Math.sin(rad(par))*Math.cos(rad(H))),raT=ra+dAl;
    let HT=((H-dAl+180)%360+360)%360-180;
    const decT=atan2D((Math.sin(rad(dec))-rhoSin*Math.sin(rad(par)))*Math.cos(rad(dAl)),Math.cos(rad(dec))-rhoCos*Math.sin(rad(par))*Math.cos(rad(H)));
    const alt=asinD(Math.sin(phi)*sinD(decT)+Math.cos(phi)*cosD(decT)*Math.cos(rad(HT)));
    let az=mod360(atan2D(Math.sin(rad(HT)),Math.cos(rad(HT))*Math.sin(phi)-Math.tan(rad(decT))*Math.cos(phi))+180);
    return {ra,dec,raTopocentric:raT,decTopocentric:decT,parallax:par,altitude:alt,azimuth:az,distance:bl.distance};
  }

  function koreksiRefraksi(alt){if(!Number.isFinite(alt)||alt<=-1)return 0;const arg=alt+10.3/(alt+5.11),nt=tanD(arg);return(!Number.isFinite(nt)||Math.abs(nt)<1e-12)?0:1.02/nt/60}

  function cekVisibilitas(jd){if(!Number.isFinite(jd))return {terlihat:false,altitude:-90,altitudeSemu:-90,azimuth:0,status:"Data tidak valid"};
    const p=posisiToposentrikBulan(jd);let alt=Number.isFinite(p.altitude)?p.altitude:-90,az=Number.isFinite(p.azimuth)?p.azimuth:0;
    const altSemu=alt+koreksiRefraksi(alt);
    return {terlihat:altSemu>=0,altitude:alt,altitudeSemu:altSemu,azimuth:az,parallax:p.parallax,status:altSemu>=0?"Di atas horizon":"Di bawah horizon"};
  }

  function cekSemuaFase(d){const f={P1:Number.isFinite(d.P1jd)?cekVisibilitas(d.P1jd):null,U1:Number.isFinite(d.U1jd)?cekVisibilitas(d.U1jd):null,U2:Number.isFinite(d.U2jd)?cekVisibilitas(d.U2jd):null,maksimum:Number.isFinite(d.jdUT)?cekVisibilitas(d.jdUT):null,U3:Number.isFinite(d.U3jd)?cekVisibilitas(d.U3jd):null,U4:Number.isFinite(d.U4jd)?cekVisibilitas(d.U4jd):null,P4:Number.isFinite(d.P4jd)?cekVisibilitas(d.P4jd):null};
    const sm=Object.values(f).filter(x=>x!==null).map(x=>x.terlihat),jt=sm.filter(x=>x).length,jf=sm.length;
    return {fase:f,jumlahFase:jf,jumlahTerlihat:jt,kesimpulan:jt===0?"Tidak terlihat":jt===jf?"Seluruh fase terlihat":"Sebagian fase terlihat"};
  }

  function hitungGerhana(k){const T=k/1236.85,T2=T*T,T3=T2*T,T4=T3*T,E=1-0.002516*T-0.0000074*T2;
    const M=mod360(2.5534+29.10535670*k-0.0000014*T2-0.00000011*T3),Mp=mod360(201.5643+385.81693528*k+0.0107582*T2+0.00001238*T3-0.000000058*T4),F=mod360(160.7108+390.67050284*k-0.0016118*T2-0.00000227*T3+0.000000011*T4),om=mod360(124.7746-1.56375580*k+0.0020672*T2+0.00000215*T3),F1=F-0.02665*sinD(om),A1=299.77+0.107408*k-0.009173*T2;
    const JDE0=2451550.09765+29.530588853*k+0.0001337*T2-0.000000150*T3+0.00000000073*T4;
    const kor=-0.4065*sinD(Mp)+0.1727*E*sinD(M)+0.0161*sinD(2*Mp)-0.0097*sinD(2*F1)+0.0073*E*sinD(Mp-M)-0.0050*E*sinD(Mp+M)-0.0023*sinD(Mp-2*F1)+0.0021*E*sinD(2*M)-0.0012*sinD(Mp-2*F1)-0.0006*E*sinD(2*Mp+M)+0.0004*sinD(3*Mp)+0.0003*E*sinD(M+2*F1)-0.0003*sinD(A1)+0.0002*E*sinD(M-2*F1)+0.0002*E*sinD(2*Mp-M)-0.0002*sinD(om);
    const JDE=JDE0+kor,P=0.2070*E*sinD(M)+0.0024*E*sinD(2*M)-0.0392*sinD(Mp)+0.0116*sinD(2*Mp)-0.0073*E*sinD(Mp+M)+0.0067*E*sinD(Mp-M)+0.0118*sinD(2*F1),Q=5.2207-0.0048*E*cosD(M)+0.0020*E*cosD(2*M)-0.3299*cosD(Mp)-0.0060*E*cosD(Mp+M)+0.0041*E*cosD(Mp-M),W=Math.abs(cosD(F1));
    const gamma=(P*cosD(F1)+Q*sinD(F1))*(1-0.0048*W),u=0.0059+0.0046*E*cosD(M)-0.0182*cosD(Mp)+0.0004*cosD(2*Mp)-0.0005*E*cosD(M+Mp);
    const magP=(1.5573+u-Math.abs(gamma))/0.5450,magU=(1.0128-u-Math.abs(gamma))/0.5450,H=1.5573+u,Pu=1.0128-u,T1=0.4678-u,n=0.5458+0.0400*cosD(Mp);
    const semiP=n&&H*H-gamma*gamma>=0?(60/n)*Math.sqrt(H*H-gamma*gamma):0,semiU=n&&Pu*Pu-gamma*gamma>=0?(60/n)*Math.sqrt(Pu*Pu-gamma*gamma):0,semiT=n&&T1*T1-gamma*gamma>=0?(60/n)*Math.sqrt(T1*T1-gamma*gamma):0;
    let jenis=magP>=0?"Gerhana Bulan Penumbra":"Tidak terjadi gerhana";
    if(magU>=0)jenis="Gerhana Bulan Sebagian";
    if(magU>=1)jenis="Gerhana Bulan Total";
    return {k,T,E,M,Mp,F,F1,omega:om,A1,JDE0,koreksiJDE:kor,JDE,P,Q,W,gamma,u,radiusPenumbra:1.2848+u,radiusUmbra:0.7403-u,magP,magU,H,Pu,T1,n,semiP,semiU,semiT,jenis};
  }

  const hasil=[],kDasar=Math.floor((thn-2000)*12.3685);
  for(let kInt=kDasar-3;kInt<=kDasar+15;kInt++){
    const k=kInt+0.5,data=hitungGerhana(k);
    if(!Number.isFinite(data.JDE))continue;
    const thnEf=2000+100*data.T,dt=deltaT(thnEf),jdUT=data.JDE-dt/86400;
    if(!Number.isFinite(jdUT))continue;
    const tglUT=jdKeTanggal(jdUT);
    if(tglUT.tahun!==thn||data.magP<0)continue;
    const jdLokal=jdUT+zona/24,maksUT=jdKeTanggal(jdUT),maksLokal=jdKeTanggal(jdLokal),P1jd=jdUT-data.semiP/1440,P4jd=jdUT+data.semiP/1440;
    let U1jd=null,U2jd=null,U3jd=null,U4jd=null;
    if(data.magU>=0){U1jd=jdUT-data.semiU/1440;U4jd=jdUT+data.semiU/1440}
    if(data.magU>=1){U2jd=jdUT-data.semiT/1440;U3jd=jdUT+data.semiT/1440}
    const vis=cekSemuaFase({P1jd,U1jd,U2jd,jdUT,U3jd,U4jd,P4jd}),maks=vis.fase.maksimum;
    hasil.push({...data,tahunEphemeris:thnEf,deltaT:dt,jdUT,jdLokal,maksimumUT:maksUT,maksimumLokal:maksLokal,P1jd,U1jd,U2jd,U3jd,U4jd,P4jd,P1:jdKeTanggal(P1jd+zona/24),U1:U1jd===null?null:jdKeTanggal(U1jd+zona/24),U2:U2jd===null?null:jdKeTanggal(U2jd+zona/24),U3:U3jd===null?null:jdKeTanggal(U3jd+zona/24),U4:U4jd===null?null:jdKeTanggal(U4jd+zona/24),P4:jdKeTanggal(P4jd+zona/24),latitude:lat,longitude:lon,altitudeTempat:tinggi,altitudeBulan:maks?maks.altitude:-90,altitudeSemuBulan:maks?maks.altitudeSemu:-90,azimuthBulan:maks?maks.azimuth:0,terlihat:maks?maks.terlihat:false,statusVisibilitas:maks?maks.status:"Data tidak valid",visibilitas:vis});
  }
  hasil.sort((a,b)=>a.jdUT-b.jdUT);

  let html='<div class="hisab-list">';
  if(hasil.length===0)html+='<div class="row"><span>Hasil</span><span>Tidak ada gerhana bulan</span></div>';
  else hasil.forEach((data,index)=>{
    html+=`<div class="tbl"><span>Gerhana</span><span>${index+1}</span></div><div class="tbl"><span>Jenis Gerhana</span><span>${data.jenis}</span></div><div class="tbl"><span>Tanggal</span><span>${ft(data.maksimumLokal)}</span></div><div class="row"><span>Maksimum Lokal</span><span>${fw(data.maksimumLokal)}</span></div><div class="row"><span>Maksimum UT</span><span>${fw(data.maksimumUT)}</span></div><div class="row"><span>Gamma</span><span>${data.gamma.toFixed(6)}</span></div><div class="row"><span>u</span><span>${data.u.toFixed(6)}</span></div><div class="row"><span>Magnitudo Penumbra</span><span>${data.magP.toFixed(6)}</span></div><div class="row"><span>Magnitudo Umbra</span><span>${data.magU.toFixed(6)}</span></div><div class="row"><span>P1</span><span>${fw(data.P1)}</span></div>`;
    if(data.U1!==null)html+=`<div class="row"><span>U1</span><span>${fw(data.U1)}</span></div>`;
    if(data.U2!==null)html+=`<div class="row"><span>U2</span><span>${fw(data.U2)}</span></div><div class="row"><span>U3</span><span>${fw(data.U3)}</span></div>`;
    if(data.U4!==null)html+=`<div class="row"><span>U4</span><span>${fw(data.U4)}</span></div>`;
    html+=`<div class="row"><span>P4</span><span>${fw(data.P4)}</span></div><div class="row"><span>Altitude Bulan</span><span>${data.altitudeBulan.toFixed(2)}°</span></div><div class="row"><span>Altitude Semu</span><span>${data.altitudeSemuBulan.toFixed(2)}°</span></div><div class="row"><span>Azimuth Bulan</span><span>${data.azimuthBulan.toFixed(2)}°</span></div><div class="tbl"><span>Visibilitas Maksimum</span><span>${data.statusVisibilitas}</span></div><div class="tbl"><span>Visibilitas Lokal</span><span>${data.visibilitas.kesimpulan}</span></div><div class="row"><span>Fase Terlihat</span><span>${data.visibilitas.jumlahTerlihat}/${data.visibilitas.jumlahFase}</span></div>`;
    const f=data.visibilitas.fase;
    const faseAlt=[["P1",f.P1],["U1",f.U1],["U2",f.U2],["Maksimum",f.maksimum],["U3",f.U3],["U4",f.U4],["P4",f.P4]];
    faseAlt.forEach(([nama,val])=>{if(val!==null)html+=`<div class="row"><span>Altitude ${nama}</span><span>${val.altitude.toFixed(2)}°</span></div>`});
    html+='<div class="row"><span></span></div>';
  });
  html+='</div>';
  return {jenisgerhana:"Gerhana Bulan",metode:"Jean Meeus",tahun:thn,altitude:tinggi,latitude:lat,longitude:lon,zona:zona,jumlah:hasil.length,hasil,html};
}