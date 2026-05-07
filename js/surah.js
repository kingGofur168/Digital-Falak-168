const params =
new URLSearchParams(location.search);

const no =
params.get("no");

fetch(`https://api.quran.gading.dev/surah/${no}`)

.then(res => res.json())

.then(result => {

  const data = result.data;

  document
  .getElementById("nama-surah")
  .innerText =
  data.name.transliteration.id;

  let html =
  `<div class="mushaf">`;

  data.verses.forEach(ayat => {

    html += `

      <span class="ayat">

        ${ayat.text.arab}

        <span class="nomor">
          ${ayat.number.inSurah}
        </span>

      </span>

    `;

  });

  html += `</div>`;

  document
  .getElementById("content")
  .innerHTML = html;

})

.catch(err => {

  document
  .getElementById("content")
  .innerHTML =
  "Gagal mengambil ayat";

  console.log(err);

});

/* =========================
   NEXT PREV
========================= */

document
.getElementById("prev")

.onclick = () => {

  if(no > 1){

    location.href =
    `surah.html?no=${Number(no)-1}`;

  }

};

document
.getElementById("next")

.onclick = () => {

  if(no < 114){

    location.href =
    `surah.html?no=${Number(no)+1}`;

  }

};