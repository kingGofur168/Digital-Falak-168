function hisabJM(data) {

    let JD = 2460000.5;
    let T  = 0.123456;

    return {

        metode: "Jean Meeus",

        html: `
            <div class="hisab-list">

                <div class="row">
                    <span>Tahun</span>
                    <span>${data.tahun}</span>
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
                    <span>Julian Day</span>
                    <span>${JD}</span>
                </div>

                <div class="row">
                    <span>Abad Julian</span>
                    <span>${T}</span>
                </div>

            </div>
        `
    };

}