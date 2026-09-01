function hisabIM(data) {
  const thn = data.tahun,
        bln = data.bulan,
        lat = data.latitude,
        lon = data.longitude,
        TT = data.altitude,
        kriteria = data.kriteria,
        TZ = 7;

  let Y = bln === 1 ? thn - 1 : thn;
  let M = bln === 1 ? bln + 11 : bln - 1;

  const rad = Math.PI / 180;
  const sin = x => Math.sin(x * rad);
  const cos = x => Math.cos(x * rad);
  const tan = x => Math.tan(x * rad);
  const asin = x => Math.asin(x) / rad;
  const acos = x => Math.acos(x) / rad;
  const atan = x => Math.atan(x) / rad;
  const frac = x => x - Math.floor(x);
  const int = x => Math.floor(x);
  const norm360 = x => ((x % 360) + 360) % 360;

  const HY = Y + (M * 29.53) / 354.3671;
  const K = Math.round((HY - 1410) * 12);
  const T = K / 1200;

  const JD =
    2447740.652 +
    29.53058868 * K +
    0.0001178 * T * T;

  const Mm = norm360(
    frac(
      (207.9587074 +
        29.10535608 * K -
        0.0000333 * T * T) / 360
    ) * 360
  );

  const Mp = norm360(
    frac(
      (111.1791307 +
        385.81691806 * K +
        0.0107306 * T * T) / 360
    ) * 360
  );

  const Fm = norm360(
    frac(
      (164.2162296 +
        390.67050646 * K -
        0.0016528 * T * T) / 360
    ) * 360
  );

  const T1 = (0.1734 - 0.000393 * T) * sin(Mm);
  const T2 = 0.0021 * sin(2 * Mm);
  const T3 = -0.4068 * sin(Mp);
  const T4 = 0.0161 * sin(2 * Mp);
  const T5 = -0.0004 * sin(3 * Mp);
  const T6 = 0.0104 * sin(2 * Fm);
  const T7 = -0.0051 * sin(Mm + Mp);
  const T8 = -0.0074 * sin(Mm - Mp);
  const T9 = 0.0004 * sin(2 * Fm + Mm);
  const T10 = -0.0004 * sin(2 * Fm - Mm);
  const T11 = -0.0006 * sin(2 * Fm + Mp);
  const T12 = 0.0010 * sin(2 * Fm - Mp);
  const T13 = 0.0005 * sin(Mm + 2 * Mp);

  const MT =
    T1 + T2 + T3 + T4 + T5 + T6 +
    T7 + T8 + T9 + T10 + T11 + T12 + T13;

  const JDIjtima = JD + 0.5 + MT;

  const WIUT = frac(JDIjtima) * 24;

  let WIWD = WIUT + TZ;
  let tambahHari = 0;

  if (WIWD >= 24) {
    WIWD -= 24;
    tambahHari = 1;
  }

  const Z = int(JDIjtima);
  const AA = int((Z - 1867216.25) / 36524.25);
  const A = Z + 1 + AA - int(AA / 4);
  const B = A + 1524;
  const C = int((B - 122.1) / 365.25);
  const D = int(365.25 * C);
  const E = int((B - D) / 30.6001);

  let tglM = int(B - D - int(30.6001 * E));
  let blnM = E - 1;
  let thnM = C - 4716;

  if (blnM > 12) {
    blnM -= 12;
    thnM++;
  }

  const PA = Z + 2 + tambahHari;
  const hari = PA - int(PA / 7) * 7;
  const pasaran = PA - int(PA / 5) * 5;

  const Bm =2 - int(thnM / 100) + int(int(thnM / 100) / 4);

  const JDm = int(365.25 * (thnM + 4716)) + int(30.6001 * (blnM + 1)) + tglM + (WIUT / 24) + Bm - 1524.5;

  const Tm = (JDm - 2451545) / 36525;

  const S = norm360(
    frac((280.46645 + 36000.76983 * Tm) / 360) * 360
  );

  const m = norm360(
    frac((357.52910 + 35999.05030 * Tm) / 360) * 360
  );

  const N = norm360(
    frac((125.04 - 1934.136 * Tm) / 360) * 360
  );

  const Kp =
    (17.264 / 3600) * sin(N) +
    (0.206 / 3600) * sin(2 * N);

  const Kpp =
    (-1.264 / 3600) * sin(2 * S);

  const Rp =
    (9.23 / 3600) * cos(N) -
    (0.090 / 3600) * cos(2 * N);

  const Rpp =
    (0.548 / 3600) * cos(2 * S);

  const Qp =
    23.43929111 +
    Rp +
    Rpp -
    (46.8150 / 3600) * Tm;

  const ET =
    (6898.06 / 3600) * sin(m) +
    (72.095 / 3600) * sin(2 * m) +
    (0.966 / 3600) * sin(3 * m);

  const Sp = S + ET + Kp + Kpp - 20.47 / 3600;

  const dm = asin(sin(Sp) * sin(Qp));

  let PT = atan(tan(Sp) * cos(Qp));

  if (Sp >= 90 && Sp <= 270) PT += 180;
  if (Sp >= 270 && Sp < 360) PT += 360;

  PT = norm360(PT);

  const e =
    (-1.915 * sin(m) -
      0.020 * sin(2 * m) +
      2.466 * sin(2 * Sp) -
      0.053 * sin(4 * Sp)) / 15;

  const SD = 0.267 / (1 - 0.017 * cos(m));
  const Dip = (1.76 / 60) * Math.sqrt(Math.max(0, TT));
  const h = -(SD + 34.5 / 60 + Dip);

  const t = acos(
    -tan(lat) * tan(dm) +
    sin(h) / (cos(lat) * cos(dm))
  );

  const Ghurub = t / 15 + (12 - e);

  const Mb = norm360(
    frac((218.31617 + 481267.88088 * Tm) / 360) * 360
  );

  const Ab = norm360(
    frac((134.96292 + 477198.86753 * Tm) / 360) * 360
  );

  const Fb = norm360(
    frac((93.27283 + 483202.01873 * Tm) / 360) * 360
  );

  const Db = norm360(
    frac((297.85027 + 445267.11135 * Tm) / 360) * 360
  );

  const BT1 = (22640 / 3600) * sin(Ab);
  const BT2 = (-4586 / 3600) * sin(Ab - 2 * Db);
  const BT3 = (2370 / 3600) * sin(2 * Db);
  const BT4 = (769 / 3600) * sin(2 * Ab);
  const BT5 = (-668 / 3600) * sin(m);
  const BT6 = (-412 / 3600) * sin(2 * Fb);
  const BT7 = (-212 / 3600) * sin(2 * Ab - 2 * Db);
  const BT8 = (-206 / 3600) * sin(Ab + m - 2 * Db);
  const BT9 = (192 / 3600) * sin(Ab + 2 * Db);
  const BT10 = (-165 / 3600) * sin(m - 2 * Db);
  const BT11 = (148 / 3600) * sin(Ab - m);
  const BT12 = (-125 / 3600) * sin(Db);
  const BT13 = (-110 / 3600) * sin(Ab + m);
  const BT14 = (-55 / 3600) * sin(2 * Fb - 2 * Db);

  const Cb =
    BT1 + BT2 + BT3 + BT4 +
    BT5 + BT6 + BT7 + BT8 +
    BT9 + BT10 + BT11 + BT12 +
    BT13 + BT14;

  const Mo =
    Mb + Cb + Kp + Kpp - 20.47 / 3600;

  const Ap = Ab + BT2 + BT3 + BT5;

  const Lp =
    (18461 / 3600) * sin(Fb) +
    (1010 / 3600) * sin(Ab + Fb) +
    (1000 / 3600) * sin(Ab - Fb) -
    (624 / 3600) * sin(Fb - 2 * Db) -
    (199 / 3600) * sin(Ab - Fb - 2 * Db) -
    (167 / 3600) * sin(Ab + Fb - 2 * Db);

  const x = atan(sin(Mo) * tan(Qp));
  const y = Lp + x;

  const c = asin(
    sin(Mo) *
    sin(Qp) *
    sin(y) /
    sin(x)
  );

  const PTc = acos(
    cos(Mo) *
    cos(Lp) /
    cos(c)
  );

  const tc = (PT - PTc) + t;

  const hc = asin(
    sin(lat) * sin(c) +
    cos(lat) * cos(c) * cos(tc)
  );

  const p =
    (384401 * (1 - 0.0549 ** 2)) /
    (1 + 0.0549 * cos(Ap + BT1));

  const pp = p / 384401;
  const HP = 0.9507 / pp;
  const SDc = (0.5181 / pp) / 2;
  const Pm = HP * cos(hc);

  const Ref =
    0.0167 /
    tan(hc + 7.31 / (hc + 4.4));

  const hc2 =
    hc - Pm + SDc + Ref + Dip;

  const Az =
    atan(
      -sin(lat) / tan(t) +
      cos(lat) * tan(dm) / sin(t)
    ) + 270;

  const Azc =
    atan(
      -sin(lat) / tan(tc) +
      cos(lat) * tan(c) / sin(tc)
    ) + 270;

  const z = Azc - Az;
  const Dc = (PTc - PT) / 15;

  const AL = acos(
    cos(Math.abs(hc2 - h)) *
    cos(Math.abs(Azc - Az))
  );

  const Cw =
    (1 - cos(AL)) * SDc * 60;

  const EL =
    acos(
      cos(Mo - Sp) * cos(Lp)
    );

  const FIa = acos(-cos(EL));
  const FI = (1 + cos(FIa)) / 2;
  const Ms = Ghurub + Dc;

  const formatJam = jam => {
    jam = ((jam % 24) + 24) % 24;

    const j = Math.floor(jam);
    const menit = Math.floor((jam - j) * 60);
    const detik = Math.round(
      (((jam - j) * 60) - menit) * 60
    );

    return `${String(j).padStart(2, "0")}:${String(menit).padStart(2, "0")}:${String(detik).padStart(2, "0")}`;
  };

  const namaHari = ["Sabtu", "Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

const namaPasaran = [ "Wage", "Kliwon", "Legi", "Pahing", "Pon"];

  return {
    metode: "Irsyadul Murid",

    html: `
  <div class="hisab-list">

    <div class="row"><span>HY</span><span>${HY.toFixed(6)}</span></div>
    <div class="row"><span>K</span><span>${K}</span></div>
    <div class="row"><span>T</span><span>${T.toFixed(8)}</span></div>
    <div class="row"><span>JD</span><span>${JD.toFixed(6)}</span></div>

    <div class="row"><span>M</span><span>${Mm.toFixed(6)}°</span></div>
    <div class="row"><span>M'</span><span>${Mp.toFixed(6)}°</span></div>
    <div class="row"><span>F</span><span>${Fm.toFixed(6)}°</span></div>

    <div class="row"><span>T1</span><span>${T1.toFixed(6)}</span></div>
    <div class="row"><span>T2</span><span>${T2.toFixed(6)}</span></div>
    <div class="row"><span>T3</span><span>${T3.toFixed(6)}</span></div>
    <div class="row"><span>T4</span><span>${T4.toFixed(6)}</span></div>
    <div class="row"><span>T5</span><span>${T5.toFixed(6)}</span></div>
    <div class="row"><span>T6</span><span>${T6.toFixed(6)}</span></div>
    <div class="row"><span>T7</span><span>${T7.toFixed(6)}</span></div>
    <div class="row"><span>T8</span><span>${T8.toFixed(6)}</span></div>
    <div class="row"><span>T9</span><span>${T9.toFixed(6)}</span></div>
    <div class="row"><span>T10</span><span>${T10.toFixed(6)}</span></div>
    <div class="row"><span>T11</span><span>${T11.toFixed(6)}</span></div>
    <div class="row"><span>T12</span><span>${T12.toFixed(6)}</span></div>
    <div class="row"><span>T13</span><span>${T13.toFixed(6)}</span></div>
    <div class="row"><span>MT</span><span>${MT.toFixed(6)}</span></div>

    <div class="row"><span>JD Ijtima'</span><span>${JDIjtima.toFixed(6)}</span></div>
    <div class="row"><span>Ijtima' UT</span><span>${formatJam(WIUT)}</span></div>
    <div class="row"><span>Ijtima' WD</span><span>${formatJam(WIWD)}</span></div>

    <div class="row"><span>Z</span><span>${Z}</span></div>
    <div class="row"><span>AA</span><span>${AA}</span></div>
    <div class="row"><span>A</span><span>${A}</span></div>
    <div class="row"><span>B</span><span>${B}</span></div>
    <div class="row"><span>C</span><span>${C}</span></div>
    <div class="row"><span>D</span><span>${D}</span></div>
    <div class="row"><span>E</span><span>${E}</span></div>

    <div class="row"><span>Tanggal Masehi</span><span>${tglM}-${blnM}-${thnM}</span></div>
    <div class="row"><span>Hari</span><span>${namaHari[hari]}</span></div>
    <div class="row"><span>Pasaran</span><span>${namaPasaran[pasaran]}</span></div>

    <div class="row"><span>B</span><span>${Bm}</span></div>
    <div class="row"><span>JD Hilal</span><span>${JDm.toFixed(6)}</span></div>
    <div class="row"><span>T</span><span>${Tm.toFixed(8)}</span></div>

    <div class="row"><span>S</span><span>${S.toFixed(6)}°</span></div>
    <div class="row"><span>m</span><span>${m.toFixed(6)}°</span></div>
    <div class="row"><span>N</span><span>${N.toFixed(6)}°</span></div>

    <div class="row"><span>K'</span><span>${Kp.toFixed(6)}°</span></div>
    <div class="row"><span>K"</span><span>${Kpp.toFixed(6)}°</span></div>

    <div class="row"><span>R'</span><span>${Rp.toFixed(6)}°</span></div>
    <div class="row"><span>R"</span><span>${Rpp.toFixed(6)}°</span></div>
    <div class="row"><span>Q'</span><span>${Qp.toFixed(6)}°</span></div>

    <div class="row"><span>E</span><span>${ET.toFixed(6)}°</span></div>
    <div class="row"><span>S'</span><span>${Sp.toFixed(6)}°</span></div>
    <div class="row"><span>Deklinasi</span><span>${dm.toFixed(6)}°</span></div>
    <div class="row"><span>PT</span><span>${PT.toFixed(6)}°</span></div>
    <div class="row"><span>Equation of Time</span><span>${e.toFixed(6)} menit</span></div>
    <div class="row"><span>SD</span><span>${SD.toFixed(6)}°</span></div>
    <div class="row"><span>Dip</span><span>${Dip.toFixed(6)}°</span></div>
    <div class="row"><span>h</span><span>${h.toFixed(6)}°</span></div>
    <div class="row"><span>t</span><span>${t.toFixed(6)}°</span></div>
    <div class="row"><span>Ghurub</span><span>${formatJam(Ghurub)}</span></div>

    <div class="row"><span>M Bulan</span><span>${Mb.toFixed(6)}°</span></div>
    <div class="row"><span>A</span><span>${Ab.toFixed(6)}°</span></div>
    <div class="row"><span>F</span><span>${Fb.toFixed(6)}°</span></div>
    <div class="row"><span>D</span><span>${Db.toFixed(6)}°</span></div>

    <div class="row"><span>T1</span><span>${BT1.toFixed(6)}°</span></div>
    <div class="row"><span>T2</span><span>${BT2.toFixed(6)}°</span></div>
    <div class="row"><span>T3</span><span>${BT3.toFixed(6)}°</span></div>
    <div class="row"><span>T4</span><span>${BT4.toFixed(6)}°</span></div>
    <div class="row"><span>T5</span><span>${BT5.toFixed(6)}°</span></div>
    <div class="row"><span>T6</span><span>${BT6.toFixed(6)}°</span></div>
    <div class="row"><span>T7</span><span>${BT7.toFixed(6)}°</span></div>
    <div class="row"><span>T8</span><span>${BT8.toFixed(6)}°</span></div>
    <div class="row"><span>T9</span><span>${BT9.toFixed(6)}°</span></div>
    <div class="row"><span>T10</span><span>${BT10.toFixed(6)}°</span></div>
    <div class="row"><span>T11</span><span>${BT11.toFixed(6)}°</span></div>
    <div class="row"><span>T12</span><span>${BT12.toFixed(6)}°</span></div>
    <div class="row"><span>T13</span><span>${BT13.toFixed(6)}°</span></div>
    <div class="row"><span>T14</span><span>${BT14.toFixed(6)}°</span></div>

    <div class="row"><span>C</span><span>${Cb.toFixed(6)}°</span></div>
    <div class="row"><span>Mo</span><span>${Mo.toFixed(6)}°</span></div>
    <div class="row"><span>A'</span><span>${Ap.toFixed(6)}°</span></div>
    <div class="row"><span>L'</span><span>${Lp.toFixed(6)}°</span></div>
    <div class="row"><span>x</span><span>${x.toFixed(6)}°</span></div>
    <div class="row"><span>y</span><span>${y.toFixed(6)}°</span></div>
    <div class="row"><span>c</span><span>${c.toFixed(6)}°</span></div>
    <div class="row"><span>PTc</span><span>${PTc.toFixed(6)}°</span></div>
    <div class="row"><span>tc</span><span>${tc.toFixed(6)}°</span></div>
    <div class="row"><span>hc</span><span>${hc.toFixed(6)}°</span></div>

    <div class="row"><span>p</span><span>${p.toFixed(6)} km</span></div>
    <div class="row"><span>p'</span><span>${pp.toFixed(6)}</span></div>
    <div class="row"><span>HP</span><span>${HP.toFixed(6)}°</span></div>
    <div class="row"><span>s.d.c</span><span>${SDc.toFixed(6)}°</span></div>
    <div class="row"><span>P</span><span>${Pm.toFixed(6)}°</span></div>
    <div class="row"><span>Ref</span><span>${Ref.toFixed(6)}°</span></div>
    <div class="row"><span>hc'</span><span>${hc2.toFixed(6)}°</span></div>

    <div class="row"><span>Az</span><span>${Az.toFixed(6)}°</span></div>
    <div class="row"><span>Azc</span><span>${Azc.toFixed(6)}°</span></div>
    <div class="row"><span>z</span><span>${z.toFixed(6)}°</span></div>
    <div class="row"><span>Dc</span><span>${Dc.toFixed(6)} jam</span></div>
    <div class="row"><span>AL</span><span>${AL.toFixed(6)}°</span></div>
    <div class="row"><span>Cw</span><span>${Cw.toFixed(6)}'</span></div>
    <div class="row"><span>EL</span><span>${EL.toFixed(6)}°</span></div>
    <div class="row"><span>FIa</span><span>${FIa.toFixed(6)}°</span></div>
    <div class="row"><span>FI</span><span>${FI.toFixed(6)}</span></div>
    <div class="row"><span>Ms</span><span>${formatJam(Ms)}</span></div>

  </div>
`
  };
}