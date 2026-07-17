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
