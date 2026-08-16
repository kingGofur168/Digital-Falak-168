function hisabGB(datagerhana){
  let thn=Number(datagerhana.tahun);
  let tinggi=Number(datagerhana.altitude);
  let lat=Number(datagerhana.latitude);
  let lon=Number(datagerhana.longitude);
  let zona=Number(datagerhana.zona);

  if(!Number.isFinite(thn))thn=2000;
  if(!Number.isFinite(tinggi))tinggi=0;
  if(!Number.isFinite(lat))lat=0;
  if(!Number.isFinite(lon))lon=0;
  if(!Number.isFinite(zona))zona=0;

  const PI=Math.PI;

  function rad(x){
    return x*PI/180;
  }

  function deg(x){
    return x*180/PI;
  }

  function sinD(x){
    return Math.sin(rad(x));
  }

  function cosD(x){
    return Math.cos(rad(x));
  }

  function tanD(x){
    return Math.tan(rad(x));
  }

  function asinD(x){
    x=Math.max(-1,Math.min(1,x));
    return deg(Math.asin(x));
  }

  function atan2D(y,x){
    return deg(Math.atan2(y,x));
  }

  function mod360(x){
    return ((x%360)+360)%360;
  }

  function deltaT(tahun){
    let t;
    let dt;

    if(tahun<500){
      t=tahun/100;

      dt=
        10583.6-
        1014.41*t+
        33.78311*t*t-
        5.952053*t*t*t-
        0.1798452*t*t*t*t+
        0.022174192*t*t*t*t*t+
        0.0090316521*t*t*t*t*t*t;

    }else if(tahun<1600){
      t=(tahun-1000)/100;

      dt=
        1574.2-
        556.01*t+
        71.23472*t*t+
        0.319781*t*t*t-
        0.8503463*t*t*t*t-
        0.005050998*t*t*t*t*t+
        0.0083572073*t*t*t*t*t*t;

    }else if(tahun<1700){
      t=tahun-1600;

      dt=
        120-
        0.9808*t-
        0.01532*t*t+
        t*t*t/7129;

    }else if(tahun<1800){
      t=tahun-1700;

      dt=
        8.83+
        0.1603*t-
        0.0059285*t*t+
        0.00013336*t*t*t-
        t*t*t*t/1174000;

    }else if(tahun<1860){
      t=tahun-1800;

      dt=
        13.72-
        0.332447*t+
        0.0068612*t*t+
        0.0041116*t*t*t-
        0.00037436*t*t*t*t+
        0.0000121272*t*t*t*t*t-
        0.0000001699*t*t*t*t*t*t+
        0.000000000875*t*t*t*t*t*t*t;

    }else if(tahun<1900){
      t=tahun-1860;

      dt=
        7.62+
        0.5737*t-
        0.251754*t*t+
        0.01680668*t*t*t-
        0.0004473624*t*t*t*t+
        t*t*t*t*t/233174;

    }else if(tahun<1920){
      t=tahun-1900;

      dt=
        -2.79+
        1.494119*t-
        0.0598939*t*t+
        0.0061966*t*t*t-
        0.000197*t*t*t*t;

    }else if(tahun<1941){
      t=tahun-1920;

      dt=
        21.20+
        0.84493*t-
        0.076100*t*t+
        0.0020936*t*t*t;

    }else if(tahun<1961){
      t=tahun-1950;

      dt=
        29.07+
        0.407*t-
        t*t/233+
        t*t*t/2547;

    }else if(tahun<1986){
      t=tahun-1975;

      dt=
        45.45+
        1.067*t-
        t*t/260-
        t*t*t/718;

    }else if(tahun<2005){
      t=tahun-2000;

      dt=
        63.86+
        0.3345*t-
        0.060374*t*t+
        0.0017275*t*t*t+
        0.000651814*t*t*t*t+
        0.00002373599*t*t*t*t*t;

    }else if(tahun<2050){
      t=tahun-2000;

      dt=
        62.92+
        0.32217*t+
        0.005589*t*t;

    }else if(tahun<2150){
      t=(tahun-1820)/100;

      dt=
        -20+
        32*t*t-
        0.5628*(2150-tahun);

    }else{
      t=(tahun-1820)/100;

      dt=
        -20+
        32*t*t;
    }

    return dt;
  }

  function jdKeTanggal(jd){
    if(!Number.isFinite(jd)){
      return {
        tahun:0,
        bulan:1,
        hari:1,
        jam:0,
        menit:0,
        detik:0
      };
    }

    let z=Math.floor(jd+0.5);
    let f=jd+0.5-z;
    let a=z;

    if(z>=2299161){
      const alpha=
        Math.floor(
          (z-1867216.25)/36524.25
        );

      a=
        z+
        1+
        alpha-
        Math.floor(alpha/4);
    }

    const b=a+1524;

    const c=
      Math.floor(
        (b-122.1)/365.25
      );

    const d=
      Math.floor(365.25*c);

    const e=
      Math.floor(
        (b-d)/30.6001
      );

    const hariDecimal=
      b-
      d-
      Math.floor(30.6001*e)+
      f;

    const bulan=
      e<14?
      e-1:
      e-13;

    const tahun=
      bulan>2?
      c-4716:
      c-4715;

    let hari=
      Math.floor(hariDecimal);

    let totalDetik=
      Math.round(
        (hariDecimal-hari)*86400
      );

    if(totalDetik>=86400){
      totalDetik-=86400;
      hari++;
    }

    const tanggal=
      new Date(
        Date.UTC(
          tahun,
          bulan-1,
          hari
        )
      );

    return {
      tahun:tanggal.getUTCFullYear(),
      bulan:tanggal.getUTCMonth()+1,
      hari:tanggal.getUTCDate(),
      jam:Math.floor(totalDetik/3600),
      menit:Math.floor((totalDetik%3600)/60),
      detik:totalDetik%60
    };
  }

  function formatTanggal(d){
    if(!d)return "-";

    const bulan=[
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember"
    ];

    if(
      d.bulan<1||
      d.bulan>12
    ){
      return "-";
    }

    return(
      String(d.hari).padStart(2,"0")+
      " "+
      bulan[d.bulan-1]+
      " "+
      d.tahun
    );
  }

  function formatWaktu(d){
    if(!d)return "-";

    return(
      String(d.jam).padStart(2,"0")+
      ":"+
      String(d.menit).padStart(2,"0")+
      ":"+
      String(d.detik).padStart(2,"0")
    );
  }

  function posisiBulan(jd){
    const T=
      (jd-2451545.0)/36525;

    const T2=T*T;
    const T3=T2*T;
    const T4=T3*T;

    let Lp=
      218.3164477+
      481267.88123421*T-
      0.0015786*T2+
      T3/538841-
      T4/65194000;

    let D=
      297.8501921+
      445267.1114034*T-
      0.0018819*T2+
      T3/545868-
      T4/113065000;

    let M=
      357.5291092+
      35999.0502909*T-
      0.0001536*T2+
      T3/24490000;

    let Mp=
      134.9633964+
      477198.8675055*T+
      0.0087414*T2+
      T3/69699-
      T4/14712000;

    let F=
      93.2720950+
      483202.0175233*T-
      0.0036539*T2-
      T3/3526000+
      T4/863310000;

    Lp=mod360(Lp);
    D=mod360(D);
    M=mod360(M);
    Mp=mod360(Mp);
    F=mod360(F);

    const E=
      1-
      0.002516*T-
      0.0000074*T2;

    const longitude=
      Lp+
      6.289*sinD(Mp)+
      1.274*sinD(2*D-Mp)+
      0.658*sinD(2*D)+
      0.214*sinD(2*Mp)-
      0.186*E*sinD(M)-
      0.059*sinD(2*D-2*Mp)-
      0.057*E*sinD(2*D-M-Mp)+
      0.053*sinD(2*D+Mp)+
      0.046*E*sinD(2*D-M)+
      0.041*E*sinD(M-Mp)-
      0.035*sinD(D)-
      0.031*E*sinD(M+Mp)-
      0.015*sinD(2*F-2*D)-
      0.011*sinD(2*D-4*Mp);

    const latitude=
      5.128*sinD(F)+
      0.280*sinD(Mp+F)+
      0.277*sinD(Mp-F)+
      0.173*sinD(2*D-F)+
      0.055*sinD(2*D-Mp+F)+
      0.046*sinD(2*D-Mp-F)+
      0.033*sinD(2*D+F)+
      0.017*sinD(2*Mp+F);

    const distance=
      385000.56-
      20905.355*cosD(Mp)-
      3699.111*cosD(2*D-Mp)-
      2955.968*cosD(2*D)-
      569.925*cosD(2*Mp)+
      48.888*E*cosD(M);

    return {
      longitude:mod360(longitude),
      latitude:latitude,
      distance:distance
    };
  }

  function gmst(jd){
    const T=
      (jd-2451545.0)/36525;

    return mod360(
      280.46061837+
      360.98564736629*
      (jd-2451545.0)+
      0.000387933*T*T-
      T*T*T/38710000
    );
  }

  function posisiToposentrikBulan(jd){
    const bulan=
      posisiBulan(jd);

    const T=
      (jd-2451545.0)/36525;

    const epsilon=
      23.439291-
      0.0130042*T;

    const lambda=
      bulan.longitude;

    const beta=
      bulan.latitude;

    const ra=
      mod360(
        atan2D(
          sinD(lambda)*cosD(epsilon)-
          tanD(beta)*sinD(epsilon),
          cosD(lambda)
        )
      );

    const dec=
      asinD(
        sinD(beta)*cosD(epsilon)+
        cosD(beta)*sinD(epsilon)*sinD(lambda)
      );

    const jarak=
      bulan.distance;

    const equatorialRadius=
      6378.14;

    const sinParallax=
      Math.min(
        1,
        equatorialRadius/jarak
      );

    const parallax=
      asinD(sinParallax);

    const phi=
      rad(lat);

    const u=
      Math.atan(
        0.99664719*
        Math.tan(phi)
      );

    const rhoSinPhi=
      0.99664719*
      Math.sin(u)+
      (tinggi/6378137)*
      Math.sin(phi);

    const rhoCosPhi=
      Math.cos(u)+
      (tinggi/6378137)*
      Math.cos(phi);

    let H=
      gmst(jd)+
      lon-
      ra;

    H=mod360(H);

    if(H>180)
      H-=360;

    const Hrad=
      rad(H);

    const decRad=
      rad(dec);

    const parallaxRad=
      rad(parallax);

    const deltaAlpha=
      atan2D(
        -rhoCosPhi*
        Math.sin(parallaxRad)*
        Math.sin(Hrad),

        Math.cos(decRad)-
        rhoCosPhi*
        Math.sin(parallaxRad)*
        Math.cos(Hrad)
      );

    const raTopocentric=
      ra+
      deltaAlpha;

    let HTopocentric=
      H-
      deltaAlpha;

    HTopocentric=
      ((HTopocentric+180)%360+360)%360-
      180;

    const HTopocentricRad=
      rad(HTopocentric);

    const decTopocentric=
      atan2D(
        (
          Math.sin(decRad)-
          rhoSinPhi*
          Math.sin(parallaxRad)
        )*
        Math.cos(rad(deltaAlpha)),

        Math.cos(decRad)-
        rhoCosPhi*
        Math.sin(parallaxRad)*
        Math.cos(Hrad)
      );

    const altitude=
      asinD(
        Math.sin(phi)*
        sinD(decTopocentric)+
        Math.cos(phi)*
        cosD(decTopocentric)*
        Math.cos(HTopocentricRad)
      );

    let azimuth=
      atan2D(
        Math.sin(HTopocentricRad),

        Math.cos(HTopocentricRad)*
        Math.sin(phi)-
        Math.tan(
          rad(decTopocentric)
        )*
        Math.cos(phi)
      );

    azimuth=
      mod360(
        azimuth+180
      );

    return {
      ra:ra,
      dec:dec,
      raTopocentric:raTopocentric,
      decTopocentric:decTopocentric,
      parallax:parallax,
      altitude:altitude,
      azimuth:azimuth,
      distance:jarak
    };
  }

  function koreksiRefraksi(alt){
    if(
      !Number.isFinite(alt)||
      alt<=-1
    ){
      return 0;
    }

    const arg=
      alt+
      10.3/(alt+5.11);

    const nilaiTan=
      tanD(arg);

    if(
      !Number.isFinite(nilaiTan)||
      Math.abs(nilaiTan)<1e-12
    ){
      return 0;
    }

    return(
      1.02/
      nilaiTan/
      60
    );
  }

  function altitudeSemu(alt){
    return(
      alt+
      koreksiRefraksi(alt)
    );
  }

  function cekVisibilitas(jd){
    if(!Number.isFinite(jd)){
      return {
        terlihat:false,
        altitude:-90,
        altitudeSemu:-90,
        azimuth:0,
        status:"Data tidak valid"
      };
    }

    const posisi=
      posisiToposentrikBulan(jd);

    let alt=
      Number(posisi.altitude);

    let az=
      Number(posisi.azimuth);

    if(!Number.isFinite(alt))
      alt=-90;

    if(!Number.isFinite(az))
      az=0;

    const altSemu=
      altitudeSemu(alt);

    const terlihat=
      altSemu>=0;

    return {
      terlihat:terlihat,
      altitude:alt,
      altitudeSemu:altSemu,
      azimuth:az,
      parallax:posisi.parallax,
      status:
        terlihat?
        "Di atas horizon":
        "Di bawah horizon"
    };
  }

  function cekSemuaFase(data){
    const fase={};

    fase.P1=
      Number.isFinite(data.P1jd)?
      cekVisibilitas(data.P1jd):
      null;

    fase.U1=
      Number.isFinite(data.U1jd)?
      cekVisibilitas(data.U1jd):
      null;

    fase.U2=
      Number.isFinite(data.U2jd)?
      cekVisibilitas(data.U2jd):
      null;

    fase.maksimum=
      Number.isFinite(data.jdUT)?
      cekVisibilitas(data.jdUT):
      null;

    fase.U3=
      Number.isFinite(data.U3jd)?
      cekVisibilitas(data.U3jd):
      null;

    fase.U4=
      Number.isFinite(data.U4jd)?
      cekVisibilitas(data.U4jd):
      null;

    fase.P4=
      Number.isFinite(data.P4jd)?
      cekVisibilitas(data.P4jd):
      null;

    const semua=
      Object.values(fase)
      .filter(function(x){
        return x!==null;
      })
      .map(function(x){
        return x.terlihat;
      });

    const jumlahTerlihat=
      semua.filter(function(x){
        return x===true;
      }).length;

    const jumlahFase=
      semua.length;

    let kesimpulan;

    if(jumlahTerlihat===0){
      kesimpulan="Tidak terlihat";
    }else if(jumlahTerlihat===jumlahFase){
      kesimpulan="Seluruh fase terlihat";
    }else{
      kesimpulan="Sebagian fase terlihat";
    }

    return {
      fase:fase,
      jumlahFase:jumlahFase,
      jumlahTerlihat:jumlahTerlihat,
      kesimpulan:kesimpulan
    };
  }

  function hitungGerhana(k){
    const T=
      k/1236.85;

    const T2=T*T;
    const T3=T2*T;
    const T4=T3*T;

    const E=
      1-
      0.002516*T-
      0.0000074*T2;

    const M=
      mod360(
        2.5534+
        29.10535670*k-
        0.0000014*T2-
        0.00000011*T3
      );

    const Mp=
      mod360(
        201.5643+
        385.81693528*k+
        0.0107582*T2+
        0.00001238*T3-
        0.000000058*T4
      );

    const F=
      mod360(
        160.7108+
        390.67050284*k-
        0.0016118*T2-
        0.00000227*T3+
        0.000000011*T4
      );

    const omega=
      mod360(
        124.7746-
        1.56375580*k+
        0.0020672*T2+
        0.00000215*T3
      );

    const F1=
      F-
      0.02665*sinD(omega);

    const A1=
      299.77+
      0.107408*k-
      0.009173*T2;

    const JDE0=
      2451550.09765+
      29.530588853*k+
      0.0001337*T2-
      0.000000150*T3+
      0.00000000073*T4;

    const koreksiJDE=
      (
        -0.4065*sinD(Mp)+
        0.1727*E*sinD(M)+
        0.0161*sinD(2*Mp)-
        0.0097*sinD(2*F1)+
        0.0073*E*sinD(Mp-M)-
        0.0050*E*sinD(Mp+M)-
        0.0023*sinD(Mp-2*F1)+
        0.0021*E*sinD(2*M)-
        0.0012*sinD(Mp-2*F1)-
        0.0006*E*sinD(2*Mp+M)+
        0.0004*sinD(3*Mp)+
        0.0003*E*sinD(M+2*F1)-
        0.0003*sinD(A1)+
        0.0002*E*sinD(M-2*F1)+
        0.0002*E*sinD(2*Mp-M)-
        0.0002*sinD(omega)
      );

    const JDE=
      JDE0+
      koreksiJDE;

    const P=
      0.2070*E*sinD(M)+
      0.0024*E*sinD(2*M)-
      0.0392*sinD(Mp)+
      0.0116*sinD(2*Mp)-
      0.0073*E*sinD(Mp+M)+
      0.0067*E*sinD(Mp-M)+
      0.0118*sinD(2*F1);

    const Q=
      5.2207-
      0.0048*E*cosD(M)+
      0.0020*E*cosD(2*M)-
      0.3299*cosD(Mp)-
      0.0060*E*cosD(Mp+M)+
      0.0041*E*cosD(Mp-M);

    const W=
      Math.abs(
        cosD(F1)
      );

    const gamma=
      (
        P*cosD(F1)+
        Q*sinD(F1)
      )*
      (
        1-
        0.0048*W
      );

    const u=
      0.0059+
      0.0046*E*cosD(M)-
      0.0182*cosD(Mp)+
      0.0004*cosD(2*Mp)-
      0.0005*E*cosD(M+Mp);

    const radiusPenumbra=
      1.2848+u;

    const radiusUmbra=
      0.7403-u;

    const magnitudePenumbra=
      (
        1.5573+
        u-
        Math.abs(gamma)
      )/
      0.5450;

    const magnitudeUmbra=
      (
        1.0128-
        u-
        Math.abs(gamma)
      )/
      0.5450;

    const H=
      1.5573+u;

    const Pu=
      1.0128-u;

    const T1=
      0.4678-u;

    const n=
      0.5458+
      0.0400*cosD(Mp);

    let semiP=0;
    let semiU=0;
    let semiT=0;

    const nilaiP=
      H*H-
      gamma*gamma;

    const nilaiU=
      Pu*Pu-
      gamma*gamma;

    const nilaiT=
      T1*T1-
      gamma*gamma;

    if(nilaiP>=0&&n!==0){
      semiP=
        (60/n)*
        Math.sqrt(nilaiP);
    }

    if(nilaiU>=0&&n!==0){
      semiU=
        (60/n)*
        Math.sqrt(nilaiU);
    }

    if(nilaiT>=0&&n!==0){
      semiT=
        (60/n)*
        Math.sqrt(nilaiT);
    }

    let jenis=
      "Tidak terjadi gerhana";

    if(magnitudePenumbra>=0){
      jenis=
        "Gerhana Bulan Penumbra";
    }

    if(magnitudeUmbra>=0){
      jenis=
        "Gerhana Bulan Sebagian";
    }

    if(magnitudeUmbra>=1){
      jenis=
        "Gerhana Bulan Total";
    }

    return {
      k:k,
      T:T,
      E:E,
      M:M,
      Mp:Mp,
      F:F,
      F1:F1,
      omega:omega,
      A1:A1,

      JDE0:JDE0,
      koreksiJDE:koreksiJDE,
      JDE:JDE,

      P:P,
      Q:Q,
      W:W,
      gamma:gamma,
      u:u,

      radiusPenumbra:radiusPenumbra,
      radiusUmbra:radiusUmbra,

      magP:magnitudePenumbra,
      magU:magnitudeUmbra,

      H:H,
      Pu:Pu,
      T1:T1,
      n:n,

      semiP:semiP,
      semiU:semiU,
      semiT:semiT,

      jenis:jenis
    };
  }

  const hasil=[];

  const kDasar=
    Math.floor(
      (thn-2000)*
      12.3685
    );

  for(
    let kInt=kDasar-3;
    kInt<=kDasar+15;
    kInt++
  ){

    const k=
      kInt+0.5;

    const data=
      hitungGerhana(k);

    if(
      !Number.isFinite(data.JDE)
    ){
      continue;
    }

    const tahunEphemeris=
      2000+
      100*data.T;

    const dt=
      deltaT(tahunEphemeris);

    const jdUT=
      data.JDE-
      dt/86400;

    if(
      !Number.isFinite(jdUT)
    ){
      continue;
    }

    const tanggalUT=
      jdKeTanggal(jdUT);

    if(
      tanggalUT.tahun!==thn
    ){
      continue;
    }

    if(
      data.magP<0
    ){
      continue;
    }

    const jdLokal=
      jdUT+
      zona/24;

    const maksimumUT=
      jdKeTanggal(jdUT);

    const maksimumLokal=
      jdKeTanggal(jdLokal);

    const P1jd=
      jdUT-
      data.semiP/1440;

    const P4jd=
      jdUT+
      data.semiP/1440;

    let U1jd=null;
    let U2jd=null;
    let U3jd=null;
    let U4jd=null;

    if(data.magU>=0){

      U1jd=
        jdUT-
        data.semiU/1440;

      U4jd=
        jdUT+
        data.semiU/1440;
    }

    if(data.magU>=1){

      U2jd=
        jdUT-
        data.semiT/1440;

      U3jd=
        jdUT+
        data.semiT/1440;
    }

    const visibilitas=
      cekSemuaFase({
        P1jd:P1jd,
        U1jd:U1jd,
        U2jd:U2jd,
        jdUT:jdUT,
        U3jd:U3jd,
        U4jd:U4jd,
        P4jd:P4jd
      });

    const maksimum=
      visibilitas.fase.maksimum;

    const altitudeBulan=
      maksimum!==null?
      maksimum.altitude:
      -90;

    const altitudeSemuBulan=
      maksimum!==null?
      maksimum.altitudeSemu:
      -90;

    const azimuthBulan=
      maksimum!==null?
      maksimum.azimuth:
      0;

    const terlihat=
      maksimum!==null?
      maksimum.terlihat:
      false;

    const statusVisibilitas=
      maksimum!==null?
      maksimum.status:
      "Data tidak valid";

    hasil.push({

      ...data,

      tahunEphemeris:
        tahunEphemeris,

      deltaT:
        dt,

      jdUT:
        jdUT,

      jdLokal:
        jdLokal,

      maksimumUT:
        maksimumUT,

      maksimumLokal:
        maksimumLokal,

      P1jd:
        P1jd,

      U1jd:
        U1jd,

      U2jd:
        U2jd,

      U3jd:
        U3jd,

      U4jd:
        U4jd,

      P4jd:
        P4jd,

      P1:
        jdKeTanggal(
          P1jd+
          zona/24
        ),

      U1:
        U1jd===null?
        null:
        jdKeTanggal(
          U1jd+
          zona/24
        ),

      U2:
        U2jd===null?
        null:
        jdKeTanggal(
          U2jd+
          zona/24
        ),

      U3:
        U3jd===null?
        null:
        jdKeTanggal(
          U3jd+
          zona/24
        ),

      U4:
        U4jd===null?
        null:
        jdKeTanggal(
          U4jd+
          zona/24
        ),

      P4:
        jdKeTanggal(
          P4jd+
          zona/24
        ),

      latitude:
        lat,

      longitude:
        lon,

      altitudeTempat:
        tinggi,

      altitudeBulan:
        altitudeBulan,

      altitudeSemuBulan:
        altitudeSemuBulan,

      azimuthBulan:
        azimuthBulan,

      terlihat:
        terlihat,

      statusVisibilitas:
        statusVisibilitas,

      visibilitas:
        visibilitas
    });
  }

  hasil.sort(
    function(a,b){
      return a.jdUT-b.jdUT;
    }
  );

  let html=`
    <div class="hisab-list">
  `;

  if(hasil.length===0){

    html+=`
      <div class="row">
        <span>Hasil</span>
        <span>Tidak ada gerhana bulan</span>
      </div>
    `;

  }else{

    hasil.forEach(
      function(data,index){

        html+=`
          <div class="row">
            <span>Gerhana</span>
            <span>${index+1}</span>
          </div>

          <div class="row">
            <span>Jenis Gerhana</span>
            <span>${data.jenis}</span>
          </div>

          <div class="row">
            <span>Tanggal</span>
            <span>${formatTanggal(data.maksimumLokal)}</span>
          </div>

          <div class="row">
            <span>Maksimum Lokal</span>
            <span>${formatWaktu(data.maksimumLokal)}</span>
          </div>

          <div class="row">
            <span>Maksimum UT</span>
            <span>${formatWaktu(data.maksimumUT)}</span>
          </div>

          <div class="row">
            <span>Gamma</span>
            <span>${data.gamma.toFixed(6)}</span>
          </div>

          <div class="row">
            <span>u</span>
            <span>${data.u.toFixed(6)}</span>
          </div>

          <div class="row">
            <span>Magnitudo Penumbra</span>
            <span>${data.magP.toFixed(6)}</span>
          </div>

          <div class="row">
            <span>Magnitudo Umbra</span>
            <span>${data.magU.toFixed(6)}</span>
          </div>

          <div class="row">
            <span>P1</span>
            <span>${formatWaktu(data.P1)}</span>
          </div>
        `;

        if(data.U1!==null){

          html+=`
            <div class="row">
              <span>U1</span>
              <span>${formatWaktu(data.U1)}</span>
            </div>
          `;
        }

        if(data.U2!==null){

          html+=`
            <div class="row">
              <span>U2</span>
              <span>${formatWaktu(data.U2)}</span>
            </div>

            <div class="row">
              <span>U3</span>
              <span>${formatWaktu(data.U3)}</span>
            </div>
          `;
        }

        if(data.U4!==null){

          html+=`
            <div class="row">
              <span>U4</span>
              <span>${formatWaktu(data.U4)}</span>
            </div>
          `;
        }

        html+=`
          <div class="row">
            <span>P4</span>
            <span>${formatWaktu(data.P4)}</span>
          </div>

          <div class="row">
            <span>Altitude Bulan</span>
            <span>${data.altitudeBulan.toFixed(2)}°</span>
          </div>

          <div class="row">
            <span>Altitude Semu</span>
            <span>${data.altitudeSemuBulan.toFixed(2)}°</span>
          </div>

          <div class="row">
            <span>Azimuth Bulan</span>
            <span>${data.azimuthBulan.toFixed(2)}°</span>
          </div>

          <div class="row">
            <span>Visibilitas Maksimum</span>
            <span>${data.statusVisibilitas}</span>
          </div>

          <div class="row">
            <span>Visibilitas Lokal</span>
            <span>${data.visibilitas.kesimpulan}</span>
          </div>

          <div class="row">
            <span>Fase Terlihat</span>
            <span>${data.visibilitas.jumlahTerlihat}/${data.visibilitas.jumlahFase}</span>
          </div>
        `;

        const fase=
          data.visibilitas.fase;

        if(fase.P1!==null){

          html+=`
            <div class="row">
              <span>Altitude P1</span>
              <span>${fase.P1.altitude.toFixed(2)}°</span>
            </div>
          `;
        }

        if(fase.U1!==null){

          html+=`
            <div class="row">
              <span>Altitude U1</span>
              <span>${fase.U1.altitude.toFixed(2)}°</span>
            </div>
          `;
        }

        if(fase.U2!==null){

          html+=`
            <div class="row">
              <span>Altitude U2</span>
              <span>${fase.U2.altitude.toFixed(2)}°</span>
            </div>
          `;
        }

        if(fase.maksimum!==null){

          html+=`
            <div class="row">
              <span>Altitude Maksimum</span>
              <span>${fase.maksimum.altitude.toFixed(2)}°</span>
            </div>
          `;
        }

        if(fase.U3!==null){

          html+=`
            <div class="row">
              <span>Altitude U3</span>
              <span>${fase.U3.altitude.toFixed(2)}°</span>
            </div>
          `;
        }

        if(fase.U4!==null){

          html+=`
            <div class="row">
              <span>Altitude U4</span>
              <span>${fase.U4.altitude.toFixed(2)}°</span>
            </div>
          `;
        }

        if(fase.P4!==null){

          html+=`
            <div class="row">
              <span>Altitude P4</span>
              <span>${fase.P4.altitude.toFixed(2)}°</span>
            </div>
          `;
        }
      }
    );
  }

  html+=`
    </div>
  `;

  return {
    jenisgerhana:
      "Gerhana Bulan",

    metode:
      "Jean Meeus",

    tahun:
      thn,

    altitude:
      tinggi,

    latitude:
      lat,

    longitude:
      lon,

    zona:
      zona,

    jumlah:
      hasil.length,

    hasil:
      hasil,

    html:
      html
  };
}