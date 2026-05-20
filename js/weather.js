const weatherData = {
  tokyo: {
    name: "Tokyo", icon: ["❄️","❄️","🌸","🌸","☀️","🌧️","🌩️","🌩️","🌤️","🍂","🌤️","❄️"],
    temp: [6,7,11,16,21,24,28,30,26,21,14,8],
    rain: [40,45,55,60,50,70,60,65,65,55,45,40],
    crowd: ["Rendah","Rendah","Tinggi","Sangat Tinggi","Sederhana","Rendah","Rendah","Sederhana","Sederhana","Tinggi","Sederhana","Sederhana"],
    flight: ["Murah","Murah","Mahal","Sangat Mahal","Sederhana","Murah","Sederhana","Mahal","Sederhana","Mahal","Murah","Murah"],
    clothing: [["Jaket tebal","Syal","Sepatu bot","Thermal inner"],["Jaket tebal","Syal","Sarung tangan"],["Jaket ringan","Payung lipat","Sepatu sukan"],["T-shirt selesa","Jaket nipis","Payung"],["T-shirt kapas","Seluar ringan","Krim pelindung matahari"],["Baju tipis","Payung","Sandal"],["Baju sangat tipis","Minum air putih"],["Baju tipis","Kipas elektrik mudah alih"],["Jaket ringan","Payung lipat"],["Cardigan hangat","Jaket ringan","Scarf"],["Jaket sederhana","Scarf"],["Mantel tebal","Thermal inner","Bot sejuk"]]
  },
  osaka: {
    name: "Osaka", icon: ["❄️","❄️","🌸","🌸","☀️","🌧️","🌩️","🌩️","🌤️","🍂","🌤️","❄️"],
    temp: [7,8,12,18,23,27,31,33,28,22,15,9],
    rain: [40,50,55,65,50,70,65,65,60,55,45,40],
    crowd: ["Rendah","Rendah","Tinggi","Sangat Tinggi","Sederhana","Rendah","Sederhana","Sederhana","Sederhana","Tinggi","Rendah","Rendah"],
    flight: ["Murah","Murah","Mahal","Mahal","Sederhana","Murah","Sederhana","Sederhana","Sederhana","Mahal","Murah","Murah"],
    clothing: [["Mantel tebal","Thermal"],["Jaket tebal","Syal"],["Jaket ringan","Payung"],["T-shirt","Jaket tipis"],["T-shirt","Sunscreen"],["Baju tipis","Payung"],["Baju tipis","Minum banyak"],["Sangat tipis","Kipas"],["Jaket ringan"],["Cardigan","Scarf"],["Jaket sedang"],["Mantel tebal","Bot"]]
  },
  kyoto: {
    name: "Kyoto", icon: ["❄️","❄️","🌸","🌸","☀️","🌧️","☀️","☀️","🌤️","🍂","🌤️","❄️"],
    temp: [5,6,10,16,21,25,29,31,26,20,13,7],
    rain: [50,55,60,70,60,70,50,45,60,65,60,50],
    crowd: ["Sederhana","Rendah","Sangat Tinggi","Sangat Tinggi","Sederhana","Rendah","Rendah","Rendah","Tinggi","Sangat Tinggi","Sangat Tinggi","Sederhana"],
    flight: ["Murah","Murah","Sangat Mahal","Sangat Mahal","Sederhana","Murah","Murah","Murah","Sederhana","Sangat Mahal","Mahal","Murah"],
    clothing: [["Mantel tebal","Bot"],["Jaket tebal"],["Jaket ringan","Payung"],["T-shirt","Jaket"],["T-shirt ringan"],["Baju tipis","Payung"],["Yukata santai","Sangat tipis"],["Sangat tipis","Banyak minum"],["Jaket ringan"],["Cardigan","Sepatu selesa"],["Jaket sedang","Scarf"],["Mantel tebal","Bot"]]
  },
  hokkaido: {
    name: "Hokkaido / Sapporo", icon: ["⛄","⛄","🌨️","🌸","🌸","☀️","☀️","☀️","🍂","🍂","🌨️","⛄"],
    temp: [-6,-5,0,8,15,20,24,25,19,11,3,-3],
    rain: [50,50,55,50,55,60,60,65,65,60,60,55],
    crowd: ["Sangat Tinggi","Tinggi","Rendah","Sederhana","Sederhana","Rendah","Sederhana","Tinggi","Sangat Tinggi","Sangat Tinggi","Sederhana","Tinggi"],
    flight: ["Mahal","Murah","Murah","Murah","Murah","Murah","Sederhana","Mahal","Sangat Mahal","Mahal","Murah","Sederhana"],
    clothing: [["Mantel bulu tebal","Long john","Balaclava"],["Mantel tebal","Kasut salji"],["Mantel tebal","Kasut anti-licin"],["Jaket sederhana"],["Jaket ringan"],["T-shirt","Jaket tipis"],["T-shirt","Sunscreen"],["T-shirt","Baju ringan"],["Jaket sederhana","Scarf"],["Jaket tebal","Scarf"],["Mantel tebal","Bot"],["Mantel tebal","Thermal"]]
  },
  hakone: { name: "Hakone", icon: ["❄️","❄️","🌸","🌸","☀️","🌧️","🌩️","🌩️","🌤️","🍂","🌤️","❄️"], temp:[2,3,7,13,18,21,25,27,23,17,10,4], rain:[55,60,65,70,60,75,60,55,65,65,60,50], crowd:["Rendah","Rendah","Tinggi","Tinggi","Sederhana","Rendah","Sederhana","Sederhana","Sederhana","Tinggi","Sederhana","Rendah"], flight:["Murah","Murah","Mahal","Mahal","Sederhana","Murah","Murah","Murah","Sederhana","Mahal","Murah","Murah"], clothing:[["Mantel tebal","Bot"],["Jaket tebal","Syal"],["Jaket medium","Payung"],["T-shirt","Jaket"],["T-shirt"],["Baju tipis","Payung"],["Sangat tipis"],["Sangat tipis"],["Jaket ringan"],["Jaket medium","Scarf"],["Jaket sedang"],["Mantel tebal","Bot"]] },
  nara: { name: "Nara", icon: ["❄️","❄️","🌸","🌸","☀️","🌧️","☀️","☀️","🌤️","🍂","🌤️","❄️"], temp:[3,4,8,14,20,24,28,30,25,18,11,5], rain:[45,50,60,70,60,70,50,45,60,65,55,45], crowd:["Rendah","Rendah","Tinggi","Sangat Tinggi","Sederhana","Rendah","Rendah","Rendah","Tinggi","Tinggi","Sederhana","Rendah"], flight:["Murah","Murah","Mahal","Mahal","Sederhana","Murah","Murah","Murah","Sederhana","Mahal","Murah","Murah"], clothing:[["Mantel tebal","Bot"],["Jaket tebal"],["Jaket ringan","Payung"],["T-shirt","Jaket"],["T-shirt"],["Baju tipis","Payung"],["Sangat tipis"],["Sangat tipis"],["Jaket ringan"],["Cardigan"],["Jaket sedang"],["Mantel tebal"]] },
  hiroshima: { name: "Hiroshima", icon: ["❄️","❄️","🌸","🌸","☀️","🌧️","☀️","☀️","🌤️","🍂","🌤️","❄️"], temp:[5,6,10,15,20,24,28,30,25,19,13,7], rain:[45,55,70,80,65,75,55,50,65,65,60,45], crowd:["Rendah","Rendah","Tinggi","Tinggi","Sederhana","Rendah","Sederhana","Tinggi","Sederhana","Sederhana","Sederhana","Rendah"], flight:["Murah","Murah","Sederhana","Mahal","Sederhana","Murah","Murah","Murah","Sederhana","Sederhana","Murah","Murah"], clothing:[["Mantel tebal","Jaket"],["Jaket tebal"],["Jaket ringan","Payung"],["T-shirt","Jaket"],["T-shirt"],["Baju tipis","Payung"],["Sangat tipis"],["Sangat tipis"],["Jaket ringan"],["Cardigan"],["Jaket sedang"],["Mantel tebal"]] },
  okinawa: { name: "Okinawa", icon: ["🌤️","🌤️","🌸","☀️","🌧️","🌧️","☀️","☀️","🌧️","🌤️","🌤️","🌤️"], temp:[17,17,19,23,26,29,31,31,29,26,23,19], rain:[65,60,60,70,80,75,50,45,75,70,60,65], crowd:["Rendah","Rendah","Sederhana","Sederhana","Tinggi","Sederhana","Sangat Tinggi","Sangat Tinggi","Sederhana","Sederhana","Sederhana","Sederhana"], flight:["Murah","Murah","Sederhana","Sederhana","Mahal","Sederhana","Sangat Mahal","Sangat Mahal","Sederhana","Sederhana","Murah","Murah"], clothing:[["T-shirt","Jaket nipis"],["T-shirt","Jaket"],["T-shirt","Jaket"],["T-shirt","Sunscreen"],["T-shirt","Payung","Sunscreen"],["Baju mandi","Sunscreen SPF50"],["Baju mandi","Sunscreen SPF100"],["Baju mandi","Minum banyak air"],["T-shirt","Jaket nipis"],["T-shirt","Cardigan"],["T-shirt","Jaket ringan"],["T-shirt","Cardigan"]] }
};

window.updateWeather = function() {
  const dest = document.getElementById('wDest').value;
  const month = document.getElementById('wMonth').value;
  const result = document.getElementById('weatherResult');
  if (!dest || month === '') { result.classList.remove('visible'); return; }
  const m = parseInt(month);
  const d = weatherData[dest];
  if (!d) return;
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const season = m <= 1 || m === 11 ? 'Musim Dingin ❄️' : m <= 4 ? 'Musim Semi 🌸' : m <= 7 ? 'Musim Panas ☀️' : 'Musim Gugur 🍂';
  result.innerHTML = `
    <div class="weather-hero">
      <div class="weather-icon">${d.icon[m]}</div>
      <div>
        <div class="weather-dest-name">${d.name}</div>
        <div style="font-size: 0.85rem; color: var(--ink-soft); margin: 0.25rem 0;">${months[m]} • ${season}</div>
        <div class="weather-temp">${d.temp[m]}<span>°C purata</span></div>
      </div>
    </div>
    <div class="weather-cards">
      <div class="weather-card"><div class="weather-card-icon">🌡️</div><div class="weather-card-label">Suhu Rata-Rata</div><div class="weather-card-value">${d.temp[m]}°C</div><div class="weather-card-sub">Kisaran ±3–5°C</div></div>
      <div class="weather-card"><div class="weather-card-icon">🌧️</div><div class="weather-card-label">Kebarangkalian Hujan</div><div class="weather-card-value">${d.rain[m]}%</div><div class="weather-card-sub">${d.rain[m] > 65 ? 'Sangat disarankan sedia payung!' : d.rain[m] > 50 ? 'Siapkan payung kecil' : 'Relatif kering'}</div></div>
      <div class="weather-card"><div class="weather-card-icon">👥</div><div class="weather-card-label">Kepadatan Pelancong</div><div class="weather-card-value" style="font-size: 1.1rem;">${d.crowd[m]}</div><div class="weather-card-sub">${d.crowd[m].includes('Sangat') ? 'Pesan penginapan awal' : d.crowd[m] === 'Tinggi' ? 'Pesan tiket tempatan awal' : 'Santai & selesa'}</div></div>
      <div class="weather-card"><div class="weather-card-icon">✈️</div><div class="weather-card-label">Tren Tiket Penerbangan</div><div class="weather-card-value" style="font-size: 1.1rem;">${d.flight[m]}</div><div class="weather-card-sub">${d.flight[m].includes('Mahal') ? 'Cari tawaran potongan harga' : 'Harga mesra dompet'}</div></div>
    </div>
    <div class="clothing-section">
      <h4>👔 Pengesyoran Pakaian Sesuai</h4>
      <div class="clothing-items">${d.clothing[m].map(c => `<span class="clothing-item">${c}</span>`).join('')}</div>
    </div>
  `;
  result.classList.add('visible');
}
