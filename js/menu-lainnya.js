const btnMenuLainnya   = document.getElementById('btnMenuLainnya');
const overlayLainnya   = document.getElementById('lainnyaOverlay');
const panelLainnya     = document.getElementById('panelLainnya');
const btnCloseLainnya  = document.getElementById('closeLainnya');

if (btnMenuLainnya) {
  btnMenuLainnya.onclick = () => {
    overlayLainnya.classList.remove('hidden');
    panelLainnya.classList.remove('hidden');
  };
}

function closeLainnyaPanel(){
  overlayLainnya.classList.add('hidden');
  panelLainnya.classList.add('hidden');
}

overlayLainnya.onclick  = closeLainnyaPanel;
closeLainnya.onclick = closeLainnyaPanel;

const btnMenuDownload = document.getElementById("btnMenuDownload");
const panelMenuDownload = document.getElementById("panelMenuDownload");
const btnBackToDownload = document.getElementById("btnBackToDownload");
const listDownload = document.getElementById("listDownload");

if (btnMenuDownload) {
  btnMenuDownload.onclick = () => {
    panelLainnya.classList.add("hidden");
    panelMenuDownload.classList.remove("hidden");
listDownload.innerHTML = `
<div class="download-file >
  <div class="">
    <h4>Aplikasi</h4>
    <ul>
      <li>
        <a href="" target="_blank">Digital Falak 168</a> — Falak 168 memudahkan perhitungan waktu sholat dan ijtima dengan metode hisab pendekatan yang sederhana dan efisien. * Karya Santri
      </li>
      <li>
        <a href="" target="_blank">F169</a> — Mempelajari hisab.
      </li>
      <li>
        <a href="" target="_blank">Digital Falak 168</a> — Mempelajari hisab.
      </li>
    </ul>
  </div>
  <div class="download-file">
    <h4>PDF</h4>
    <ul>
      <li>
        <a href="" target="_blank">Digital Falak 168</a> — Mempelajari hisab.
      </li>
      <li>
        <a href="" target="_blank">Digital Falak 168</a> — Mempelajari hisab.
      </li>
      <li>
        <a href="" target="_blank">Digital Falak 168</a> — Mempelajari hisab.
      </li>
    </ul>
  </div>
  <div class="download-file">
    <h4>Excel</h4>
    <ul>
      <li>
        <a href="" target="_blank">Digital Falak 168</a> — Mempelajari hisab.
      </li>
      <li>
        <a href="" target="_blank">Digital Falak 168</a> — Mempelajari hisab.
      </li>
      <li>
        <a href="" target="_blank">Digital Falak 168</a> — Mempelajari hisab.
      </li>
    </ul>
  </div>
</div>

`;
    
  };
}

if (btnBackToDownload) {
  btnBackToDownload.onclick = () => {
    panelLainnya.classList.remove("hidden");
    panelMenuDownload.classList.add("hidden");
  };
}

/* ===============================
   MENU LAINNYA - LOKASI
================================ */
const btnMenuLokasi = document.getElementById("btnMenuLokasi");
const panelMenuLokasi = document.getElementById("panelMenuLokasi");
const btnBackToLokasi = document.getElementById("btnBackToLokasi");
const listLokasi = document.getElementById("listLokasi");

if (btnMenuLokasi) {
  btnMenuLokasi.onclick = () => {
    panelLainnya.classList.add("hidden");
    panelMenuLokasi.classList.remove("hidden");
listLokasi.innerHTML = `
<div class="feature-unavailable">
    <!-- Partikel -->
    <div class="particles" id="particles"></div>
    <!-- Container -->
    <div class="feature-container">
    <!-- Code Snippet -->
        <div class="code-snippet" id="codeSnippet">
<span class="comment">// Status fitur</span>
<span class="keyword">const</span> <span class="property">featureStatus</span> = {
<span class="property">  available</span>: <span class="keyword">false</span>,
<span class="property">  estimatedRelease</span>: <span class="string">"Segera"</span>,
<span class="property">  message</span>: <span class="string">"Dalam pengerjaan"</span>
};
<span class="function">checkFeature</span>() → <span class="string">"403 - Belum Tersedia"</span>
            <span class="copy-indicator" id="copyIndicator">Tersalin!</span>
        </div>

        <!-- Footer -->
        <p class="footer-note">
            Kode status: <span>403 • Fitur Belum Tersedia. </p>
    </div>
</div>
`;

  };
}

if (btnBackToLokasi) {
  btnBackToLokasi.onclick = () => {
    panelLainnya.classList.remove("hidden");
    panelMenuLokasi.classList.add("hidden");
  };
}