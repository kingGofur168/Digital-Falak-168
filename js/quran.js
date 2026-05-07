fetch("https://api.quran.gading.dev/surah")

.then(res => res.json())

.then(result => {

  let html = "";

  result.data.forEach(surah => {

    html += `
      <a href="surah.html?no=${surah.number}">

        <div class="card">

          <h2>
            ${surah.number}.
            ${surah.name.transliteration.id}
          </h2>

          <p>
            ${surah.numberOfVerses} Ayat
          </p>

        </div>

      </a>
    `;

  });

  document
  .getElementById("list-surah")
  .innerHTML = html;

})

.catch(err => {

  document
  .getElementById("list-surah")
  .innerHTML =
  "Gagal mengambil data";

  console.log(err);

});