// PRESETS DATA FOR BUDGET PLANNER
const flightPresets = [5000000, 8000000, 12000000]; // IDR values
const hotelPresets = [3000, 7000, 15000]; // JPY values
const transitPresets = [800, 1500, 3500]; // JPY values

// Objek global yang memegang status state budget planner terpadu
const budgetState = {
  days: 7,
  konbiniDays: 2,
  flightCostIDR: 8000000,
  hotelCostJPY: 7000,
  transitCostJPY: 1500,
  customEntranceJPY: 0
};

// Fungsi sinkronisasi dua arah untuk slider Makan & Hari Trip
function syncAndCalculateAll(paramType, value) {
  const val = parseInt(value);
  if (paramType === 'days') {
    budgetState.days = val;
    // Maksimum hari makan konbini tidak boleh melebihi total hari perjalanan
    if (budgetState.konbiniDays > val) {
      budgetState.konbiniDays = val;
    }
  } else if (paramType === 'konbini') {
    budgetState.konbiniDays = val;
  }

  // 1. Perbarui nilai-nilai elemen visual pada Simulator Makan biasa
  const slDays = document.getElementById('sl-days');
  if (slDays) slDays.value = budgetState.days;
  const valDays = document.getElementById('val-days');
  if (valDays) valDays.textContent = budgetState.days;
  
  const slKonbini = document.getElementById('sl-konbini');
  if (slKonbini) {
    slKonbini.max = budgetState.days;
    slKonbini.value = budgetState.konbiniDays;
  }
  const valKonbini = document.getElementById('val-konbini');
  if (valKonbini) valKonbini.textContent = budgetState.konbiniDays;

  // 2. Perbarui nilai-nilai elemen visual pada Tab Rancangan Budget Utama
  const pdSlider = document.getElementById('plan-days-slider');
  if (pdSlider) pdSlider.value = budgetState.days;
  const pdBadge = document.getElementById('plan-days-badge');
  if (pdBadge) pdBadge.textContent = budgetState.days + " Hari";
  const pnCalc = document.getElementById('plan-nights-calc');
  if (pnCalc) pnCalc.textContent = (budgetState.days - 1) + " Malam Menginap";
  
  const pkSlider = document.getElementById('plan-konbini-slider');
  if (pkSlider) {
    pkSlider.max = budgetState.days;
    pkSlider.value = budgetState.konbiniDays;
  }
  const pkBadge = document.getElementById('plan-konbini-badge');
  if (pkBadge) pkBadge.textContent = budgetState.konbiniDays + " Hari Konbini";
  const prCalc = document.getElementById('plan-resto-calc');
  if (prCalc) prCalc.textContent = (budgetState.days - budgetState.konbiniDays) + " Hari Restoran";

  // 3. Jalankan kalkulasi masing-masing tab secara paralel
  updateSimulator();
  calculateEntireBudget();
}

function updateSimulator() {
  const days = budgetState.days;
  const konbiniDays = budgetState.konbiniDays;
  const restaurantDays = days - konbiniDays;

  const konbiniCostPerDay = 1800; // JPY
  const restaurantCostPerDay = 4000; // JPY
  const fullMidCostPerDay = 5000; // JPY

  const mixedTotal = Math.round((konbiniDays * konbiniCostPerDay) + (restaurantDays * restaurantCostPerDay));
  const fullTotal = Math.round(days * fullMidCostPerDay);
  const allKonbiniTotal = Math.round(days * konbiniCostPerDay);
  
  const saving = fullTotal - mixedTotal;
  const savingPct = Math.round((saving / fullTotal) * 100);

  const resCards = document.getElementById('simResultCards');
  if (resCards) {
    resCards.innerHTML = `
      <div class="result-card">
        <div class="result-card-label">Jumlah Anggaran Skenario Pilihanmu</div>
        <div class="result-card-value">¥${mixedTotal.toLocaleString()}</div>
        <div class="result-card-subvalue">${formatRupiah(mixedTotal * KURS_RATE)}</div>
        <div class="result-card-sub">Untuk ${days} hari perjalanan</div>
      </div>
      <div class="result-card highlight">
        <div class="result-card-label">💚 Anggaran Penjimatan Maksimal</div>
        <div class="result-card-value">¥${saving.toLocaleString()}</div>
        <div class="result-card-subvalue">${formatRupiah(saving * KURS_RATE)}</div>
        <div class="result-card-sub">Lebih jimat ${savingPct}% berbanding makan mewah di restoran</div>
      </div>
    `;
  }

  const mixedPct = Math.round((mixedTotal / fullTotal) * 100);
  const konbiniPct = Math.round((allKonbiniTotal / fullTotal) * 100);
  
  if (document.getElementById('bar-mixed')) {
    document.getElementById('bar-mixed').style.width = mixedPct + '%';
    document.getElementById('bar-mixed').textContent = `¥${mixedTotal.toLocaleString()} (${formatRupiah(mixedTotal * KURS_RATE)})`;
  }
  
  if (document.getElementById('bar-konbini')) {
    document.getElementById('bar-konbini').style.width = konbiniPct + '%';
    document.getElementById('bar-konbini').textContent = `¥${allKonbiniTotal.toLocaleString()} (${formatRupiah(allKonbiniTotal * KURS_RATE)})`;
  }
  
  if (document.getElementById('bar-full')) {
    document.getElementById('bar-full').textContent = `¥${fullTotal.toLocaleString()} (${formatRupiah(fullTotal * KURS_RATE)})`;
  }

  let strategy = "";
  if (konbiniDays === 0) {
    strategy = `💡 Cuba pelbagaikan hidangan dengan merancang 2–3 hari makan malam konbini ringkas! Anda boleh menjimatkan anggaran bernilai sehingga ¥${Math.round((days * 0.3) * (restaurantCostPerDay - konbiniCostPerDay)).toLocaleString()} lagi.`;
  } else if (konbiniDays >= days) {
    strategy = `🏪 Anda merancang makan konbini sepenuhnya! Sangat menjimatkan wang tetapi variasi rasa agak terhad. Disarankan menyelang seli dengan 1-2 hidangan restoran budget tempatan untuk memori kulinari autentik.`;
  } else {
    strategy = `✅ Formula pembahagian snek konbini anda sangat cemerlang! Melalui gabungan ${konbiniDays} hari snek konbini + ${restaurantDays} hari restoran budget harian, anda berjaya mengurangkan perbelanjaan bernilai ${formatRupiah(saving * KURS_RATE)}. Lebihan wang saku ini sangat sesuai ditukarkan menjadi bajet cenderahati!`;
  }

  if (document.getElementById('simTipBox')) {
    document.getElementById('simTipBox').innerHTML = `<h4>💡 Strategi Pembahagian Anggaran Terbaik</h4><p>${strategy}</p>`;
  }
}

function setFlightPreset(index) {
  document.querySelectorAll('[id^="flight-preset-"]').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`flight-preset-${index}`).classList.add('active');
  
  budgetState.flightCostIDR = flightPresets[index];
  document.getElementById('plan-flight-custom').value = budgetState.flightCostIDR;
  calculateEntireBudget();
}

function setHotelPreset(index) {
  document.querySelectorAll('[id^="hotel-preset-"]').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`hotel-preset-${index}`).classList.add('active');
  
  budgetState.hotelCostJPY = hotelPresets[index];
  document.getElementById('plan-hotel-custom').value = budgetState.hotelCostJPY;
  calculateEntireBudget();
}

function setTransitPreset(index) {
  document.querySelectorAll('[id^="transit-preset-"]').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`transit-preset-${index}`).classList.add('active');
  
  budgetState.transitCostJPY = transitPresets[index];
  document.getElementById('plan-transit-custom').value = budgetState.transitCostJPY;
  calculateEntireBudget();
}

function onCustomBudgetChange(type) {
  if (type === 'flight') {
    budgetState.flightCostIDR = parseFloat(document.getElementById('plan-flight-custom').value) || 0;
    document.querySelectorAll('[id^="flight-preset-"]').forEach(btn => btn.classList.remove('active'));
  } else if (type === 'hotel') {
    budgetState.hotelCostJPY = parseFloat(document.getElementById('plan-hotel-custom').value) || 0;
    document.querySelectorAll('[id^="hotel-preset-"]').forEach(btn => btn.classList.remove('active'));
  } else if (type === 'transit') {
    budgetState.transitCostJPY = parseFloat(document.getElementById('plan-transit-custom').value) || 0;
    document.querySelectorAll('[id^="transit-preset-"]').forEach(btn => btn.classList.remove('active'));
  }
  calculateEntireBudget();
}

function calculateEntireBudget() {
  const days = budgetState.days;
  const nights = days - 1; // Menginap dihitung per malam

  const konbiniCostPerDay = 1800; // JPY
  const restaurantCostPerDay = 4000; // JPY
  const totalFoodJPY = (budgetState.konbiniDays * konbiniCostPerDay) + ((days - budgetState.konbiniDays) * restaurantCostPerDay);
  const totalFoodIDR = totalFoodJPY * KURS_RATE;

  const totalFlightIDR = budgetState.flightCostIDR;
  const totalFlightJPY = totalFlightIDR / KURS_RATE;

  const totalHotelJPY = budgetState.hotelCostJPY * nights;
  const totalHotelIDR = totalHotelJPY * KURS_RATE;

  const totalTransitJPY = budgetState.transitCostJPY * days;
  const totalTransitIDR = totalTransitJPY * KURS_RATE;

  let totalEntranceJPY = 0;
  if (document.getElementById('ent-daibutsu')?.checked) totalEntranceJPY += 300;
  if (document.getElementById('ent-bamboo')?.checked) totalEntranceJPY += 300;
  if (document.getElementById('ent-wada')?.checked) totalEntranceJPY += 400;
  if (document.getElementById('ent-usj')?.checked) totalEntranceJPY += 8600;
  if (document.getElementById('ent-disney')?.checked) totalEntranceJPY += 8400;

  const ceInput = document.getElementById('plan-entrance-custom');
  const customEntranceVal = ceInput ? parseFloat(ceInput.value) || 0 : 0;
  totalEntranceJPY += customEntranceVal;
  const totalEntranceIDR = totalEntranceJPY * KURS_RATE;

  const grandTotalJPY = totalFoodJPY + totalFlightJPY + totalHotelJPY + totalTransitJPY + totalEntranceJPY;
  const grandTotalIDR = totalFoodIDR + totalFlightIDR + totalHotelIDR + totalTransitIDR + totalEntranceIDR;

  // Update Badges
  if(document.getElementById('plan-flight-badge')) document.getElementById('plan-flight-badge').textContent = formatRupiah(totalFlightIDR);
  if(document.getElementById('plan-hotel-badge')) document.getElementById('plan-hotel-badge').textContent = "¥" + budgetState.hotelCostJPY.toLocaleString() + " / Malam";
  if(document.getElementById('plan-transit-badge')) document.getElementById('plan-transit-badge').textContent = "¥" + budgetState.transitCostJPY.toLocaleString() + " / Hari";
  if(document.getElementById('plan-entrance-badge')) document.getElementById('plan-entrance-badge').textContent = "¥" + totalEntranceJPY.toLocaleString();

  // Update Summary List
  if(document.getElementById('sum-grand-jpy')) document.getElementById('sum-grand-jpy').textContent = "¥" + Math.round(grandTotalJPY).toLocaleString();
  if(document.getElementById('sum-grand-idr')) document.getElementById('sum-grand-idr').textContent = formatRupiah(grandTotalIDR);
  if(document.getElementById('sum-flight-val')) document.getElementById('sum-flight-val').textContent = `¥${Math.round(totalFlightJPY).toLocaleString()} (${formatRupiah(totalFlightIDR)})`;
  if(document.getElementById('sum-hotel-val')) document.getElementById('sum-hotel-val').textContent = `¥${totalHotelJPY.toLocaleString()} (${formatRupiah(totalHotelIDR)})`;
  if(document.getElementById('sum-food-val')) document.getElementById('sum-food-val').textContent = `¥${totalFoodJPY.toLocaleString()} (${formatRupiah(totalFoodIDR)})`;
  if(document.getElementById('sum-transit-val')) document.getElementById('sum-transit-val').textContent = `¥${totalTransitJPY.toLocaleString()} (${formatRupiah(totalTransitIDR)})`;
  if(document.getElementById('sum-entrance-val')) document.getElementById('sum-entrance-val').textContent = `¥${totalEntranceJPY.toLocaleString()} (${formatRupiah(totalEntranceIDR)})`;
  if(document.getElementById('sum-total-val')) document.getElementById('sum-total-val').textContent = formatRupiah(grandTotalIDR);

  // Update Visual Segmented Bar
  const flightPct = (totalFlightJPY / grandTotalJPY) * 100 || 0;
  const hotelPct = (totalHotelJPY / grandTotalJPY) * 100 || 0;
  const foodPct = (totalFoodJPY / grandTotalJPY) * 100 || 0;
  const transitPct = (totalTransitJPY / grandTotalJPY) * 100 || 0;
  const entrancePct = (totalEntranceJPY / grandTotalJPY) * 100 || 0;

  if(document.getElementById('seg-flight')) document.getElementById('seg-flight').style.width = flightPct + "%";
  if(document.getElementById('seg-hotel')) document.getElementById('seg-hotel').style.width = hotelPct + "%";
  if(document.getElementById('seg-food')) document.getElementById('seg-food').style.width = foodPct + "%";
  if(document.getElementById('seg-transit')) document.getElementById('seg-transit').style.width = transitPct + "%";
  if(document.getElementById('seg-entrance')) document.getElementById('seg-entrance').style.width = entrancePct + "%";
}
