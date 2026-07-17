// ==========================================
// INITIALIZATION - SEMUA DALAM SATU EVENT LISTENER
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  
  // ===== SETTINGS =====
  const settings = {
    ihtiyat: Number(localStorage.getItem('ihtiyat')) || 0,
    altitude: Number(localStorage.getItem('altitude')) || 0,
    useAltitude: localStorage.getItem('use_altitude') !== 'false'
  };
  
  // ===== ELEMEN DOM =====
  
  // Ihtiyat
  const sheet = document.getElementById('sheetIhtiyat');
  const openBtn = document.getElementById('openIhtiyat');
  const valueText = document.getElementById('ihtiyatValue');
  
  // Altitude
  const toggleAltitude = document.getElementById('toggleAltitude');
  const openAltitude = document.getElementById('openAltitude');
  const altitudeValue = document.getElementById('altitudeValue');
  const altitudeStatus = document.getElementById('altitudeStatus');
  
  // Location
  const locationModeValue = document.getElementById('locationModeValue');
  const locationModeDesc = document.getElementById('locationModeDesc');
  const coordinateDesc = document.getElementById('coordinateDesc');
  const openLocationMode = document.getElementById('openLocationMode');
  const openCoordinate = document.getElementById('openCoordinate');
  
  // Calendar
  const prevMonth = document.getElementById('prevMonth');
  const nextMonth = document.getElementById('nextMonth');
  
  // ===== FUNGSI-FUNGSI UI =====
  
  // Ihtiyat
  if (valueText) valueText.innerText = settings.ihtiyat + ' Menit';
  
  openBtn?.addEventListener('click', () => sheet?.classList.add('show'));
  sheet?.querySelector('.sheet-close')?.addEventListener('click', () => sheet.classList.remove('show'));
  
  sheet?.querySelectorAll('.sheet-option').forEach(opt => {
    opt.addEventListener('click', () => {
      settings.ihtiyat = Number(opt.dataset.val);
      localStorage.setItem('ihtiyat', settings.ihtiyat);
      if (valueText) valueText.innerText = settings.ihtiyat + ' Menit';
      sheet.classList.remove('show');
      
      // Update jadwal
      const j = hitungSholat(lokasi.lat, lokasi.lon, lokasi.tz, settings);
      updateSholatUI(j);
      startCountdown(j);
    });
  });
  
  // Altitude
  function updateAltitudeUI() {
    if (altitudeValue) altitudeValue.innerText = settings.altitude + ' MDPL';
    if (altitudeStatus) altitudeStatus.innerText = settings.useAltitude ? 'Aktif' : 'Nonaktif';
  }
  
  function applyAltitude() {
    const j = hitungSholat(lokasi.lat, lokasi.lon, lokasi.tz, settings);
    updateSholatUI(j);
    startCountdown(j);
  }
  
  toggleAltitude?.addEventListener('click', () => {
    settings.useAltitude = !settings.useAltitude;
    localStorage.setItem('use_altitude', settings.useAltitude);
    updateAltitudeUI();
    applyAltitude();
  });
  
  openAltitude?.addEventListener('click', (e) => {
    e.stopPropagation();
    
    if (!settings.useAltitude) {
      if (confirm('Ketinggian nonaktif. Aktifkan sekarang?')) {
        settings.useAltitude = true;
        localStorage.setItem('use_altitude', true);
        updateAltitudeUI();
      } else {
        return;
      }
    }
    
    const v = prompt('Masukkan ketinggian tempat untuk koreksi waktu maghrib', settings.altitude);
    if (v === null || isNaN(v)) return;
    
    settings.altitude = Number(v);
    localStorage.setItem('altitude', settings.altitude);
    
    updateAltitudeUI();
    applyAltitude();
  });
  
  // Location
  const locationSettings = {
    mode: localStorage.getItem('loc_mode') || 'auto',
    lat: Number(localStorage.getItem('lat')) || lokasi.lat,
    lon: Number(localStorage.getItem('lon')) || lokasi.lon,
  };
  
  function updateLocationUI() {
    if (!locationModeValue) return;
    locationModeValue.innerText = locationSettings.mode === 'auto' ? 'Otomatis' : 'Manual';
    if (locationModeDesc) locationModeDesc.innerText = locationModeValue.innerText;
    if (coordinateDesc) {
      coordinateDesc.innerText = locationSettings.lat.toFixed(3) + ', ' + locationSettings.lon.toFixed(3);
    }
  }
  
  function applyLocation() {
    lokasi.lat = locationSettings.lat;
    lokasi.lon = locationSettings.lon;
    const j = hitungSholat(lokasi.lat, lokasi.lon, lokasi.tz, settings);
    updateSholatUI(j);
    startCountdown(j);
  }
  
  function getAutoLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      locationSettings.lat = pos.coords.latitude;
      locationSettings.lon = pos.coords.longitude;
      localStorage.setItem('lat', locationSettings.lat);
      localStorage.setItem('lon', locationSettings.lon);
      updateLocationUI();
      applyLocation();
    });
  }
  
  openLocationMode?.addEventListener('click', () => {
    if (locationSettings.mode === 'auto') {
      locationSettings.mode = 'manual';
    } else {
      locationSettings.mode = 'auto';
      getAutoLocation();
    }
    localStorage.setItem('loc_mode', locationSettings.mode);
    updateLocationUI();
  });
  
  openCoordinate?.addEventListener('click', () => {
    if (locationSettings.mode !== 'manual') {
      alert('Mode lokasi harus Manual untuk mengubah koordinat');
      return;
    }
    const lat = prompt('Masukkan Latitude', locationSettings.lat);
    const lon = prompt('Masukkan Longitude', locationSettings.lon);
    if (lat === null || lon === null) return;
    if (isNaN(lat) || isNaN(lon)) {
      alert('Koordinat tidak valid');
      return;
    }
    locationSettings.lat = Number(lat);
    locationSettings.lon = Number(lon);
    localStorage.setItem('lat', locationSettings.lat);
    localStorage.setItem('lon', locationSettings.lon);
    updateLocationUI();
    applyLocation();
  });
  
  // Calendar Navigation
  prevMonth?.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
  });
  
  nextMonth?.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  });
  
  // ===== INITIAL RENDER =====
  updateAltitudeUI();
  updateLocationUI();
  
  if (locationSettings.mode === 'auto') {
    getAutoLocation();
  } else {
    applyLocation();
  }
  
  const jadwal = hitungSholat(lokasi.lat, lokasi.lon, lokasi.tz, settings);
  updateSholatUI(jadwal);
  startCountdown(jadwal);
  
  renderCalendar();
});
// ==========================================
// KONFIGURASI & SETTINGS
// ==========================================
const lokasi = {lat: -6.786, lon: 107.173, tz: 7};
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
const d2r = d => d * Math.PI / 180;
const r2d = r => r * 180 / Math.PI;
function time(x) {
  x = (x + 24) % 24;
  let h = Math.floor(x), m = Math.ceil((x - h) * 60);
  if (m === 60) { h = (h + 1) % 24; m = 0; }
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}
const timeToSeconds = t => { const [h, m] = t.split(':').map(Number); return h * 3600 + m * 60; };
const pad = n => String(n).padStart(2, '0');
// ==========================================
// HISAB FUNCTIONS
// ==========================================
function julianDay(y, m, d) {
  const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  let Y = date.getUTCFullYear(), M = date.getUTCMonth() + 1;
  if (M <= 2) { Y--; M += 12; }
  const A = Math.floor(Y / 100), B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + date.getUTCDate() + B - 1524.5;
}

function solar(jd) {
  const T = (jd - 2451545) / 36525;
  const L = (280.46646 + 36000.76983 * T) % 360;
  const g = 357.52911 + 35999.05029 * T;
  const C = (1.914602 - 0.004817 * T) * Math.sin(d2r(g)) + 0.019993 * Math.sin(d2r(2 * g));
  const λ = L + C, ε = 23.439291 - 0.0130042 * T;
  const δ = r2d(Math.asin(Math.sin(d2r(ε)) * Math.sin(d2r(λ))));
  const EoT = 4 * r2d(Math.tan(d2r(ε / 2)) ** 2 * Math.sin(d2r(2 * L)) - 2 * 0.016708 * Math.sin(d2r(g)));
  return { δ, EoT };
}
function hourAngle(lat, δ, h) {
  let value = (Math.sin(d2r(h)) - Math.sin(d2r(lat)) * Math.sin(d2r(δ))) /
              (Math.cos(d2r(lat)) * Math.cos(d2r(δ)));
  return r2d(Math.acos(Math.max(-1, Math.min(1, value))));
}
const dip = h => 0.0293 * Math.sqrt(h);
// ==========================================
// HITUNG JADWAL SHOLAT
// ==========================================
function hitungSholat(lat, lon, tz, settings) {
  const d = new Date();
  const jd = julianDay(d.getFullYear(), d.getMonth() + 1, d.getDate());
  const { δ, EoT } = solar(jd);
  const dz = 12 + tz - lon / 15 - EoT / 60;
  const iht = settings.ihtiyat / 60;
  const dipH = (settings.useAltitude && settings.altitude > 0) ? dip(settings.altitude) : 0;
  const subuh = dz - hourAngle(lat, δ, -20) / 15 + iht;
  const maghrib = dz + hourAngle(lat, δ, -0.833 - dipH) / 15 + iht;
  const asAlt = r2d(Math.atan(1 / (1 + Math.tan(Math.abs(d2r(lat - δ))))));
  return {
    imsak: time(subuh - 10 / 60),
    subuh: time(subuh),
    terbit: time(dz - hourAngle(lat, δ, -1) / 15 - iht),
    dhuha: time(dz - hourAngle(lat, δ, -1) / 15 - iht + (4.5 / 15) + iht),
    dzuhur: time(dz + iht),
    ashar: time(dz + hourAngle(lat, δ, asAlt) / 15 + iht),
    maghrib: time(maghrib),
    isya: time(dz + hourAngle(lat, δ, -18) / 15 + iht)
  };
}
const updateSholatUI = j => Object.keys(j).forEach(k => {
  const el = document.getElementById(k);
  if (el) el.innerText = j[k];
});
// ==========================================
// NEXT SHOLAT & COUNTDOWN
// ==========================================
function getNextSholat(jadwal) {
  const urutan = [
    { id: 'imsak', label: 'Imsak' },
    { id: 'subuh', label: 'Subuh' },
    { id: 'terbit', label: 'Terbit' },
    { id: 'dhuha', label: 'Dhuha' },
    { id: 'dzuhur', label: 'Dzuhur' },
    { id: 'ashar', label: 'Ashar' },
    { id: 'maghrib', label: 'Maghrib' },
    { id: 'isya', label: 'Isya' }
  ];

  const now = new Date();
  const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  
  // Cari waktu sholat berikutnya
  for (let item of urutan) {
    const waktuSec = timeToSeconds(jadwal[item.id]);
    if (waktuSec > nowSec) {
      return {
        label: item.label,
        time: jadwal[item.id],
        tomorrow: false
      };
    }
  }
  
  // Jika semua sudah lewat, ambil subuh besok
  return {
    label: 'Subuh',
    time: jadwal.subuh,
    tomorrow: true
  };
}

let countdownInterval = null;

function startCountdown(jadwal) {
  // Hapus interval lama jika ada
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  
  countdownInterval = setInterval(() => {
    const next = getNextSholat(jadwal);
    const now = new Date();
    const target = new Date();
    
    const [h, m] = next.time.split(':').map(Number);
    target.setHours(h, m, 0, 0);
    if (next.tomorrow) target.setDate(target.getDate() + 1);

    let diff = Math.max(0, Math.floor((target - now) / 1000));
    const hh = Math.floor(diff / 3600);
    const mm = Math.floor((diff % 3600) / 60);
    const ss = diff % 60;

    const n = document.getElementById('nextSholatName');
    const c = document.getElementById('countdownTime');
    if (n) n.innerText = `${next.label} ${next.time}`;
    if (c) c.innerText = `- ${pad(hh)}:${pad(mm)}:${pad(ss)}`;
  }, 1000);
}

// ==========================================
// KALENDER MASEHI & HIJRIYAH
// ==========================================
const namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const pasaran = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
const namaBulanHijri = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر',
  'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
];

// Data hisab untuk tahun Hijriyah
const hijriMonthLengths = {
  1446: [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 29, 29],
  1447: [30, 29, 30, 29, 30, 30, 30, 30, 29, 30, 29, 29],
  1448: [30, 29, 29, 30, 30, 29, 30, 30, 30, 29, 30, 29],
  1449: [29, 30, 29, 29, 30, 29, 30, 30, 30, 29, 30, 30],
  1450: [29, 29, 30, 29, 29, 30, 29, 30, 30, 29, 30, 30],
  1451: [29, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30, 30],
  1452: [29, 30, 30, 29, 30, 29, 30, 29, 29, 30, 29, 30],
  1453: [30, 29, 30, 29, 30, 29, 30, 29, 29, 30, 29, 30],
  1454: [30, 29, 30, 29, 30, 30, 29, 30, 30, 29, 30, 29],
  1454: [29, 30, 29, 30, 29, 30, 30, 29, 30, 30, 29, 30]
};

// Fungsi untuk mendapatkan panjang bulan dengan fallback yang lebih baik
function getHijriMonthLength(year, month) {
  // Coba dapatkan dari data yang ada
  if (hijriMonthLengths[year] && hijriMonthLengths[year][month - 1]) {
    return hijriMonthLengths[year][month - 1];
  }
  
  // Fallback: hisab sederhana (bergantian 30/29)
  // Bulan ganjil = 30, genap = 29, kecuali Dzulhijjah (bulan 12) bisa 30/29
  if (month === 12) {
    // Dzulhijjah: asumsi 30 untuk tahun kabisat (sederhana)
    return (year % 30 === 0) ? 30 : 29;
  }
  return (month % 2 === 1) ? 30 : 29;
}

const hijriAnchor = {
  startDate: new Date(2025, 0, 1),
  day: 1,
  month: 7,
  year: 1446
};

function toArab(n) {
  const a = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(n).replace(/\d/g, d => a[d]);
}

function getHijri(date) {
  let diff = Math.floor((date - hijriAnchor.startDate) / 86400000);
  let { day, month, year } = hijriAnchor;

  while (diff !== 0) {
    if (diff > 0) {
      const len = getHijriMonthLength(year, month);
      day++;
      if (day > len) {
        day = 1;
        month++;
        if (month > 12) {
          month = 1;
          year++;
        }
      }
      diff--;
    } else {
      month--;
      if (month < 1) {
        month = 12;
        year--;
      }
      const len = getHijriMonthLength(year, month);
      day = len;
      diff++;
    }
  }
  return { day, month, year };
}

function getPasaran(date) {
  const ref = new Date(2020, 0, 1);
  const diff = Math.floor((date - ref) / 86400000);
  return pasaran[(diff % 5 + 5) % 5];
}


/*
LIBUR NASIONAL (TANGGAL TETAP)

01 Januari - Tahun Baru Masehi
01 Mei - Hari Buruh Internasional
01 Juni - Hari Lahir Pancasila
17 Agustus - Hari Kemerdekaan Republik Indonesia
25 Desember - Hari Raya Natal


HARI BESAR ISLAM (TANGGAL HIJRIYAH - TETAP)

01 Muharram - Tahun Baru Islam
10 Muharram - Hari Asyura
12 Rabiul Awal - Maulid Nabi Muhammad SAW
27 Rajab - Isra Mi'raj
01 Ramadhan - Awal Puasa
17 Ramadhan - Nuzulul Qur'an
01 Syawal - Idul Fitri
09 Dzulhijjah - Hari Arafah
10 Dzulhijjah - Idul Adha
*/

// ========== DATA HARI LIBUR ==========
// ========== DATA HARI LIBUR ==========
const islamicHolidaysHijri = [
    { month: 1, day: 1, name: 'Tahun Baru Islam' },
    { month: 1, day: 10, name: 'Hari Asyura' },
    { month: 3, day: 12, name: 'Maulid Nabi' },
    { month: 7, day: 27, name: 'Isra Mi\'raj' },
    { month: 8, day: 15, name: 'Nisfu Sya\'ban' },
    { month: 9, day: 1, name: 'Awal Ramadhan' },
    { month: 10, day: 1, name: 'Idul Fitri' },
    { month: 10, day: 2, name: 'Idul Fitri Hari ke-2' },
    { month: 12, day: 10, name: 'Idul Adha' },
    { month: 12, day: 11, name: 'Tasyriq' },
    { month: 12, day: 12, name: 'Tasyriq' }
];

const fixedNationalHolidays = {
    '01-01': 'Tahun Baru Masehi',
    '05-01': 'Hari Buruh',
    '06-01': 'Hari Lahir Pancasila',
    '08-17': 'Hari Kemerdekaan RI',
    '12-25': 'Hari Raya Natal'
};


const islamicToNational = {
// Mapping hari Islam ke libur nasional
};

// ========== STATE SETTING ==========
let calendarSettings = {
    nationalHoliday: true,
    islamicHoliday: true
};

// ========== FORMAT TANGGAL ==========
function formatDateString(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// ========== GET NATIONAL HOLIDAYS UNTUK TAHUN TERTENTU ==========
function getNationalHolidays(year) {
    const result = {};
    
    // Fixed Masehi holidays
    Object.entries(fixedNationalHolidays).forEach(([mmdd, name]) => {
        const [month, day] = mmdd.split('-');
        result[`${year}-${month}-${day}`] = name;
    });
    
    return result;
}

// ========== GET ISLAMIC HOLIDAYS (KONVERSI HIJRI KE MASEHI) ==========
function getIslamicHolidaysForYear(hijriYear) {
    const result = {};
    
    // Cari 1 Muharram
    let currentDate = new Date(hijriAnchor.startDate);
    while (true) {
        const h = getHijri(currentDate);
        if (h.year === hijriYear && h.month === 1 && h.day === 1) break;
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Generate semua hari besar
    islamicHolidaysHijri.forEach(holiday => {
        let date = new Date(currentDate);
        date.setMonth(date.getMonth() + (holiday.month - 1));
        date.setDate(date.getDate() + (holiday.day - 1));
        
        const dateString = formatDateString(date.getFullYear(), date.getMonth(), date.getDate());
        result[dateString] = holiday.name;
    });
    
    return result;
}

// ========== GABUNGKAN SEMUA HOLIDAY ==========
function getAllHolidaysForDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const dateString = formatDateString(year, month, day);
    
    const result = { national: null, islamic: null };
    
    // Cek libur nasional fixed
    const mmdd = `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (calendarSettings.nationalHoliday && fixedNationalHolidays[mmdd]) {
        result.national = fixedNationalHolidays[mmdd];
    }
    
    // Cek hari Islam
    if (calendarSettings.islamicHoliday) {
        const h = getHijri(date);
        const islamicHoliday = islamicHolidaysHijri.find(
            item => item.month === h.month && item.day === h.day
        );
        
        if (islamicHoliday) {
            result.islamic = islamicHoliday.name;
            
            // Jika juga termasuk libur nasional
            if (calendarSettings.nationalHoliday && islamicToNational[islamicHoliday.name]) {
                result.national = islamicToNational[islamicHoliday.name];
            }
        }
    }
    
    return result;
}


function createCustomModal() {
    const oldModal = document.getElementById('customDateModal');
    if (oldModal) oldModal.remove();
    
    const overlay = document.createElement('div');
    overlay.id = 'customDateModal';
    
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    setTimeout(() => overlay.style.opacity = '1', 10);
    
    return { overlay, modal };
}

function showDateInfo(date) {
    const day = date.getDate();
    const month = namaBulan[date.getMonth()];
    const year = date.getFullYear();
    
    const dayNames = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = dayNames[date.getDay()];
    
    const h = getHijri(date);
    const hijriMonthName = namaBulanHijri[h.month - 1];
    const pasaranName = getPasaran(date);
    
    const holidays = getAllHolidaysForDate(date);
    
    const { overlay, modal } = createCustomModal();
    
    // Garis aksen atas (warna dinamis)
    let accentColor = '#757575';
    if (holidays.national) accentColor = '#ef5350';
    else if (holidays.islamic) accentColor = '#66bb6a';
    else if (date.getDay() === 5) accentColor = '#66bb6a';
    
    const accent = document.createElement('div');
    accent.style.cssText = `
        height: 3px;
        background: ${accentColor};
        width: 100%;
    `;
    modal.appendChild(accent);
    
    // Konten
    const content = document.createElement('div');
    content.className = 'modal-content';
    
    // Tanggal Masehi
    const masehiDate = document.createElement('div');
    masehiDate.className = 'modal-masehi-date';
    masehiDate.textContent = `${dayName}, ${day} ${month} ${year}`;
    
    // Tanggal Hijriyah
    const hijriDate = document.createElement('div');
    hijriDate.className = 'modal-hijri-date';
    hijriDate.textContent = `${h.day} ${hijriMonthName} ${h.year}`;
    
    // Garis pembatas
    const divider = document.createElement('div');
    divider.className = 'modal-divider';
    
    // Pasaran
    const pasaranRow = document.createElement('div');
    pasaranRow.className = 'modal-pasaran-row';
    pasaranRow.innerHTML = `
        <span class="modal-pasaran-label">Pasaran</span>
        <span class="modal-pasaran-value">${pasaranName}</span>
    `;
    
    content.appendChild(masehiDate);
    content.appendChild(hijriDate);
    content.appendChild(divider);
    content.appendChild(pasaranRow);
    
    // Info Libur
    if (holidays.national) {
        const liburRow = document.createElement('div');
        liburRow.className = 'modal-libur-row';
        liburRow.innerHTML = `
            <span class="modal-libur-label">Libur Nasional</span>
            <span class="modal-libur-value">${holidays.national}</span>
        `;
        content.appendChild(liburRow);
    }
    
    if (holidays.islamic && !holidays.national) {
        const islamRow = document.createElement('div');
        islamRow.className = 'islam-row';
        islamRow.innerHTML = `
            <span class="hAgungIslam-label">Hari Agung Islam</span>
            <span class="hAgungIslam-value">${holidays.islamic}</span>
        `;
        content.appendChild(islamRow);
    }
    
    modal.appendChild(content);
    
    // Tombol Tutup
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Tutup';
    closeBtn.className = 'modal-close-btn';
    closeBtn.onclick = () => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 200);
    };
    
    modal.appendChild(closeBtn);
    
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 200);
        }
    };
    
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 200);
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// === MODIFIKASI renderCalendar() ===
function renderCalendar() {
  const daysEl = document.getElementById('calendarDays');
  if (!daysEl) return;

  daysEl.innerHTML = '';

  const monthNameEl = document.getElementById('monthName');
  const yearNameEl = document.getElementById('yearName');
  if (monthNameEl) monthNameEl.innerText = namaBulan[currentMonth];
  if (yearNameEl) yearNameEl.innerText = currentYear;

  const hijriStart = getHijri(new Date(currentYear, currentMonth, 1));
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
  const hijriEnd = getHijri(new Date(currentYear, currentMonth, lastDay));

  let hijriText;
  if (hijriStart.month !== hijriEnd.month) {
    if (hijriStart.year === hijriEnd.year) {
      hijriText = `${namaBulanHijri[hijriStart.month - 1]} – ${namaBulanHijri[hijriEnd.month - 1]} ${toArab(hijriStart.year)}`;
    } else {
      hijriText = `${namaBulanHijri[hijriStart.month - 1]} ${toArab(hijriStart.year)} – ${namaBulanHijri[hijriEnd.month - 1]} ${toArab(hijriEnd.year)}`;
    }
  } else {
    hijriText = `${namaBulanHijri[hijriStart.month - 1]} ${toArab(hijriStart.year)}`;
  }

  const hijriEl = document.getElementById('hijriMonthYear');
  if (hijriEl) hijriEl.innerText = hijriText;

  const todayDate = new Date();
  const tDate = todayDate.getDate();
  const tMonth = todayDate.getMonth();
  const tYear = todayDate.getFullYear();

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrev = new Date(currentYear, currentMonth, 0).getDate();

  for (let i = firstDay - 1; i >= 0; i--) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day empty prev';
    dayDiv.innerHTML = `<span class="date">${daysInPrev - i}</span>`;
    daysEl.appendChild(dayDiv);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(currentYear, currentMonth, d);
    const h = getHijri(date);
    const holidays = getAllHolidaysForDate(date);

    let cls = 'day';
    if (date.getDay() === 0) cls += ' ahad';
    if (date.getDay() === 5) cls += ' jumat';
    
    if (holidays.national) cls += ' national-holiday';
    if (holidays.islamic && !holidays.national) cls += ' islamic-holiday';

    if (d === tDate && currentMonth === tMonth && currentYear === tYear) {
      cls += ' today';
    }

    const dayDiv = document.createElement('div');
    dayDiv.className = cls;
    dayDiv.innerHTML = `
      <span class="date">${d}</span>
      <span class="hijri">${toArab(h.day)}</span>
      <span class="pasaran">${getPasaran(date)}</span>
    `;
    
    // Tambah event listener untuk alert
    dayDiv.addEventListener('click', () => showDateInfo(date));
    
    daysEl.appendChild(dayDiv);
  }

  const totalUsed = firstDay + daysInMonth;
  const totalCell = Math.ceil(totalUsed / 7) * 7;
  const sisa = totalCell - daysEl.children.length;

  for (let d = 1; d <= sisa; d++) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day empty next';
    dayDiv.innerHTML = `<span class="date">${d}</span>`;
    daysEl.appendChild(dayDiv);
  }
}

// ========== INISIALISASI SETTING ==========
function initCalendarSettings() {
    const settingItems = document.querySelectorAll('.settings-item');
    
    settingItems.forEach((item) => {
        const settingText = item.querySelector('.settings-text strong');
        const statusSpan = item.querySelector('.settings-value span');
        
        if (!settingText || !statusSpan) return;
        
        // Tambahkan class untuk styling
        statusSpan.className = 'settings-status';
        
        // Set initial status color based on settings
        if (settingText.textContent.includes('Hari Agung Islam')) {
            statusSpan.textContent = calendarSettings.islamicHoliday ? 'Aktif' : 'Nonaktif';
            statusSpan.classList.add(calendarSettings.islamicHoliday ? 'active' : 'inactive');
        } else if (settingText.textContent.includes('Hari Libur Nasional')) {
            statusSpan.textContent = calendarSettings.nationalHoliday ? 'Aktif' : 'Nonaktif';
            statusSpan.classList.add(calendarSettings.nationalHoliday ? 'active' : 'inactive');
        }
        
        item.addEventListener('click', () => {
            if (settingText.textContent.includes('Hari Agung Islam')) {
                calendarSettings.islamicHoliday = !calendarSettings.islamicHoliday;
                statusSpan.textContent = calendarSettings.islamicHoliday ? 'Aktif' : 'Nonaktif';
                
                // Update class
                statusSpan.classList.remove('active', 'inactive');
                statusSpan.classList.add(calendarSettings.islamicHoliday ? 'active' : 'inactive');
                
            } else if (settingText.textContent.includes('Hari Libur Nasional')) {
                calendarSettings.nationalHoliday = !calendarSettings.nationalHoliday;
                statusSpan.textContent = calendarSettings.nationalHoliday ? 'Aktif' : 'Nonaktif';
                
                // Update class
                statusSpan.classList.remove('active', 'inactive');
                statusSpan.classList.add(calendarSettings.nationalHoliday ? 'active' : 'inactive');
            }
            
            renderCalendar();
        });
    });
}

// ========== CSS MINIMAL ==========
document.addEventListener('DOMContentLoaded', () => {
    initCalendarSettings();
});

// ========== INISIALISASI ==========
document.addEventListener('DOMContentLoaded', () => {
    addHolidayStyles();
    initCalendarSettings();
});

const resetBtn = document.getElementById('resetSettings');

resetBtn?.addEventListener('click',()=>{
  if(!confirm('Reset semua pengaturan ke default?')) return;

  localStorage.clear();
  location.reload();
});

const openTheme = document.getElementById("openTheme");
const themeDesc = document.getElementById("themeDesc");
const themeValue = document.getElementById("themeValue");

// ambil dari storage
let theme = localStorage.getItem("theme") || "dark";

// terapkan saat load
applyTheme(theme);

// toggle saat diklik
openTheme.addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";
  applyTheme(theme);
});

// fungsi utama
function applyTheme(mode) {
  if (mode === "light") {
    document.body.classList.add("light");
    themeDesc.textContent = "Terang";
    themeValue.className = "bi bi-sun";
  } else {
    document.body.classList.remove("light");
    themeDesc.textContent = "Gelap";
    themeValue.className = "bi bi-moon";
  }
  localStorage.setItem("theme", mode);
}

/* ===============================
   RESET (opsional)
================================ */
function resetTheme() {
  applyTheme("dark");
}

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
