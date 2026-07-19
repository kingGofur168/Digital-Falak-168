// INITIALIZATION
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
    if (altitudeValue) altitudeValue.innerText = settings.altitude + ' M';
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
  { id: 'subuh', label: 'Subuh' },
  { id: 'terbit', label: 'Terbit' },
  { id: 'dhuha', label: 'Dhuha' },
  { id: 'dzuhur', label: 'Dzuhur' },
  { id: 'ashar', label: 'Ashar' },
  { id: 'maghrib', label: 'Maghrib' },
  { id: 'isya', label: 'Isya' },
  { id: 'imsak', label: 'Imsak' } // setelah Isya, sebelum Subuh
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
    label: 'Imsak',
    time: jadwal.imsak,
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

// GABUNGKAN SEMUA HOLIDAY
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
