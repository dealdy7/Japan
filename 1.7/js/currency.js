// ===== CURRENCY CONVERTER PAGE =====
function performConversion(source) {
  const jpyField = document.getElementById('jpy-input');
  const idrField = document.getElementById('idr-input');
  
  if (source === 'jpy') {
    const jpyVal = parseFloat(jpyField.value) || 0;
    idrField.value = Math.round(jpyVal * KURS_RATE);
  } else {
    const idrVal = parseFloat(idrField.value) || 0;
    jpyField.value = Math.round(idrVal / KURS_RATE);
  }
}

function toggleFloatingCalc() {
  const panel = document.getElementById('floatingCalcPanel');
  if (panel) panel.classList.toggle('visible');
}

function calculateFloatRates(source) {
  const floatJpy = document.getElementById('float-jpy-input');
  const floatIdr = document.getElementById('float-idr-input');
  
  if (source === 'jpy') {
    const jpyValue = parseFloat(floatJpy.value) || 0;
    floatIdr.value = Math.round(jpyValue * KURS_RATE);
  } else {
    const idrValue = parseFloat(floatIdr.value) || 0;
    floatJpy.value = Math.round(idrValue / KURS_RATE);
  }
}
