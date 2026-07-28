function hisabFR(data) {
  let lon = data.latitude;
  let tahunMabsutoh = data.tahun % 10, tahunMajmuah = data.tahun - tahunMabsutoh;
  

    return {
        metode: "Fathu ar-Rouf",
        html: `
            <div class="hisab-list">

                <div class="row">
                    <span>longitude</span>
                    <span>${lon}</span>
                </div>

                <div class="row">
                    <span>Bulan</span>
                    <span>${data.bulan}</span>
                </div>

                <div class="row">
                    <span>Kriteria</span>
                    <span>${data.irtifa}</span>
                </div>

                <div class="row">
                    <span>Contoh</span>
                    <span>Perhitungan Fathu ar-Rouf</span>
                </div>

            </div>
        `
    };

}