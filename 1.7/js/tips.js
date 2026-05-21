const accordionData = [
  {
    icon: "🛂",
    title: "Syarat Dokumen, Membuat Pasport & Permohonan Visa Jepang",
    content: `<div class="prep-grid">
      <div class="prep-card">
        <h4>1. Pasport Masa Berlaku Kuat</h4>
        <ul class="tip-list" style="margin-top:0.5rem; gap:0.4rem;">
          <li>Masa berlaku pasport wajib baki sekurang-kurangnya <strong>6 bulan</strong> sebelum penerbangan pulang anda.</li>
          <li><strong>Lokasi Buat:</strong> Kantor Imigrasi terdekat di kota anda (gunakan aplikasi pendaftaran temu janji 'M-Paspor' untuk kemudahan slot antrean).</li>
          <li><strong>Kos:</strong> Pasport Biasa (Rp 350.000), Pasport Elektronik/E-Paspor (Rp 650.000).</li>
        </ul>
      </div>
      <div class="prep-card">
        <h4>2. Pengurusan Visa Wisatawan</h4>
        <ul class="tip-list" style="margin-top:0.5rem; gap:0.4rem;">
          <li><strong>Pemegang E-Pasport:</strong> Boleh memohon <strong>Visa Waiver</strong> secara online secara mandiri melalui laman sesawang e-Visa rasmi (tanpa bayaran yuran kedutaan, hanya caj agensi sekitar Rp 120.000 - Rp 200.000 jika diserah melalui KVAC).</li>
          <li><strong>Pemegang Pasport Biasa:</strong> Wajib mengemukakan permohonan Visa Pelawat Biasa di Pusat Permohonan Visa Jepun (KVAC) dengan mengemukakan dokumen sokongan seperti penyata akaun bank bank 3 bulan terkini, bukti kerja, dan jadual perjalanan.</li>
        </ul>
      </div>
    </div>
    <div style="margin-top:1rem; padding:0.75rem; background:var(--sky-light); border-radius:6px; font-size:0.85rem;">
      📝 <strong>Visit Japan Web:</strong> Sila daftar dan lengkapkan borang isytihar imigresen dan kastam digital di laman Visit Japan Web secara dalam talian 48 jam sebelum mendarat untuk mendapatkan kod imbasan QR yang pantas di pintu kawalan ketibaan.
    </div>`
  },
  {
    icon: "🧳",
    title: "Persediaan Bagasi Pulang & Peraturan Kastam Indonesia",
    content: `<div class="prep-grid">
      <div class="prep-card">
        <h4>🎒 Aturan Nilai Bawaan Kepulangan</h4>
        <ul class="tip-list" style="margin-top:0.5rem; gap:0.4rem;">
          <li>Pembebasan cukai barangan cenderahati pelawat yang dibawa masuk ke Indonesia adalah bernilai maksimum <strong>USD 500 (~Rp 8.000.000)</strong> bagi setiap orang pelawat.</li>
          <li>Lebihan nilai daripada had pengecualian tersebut akan dikenakan taksiran duti import kastam rasmi.</li>
          <li>Lengkapkan borang ECD (*Electronic Customs Declaration*) setibanya di kawasan tuntutan bagasi lapangan terbang Indonesia.</li>
        </ul>
      </div>
      <div class="prep-card">
        <h4>🚫 Senarai Barang Dilarang Keras Masuk</h4>
        <ul class="tip-list" style="margin-top:0.5rem; gap:0.4rem;">
          <li>Produk makanan segar basah tanpa sijil kuarantin rasmi seperti sosis segar, buah-buahan segar asing, dan sayur mentah.</li>
          <li>Produk tiruan barangan berjenama (*KW*) dalam kuantiti komersial yang banyak untuk dijual semula.</li>
          <li>Had minuman beralkohol adalah terhad kepada maksimum 1 liter sahaja bagi setiap orang dewasa.</li>
        </ul>
      </div>
    </div>`
  },
  {
    icon: "🚇",
    title: "Jadual Estimasi Anggaran Pengangkutan Awam",
    content: `<p style="font-size:0.85rem; color:var(--ink-soft); margin-bottom:1rem;">Berikut merupakan rujukan kos pengangkutan awam kereta api, bas bandar, dan shinkansen dalam nilai Yen dan Rupiah untuk panduan belanjawan kad IC-Card (Suica/Pasmo) anda:</p>
    <table class="transport-table">
      <thead>
        <tr><th>Kategori Transit Awam</th><th>Kos Perjalanan JPY</th><th>Setara Rupiah IDR</th><th>Catatan Kegunaan</th></tr>
      </thead>
      <tbody>
        <tr><td>Deposit Kad IC (Suica/Pasmo)</td><td>¥500</td><td>Rp 52.500</td><td>Deposit wajib kad fizikal, baki kad boleh dikembalikan</td></tr>
        <tr><td>Kereta Api Tempatan (Per Tap)</td><td>¥140 - ¥320</td><td>Rp 14.700 - Rp 33.600</td><td>Tambang rata-rata perjalanan jarak dekat dalam bandar Tokyo/Osaka</td></tr>
        <tr><td>Tiket Bas Setempat Kyoto (Flat Rate)</td><td>¥230</td><td>Rp 24.150</td><td>Tambang bas tetap bagi meneroka kuil bersejarah Kyoto</td></tr>
        <tr><td>Pas Terusan Subway Tokyo (24 Jam)</td><td>¥800</td><td>Rp 84.000</td><td>Naik turun tanpa had di semua landasan Tokyo Metro</td></tr>
        <tr><td>Kereta Api Laju Shinkansen (Tokyo ⇄ Osaka)</td><td>¥14,500</td><td>Rp 1.522.500</td><td>Satu hala perjalanan pantas rentas wilayah (masa tempuh 2.5 jam)</td></tr>
      </tbody>
    </table>`
  },
  {
    icon: "📶",
    title: "Akses Kad SIM, eSIM, & Pocket WiFi",
    content: `<div class="sim-card-grid">
      <div class="sim-card-item">
        <h4>IIJmio eSIM</h4>
        <p>Rangkaian Docomo terpantas. Pasang kod QR dari Indonesia sebelum bertolak terbang.</p>
        <div class="sim-card-prices">
          <span class="sim-card-price">¥2,500</span>
          <span class="sim-card-price-idr">≈ Rp 262.500 (10GB / 30 Hari)</span>
        </div>
      </div>
      <div class="sim-card-item">
        <h4>Airalo eSIM Jepang</h4>
        <p>Sangat praktikal terus aktif sebaik sahaja mendarat tanpa tukar kad fizikal.</p>
        <div class="sim-card-prices">
          <span class="sim-card-price">$9–15</span>
          <span class="sim-card-price-idr">≈ Rp 140.000 - Rp 230.000</span>
        </div>
      </div>
      <div class="sim-card-item">
        <h4>Sewa Pocket WiFi</h4>
        <p>Disyorkan jika mengembara secara berkumpulan 3-4 orang. Ambil di lapangan terbang ketibaan.</p>
        <div class="sim-card-prices">
          <span class="sim-card-price">¥500–800 / Hari</span>
          <span class="sim-card-price-idr">≈ Rp 52.500 - Rp 84.000</span>
        </div>
      </div>
    </div>`
  },
  {
    icon: "💴",
    title: "Pembahagian Cash vs Kad Bank Indonesia di Jepang",
    content: `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
      <div style="padding: 1rem; background: var(--gold-light); border-radius: 8px; border: 1px solid rgba(212,175,55,0.3);">
        <h4 style="color: #8B6800; margin-bottom: 0.5rem; font-size:0.9rem;">💴 Gunakan Wang Tunai</h4>
        <ul class="tip-list" style="font-size:0.85rem;">
          <li>Yuran kemasukan taman dan kuil lama</li>
          <li>Kedai makan mi ramen tiket vending machine</li>
          <li>Pasar basah jalanan kulinari basah</li>
          <li>Tambah nilai kad fizikal Suica/Pasmo</li>
        </ul>
      </div>
      <div style="padding: 1rem; background: var(--sky-light); border-radius: 8px; border: 1px solid rgba(91,155,213,0.3);">
        <h4 style="color: #185FA5; margin-bottom: 0.5rem; font-size:0.9rem;">💳 Sesuai Transaksi Tanpa Tunai</h4>
        <ul class="tip-list" style="font-size:0.85rem;">
          <li>Belanja gedung fesyen & butik mall</li>
          <li>Kaunter pemotongan bebas cukai Don Quijote</li>
          <li>Tarik tunai kecemasan di ATM 7-Eleven</li>
          <li>Pembayaran penginapan hotel besar</li>
        </ul>
      </div>
    </div>`
  },
  {
    icon: "🎌",
    title: "Peraturan Sosial & Etika Penting Setempat",
    content: `<ul class="tip-list">
      <li><strong>Budaya Sampah:</strong> Sangat sukar mencari tong sampah awam di tepi jalan. Sila sediakan beg plastik kecil di dalam beg anda untuk membawa pulang sampah sendiri ke hotel atau dibuang di ruang luar konbini terdekat.</li>
      <li><strong>Perjalanan Eskalator:</strong> Berdiri rapat di sebelah kiri untuk memberi laluan pejalan laju di sebelah kanan (Kecuali wilayah Osaka yang menggunakan peraturan sebaliknya).</li>
      <li><strong>Suasana Kereta Api:</strong> Tolong matikan mod deringan telefon pintar dan elakkan daripada bersembang dengan suara yang kuat di dalam pengangkutan awam bagi menghormati privasi orang sekeliling.</li>
      <li><strong>Pemberian Tip:</strong> Tidak perlu memberikan sebarang wang tip tambahan di restoran. Amalan ini dianggap kurang sopan mengikut budaya Jepun.</li>
    </ul>`
  },
  {
    icon: "🗣️",
    title: "Frasa Ringkas Bahasa Jepun untuk Perbualan Asas",
    content: `<table class="phrase-table">
      <thead><tr><th>Bahasa Indonesia/Melayu</th><th>Tulisan Asli</th><th>Cara Sebutan Romaji</th></tr></thead>
      <tbody>
        <tr><td>Terima kasih banyak</td><td class="phrase-jp">ありがとうございます</td><td class="phrase-romaji">Arigatou gozaimasu</td></tr>
        <tr><td>Permisi / Maaf encik</td><td class="phrase-jp">すみません</td><td class="phrase-romaji">Sumimasen</td></tr>
        <tr><td>Di manakah lokasi tandas?</td><td class="phrase-jp">トイレはmonoですか？</td><td class="phrase-romaji">Toire wa doko desu ka?</td></tr>
        <tr><td>Berapakah harga barangan ini?</td><td class="phrase-jp">いくらですか？</td><td class="phrase-romaji">Ikura desu ka?</td></tr>
        <tr><td>Adakah menu ini mengandungi daging babi?</td><td class="phrase-jp">豚肉は入っていますか？</td><td class="phrase-romaji">Butaniku wa haitte imasu ka?</td></tr>
        <tr><td>Adakah sajian makanan ini halal?</td><td class="phrase-jp">これはハラールですか？</td><td class="phrase-romaji">Kore wa Hararu desu ka?</td></tr>
        <tr><td>Bolehkah saya dapat potongan bebas cukai?</td><td class="phrase-jp">免税できますか？</td><td class="phrase-romaji">Menzei dekimasu ka?</td></tr>
      </tbody>
    </table>`
  }
];

function renderAccordion() {
  const group = document.getElementById('accordionGroup');
  if (!group) return;
  group.innerHTML = accordionData.map((item, i) => `
    <div class="accordion-item" id="acc-${i}">
      <div class="accordion-header" onclick="toggleAccordion(${i})">
        <div class="accordion-icon">${item.icon}</div>
        <span class="accordion-title">${item.title}</span>
        <span class="accordion-arrow">▼</span>
      </div>
      <div class="accordion-body">
        <div class="accordion-content">${item.content}</div>
      </div>
    </div>
  `).join('');
}

window.toggleAccordion = function(i) {
  const item = document.getElementById('acc-' + i);
  if (!item) return;
  const isOpen = item.classList.contains('open');
  
  // Close other open accordions
  document.querySelectorAll('.accordion-item').forEach(el => el.classList.remove('open'));
  
  if (!isOpen) {
    item.classList.add('open');
  }
}
