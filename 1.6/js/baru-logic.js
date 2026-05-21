
        /* ═══════════════════════════════════════════
           CONSTANTS & CENTRAL CURRENCY STATE
        ═══════════════════════════════════════════ */
        const DEFAULT_KURS = 104;
        let IDR = parseFloat(localStorage.getItem('jpy_idr_rate')) || DEFAULT_KURS;
        let currencyMode = localStorage.getItem('currency_mode') || 'dual'; // 'dual', 'jpy', 'idr'

        const fmt = n => Math.round(n).toLocaleString('id-ID');
        
        // Responsive formatters based on display mode settings
        const jpy = n => {
            if (currencyMode === 'idr') {
                return `Rp ${fmt(n * IDR)}`;
            }
            return `¥${fmt(n)}`;
        };
        
        const idrStr = n => {
            if (currencyMode === 'jpy' || currencyMode === 'idr') {
                return '';
            }
            return `Rp ${fmt(n * IDR)}`;
        };

        const fmtIDR = n => {
            if (currencyMode === 'jpy') {
                return `¥${fmt(n / IDR)}`;
            }
            return `Rp ${fmt(n)}`;
        };

        // Central price formatter that automatically formats and converts JPY to IDR,
        // respecting dual currency ranges and single currency settings.
        const formatRange = (rangeStr, rawVal) => {
            if (currencyMode === 'jpy') {
                return rangeStr || `¥${fmt(rawVal)}`;
            }
            const convertRange = (str) => {
                if (!str) return '';
                return str.replace(/¥/g, '').replace(/[\d,.]+/g, m => {
                    const val = parseFloat(m.replace(/,/g, '').replace(/\./g, ''));
                    return isNaN(val) ? m : fmt(val * IDR);
                });
            };
            const converted = convertRange(rangeStr || `¥${rawVal}`);
            if (currencyMode === 'idr') {
                return `Rp ${converted}`;
            }
            // Dual Currency mode (e.g. ¥2,000–4,000 (Rp 208.000–416.000))
            return `${rangeStr || `¥${rawVal}`} (Rp ${converted})`;
        };

        // Utility to convert JPY price ranges to Rupiah format
        const idrStrRange = (rangeStr, rawVal) => {
            if (!rangeStr) return `Rp ${fmt(rawVal * IDR)}`;
            return 'Rp ' + rangeStr.replace(/¥/g, '').replace(/[\d,.]+/g, m => {
                const val = parseFloat(m.replace(/,/g, '').replace(/\./g, ''));
                return isNaN(val) ? m : fmt(val * IDR);
            });
        };

        // Renders local food item dynamically parsing JPY price from its name string
        const renderFoodItemHTML = (f) => {
            const nameText = f.name || f.n || '';
            const match = nameText.match(/(.*?)\s*(¥\s*[\d,.\-–]+)\s*$/);
            if (match) {
                const baseName = match[1];
                const jpyPriceStr = match[2];
                const rawVal = parseFloat(jpyPriceStr.replace(/¥/g, '').replace(/,/g, ''));
                const idrPriceStr = `Rp ${fmt(rawVal * IDR)}`;
                return `
                    <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.05)">
                        <span style="font-size:13px;color:var(--t)">${f.icon || '🍛'} ${baseName}</span>
                        <span style="font-size:12px;color:var(--j);font-weight:700">
                            <span class="price-jpy">${jpyPriceStr}</span>
                            <span class="price-separator">≈</span>
                            <span class="price-idr">${idrPriceStr}</span>
                        </span>
                    </div>
                `;
            }
            return `
                <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.05)">
                    <span style="font-size:13px;color:var(--t)">${f.icon || '🍛'} ${nameText}</span>
                </div>
            `;
        };

        /* ═══════════════════════════════════════════
           NAV CONFIG
        ═══════════════════════════════════════════ */
        const NAV = [
            { id: 'home', l: 'Beranda', ic: '🏯' },
            { id: 'gems', l: 'Hidden Gems', ic: '💎' },
            { id: 'halal', l: 'Halal Food', ic: '🕌' },
            { id: 'sim', l: 'Simulator Hemat', ic: '🍱' },
            { id: 'budget', l: 'Budget Planner', ic: '💴' },
            { id: 'preset', l: 'Preset Trip', ic: '📋' },
            { id: 'transport', l: 'Transportasi', ic: '🚆' },
            { id: 'currency', l: 'Kurs IDR/JPY', ic: '💱' },
            { id: 'weather', l: 'Cuaca & Musim', ic: '🌸' },
            { id: 'prep', l: 'Persiapan Trip', ic: '🧳' },
            { id: 'tips', l: 'Tips Indonesia', ic: '🇮🇩' },
            { id: 'planning', l: 'Planning Trip', ic: '🗺️' },
        ];

        /* ═══════════════════════════════════════════
           DATA — GEMS
        ═══════════════════════════════════════════ */
        const GEMS = [
            {
                id: 'shimokitazawa', name: 'Shimokitazawa', emoji: '🎭', region: 'Tokyo',
                img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&q=80',
                imgW: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=900&q=80',
                cost: 3000, costStr: '¥2,000–4,000', season: 'Spring & Autumn', seasonW: 'Winter Vibes',
                crowd: 30, budget: true, tempS: '12–20°C', tempW: '-2–8°C',
                clothingS: 'Jaket tipis, sneakers', clothingW: 'Mantel tebal, syal, boots',
                desc: 'Surga vintage & indie music Tokyo. Kafe tersembunyi, thrift shops bohemian, dan live music bars anti-mainstream.',
                descW: 'Musim dingin menambah keintiman — kafe hangat, jalanan sepi, nuansa vintage makin kuat.',
                activities: ['Thrift shopping vintage', 'Live music indie bar', 'Kafe tersembunyi', 'Street food lokal', 'Gallery hopping'],
                food: [{ n: 'Bear Pond Espresso', p: '¥600' }, { n: 'Shimokita Ramen', p: '¥900' }, { n: 'Curry & Spice', p: '¥800' }]
            },
            {
                id: 'kamakura', name: 'Kamakura', emoji: '🗿', region: 'Kanagawa',
                img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&q=80',
                imgW: 'https://images.unsplash.com/photo-1584542113680-5ada6cdac52e?w=900&q=80',
                cost: 4000, costStr: '¥3,000–5,000', season: 'Spring & Autumn', seasonW: 'Winter Temples',
                crowd: 55, budget: true, tempS: '10–18°C', tempW: '2–10°C',
                clothingS: 'Jaket ringan, sepatu nyaman', clothingW: 'Mantel, sepatu anti selip',
                desc: 'Patung Buddha raksasa, kuil megah, dan pantai dramatis. Hanya 1 jam dari Tokyo.',
                descW: 'Musim dingin: kuil bersalju, hampir tanpa turis — jauh lebih autentik.',
                activities: ['Great Buddha Kotoku-in', 'Bamboo Grove Hokoku-ji', 'Yuigahama surf spot', 'Temple hopping', 'Zeniara Benten'],
                food: [{ n: 'Shirasu Don', p: '¥1,200' }, { n: 'Gelato Yukinoshita', p: '¥500' }, { n: 'Komachi Dango', p: '¥300' }]
            },
            {
                id: 'enoshima', name: 'Enoshima', emoji: '🏝️', region: 'Kanagawa',
                img: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=900&q=80',
                imgW: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=900&q=80',
                cost: 3500, costStr: '¥2,500–4,500', season: 'Summer & Spring', seasonW: 'Winter Sunset',
                crowd: 60, budget: true, tempS: '18–26°C', tempW: '4–12°C',
                clothingS: 'T-shirt, sunscreen', clothingW: 'Jaket sedang, syal',
                desc: 'Pulau kecil ajaib — kuil dewi laut, gua laut, pemandangan Fuji, dan seafood segar.',
                descW: 'Musim dingin: sunset dengan Fuji bersalju — salah satu view paling epik di Jepang.',
                activities: ['Enoshima Shrine', 'Sea Candle lighthouse', 'Gua Iwaya', 'Sunset view Fuji', 'Pelabuhan seafood'],
                food: [{ n: 'Takoyaki segar', p: '¥500' }, { n: 'Shirasu pizza', p: '¥1,000' }, { n: 'Dango Benzaiten', p: '¥300' }]
            },
            {
                id: 'kawagoe', name: 'Kawagoe', emoji: '🏘️', region: 'Saitama',
                img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&q=80',
                imgW: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=900&q=80',
                cost: 2800, costStr: '¥2,000–3,500', season: 'Autumn', seasonW: 'New Year',
                crowd: 35, budget: true, tempS: '10–20°C', tempW: '0–8°C',
                clothingS: 'Cardigan, jaket ringan', clothingW: 'Mantel, syal',
                desc: '"Little Edo" — bangunan era samurai terawat, bell tower 300 tahun, festival meriah.',
                descW: 'Tahun Baru Jepang paling meriah — lentera, kimono, soba tradisional.',
                activities: ['Kurazukuri warehouse district', 'Kashiya Yokocho candy alley', 'Kitain Temple', 'Hikawa Shrine'],
                food: [{ n: 'Imo sweet potato', p: '¥300' }, { n: 'Unaju Ichinoya', p: '¥2,000' }, { n: 'Mitarashi Dango', p: '¥200' }]
            },
            {
                id: 'ginzan', name: 'Ginzan Onsen', emoji: '♨️', region: 'Yamagata',
                img: 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=900&q=80',
                imgW: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=900&q=80',
                cost: 12000, costStr: '¥8,000–15,000', season: 'Autumn Foliage', seasonW: '❄️ Peak Winter',
                crowd: 25, budget: false, tempS: '8–18°C', tempW: '-10–2°C',
                clothingS: 'Jaket medium, scarf', clothingW: 'Mantel ultra tebal, boots salju, thermal',
                desc: 'Desa onsen era Taisho dengan ryokan tua berlampu gas di tepi sungai. Lebih indah dari semua poster Jepang.',
                descW: 'Peak season bersalju — desa ini seperti keluar dari mimpi. HARUS booking jauh hari!',
                activities: ['Soak public bath ¥500', 'Jalan malam berlampu gas', 'Foto salju', 'Kaiseki dinner di ryokan'],
                food: [{ n: 'Onsen Tamago', p: '¥100' }, { n: 'Kaiseki Ryori', p: 'incl.' }, { n: 'Wanko Soba', p: '¥1,200' }]
            },
            {
                id: 'shirakawa', name: 'Shirakawa-go', emoji: '🏔️', region: 'Gifu',
                img: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=900&q=80',
                imgW: 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?w=900&q=80',
                cost: 6000, costStr: '¥4,000–8,000', season: 'Spring & Autumn', seasonW: '❄️ Snow Village',
                crowd: 40, budget: false, tempS: '5–18°C', tempW: '-12–0°C',
                clothingS: 'Jaket ringan, sepatu nyaman', clothingW: 'Mantel tebal, boots, kacamata salju',
                desc: 'Desa UNESCO Heritage dengan rumah gassho-zukuri atap jerami 60° di lembah Pegunungan Hida.',
                descW: 'Musim dingin menjadikannya salah satu pemandangan paling ikonik di seluruh Jepang.',
                activities: ['Ogimachi observation deck', 'Wada House museum', 'Gassho village walk', 'Light-up festival'],
                food: [{ n: 'Hida beef skewer', p: '¥800' }, { n: 'Doburoku sake', p: '¥600' }, { n: 'Sansai teishoku', p: '¥1,500' }]
            },
            {
                id: 'otaru', name: 'Otaru', emoji: '🏙️', region: 'Hokkaido',
                img: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=900&q=80',
                imgW: 'https://images.unsplash.com/photo-1609856878074-cf31e21ccb6b?w=900&q=80',
                cost: 5500, costStr: '¥4,000–7,000', season: 'Autumn', seasonW: '❄️ Snow Canal',
                crowd: 30, budget: false, tempS: '8–22°C', tempW: '-14–0°C',
                clothingS: 'Jaket sedang, scarf', clothingW: 'Mantel arctic, boots salju, thermal',
                desc: 'Kota kanal romantis Hokkaido — gedung bata era Meiji, musik box, dan sushi paling segar.',
                descW: 'Musim dingin: kanal beku berlampu es, pasar kepiting segar. Kota paling romantis di Jepang.',
                activities: ['Otaru Canal night walk', 'Kitaichi glass factory', 'Music box museum', 'Morning fish market'],
                food: [{ n: 'Kaisen-don', p: '¥2,000' }, { n: 'Fresh crab Sankaku', p: '¥1,500' }, { n: 'LeTAO Fromage', p: '¥700' }]
            },
            {
                id: 'hakone', name: 'Hakone Hidden', emoji: '🌋', region: 'Kanagawa',
                img: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=900&q=80',
                imgW: 'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=900&q=80',
                cost: 8000, costStr: '¥5,000–12,000', season: 'Spring & Autumn', seasonW: 'Snow + Fuji',
                crowd: 50, budget: true, tempS: '8–20°C', tempW: '0–8°C',
                clothingS: 'Jaket ringan, sunscreen', clothingW: 'Mantel, boots, syal',
                desc: 'Owakudani sulfur valley, danau mistis Ashi, onsen kelas dunia, dan seni kontemporer Open Air.',
                descW: 'Musim dingin: onsen makin nikmat, turis sedikit, Fuji bersalju terlihat jelas.',
                activities: ['Owakudani sulfur valley', 'Lake Ashi pirate ship', 'Open Air Museum', 'Pola Museum of Art'],
                food: [{ n: 'Kuro Tamago', p: '¥500' }, { n: 'Hakone Bakery', p: '¥400' }, { n: 'Yumoto hot pot', p: '¥1,800' }]
            },
        ];

        /* ═══════════════════════════════════════════
           DATA — HALAL
        ═══════════════════════════════════════════ */
        const HALAL = {
            tokyo: [
                {
                    name: 'Gyumon Halal Yakiniku', price: '¥2,000–3,500', cert: 'certified', certL: '✅ Halal Certified', area: 'Shinjuku',
                    img: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=700&q=80', menu: 'A5 Wagyu halal, kalbi, short rib premium', rating: 4.8
                },
                {
                    name: 'Naritaya Ramen Asakusa', price: '¥1,200–2,000', cert: 'muslim', certL: '☪️ Muslim Friendly', area: 'Asakusa',
                    img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700&q=80', menu: 'Ramen halal broth sapi & ayam, gyoza', rating: 4.6
                },
                {
                    name: 'Ayam-Ya Shinjuku', price: '¥800–1,200', cert: 'certified', certL: '✅ Halal Certified', area: 'Shinjuku',
                    img: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=700&q=80', menu: 'Ayam goreng crispy Jepang, nasi set menu', rating: 4.5
                },
                {
                    name: 'Matagi Halal Burger', price: '¥1,000–1,500', cert: 'nopork', certL: '🟡 No Pork', area: 'Akihabara',
                    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&q=80', menu: 'Beef burger halal, loaded fries, milkshake', rating: 4.4
                },
            ],
            osaka: [
                {
                    name: 'Halal Okonomiyaki Kaname', price: '¥1,200–1,800', cert: 'certified', certL: '✅ Halal Certified', area: 'Dotonbori',
                    img: 'https://images.unsplash.com/photo-1570275239925-4af0aa93a0dc?w=700&q=80', menu: 'Okonomiyaki halal seafood & beef, yakisoba', rating: 4.7
                },
                {
                    name: 'Naritaya Namba', price: '¥1,200–2,000', cert: 'certified', certL: '✅ Halal Certified', area: 'Namba',
                    img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700&q=80', menu: 'Ramen halal legendaris cabang Osaka', rating: 4.8
                },
                {
                    name: 'Halal Takoyaki Dotonbori', price: '¥500–800', cert: 'nopork', certL: '🟡 No Pork', area: 'Dotonbori',
                    img: 'https://images.unsplash.com/photo-1511689660979-10d2b1ec7ea2?w=700&q=80', menu: 'Takoyaki halal fresh, halal mayo', rating: 4.5
                },
            ],
            kyoto: [
                {
                    name: 'Halal Nishiki Tofu Set', price: '¥1,000–1,800', cert: 'certified', certL: '✅ Halal Certified', area: 'Nishiki Market',
                    img: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=700&q=80', menu: 'Tofu kaiseki, soba halal, Kyoto bento', rating: 4.6
                },
                {
                    name: 'Nishiki Halal Karaage', price: '¥600–900', cert: 'certified', certL: '✅ Halal Certified', area: 'Karasuma',
                    img: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=700&q=80', menu: 'Karaage halal crispy, onigiri halal', rating: 4.4
                },
            ],
            hokkaido: [
                {
                    name: 'Sapporo Halal Lamb BBQ', price: '¥2,500–4,000', cert: 'certified', certL: '✅ Halal Certified', area: 'Susukino',
                    img: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=700&q=80', menu: 'Jingisukan domba halal, khas Hokkaido', rating: 4.9
                },
                {
                    name: 'Otaru Halal Seafood Bowl', price: '¥2,000–3,500', cert: 'nopork', certL: '🟡 No Pork', area: 'Otaru Market',
                    img: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=700&q=80', menu: 'Kaisen-don seafood fresh, ikan panggang', rating: 4.7
                },
            ],
        };

        /* ═══════════════════════════════════════════
           DATA — WEATHER
        ═══════════════════════════════════════════ */
        const WD = {
            tokyo: { name: 'Tokyo', ic: '🗼', t: [6, 7, 11, 16, 21, 24, 28, 30, 26, 21, 14, 8], r: [40, 45, 55, 60, 50, 70, 60, 65, 65, 55, 45, 40], cr: ['Rendah', 'Rendah', 'Tinggi', 'Sangat Tinggi', 'Sedang', 'Rendah', 'Rendah', 'Sedang', 'Sedang', 'Tinggi', 'Sedang', 'Sedang'] },
            osaka: { name: 'Osaka', ic: '🏯', t: [7, 8, 12, 18, 23, 27, 31, 33, 28, 22, 15, 9], r: [40, 50, 55, 65, 50, 70, 65, 65, 60, 55, 45, 40], cr: ['Rendah', 'Rendah', 'Tinggi', 'Sangat Tinggi', 'Sedang', 'Rendah', 'Sedang', 'Sedang', 'Tinggi', 'Tinggi', 'Sedang', 'Sedang'] },
            kyoto: { name: 'Kyoto', ic: '⛩️', t: [5, 6, 10, 16, 21, 25, 29, 31, 26, 20, 13, 7], r: [50, 55, 60, 70, 60, 70, 50, 45, 60, 65, 60, 50], cr: ['Sedang', 'Rendah', 'Sangat Tinggi', 'Sangat Tinggi', 'Sedang', 'Rendah', 'Rendah', 'Rendah', 'Tinggi', 'Sangat Tinggi', 'Sangat Tinggi', 'Sedang'] },
            hokkaido: { name: 'Hokkaido', ic: '❄️', t: [-6, -5, 0, 8, 15, 20, 24, 25, 19, 11, 3, -3], r: [50, 50, 55, 50, 55, 60, 60, 65, 65, 60, 60, 55], cr: ['Sangat Tinggi', 'Tinggi', 'Rendah', 'Sedang', 'Sedang', 'Rendah', 'Sedang', 'Tinggi', 'Sangat Tinggi', 'Sangat Tinggi', 'Sedang', 'Tinggi'] },
        };
        const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
        const MOF = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const SI = ['❄️', '❄️', '🌸', '🌸', '☀️', '🌧️', '🌩️', '🌩️', '🌤️', '🍂', '🌤️', '❄️'];

        /* ═══════════════════════════════════════════
           DATA — TRANSPORT
        ═══════════════════════════════════════════ */
        const TR = [
            { n: 'Tokyo Metro (1 zona)', y: 200, ic: '🚇', note: 'Per perjalanan, estimasi rata-rata' },
            { n: 'JR Yamanote Loop Tokyo', y: 140, ic: '🚃', note: 'Keliling Tokyo per perjalanan' },
            { n: 'Tokyo Subway Day Pass', y: 600, ic: '🎫', note: 'Unlimited subway 1 hari' },
            { n: 'Shinkansen Tokyo→Kyoto', y: 13320, ic: '🚄', note: 'Nozomi/Hikari, sekali jalan' },
            { n: 'Shinkansen Tokyo→Osaka', y: 14720, ic: '🚄', note: 'Nozomi, sekali jalan' },
            { n: 'JR Pass 7 Hari', y: 50000, ic: '🎟️', note: 'Unlimited JR seluruh Jepang' },
            { n: 'JR Pass 14 Hari', y: 80000, ic: '🎟️', note: 'Unlimited JR 14 hari' },
            { n: 'Bus Limousine Bandara', y: 3200, ic: '🚌', note: 'Narita→Shinjuku sekali jalan' },
            { n: 'Narita Express (NEX)', y: 3070, ic: '🚂', note: 'Narita→Shibuya, ~1 jam' },
            { n: 'Taksi (tarif dasar)', y: 730, ic: '🚕', note: '1.2 km pertama' },
            { n: 'Sepeda sewa (per hari)', y: 1000, ic: '🚲', note: 'Kyoto, Nara, Otaru' },
            { n: 'IC Card Suica (deposit)', y: 500, ic: '💳', note: 'Refundable, berlaku seumur hidup' },
        ];

        /* ═══════════════════════════════════════════
           DATA — PLANNING
        ═══════════════════════════════════════════ */
        // Budget Planning Data Structure
        // Untuk menambah opsi budget baru: tambah objek baru ke array PLAN_OPTIONS
        // Field 'persons' = jumlah orang untuk patungan (default 1 = solo)
        // Semua harga dalam IDR
        const PLAN_OPTIONS = [
            {
                id: 'A', label: 'Budget Traveler', icon: '🎒',
                totalIDR: 8000000, persons: 1,
                flight: 3600000, hotel: 1700000, food: 1200000, transport: 900000, souvenir: 600000, wisata: 0,
                flightNote: 'CGK–NRT PP promo', hotelNote: 'Hostel / Capsule, ~¥2.300/malam', foodNote: 'Konbini + budget resto', transportNote: 'IC Card + JR Pass partial', souvenirNote: 'Budget fleksibel', wisataNote: 'Banyak destinasi gratis',
                color: '#3ddc84', colorDim: 'rgba(61,220,132,.1)', colorBorder: 'rgba(61,220,132,.22)',
                desc: 'Perjalanan hemat maksimal — konbini, hostel, dan IC Card.',
                style: 'Hostel / Capsule Hotel', stars: '★★',
                highlights: ['Hostel dorm atau capsule hotel', 'Makan konbini 2–3x/hari', 'IC Card untuk semua transport', 'Wisata gratis & low cost']
            },
            {
                id: 'B', label: 'Mid Traveler', icon: '🧳',
                totalIDR: 14000000, persons: 1,
                flight: 5500000, hotel: 4500000, food: 2000000, transport: 1200000, souvenir: 800000, wisata: 0,
                flightNote: 'Tiket reguler CGK–NRT PP', hotelNote: 'Business Hotel ★★★, ~¥6.000/malam', foodNote: 'Restoran budget + konbini', transportNote: 'JR Pass 7 hari + IC Card', souvenirNote: 'Oleh-oleh standar', wisataNote: 'Tiket wisata berbayar',
                color: '#f4a7b9', colorDim: 'rgba(244,167,185,.1)', colorBorder: 'rgba(244,167,185,.22)',
                desc: 'Keseimbangan kenyamanan & budget — hotel bintang 3, restoran.',
                style: 'Business Hotel ★★★', stars: '★★★',
                highlights: ['Business hotel ★★★ twin/double', 'Mix konbini + restoran halal', 'JR Pass 7 hari full', 'Museum & tempat berbayar']
            },
            {
                id: 'C', label: 'Comfortable', icon: '✈️',
                totalIDR: 22000000, persons: 1,
                flight: 8000000, hotel: 9000000, food: 3000000, transport: 1500000, souvenir: 500000, wisata: 1000000,
                flightNote: 'Direct flight CGK–NRT', hotelNote: 'Hotel ★★★★–★★★★★, ~¥12.000/malam', foodNote: 'Fine dining & restoran premium', transportNote: 'JR Pass + private transfer', souvenirNote: 'Oleh-oleh premium', wisataNote: 'Tiket premium & priority',
                color: '#d4af37', colorDim: 'rgba(212,175,55,.1)', colorBorder: 'rgba(212,175,55,.22)',
                desc: 'Pengalaman premium — hotel bintang 4-5 dan fine dining.',
                style: 'Hotel ★★★★–★★★★★', stars: '★★★★★',
                highlights: ['Hotel mewah ★★★★–★★★★★', 'Fine dining & restoran premium', 'Direct flight + private car', 'Wisata VIP & priority access']
            },
            {
                id: 'D', label: 'Group Patungan', icon: '👥',
                totalIDR: 24000000, persons: 3,
                flight: 12000000, hotel: 6000000, food: 3000000, transport: 1800000, souvenir: 900000, wisata: 300000,
                flightNote: 'Total 3 tiket PP (×Rp4jt/orang)', hotelNote: 'Total 3 orang, hotel ★★★ twin', foodNote: 'Total 3 orang, 7 hari', transportNote: 'JR Pass × 3 + IC Card', souvenirNote: 'Total budget belanja grup', wisataNote: 'Tiket wisata total 3 orang',
                color: '#c084fc', colorDim: 'rgba(192,132,252,.1)', colorBorder: 'rgba(192,132,252,.22)',
                desc: 'Trip seru bareng 3 orang — bayar lebih hemat, pengalaman lebih meriah!',
                style: 'Business Hotel ★★★ (shared)', stars: '★★★',
                highlights: ['Patungan 3 orang = Rp8jt/orang', 'Hotel twin/triple share room', 'JR Pass hemat dibagi 3', 'Biaya wisata dibagi rata'],
                groupNote: 'Budget patungan 3 orang'
            },
        ];

        const ITIN = [
            {
                day: 1, title: 'Tokyo Barat', sector: 'Shibuya · Harajuku · Meiji', transport: 'JR Yamanote Line', transportCost: 600, foodCost: 1800, color: '#f4a7b9',
                places: [
                    { name: 'Shibuya Crossing', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', desc: 'Persimpangan tersibuk di dunia — wajib foto dari jembatan Starbucks.', time: '09:00', spend: '¥0', type: 'Free' },
                    { name: 'Hachiko Statue', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80', desc: 'Patung anjing setia Hachiko di depan Shibuya Station. Meet point paling ikonik.', time: '09:30', spend: '¥0', type: 'Free' },
                    { name: 'Harajuku & Takeshita St.', img: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80', desc: 'Surga fashion unik, crepe manis, dan subkultur Jepang. Coba crepe Harajuku!', time: '10:30', spend: '¥500–1,500', type: 'Food' },
                    { name: 'Meiji Shrine', img: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&q=80', desc: 'Kuil Shinto megah di hutan rindang tengah Tokyo. Gratis masuk, tenang & spiritual.', time: '13:00', spend: '¥0', type: 'Free' },
                ]
            },
            {
                day: 2, title: 'Tokyo Tengah', sector: 'Shinjuku · Kabukicho · Omoide Yokocho', transport: 'Tokyo Metro + JR', transportCost: 800, foodCost: 2000, color: '#d4af37',
                places: [
                    { name: 'Tokyo Metropolitan Bldg.', img: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80', desc: 'Observatorium GRATIS setinggi 202m. Panorama 360° Tokyo termasuk Fuji di hari cerah.', time: '09:00', spend: '¥0', type: 'Free' },
                    { name: 'Shinjuku Gyoen Garden', img: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&q=80', desc: 'Taman nasional indah — kombinasi taman Prancis, Inggris, dan Jepang.', time: '10:30', spend: '¥500', type: 'Ticket' },
                    { name: 'Omoide Yokocho', img: 'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=800&q=80', desc: '"Memory Lane" — bar dan yakitori kecil berjajaran, atmosfer Showa era yang autentik.', time: '18:00', spend: '¥1,500–2,500', type: 'Food' },
                    { name: 'Shinjuku Night Walk', img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80', desc: 'Shinjuku malam — neon, orang, energi, dan kehidupan malam penuh gaya.', time: '20:00', spend: '¥500', type: 'Drinks' },
                ]
            },
            {
                day: 3, title: 'Tokyo Timur', sector: 'Asakusa · Skytree · Akihabara', transport: 'Tokyo Metro Asakusa Line', transportCost: 700, foodCost: 1800, color: '#6699ff',
                places: [
                    { name: 'Senso-ji Temple Asakusa', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80', desc: 'Kuil Buddha tertua Tokyo sejak 628. Kaminarimon Gate ikonik — gratis masuk.', time: '08:00', spend: '¥200 omikuji', type: 'Culture' },
                    { name: 'Nakamise Shopping Street', img: 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800&q=80', desc: 'Jalan belanja tradisional menuju Senso-ji — souvenir, jajanan, dan kerajinan tangan.', time: '09:00', spend: '¥500–2,000', type: 'Shopping' },
                    { name: 'Tokyo Skytree', img: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80', desc: 'Menara tertinggi Jepang (634m). Pemandangan Tokyo dari atas yang tiada duanya.', time: '11:00', spend: '¥2,100', type: 'Ticket' },
                    { name: 'Akihabara Electric Town', img: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&q=80', desc: 'Surga anime, manga, elektronik, gaming. Dari figur rare hingga retro game.', time: '14:00', spend: '¥1,000–5,000', type: 'Shopping' },
                ]
            },
            {
                day: 4, title: 'Day Trip Kamakura', sector: 'Kamakura · Enoshima', transport: 'JR Yokosuka + Enoden', transportCost: 1500, foodCost: 2000, color: '#3ddc84',
                places: [
                    { name: 'Kotoku-in Great Buddha', img: 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?w=800&q=80', desc: 'Patung Buddha perunggu setinggi 13.35m — salah satu patung paling ikonik Jepang.', time: '09:30', spend: '¥300', type: 'Ticket' },
                    { name: 'Hokoku-ji Bamboo Grove', img: 'https://images.unsplash.com/photo-1609856878074-cf31e21ccb6b?w=800&q=80', desc: '"The Bamboo Temple" — hutan bambu tenang. Nikmati matcha di tengah bambu.', time: '11:00', spend: '¥1,200', type: 'Culture' },
                    { name: 'Yuigahama Beach', img: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80', desc: 'Pantai Kamakura yang cantik — santai dan makan siang dengan pemandangan laut.', time: '13:00', spend: '¥1,200', type: 'Food' },
                    { name: 'Enoshima Island', img: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&q=80', desc: 'Pulau kecil ajaib — kuil dewi laut, Sea Candle lighthouse, dan view Fuji.', time: '15:00', spend: '¥1,000', type: 'Ticket' },
                ]
            },
            {
                day: 5, title: 'Hidden Gems Tokyo', sector: 'Shimokitazawa · Koenji', transport: 'Odakyu + Chuo Line', transportCost: 500, foodCost: 1800, color: '#c084fc',
                places: [
                    { name: 'Shimokitazawa Morning', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', desc: 'Pagi di Shimokita — kafe tersembunyi, toko vinyl, dan sarapan warung lokal.', time: '09:00', spend: '¥600–900', type: 'Food' },
                    { name: 'Thrift Shops & Vintage', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80', desc: 'Surga thrift shopping terbaik Tokyo — baju vintage berkualitas harga terjangkau.', time: '10:00', spend: '¥500–3,000', type: 'Shopping' },
                    { name: 'Shimokita Live Music', img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80', desc: 'Venue kecil live music indie — pengalaman yang jarang didapat turis biasa.', time: '13:00', spend: '¥500–1,000', type: 'Entertainment' },
                    { name: 'Koenji Shotengai', img: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80', desc: 'Neighborhood bohemian Tokyo — galeri seni, vintage shop, dan kafe unik terjangkau.', time: '15:30', spend: '¥500–1,500', type: 'Explore' },
                ]
            },
            {
                day: 6, title: 'Shopping & Souvenir Day', sector: 'Don Quijote · Ueno · Ginza', transport: 'Tokyo Metro Day Pass', transportCost: 600, foodCost: 1500, color: '#f5a623',
                places: [
                    { name: 'Don Quijote Shibuya', img: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&q=80', desc: 'Surga oleh-oleh terlengkap! KitKat, snack, kosmetik, elektronik. Tax free tersedia.', time: '10:00', spend: '¥2,000–10,000', type: 'Shopping' },
                    { name: 'Ameyoko Market Ueno', img: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&q=80', desc: 'Pasar jalanan ikonik — buah, snack, seafood, dan souvenir harga lokal.', time: '13:00', spend: '¥500–2,000', type: 'Market' },
                    { name: 'Ueno Park & Museums', img: 'https://images.unsplash.com/photo-1584542113680-5ada6cdac52e?w=800&q=80', desc: 'Taman luas — museum nasional, kebun binatang, spot hanami terbaik Tokyo.', time: '14:30', spend: '¥0–600', type: 'Culture' },
                    { name: 'Ginza Window Shopping', img: 'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=800&q=80', desc: 'District mewah Ginza — UNIQLO flagship store dan Apple Store Tokyo ikonik.', time: '17:00', spend: '¥0–∞', type: 'Explore' },
                ]
            },
            {
                day: 7, title: 'Relax & Airport', sector: 'Final Morning · NRT/HND', transport: 'Narita Express / Limo Bus', transportCost: 3200, foodCost: 1000, color: '#94a3b8',
                places: [
                    { name: 'Morning Konbini Breakfast', img: 'https://images.unsplash.com/photo-1511689660979-10d2b1ec7ea2?w=800&q=80', desc: 'Sarapan terakhir dari konbini — onigiri, tamagoyaki, dan kopi Jepang. Momen yang selalu dirindukan.', time: '07:00', spend: '¥600–800', type: 'Food' },
                    { name: 'Final Souvenir Hunt', img: 'https://images.unsplash.com/photo-1570275239925-4af0aa93a0dc?w=800&q=80', desc: 'Terakhir! Duty free bandara menyediakan KitKat, LeTAO, Royce, dan Tokyo Banana.', time: '08:30', spend: '¥1,000–3,000', type: 'Shopping' },
                    { name: 'Hotel Check-out & Pack', img: 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800&q=80', desc: 'Check-out dan timbang koper. Pastikan struk tax free tersimpan.', time: '10:00', spend: '¥0', type: 'Admin' },
                    { name: 'Narita / Haneda Airport', img: 'https://images.unsplash.com/photo-1609856878074-cf31e21ccb6b?w=800&q=80', desc: 'Ambil NEX atau Limousine Bus. Datang minimal 3 jam sebelum penerbangan internasional.', time: '13:00', spend: '¥3,070–3,200', type: 'Transport' },
                ]
            },
        ];

        /* ═══════════════════════════════════════════
           APP STATE
        ═══════════════════════════════════════════ */
        const state = {
            page: 'home',
            sidebarCollapsed: false,
            gemSeason: 'spring',
            gemDetailId: null,
            gemDetailSeason: 'spring',
            halalCity: 'tokyo',
            simDays: 7, simKb: 2, simBr: 3,
            budgetVals: { flightIDR: 5500000, hotel: 6000, food: 4000, transport: 55000, attraction: 8000, shopping: 15000, emergency: 10000, days: 7 },
            weatherDest: 'tokyo',
            weatherMonth: 3,
            currMode: 'idr2jpy',
            prepTab: 'before',
            planSel: 'A',
            planPersons: 1,   // Toggle jumlah orang: 1, 2, atau 3
            openDay: null,
            heroSlide: 0,
            simChart: null,
            budgetChart: null,
            weatherChart: null,
            planPieChart: null,
        };

        /* ═══════════════════════════════════════════
           SAKURA CANVAS
        ═══════════════════════════════════════════ */
        function bootSakura() {
            const cv = document.getElementById('sk');
            if (!cv) return;
            const cx = cv.getContext('2d');
            let W = innerWidth, H = innerHeight;
            const resize = () => { W = innerWidth; H = innerHeight; cv.width = W; cv.height = H; };
            resize();
            window.addEventListener('resize', resize);
            const ps = Array.from({ length: 75 }, () => ({
                x: Math.random() * innerWidth, y: Math.random() * innerHeight,
                sz: Math.random() * 7 + 2.5, vx: Math.random() * .7 - .35, vy: Math.random() * 1.3 + .35,
                spin: (Math.random() - .5) * .055, ang: Math.random() * Math.PI * 2,
                wb: Math.random() * Math.PI * 2, wbS: Math.random() * .025 + .007, wbA: Math.random() * .55 + .2,
                op: Math.random() * .28 + .06, ph: Math.random() * Math.PI * 2, hue: 338 + Math.random() * 22,
            }));
            function drawP(p) {
                cx.save(); cx.translate(p.x, p.y); cx.rotate(p.ang); cx.globalAlpha = p.op;
                const g = cx.createRadialGradient(0, 0, 0, p.sz * .3, p.sz * .3, p.sz);
                g.addColorStop(0, `hsla(${p.hue},84%,90%,1)`); g.addColorStop(1, `hsla(${p.hue + 12},74%,68%,.5)`);
                cx.fillStyle = g; cx.beginPath(); cx.ellipse(0, 0, p.sz, p.sz * .5, 0, 0, Math.PI * 2); cx.fill();
                cx.globalAlpha = p.op * .5; cx.fillStyle = 'rgba(255,255,255,.65)';
                cx.beginPath(); cx.ellipse(-p.sz * .15, -p.sz * .15, p.sz * .32, p.sz * .16, -.55, 0, Math.PI * 2); cx.fill();
                cx.restore();
            }
            let raf;
            function loop() {
                cx.clearRect(0, 0, W, H);
                ps.forEach(p => {
                    p.wb += p.wbS; p.x += p.vx + Math.sin(p.wb) * p.wbA; p.y += p.vy; p.ang += p.spin;
                    p.op = .06 + Math.abs(Math.sin(p.ph + p.wb * .3)) * .22;
                    if (p.y > H + 14) { p.y = -14; p.x = Math.random() * W; }
                    if (p.x > W + 14) p.x = -14; if (p.x < -14) p.x = W + 14;
                    drawP(p);
                });
                raf = requestAnimationFrame(loop);
            }
            loop();
        }

        /* ═══════════════════════════════════════════
           NAVIGATION
        ═══════════════════════════════════════════ */
        function navigate(id) {
            if (id === state.page) return;
            const main = document.getElementById('main');
            main.classList.add('fading');
            setTimeout(() => {
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                const target = document.getElementById(id + '-page');
                if (target) { target.classList.add('active'); state.page = id; }
                document.querySelectorAll('.nav-btn').forEach(b => {
                    b.classList.toggle('active', b.dataset.id === id);
                });
                document.querySelectorAll('.bot-btn').forEach(b => {
                    b.classList.toggle('active', b.dataset.id === id);
                });
                main.classList.remove('fading');
                main.scrollTop = 0;
                // init page-specific logic
                if (id === 'sim') initSim();
                if (id === 'budget') initBudget();
                if (id === 'weather') initWeather();
                if (id === 'preset') renderPreset();
                if (id === 'transport') renderTransport();
                if (id === 'currency') initCurrency();
                if (id === 'planning') renderPlanning();
                if (id === 'halal') renderHalal(state.halalCity);
                if (id === 'prep') renderPrep();
                if (id === 'tips') renderTips();
                if (id === 'gems') renderGems();
            }, 200);
        }

        function toggleSidebar() {
            state.sidebarCollapsed = !state.sidebarCollapsed;
            const sb = document.getElementById('sidebar');
            const btn = document.getElementById('collapse-btn');
            sb.classList.toggle('collapsed', state.sidebarCollapsed);
            btn.textContent = state.sidebarCollapsed ? '→' : '←';
        }

        /* ═══════════════════════════════════════════
           SIDEBAR & BOTNAV RENDER
        ═══════════════════════════════════════════ */
        function renderSidebar() {
            const nav = document.getElementById('sidenav');
            nav.innerHTML = NAV.map(item => `
    <button class="nav-btn${item.id === 'home' ? ' active' : ''}" data-id="${item.id}" onclick="navigate('${item.id}')">
      <span class="nav-ic">${item.ic}</span>
      <span class="nav-label">${item.l}</span>
    </button>
  `).join('');
            const bot = document.getElementById('botnav');
            const botItems = [NAV[0], NAV[1], NAV[2], NAV[3], NAV[11]];
            bot.style.display = 'flex';
            bot.innerHTML = botItems.map(item => `
    <button class="bot-btn${item.id === 'home' ? ' active' : ''}" data-id="${item.id}" onclick="navigate('${item.id}')">
      <span class="bot-ic">${item.ic}</span>
      <span class="bot-lbl">${item.l.split(' ')[0]}</span>
    </button>
  `).join('');
        }

        /* ═══════════════════════════════════════════
           HOME PAGE
        ═══════════════════════════════════════════ */
        const HERO_SLIDES = [
            { img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&q=80', city: 'Tokyo', sub: 'Kota yang tak pernah tidur' },
            { img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&q=80', city: 'Kamakura', sub: 'Buddha & Pantai Tersembunyi' },
            { img: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=1600&q=80', city: 'Shirakawa-go', sub: 'Desa Salju UNESCO Heritage' },
            { img: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=1600&q=80', city: 'Ginzan Onsen', sub: 'Jiwa Jepang yang Sesungguhnya' },
        ];

        function initHome() {
            // slides
            const slides = document.getElementById('hero-slides');
            slides.innerHTML = HERO_SLIDES.map((s, i) => `
    <div class="hero-slide${i === 0 ? ' active' : ''}" id="hslide-${i}">
      <div class="hero-bg" style="background-image:url('${s.img}')"></div>
    </div>
  `).join('');
            // dots
            const dots = document.getElementById('hero-dots');
            dots.innerHTML = HERO_SLIDES.map((_, i) => `<div class="hero-dot${i === 0 ? ' active' : ''}" onclick="setHeroSlide(${i})"></div>`).join('');
            // auto slide
            setInterval(() => setHeroSlide((state.heroSlide + 1) % HERO_SLIDES.length), 4800);
            // stats
            const stats = [
                { n: '8+', l: 'Hidden Gems', s: 'Destinasi tersembunyi', ic: '💎' },
                { n: '30+', l: 'Halal Spots', s: 'Verified halal food', ic: '🕌' },
                { n: '¥3,000', l: 'Avg Budget/Hari', s: 'Backpacker style', ic: '💴' },
                { n: 'IDR & JPY', l: 'Dual Currency', s: 'Simulator & planner', ic: '💱' },
                { n: '12 Tab', l: 'Fitur Lengkap', s: 'Dashboard premium', ic: '⚡' },
            ];
            document.getElementById('home-stats').innerHTML = stats.map(s => `
    <div class="card" style="padding:1.4rem;text-align:center">
      <div style="font-size:1.9rem;margin-bottom:.4rem">${s.ic}</div>
      <div style="font-family:'Playfair Display';font-size:1.9rem;font-weight:700;color:var(--s);line-height:1">${s.n}</div>
      <div style="font-size:13px;font-weight:600;color:var(--t);margin-top:4px">${s.l}</div>
      <div style="font-size:11px;color:var(--t3);margin-top:2px">${s.s}</div>
    </div>
  `).join('');
            // features
            const descs = { gems: '8 hidden gems sakura & winter mode, crowd level, Google Maps', halal: 'Halal certified di Tokyo, Osaka, Kyoto, Hokkaido', sim: 'Simulasi hemat makan ¥ JPY & Rp IDR real-time dengan chart', budget: 'Planner: flight, hotel, makan, transport, wisata, shopping', preset: 'Itinerary & budget preset 7 hari siap pakai', transport: 'Biaya kereta, Shinkansen, JR Pass dalam ¥ & IDR', currency: 'Kalkulator kurs IDR ↔ JPY + referensi biaya', weather: 'Grafik suhu, hujan, festival & kepadatan per bulan', prep: 'Checklist paspor, visa, packing, custom & oleh-oleh', tips: 'Frasa Jepang, etika, SIM card & panduan Muslim', planning: '7-day itinerary per area + foto destinasi + 3 pilihan budget' };
            document.getElementById('home-features').innerHTML = NAV.filter(n => n.id !== 'home').map(item => `
    <div class="card hover clickable" style="padding:1.4rem" onclick="navigate('${item.id}')">
      <div style="font-size:2rem;margin-bottom:.65rem">${item.ic}</div>
      <div style="font-size:15px;font-weight:600;color:var(--t);margin-bottom:5px">${item.l}</div>
      <div style="font-size:12px;color:var(--t3);line-height:1.6">${descs[item.id] || 'Panduan lengkap'}</div>
      <div style="margin-top:.9rem;color:var(--s);font-size:12px;font-weight:500">Buka →</div>
    </div>
  `).join('');
        }

        function setHeroSlide(i) {
            document.querySelectorAll('.hero-slide').forEach((s, j) => s.classList.toggle('active', j === i));
            document.querySelectorAll('.hero-dot').forEach((d, j) => d.classList.toggle('active', j === i));
            state.heroSlide = i;
            const s = HERO_SLIDES[i];
            document.getElementById('hero-city-sub').textContent = `${s.city} — ${s.sub}`;
        }

        /* ═══════════════════════════════════════════
           GEMS
        ═══════════════════════════════════════════ */
        function setSeason(s) {
            state.gemSeason = s;
            document.getElementById('btn-spring').classList.toggle('active', s === 'spring');
            document.getElementById('btn-winter').classList.toggle('active', s === 'winter');
            renderGems();
        }

        function renderGems() {
            const grid = document.getElementById('gems-grid');
            grid.innerHTML = gemsData.map(g => gemCardHTML(g, state.gemSeason)).join('');
        }

        function crowdColor(pct) { return pct < 40 ? '#3ddc84' : pct < 65 ? '#f5a623' : '#f08080'; }

        function gemCardHTML(g, season) {
            const img = season === 'winter' ? g.imgWinter || g.imgW : g.imgSpring || g.img;
            const desc = season === 'winter' ? g.descW || g.desc : g.desc;
            const temp = season === 'winter' ? g.tempW || '5°C' : g.tempS || '15°C';
            const seas = season === 'winter' ? g.seasonW || 'Winter' : g.season || 'Spring';
            const cc = crowdColor(g.crowdPct || g.crowd);
            return `
    <div class="gem-card" onclick="openGemDetail('${g.id}')">
      <div class="gem-img">
        <div class="gem-img-bg" style="background-image:url('${img}')"></div>
        <div class="gem-img-grad"></div>
        <div class="gem-img-top">
          ${g.budget ? '<span class="chip chip-g">💰 Budget</span>' : ''}
          <span class="chip ${(g.crowdPct || g.crowd) < 40 ? 'chip-j' : (g.crowdPct || g.crowd) < 65 ? 'chip-o' : 'chip-r'}">${(g.crowdPct || g.crowd) < 40 ? '🟢 Sepi' : (g.crowdPct || g.crowd) < 65 ? '🟡 Sedang' : '🔴 Ramai'}</span>
        </div>
        <div class="gem-img-topR"><span class="chip chip-s">${seas}</span></div>
        <div class="gem-img-bottom">
          <div class="gem-name">${g.name}</div>
          <div class="gem-region">${g.region} • ${temp}</div>
        </div>
      </div>
      <div class="gem-body">
        <p class="gem-desc">${desc}</p>
        <div class="gem-cost-row">
          <span class="gem-cost">💴 
            <span class="price-jpy">${g.costStr || `¥${fmt(g.costRaw || g.cost)}`}</span>
            <span class="price-separator">≈</span>
            <span class="price-idr">${idrStrRange(g.costStr, g.costRaw || g.cost)}</span>
            /hari
          </span>
        </div>
        <div class="crowd-bar-wrap">
          <div class="crowd-track"><div class="crowd-fill" style="width:${(g.crowdPct || g.crowd)}%;background:${cc}"></div></div>
          <span class="crowd-pct">${(g.crowdPct || g.crowd)}%</span>
        </div>
        <div class="gem-tags">${g.activities.slice(0, 3).map(a => `<span class="gem-tag">${a}</span>`).join('')}</div>
        <div class="gem-actions">
          <button class="gem-btn gem-btn-maps" onclick="event.stopPropagation();window.open('https://maps.google.com/?q=${encodeURIComponent(g.name + ' Japan')}','_blank')">📍 Maps</button>
          <button class="gem-btn gem-btn-detail">Detail →</button>
        </div>
      </div>
    </div>
  `;
        }

        function openGemDetail(id) {
            state.gemDetailId = id;
            state.gemDetailSeason = 'spring';
            renderGemDetail();
            document.getElementById('gem-detail').classList.add('open');
            document.getElementById('gem-detail').scrollTop = 0;
        }

        function closeGemDetail() {
            document.getElementById('gem-detail').classList.remove('open');
            state.gemDetailId = null;
        }

        function setGemDetailSeason(s) {
            state.gemDetailSeason = s;
            document.getElementById('gd-spring').classList.toggle('active', s === 'spring');
            document.getElementById('gd-winter').classList.toggle('active', s === 'winter');
            renderGemDetail();
        }

        function renderGemDetail() {
            const g = gemsData.find(x => x.id === state.gemDetailId);
            if (!g) return;
            const s = state.gemDetailSeason;
            const img = s === 'winter' ? g.imgWinter || g.imgW : g.imgSpring || g.img;
            const desc = s === 'winter' ? g.descW || g.desc : g.desc;
            const temp = s === 'winter' ? g.tempW || '5°C' : g.tempS || '15°C';
            const clothing = s === 'winter' ? g.clothingW || 'Nyaman' : g.clothingS || 'Nyaman';
            document.getElementById('gd-bg').style.backgroundImage = `url('${img}')`;
            document.getElementById('gd-name').textContent = `${g.emoji} ${g.name}`;
            document.getElementById('gd-meta').textContent = `${g.region} • ${temp} • ${clothing}`;
            document.getElementById('gd-body').innerHTML = `
    <div class="grid-2" style="margin-bottom:1.15rem; gap: 0.75rem;">
      <div class="card" style="padding:1.2rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);">
        <div style="font-size:10px;color:var(--s);font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.5rem">📍 Lokasi & Akses</div>
        <div style="font-size:14px;color:var(--t);font-weight:600;margin-bottom:5px">🏙️ ${g.region || 'Japan'}</div>
        <div style="font-size:12px;color:var(--t2);display:flex;gap:6px"><span>🚆</span><span>${g.transport || 'Akses Kereta'}</span></div>
      </div>
      <div class="card" style="padding:1.2rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);">
        <div style="font-size:10px;color:var(--j);font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.5rem">⛅ Cuaca & Pakaian (${s === 'winter' ? 'Winter' : 'Spring'})</div>
        <div style="font-size:14px;color:var(--t);font-weight:600;margin-bottom:5px">🌡️ ${temp}</div>
        <div style="font-size:12px;color:var(--t2);display:flex;gap:6px"><span>🧥</span><span>${clothing}</span></div>
      </div>
    </div>
    <div class="grid-2" style="margin-bottom:1.15rem">
      <div class="card col-full" style="padding:1.5rem"><p style="font-size:15px;color:var(--t2);line-height:1.85">${desc}</p></div>
      <div class="card" style="padding:1.4rem">
        <div style="font-size:11px;color:var(--s);font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.75rem">🎯 Aktivitas</div>
        ${g.activities.map(a => `<div style="padding:7px 0;border-bottom:1px solid rgba(255,255,255,.05);color:var(--t);font-size:13px;display:flex;gap:8px"><span style="color:var(--s)">→</span>${a}</div>`).join('')}
      </div>
      <div class="card" style="padding:1.4rem">
        <div style="font-size:11px;color:var(--g);font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.75rem">🍽️ Local Food</div>
        ${g.food.map(f => renderFoodItemHTML(f)).join('')}
      </div>
      <div class="card" style="padding:1.4rem">
        <div style="font-size:11px;color:var(--t3);font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.75rem">📊 Info Trip</div>
        <div style="display:flex;flex-direction:column;gap:13px">
          <div><div style="font-size:10px;color:var(--t3);margin-bottom:3px">ESTIMASI BIAYA/HARI</div><div style="font-size:18px;font-weight:700;color:var(--g)">
            <span class="price-jpy">${g.costStr || `¥${fmt(g.costRaw || g.cost)}`}</span>
            <span class="price-separator">≈</span>
            <span class="price-idr">${idrStrRange(g.costStr, g.costRaw || g.cost)}</span>
            /hari
          </div></div>
          <div><div style="font-size:10px;color:var(--t3);margin-bottom:5px">KEPADATAN</div><div class="crowd-bar-wrap"><div class="crowd-track"><div class="crowd-fill" style="width:${(g.crowdPct || g.crowd)}%;background:${crowdColor(g.crowdPct || g.crowd)}"></div></div><span class="crowd-pct">${(g.crowdPct || g.crowd)}%</span></div></div>
          <div><div style="font-size:10px;color:var(--t3);margin-bottom:3px">MUSIM TERBAIK</div><div style="font-size:13px;color:var(--t)">${g.season}</div></div>
        </div>
      </div>
      <button onclick="window.open('https://maps.google.com/?q=${encodeURIComponent(g.name + ' Japan')}','_blank')" style="grid-column:1/-1;width:100%;padding:13px;border-radius:11px;border:1px solid rgba(244,167,185,.28);background:var(--s3);color:var(--s);font-size:14px;font-weight:600;cursor:pointer">📍 Buka di Google Maps → ${g.name}</button>
    </div>
  `;
        }

        /* ═══════════════════════════════════════════
           HALAL
        ═══════════════════════════════════════════ */
        function renderHalalTabs() {
            const tabs = ['tokyo', 'osaka', 'kyoto', 'hokkaido'];
            const labels = { 'tokyo': '🗼 Tokyo', 'osaka': '🏯 Osaka', 'kyoto': '⛩️ Kyoto', 'hokkaido': '❄️ Hokkaido' };
            document.getElementById('halal-tabs').innerHTML = tabs.map(c => `<button class="city-tab${c === state.halalCity ? ' active' : ''}" onclick="setHalalCity('${c}')">${labels[c]}</button>`).join('');
        }

        function setHalalCity(c) {
            state.halalCity = c;
            renderHalalTabs();
            renderHalal(c);
        }

        function renderHalal(city) {
            renderHalalTabs();
            const certChip = { 'certified': 'chip-j', 'muslim-friendly': 'chip-b', 'muslim': 'chip-b', 'no-pork': 'chip-g', 'nopork': 'chip-g' };
            const grid = document.getElementById('halal-grid');
            const restaurants = halalDataCache.halalRestaurants[city] || [];
            grid.innerHTML = restaurants.map(r => {
                const ratingNum = r.rating || null;
                const ratingDisplay = ratingNum
                    ? `<span style="color:#f4a7b9;font-weight:700;font-size:13px">${ratingNum}</span><span style="font-size:10px;color:var(--t3)"> /5</span>`
                    : `<span style="color:var(--j);font-size:11px">✅ Rekomendasi</span>`;
                const areaDisplay = r.area || r.location || '';
                const mapQ = encodeURIComponent(r.name + ' ' + areaDisplay + ' Japan');
                const certLabel = r.certLabel || r.certL || '✅ Halal';
                return `
    <div class="food-card" style="overflow:hidden">
      <div class="food-img" style="background-image:url('${r.img}');transition:transform 0.45s ease" onmouseover="this.style.transform='scale(1.07)'" onmouseout="this.style.transform='scale(1)'">
        <div class="food-img-grad"></div>
        <div class="food-cert"><span class="chip ${certChip[r.cert] || 'chip-j'}">${certLabel}</span></div>
        <div style="position:absolute;bottom:8px;left:10px;z-index:2;background:rgba(0,0,0,0.52);backdrop-filter:blur(5px);border-radius:6px;padding:3px 9px;font-size:11px;color:rgba(255,255,255,0.88)">📍 ${areaDisplay}</div>
        <div class="food-title">${r.name}</div>
      </div>
      <div class="food-body">
        <div class="food-row">
          <span class="food-price">
            <span class="price-jpy">${r.price}</span>
            <span class="price-separator">≈</span>
            <span class="price-idr">${idrStrRange(r.price, r.priceRaw || 0)}</span>
          </span>
          <span class="food-rating" style="display:flex;align-items:center;gap:3px">⭐ ${ratingDisplay}</span>
        </div>
        <div class="food-menu" style="line-height:1.6">📋 ${r.menu}</div>
        <div class="food-loc" style="font-size:11px;margin-top:4px;opacity:.75">📍 ${r.location || r.area}</div>
        <button class="food-maps-btn" onclick="window.open('https://maps.google.com/?q=${mapQ}','_blank')">🗺️ Google Maps</button>
      </div>
    </div>
  `;
            }).join('');

            const konbini = (halalDataCache.konbiniData || []);
            const mushollaList = halalDataCache.mushollaGuide || [
                'Tokyo Camii (Yoyogi/Shibuya) — masjid terbesar, fasilitas lengkap',
                'Download Muslim Pro / HalalNavi — cari musholla & halal food terdekat',
                'Bawa sajadah lipat & mukena sendiri untuk ketenangan'
            ];

            document.getElementById('halal-extra').innerHTML = `
    <div class="card" style="padding:1.4rem;margin-bottom:1.15rem">
      <h3 style="color:var(--t);margin-bottom:1rem;font-size:14px;font-weight:600">🏪 Pilihan Halal di Konbini</h3>
      <div class="grid-3">
        ${konbini.map(k => `<div style="padding:.9rem;background:rgba(255,255,255,.025);border-radius:10px;border:1px solid rgba(255,255,255,.05)">
          <div style="font-size:1.7rem;margin-bottom:6px">${k.logo}</div>
          <div style="font-weight:600;color:var(--t);margin-bottom:6px;font-size:13px">${k.name || k.n}</div>
          ${(k.items || []).map(i => `<div style="font-size:11px;color:var(--t3);padding:2px 0">• ${i}</div>`).join('')}
        </div>`).join('')}
      </div>
    </div>
    <div class="card" style="padding:1.2rem;background:rgba(61,220,132,.04);border-color:rgba(61,220,132,.12)">
      <h4 style="color:var(--j);font-size:13px;margin-bottom:.7rem">🕌 Panduan Sholat & Musholla</h4>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:.35rem">
        ${mushollaList.map(t => `<div style="font-size:12px;color:var(--t2);display:flex;gap:7px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span style="color:var(--j);flex-shrink:0">→</span>${t}</div>`).join('')}
      </div>
    </div>
  `;
        }

        /* ═══════════════════════════════════════════
           SIMULATOR (Chart.js)
        ═══════════════════════════════════════════ */
        function initSim() {
            const sl_days = document.getElementById('sl-days');
            const sl_kb = document.getElementById('sl-kb');
            const sl_br = document.getElementById('sl-br');
            sl_days.value = state.simDays; sl_kb.value = state.simKb; sl_br.value = state.simBr;
            updateSim();
        }

        function updateSim() {
            const days = parseInt(document.getElementById('sl-days').value) || 7;
            const kb = Math.min(parseInt(document.getElementById('sl-kb').value) || 2, days);
            const br = Math.min(parseInt(document.getElementById('sl-br').value) || 3, Math.max(0, days - kb));
            const mid = Math.max(0, days - kb - br);
            state.simDays = days; state.simKb = kb; state.simBr = br;
            document.getElementById('sl-kb').max = days;
            document.getElementById('sl-br').max = Math.max(0, days - kb);
            document.getElementById('sl-kb-max').textContent = days;
            document.getElementById('sl-br-max').textContent = Math.max(0, days - kb);
            document.getElementById('sv-days').textContent = days;
            document.getElementById('sv-kb').textContent = kb;
            document.getElementById('sv-br').textContent = br;
            const P = { kb: 1800, br: 3000, mid: 5000 };
            const mix = kb * P.kb + br * P.br + mid * P.mid;
            const full = days * P.mid;
            const allKb = days * P.kb;
            const sav = full - mix;
            const savPct = Math.round((sav / full) * 100);
            const showSimPrice = (jpyElId, idrElId, val) => {
                const jpyEl = document.getElementById(jpyElId);
                const idrEl = document.getElementById(idrElId);
                if (currencyMode === 'jpy') {
                    if (jpyEl) jpyEl.textContent = `¥${fmt(val)}`;
                    if (idrEl) idrEl.textContent = '';
                } else if (currencyMode === 'idr') {
                    if (jpyEl) jpyEl.textContent = `Rp ${fmt(val * IDR)}`;
                    if (idrEl) idrEl.textContent = '';
                } else {
                    if (jpyEl) jpyEl.textContent = `¥${fmt(val)}`;
                    if (idrEl) idrEl.textContent = `≈ Rp ${fmt(val * IDR)}`;
                }
            };
            showSimPrice('sim-sav-jpy', 'sim-sav-idr', sav);
            showSimPrice('sim-mix-jpy', 'sim-mix-idr', mix);
            showSimPrice('sim-full-jpy', 'sim-full-idr', full);
            document.getElementById('sim-sav-pct').textContent = `vs semua mid-range • ${savPct}% lebih hemat`;
            document.getElementById('sim-breakdown').innerHTML = `
    ${[{ l: 'Konbini', v: kb, p: P.kb }, { l: 'Budget Rest.', v: br, p: P.br }, { l: 'Mid-range', v: mid, p: P.mid }].map(({ l, v, p }) => `
    <div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.04)">
      <span style="color:var(--t2)">${l}: ${v}h</span>
      <div style="text-align:right"><span style="color:var(--g);font-weight:600">${jpy(v * p)}</span><span style="color:var(--t3);font-size:10px;display:block">${idrStr(v * p)}</span></div>
    </div>`).join('')}
  `;
            // Chart
            const ctx = document.getElementById('sim-chart');
            if (!ctx) return;
            if (state.simChart) { state.simChart.destroy(); }
            state.simChart = new Chart(ctx, {
                type: 'bar',
                data: { labels: ['Semua Mid-range', 'Strategi Kamu', 'Semua Konbini'], datasets: [{ data: [full, mix, allKb], backgroundColor: ['#f08080', '#f4a7b9', '#3ddc84'], borderRadius: 6, borderSkipped: false }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => {
                    if (currencyMode === 'jpy') return `¥${fmt(c.raw)}`;
                    if (currencyMode === 'idr') return `Rp ${fmt(c.raw * IDR)}`;
                    return `¥${fmt(c.raw)} ≈ Rp ${fmt(c.raw * IDR)}`;
                } } } }, scales: { x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#52496a', font: { size: 10 } } }, y: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#52496a', font: { size: 10 }, callback: (v) => `¥${(v / 1000).toFixed(0)}k` } } } }
            });
        }

        /* ═══════════════════════════════════════════
           BUDGET PLANNER (Chart.js)
        ═══════════════════════════════════════════ */
        const BUDGET_SLIDERS = [
            { k: 'days', l: '🗓 Durasi Trip', min: 3, max: 21, step: 1, isIDR: false, unit: 'hari' },
            { k: 'flightIDR', l: '✈️ Tiket Pesawat (IDR)', min: 2000000, max: 15000000, step: 100000, isIDR: true },
            { k: 'hotel', l: '🏨 Hotel per Malam (¥)', min: 2000, max: 30000, step: 500, isIDR: false },
            { k: 'food', l: '🍱 Makan per Hari (¥)', min: 1000, max: 15000, step: 500, isIDR: false },
            { k: 'transport', l: '🚆 Transportasi Total (¥)', min: 5000, max: 120000, step: 1000, isIDR: false },
            { k: 'attraction', l: '🎭 Tiket Wisata (¥)', min: 0, max: 50000, step: 500, isIDR: false },
            { k: 'shopping', l: '🛍️ Shopping (¥)', min: 0, max: 200000, step: 1000, isIDR: false },
            { k: 'emergency', l: '🆘 Dana Darurat (¥)', min: 5000, max: 50000, step: 1000, isIDR: false },
        ];

        function initBudget() {
            const wrap = document.getElementById('budget-sliders');
            wrap.innerHTML = BUDGET_SLIDERS.map(({ k, l, min, max, step, isIDR, unit }) => `
    <div class="slider-wrap">
      <div class="slider-label-row">
        <span class="slider-label">${l}</span>
        <div style="text-align:right">
          <span style="font-size:13px;color:${isIDR ? 'var(--j)' : 'var(--g)'};font-weight:700" id="bv-${k}">${isIDR ? fmtIDR(state.budgetVals[k]) : k === 'days' ? state.budgetVals[k] + ' hari' : jpy(state.budgetVals[k])}</span>
          ${!isIDR && k !== 'days' ? `<span style="display:block;font-size:10px;color:var(--t3)" id="bv-${k}-idr">${idrStr(state.budgetVals[k])}</span>` : ''}
        </div>
      </div>
      <input type="range" min="${min}" max="${max}" step="${step}" value="${state.budgetVals[k]}" oninput="updateBudget('${k}',this.value)">
    </div>
  `).join('');
            updateBudgetCalc();
        }

        function updateBudget(k, val) {
            state.budgetVals[k] = Number(val);
            const el = document.getElementById(`bv-${k}`);
            const idr_el = document.getElementById(`bv-${k}-idr`);
            const sv = BUDGET_SLIDERS.find(s => s.k === k);
            if (el) {
                if (sv.isIDR) el.textContent = fmtIDR(state.budgetVals[k]);
                else if (k === 'days') el.textContent = val + ' hari';
                else el.textContent = jpy(state.budgetVals[k]);
            }
            if (idr_el && !sv.isIDR && k !== 'days') idr_el.textContent = idrStr(state.budgetVals[k]);
            updateBudgetCalc();
        }

        function updateBudgetCalc() {
            const v = state.budgetVals;
            const hJPY = v.hotel * v.days, fJPY = v.food * v.days;
            const totalJPY = hJPY + fJPY + v.transport + v.attraction + v.shopping + v.emergency;
            const totalIDR = v.flightIDR + totalJPY * IDR;
            const flightJPY = Math.round(v.flightIDR / IDR);
            if (currencyMode === 'jpy') {
                document.getElementById('bud-total-jpy').textContent = `¥${fmt(totalJPY)}`;
                document.getElementById('bud-total-idr').textContent = `¥${fmt(totalIDR / IDR)}`;
                document.getElementById('bud-total-sub').textContent = `Total ${v.days} hari termasuk pesawat (estimasi JPY)`;
                document.getElementById('bud-perday').textContent = `¥${fmt(Math.round(totalJPY / v.days))}/hari`;
                document.getElementById('bud-perday-idr').textContent = '';
            } else if (currencyMode === 'idr') {
                document.getElementById('bud-total-jpy').textContent = '';
                document.getElementById('bud-total-idr').textContent = `Rp ${fmt(totalIDR)}`;
                document.getElementById('bud-total-sub').textContent = `Total ${v.days} hari termasuk pesawat`;
                document.getElementById('bud-perday').textContent = '';
                document.getElementById('bud-perday-idr').textContent = `Rp ${fmt(Math.round(totalIDR / v.days))}/hari`;
            } else {
                document.getElementById('bud-total-jpy').textContent = `¥${fmt(totalJPY)}`;
                document.getElementById('bud-total-idr').textContent = `Rp ${fmt(totalIDR)}`;
                document.getElementById('bud-total-sub').textContent = `Total ${v.days} hari termasuk pesawat`;
                document.getElementById('bud-perday').textContent = `¥${fmt(Math.round(totalJPY / v.days))}/hari`;
                document.getElementById('bud-perday-idr').textContent = `≈ Rp ${fmt(Math.round(totalIDR / v.days))}/hari`;
            }
            const bk = [
                { l: '✈️ Tiket Pesawat', eq: flightJPY, fill: '#f4a7b9' },
                { l: '🏨 Hotel', eq: hJPY, fill: '#d4af37' },
                { l: '🍱 Makan', eq: fJPY, fill: '#3ddc84' },
                { l: '🚆 Transport', eq: v.transport, fill: '#6699ff' },
                { l: '🎭 Wisata', eq: v.attraction, fill: '#f5a623' },
                { l: '🛍️ Shopping', eq: v.shopping, fill: '#c084fc' },
                { l: '🆘 Darurat', eq: v.emergency, fill: '#94a3b8' },
            ];
            const grand = totalJPY + flightJPY;
            // bars
            document.getElementById('budget-bars').innerHTML = bk.map(b => {
                const pct = grand > 0 ? Math.round((b.eq / grand) * 100) : 0;
                return `<div style="margin-bottom:.5rem"><div style="display:flex;justify-content:space-between;margin-bottom:3px"><span style="font-size:11px;color:var(--t2)">${b.l}</span><span style="font-size:10px;color:var(--t3)">${pct}%</span></div><div style="height:5px;background:rgba(255,255,255,.07);border-radius:3px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${b.fill};border-radius:3px;transition:width .6s"></div></div></div>`;
            }).join('');
            // table
            document.getElementById('budget-tbody').innerHTML = bk.map(b => {
                const pct = grand > 0 ? Math.round((b.eq / grand) * 100) : 0;
                return `<tr>
                    <td style="color:var(--t);font-weight:500;padding:8px 10px">${b.l}</td>
                    <td class="price-jpy c-g" style="padding:8px 10px">¥${fmt(b.eq)}</td>
                    <td class="price-idr" style="color:var(--j);padding:8px 10px">Rp ${fmt(b.eq * IDR)}</td>
                    <td style="padding:8px 10px"><div style="display:flex;align-items:center;gap:5px"><div style="width:44px;height:4px;background:rgba(255,255,255,.08);border-radius:2px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${b.fill}"></div></div><span style="color:var(--t3);font-size:10px">${pct}%</span></div></td>
                </tr>`;
            }).join('') + `<tr style="border-top:2px solid rgba(255,255,255,.12)">
                <td style="color:var(--t);font-weight:700;font-size:13px;padding:9px 10px">TOTAL</td>
                <td class="price-jpy" style="color:var(--s);font-weight:700;font-size:15px;padding:9px 10px">¥${fmt(totalJPY)}</td>
                <td class="price-idr" style="color:var(--g);font-weight:700;padding:9px 10px">Rp ${fmt(totalIDR)}</td>
                <td style="color:var(--t3);font-size:11px;padding:9px 10px">incl. pesawat</td>
            </tr>`;
            // doughnut chart
            const ctx = document.getElementById('budget-chart');
            if (!ctx) return;
            if (state.budgetChart) { state.budgetChart.destroy(); }
            state.budgetChart = new Chart(ctx, {
                type: 'doughnut',
                data: { labels: bk.map(b => b.l), datasets: [{ data: bk.map(b => b.eq), backgroundColor: bk.map(b => b.fill), borderWidth: 0, hoverOffset: 6 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, labels: { color: '#9d94b0', font: { size: 11 }, padding: 12 } }, tooltip: { callbacks: { label: (c) => {
                    if (currencyMode === 'jpy') return `${c.label}: ¥${fmt(c.raw)}`;
                    if (currencyMode === 'idr') return `${c.label}: Rp ${fmt(c.raw * IDR)}`;
                    return `${c.label}: ${jpy(c.raw)} ≈ ${idrStr(c.raw)}`;
                } } } } }
            });
        }

        /* ═══════════════════════════════════════════
           PRESET
        ═══════════════════════════════════════════ */
        function renderPreset() {
            const P = { flight: 5500000, hotel: 42000, transport: 55000, food: 28000, attraction: 15000, shopping: 20000, emergency: 10000, days: 7 };
            const totalJPY = P.hotel + P.transport + P.food + P.attraction + P.shopping + P.emergency;
            const totalIDR = P.flight + totalJPY * IDR;
            const items = [
                { ic: '✈️', l: 'Tiket Pesawat (PP)', desc: 'CGK–NRT kelas ekonomi', eq: Math.round(P.flight / IDR), idr: P.flight },
                { ic: '🏨', l: 'Hotel 7 Malam', desc: 'Capsule/Business Hotel ★★★', eq: P.hotel, idr: P.hotel * IDR },
                { ic: '🚆', l: 'Transportasi', desc: 'JR Pass 7h + IC Card + bus bandara', eq: P.transport, idr: P.transport * IDR },
                { ic: '🍱', l: 'Makan 7 Hari', desc: 'Mix konbini + budget restaurant', eq: P.food, idr: P.food * IDR },
                { ic: '🎭', l: 'Tiket Wisata', desc: 'Kuil, museum, Fuji, dsb', eq: P.attraction, idr: P.attraction * IDR },
                { ic: '🛍️', l: 'Shopping', desc: 'Tax free shopping budget', eq: P.shopping, idr: P.shopping * IDR },
                { ic: '🆘', l: 'Dana Darurat', desc: 'Situasi tak terduga', eq: P.emergency, idr: P.emergency * IDR },
            ];
            const route = ['Hari 1: Tiba Tokyo — Asakusa, Akihabara, ramen malam', 'Hari 2: Tokyo — Shinjuku, Shibuya, Harajuku', 'Hari 3: Kamakura day trip — Buddha, Enoshima', 'Hari 4: Shinkansen ke Kyoto — Fushimi Inari, Gion', 'Hari 5: Kyoto — Arashiyama, Nishiki, Kinkakuji', 'Hari 6: Kyoto → Osaka — Dotonbori, Namba shopping', 'Hari 7: Osaka morning → Bandara, pulang'];
            document.getElementById('preset-content').innerHTML = `
    <div class="card" style="padding:1.7rem;background:rgba(244,167,185,.04);border-color:rgba(244,167,185,.18)">
      <div style="text-align:center;margin-bottom:1.4rem">
        <div style="font-family:'Noto Serif JP';font-size:.85rem;color:var(--t3);letter-spacing:.1em;margin-bottom:4px">TOTAL ESTIMASI BIAYA</div>
        <div style="font-family:'Playfair Display';font-size:3.3rem;font-weight:900;color:var(--s);line-height:1">${jpy(totalJPY)}</div>
        <div style="font-size:13px;color:var(--t3);margin:4px 0">belum termasuk pesawat</div>
        <div style="font-family:'Playfair Display';font-size:2rem;font-weight:700;color:var(--g)">${fmtIDR(totalIDR)}</div>
        <div style="font-size:11px;color:var(--t3);margin-top:3px">total termasuk tiket pesawat</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.7rem">
        ${[{ l: 'Durasi', v: P.days + ' hari' }, { l: 'Rute', v: '3 Kota' }, { l: 'Budget/Hari', v: jpy(Math.round(totalJPY / P.days)) }, { l: 'Akomodasi', v: 'Budget ★★★' }].map(({ l, v }) => `<div style="padding:.7rem;background:rgba(255,255,255,.04);border-radius:8px;text-align:center"><div style="font-size:10px;color:var(--t3);margin-bottom:3px">${l}</div><div style="font-size:13px;font-weight:600;color:var(--t)">${v}</div></div>`).join('')}
      </div>
    </div>
    <div class="card" style="padding:1.4rem">
      <div style="font-size:11px;color:var(--s);font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:1rem">🗺️ Rute 7 Hari</div>
      <div style="font-size:12px;color:var(--t2);margin-bottom:1rem;padding:6px 11px;background:var(--s3);border-radius:7px;font-weight:500">Tokyo (3h) → Kyoto (2h) → Osaka (2h)</div>
      ${route.map((r, i) => `<div style="display:flex;gap:.7rem;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04);align-items:flex-start"><span style="width:21px;height:21px;border-radius:50%;background:var(--s3);color:var(--s);font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">${i + 1}</span><span style="font-size:12px;color:var(--t2);line-height:1.5">${r}</span></div>`).join('')}
    </div>
    <div class="card col-full" style="padding:1.2rem">
      <h3 style="font-size:13px;font-weight:600;color:var(--t);margin-bottom:.75rem">📊 Rincian Biaya Preset</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:.7rem">
        ${items.map(item => `<div style="display:flex;align-items:flex-start;gap:.7rem;padding:.8rem;background:rgba(255,255,255,.025);border-radius:10px;border:1px solid rgba(255,255,255,.05)"><span style="font-size:1.4rem;flex-shrink:0">${item.ic}</span><div style="flex:1"><div style="font-size:13px;font-weight:600;color:var(--t)">${item.l}</div><div style="font-size:11px;color:var(--t3);margin-bottom:4px">${item.desc}</div><div style="display:flex;gap:.75rem;align-items:center">${currencyMode === 'jpy' ? `<span style="font-size:14px;color:var(--g);font-weight:700">${jpy(item.eq)}</span>` : currencyMode === 'idr' ? `<span style="font-size:14px;color:var(--g);font-weight:700">${jpy(item.eq)}</span>` : `<span style="font-size:14px;color:var(--g);font-weight:700">${jpy(item.eq)}</span><span style="font-size:11px;color:var(--t3)">≈ ${idrStr(item.eq)}</span>`}</div></div></div>`).join('')}
      </div>
      <div style="margin-top:1rem;padding:.9rem 1rem;background:rgba(61,220,132,.05);border:1px solid rgba(61,220,132,.15);border-radius:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem">
        <div><div style="font-size:11px;color:var(--t3)">Grand Total (termasuk pesawat)</div><div style="font-family:'Playfair Display';font-size:1.75rem;font-weight:700;color:var(--j)">${fmtIDR(totalIDR)}</div></div>
        <div style="text-align:right"><div style="font-size:11px;color:var(--t3)">Komponen JPY</div><div style="font-size:1.35rem;font-weight:700;color:var(--g)">${jpy(totalJPY)}</div></div>
      </div>
    </div>
  `;
        }

        /* ═══════════════════════════════════════════
           TRANSPORT
        ═══════════════════════════════════════════ */
        function renderTransport() {
            document.getElementById('transport-grid').innerHTML = TR.map(t => `
    <div class="card" style="padding:1.2rem">
      <div style="font-size:1.7rem;margin-bottom:.45rem">${t.ic}</div>
      <div style="font-size:14px;font-weight:600;color:var(--t);margin-bottom:3px">${t.n}</div>
      <div style="font-size:11px;color:var(--t3);margin-bottom:.65rem;line-height:1.5">${t.note}</div>
      <div style="display:flex;gap:.9rem;align-items:baseline">
        <span style="font-size:20px;font-weight:700;color:var(--g)">${jpy(t.y)}</span>
        ${currencyMode === 'dual' ? `<span style="font-size:13px;color:var(--j);font-weight:500">${idrStr(t.y)}</span>` : ''}
      </div>
    </div>
  `).join('');
            document.getElementById('transport-extra').innerHTML = `
    <div class="card" style="padding:1.4rem;margin-bottom:1.2rem">
      <h3 style="font-size:14px;font-weight:600;color:var(--t);margin-bottom:1rem">🎟️ Kapan Worth It Beli JR Pass?</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem">
        ${[{ route: 'Tokyo → Kyoto → Osaka (PP)', worth: true, note: 'Worth it! Hemat ~¥29,440 vs beli terpisah' },
                { route: 'Tokyo → Osaka → Hiroshima (PP)', worth: true, note: 'Sangat worth it untuk rute panjang' },
                { route: 'Hanya di Tokyo (subway)', worth: false, note: 'Tidak perlu JR Pass — IC Card sudah cukup' },
                ].map(r => `<div style="padding:1rem;background:${r.worth ? 'rgba(61,220,132,.06)' : 'rgba(240,100,100,.06)'};border:1px solid ${r.worth ? 'rgba(61,220,132,.18)' : 'rgba(240,100,100,.18)'};border-radius:10px"><div style="font-size:13px;font-weight:600;color:var(--t);margin-bottom:4px">${r.route}</div><div style="font-size:12px;color:var(--t3);margin-bottom:.45rem">${r.note}</div><div style="font-size:12px;color:${r.worth ? 'var(--j)' : '#f08080'};font-weight:600">${r.worth ? '✅ Worth It' : '❌ Tidak Perlu'}</div></div>`).join('')}
      </div>
    </div>
    <div class="card" style="padding:1.2rem;background:rgba(212,175,55,.05);border-color:rgba(212,175,55,.14)">
      <h3 style="font-size:14px;font-weight:600;color:var(--g);margin-bottom:.75rem">💳 Tips IC Card Suica/Pasmo</h3>
      ${['Beli di mesin vending bandara — ¥1,500 (termasuk ¥500 deposit refundable)', 'Top up di mesin "チャージ" di stasiun manapun — minimum ¥1,000', 'Berlaku untuk kereta, subway, bus kota, dan belanja di konbini!', 'Deposit ¥500 bisa dikembalikan saat pulang ke stasiun besar', 'Tambahkan ke Apple/Google Pay untuk kemudahan tanpa antri'].map(t => `<div style="display:flex;gap:7px;font-size:12px;color:var(--t2);padding:5px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span style="color:var(--g);flex-shrink:0">→</span>${t}</div>`).join('')}
    </div>
  `;
        }

        /* ═══════════════════════════════════════════
           CURRENCY
        ═══════════════════════════════════════════ */
        /* ═══════════════════════════════════════════
           NEW: CENTRAL YEN CURRENCY CONTROLLER & HANDLERS
        ═══════════════════════════════════════════ */
        window.applyCustomKurs = function() {
            const val = parseFloat(document.getElementById('setting-kurs-rate').value);
            if (isNaN(val) || val < 50 || val > 300) {
                alert('Silakan masukkan nilai kurs yang valid antara Rp50 dan Rp300.');
                return;
            }
            IDR = Math.round(val);
            localStorage.setItem('jpy_idr_rate', IDR);
            refreshCurrencyDependentUI();
        };

        window.setCurrencyDisplayMode = function(mode) {
            currencyMode = mode;
            localStorage.setItem('currency_mode', mode);
            refreshCurrencyDependentUI();
        };

        window.resetCurrencySettings = function() {
            IDR = DEFAULT_KURS;
            currencyMode = 'dual';
            localStorage.removeItem('jpy_idr_rate');
            localStorage.removeItem('currency_mode');
            
            const rateInput = document.getElementById('setting-kurs-rate');
            if (rateInput) rateInput.value = IDR;
            
            refreshCurrencyDependentUI();
        };

        window.refreshCurrencyDependentUI = function() {
            // Apply body classes
            document.body.classList.remove('currency-mode-dual', 'currency-mode-jpy', 'currency-mode-idr');
            document.body.classList.add(`currency-mode-${currencyMode}`);
            
            // Sync setting controls
            const rateInput = document.getElementById('setting-kurs-rate');
            if (rateInput) rateInput.value = IDR;
            
            const statusMsg = document.getElementById('currency-status-msg');
            if (statusMsg) {
                statusMsg.textContent = `1 JPY = Rp${IDR} (${currencyMode === 'dual' ? 'Yen + Rupiah' : currencyMode === 'jpy' ? 'Hanya Yen' : 'Hanya Rupiah'})`;
            }
            
            // Highlight display mode buttons
            ['dual', 'jpy', 'idr'].forEach(m => {
                const btn = document.getElementById(`btn-curr-${m}`);
                if (btn) {
                    if (m === currencyMode) btn.classList.add('active');
                    else btn.classList.remove('active');
                }
            });
            
            // Update subtext on calculator
            const sub = document.getElementById('curr-rate-sub');
            if (sub) sub.textContent = `Kurs referensi: 1 JPY ≈ Rp ${IDR}`;
            
            // Re-render UI components using new kurs
            renderGems();
            if (state.gemDetailId) {
                renderGemDetail();
            }
            renderHalal(state.halalCity);
            updateSim();
            updateBudgetCalc();
            renderPreset();
            renderTransport();
            renderPlanning();
            updateCurr();
        };

        function initCurrency() {
            updateCurr();
            document.getElementById('curr-examples').innerHTML = [
                { l: 'Makan 1 hari (konbini)', y: 1800 }, { l: 'Ramen di Ichiran', y: 1200 }, { l: 'Shinkansen Tokyo→Kyoto', y: 13320 },
                { l: 'JR Pass 7 Hari', y: 50000 }, { l: 'Hotel semalam (hostel)', y: 3000 }, { l: 'Hotel semalam (bintang 3)', y: 10000 },
                { l: 'KitKat matcha box', y: 800 }, { l: 'Tiket Fuji area', y: 2000 }, { l: 'Onsen public bath', y: 500 }, { l: 'Day trip Kamakura', y: 5000 },
            ].map(e => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 11px;background:rgba(255,255,255,.025);border-radius:8px;border:1px solid rgba(255,255,255,.05)">
      <span style="font-size:12px;color:var(--t2);flex:1;margin-right:7px">${e.l}</span>
      <div style="text-align:right;flex-shrink:0"><div style="font-size:13px;color:var(--g);font-weight:700">${jpy(e.y)}</div>
      ${currencyMode === 'dual' ? `<div style="font-size:10px;color:var(--j)">${idrStr(e.y)}</div>` : ''}</div>
    </div>
  `).join('');
        }

        function setCurrMode(m) {
            state.currMode = m;
            document.getElementById('btn-idr2jpy').classList.toggle('active', m === 'idr2jpy');
            document.getElementById('btn-jpy2idr').classList.toggle('active', m === 'jpy2idr');
            document.getElementById('curr-from-lbl').textContent = m === 'idr2jpy' ? 'Rupiah (IDR)' : 'Yen (JPY)';
            document.getElementById('curr-to-lbl').textContent = m === 'idr2jpy' ? 'Yen (JPY)' : 'Rupiah (IDR)';
            updateCurr();
        }

        function updateCurr() {
            const amt = parseFloat(document.getElementById('curr-input').value) || 0;
            const m = state.currMode;
            const res = m === 'idr2jpy' ? amt / IDR : amt * IDR;
            document.getElementById('curr-from-fmt').textContent = `${m === 'idr2jpy' ? 'Rp' : '¥'} ${fmt(amt)}`;
            document.getElementById('curr-result').textContent = `${m === 'idr2jpy' ? '¥' : 'Rp'} ${fmt(res)}`;
            document.getElementById('curr-to-fmt').textContent = fmt(res);
        }

        /* ═══════════════════════════════════════════
           WEATHER (Chart.js)
        ═══════════════════════════════════════════ */
        function initWeather() {
            const tabs = document.getElementById('weather-dest-tabs');
            tabs.innerHTML = Object.entries(WD).map(([k, v]) => `<button class="city-tab${k === state.weatherDest ? ' active' : ''}" onclick="setWeatherDest('${k}')">${v.ic} ${v.name}</button>`).join('');
            renderMonthBtns();
            renderWeatherChart();
            renderWeatherDetail();
        }

        function setWeatherDest(d) {
            state.weatherDest = d;
            document.querySelectorAll('#weather-dest-tabs .city-tab').forEach(b => b.classList.toggle('active', b.textContent.trim().includes(WD[d].name)));
            document.getElementById('weather-chart-title').textContent = `Suhu (°C) & Peluang Hujan (%) — ${WD[d].name}`;
            renderWeatherChart();
            renderWeatherDetail();
        }

        function renderMonthBtns() {
            document.getElementById('month-btns').innerHTML = MO.map((m, i) => `<button class="month-btn${i === state.weatherMonth ? ' active' : ''}" onclick="setWeatherMonth(${i})">${m}</button>`).join('');
        }

        function setWeatherMonth(i) {
            state.weatherMonth = i;
            document.querySelectorAll('.month-btn').forEach((b, j) => b.classList.toggle('active', j === i));
            renderWeatherDetail();
        }

        function renderWeatherChart() {
            const d = WD[state.weatherDest];
            const ctx = document.getElementById('weather-chart');
            if (!ctx) return;
            if (state.weatherChart) { state.weatherChart.destroy(); }
            state.weatherChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: MO, datasets: [
                        { label: 'Suhu °C', data: d.t, borderColor: '#f4a7b9', backgroundColor: 'rgba(244,167,185,.15)', fill: true, tension: .4, pointRadius: 3, pointBackgroundColor: '#f4a7b9' },
                        { label: 'Hujan %', data: d.r, borderColor: '#6699ff', backgroundColor: 'rgba(102,153,255,.12)', fill: true, tension: .4, pointRadius: 3, pointBackgroundColor: '#6699ff' },
                    ]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#9d94b0', font: { size: 11 } } }, tooltip: { mode: 'index', intersect: false } }, scales: { x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#52496a', font: { size: 11 } } }, y: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#52496a', font: { size: 11 } } } } }
            });
        }

        function renderWeatherDetail() {
            const d = WD[state.weatherDest];
            const m = state.weatherMonth;
            const cc = { 'Sangat Tinggi': '#f08080', 'Tinggi': '#f5a623', 'Sedang': '#6699ff', 'Rendah': '#3ddc84' };
            document.getElementById('weather-detail-cards').innerHTML = [
                { ic: SI[m], l: 'Suhu Rata-rata', v: `${d.t[m]}°C`, s: d.t[m] < 5 ? 'Sangat dingin!' : d.t[m] < 14 ? 'Sejuk — jaket' : d.t[m] < 22 ? 'Nyaman' : 'Panas!' },
                { ic: '🌧️', l: 'Peluang Hujan', v: `${d.r[m]}%`, s: d.r[m] > 70 ? 'Bawa payung!' : d.r[m] > 55 ? 'Siapkan payung' : 'Relatif cerah' },
                { ic: '👥', l: 'Kepadatan', v: d.cr[m], s: d.cr[m].includes('Sangat') ? 'Book jauh hari!' : d.cr[m] === 'Tinggi' ? 'Pesan lebih awal' : 'Lebih santai', vc: cc[d.cr[m]] },
                { ic: '📅', l: 'Bulan', v: MOF[m], s: 'Rencanakan perjalanan' },
            ].map(({ ic, l, v, s, vc }) => `
    <div class="card" style="padding:1.1rem">
      <div style="font-size:1.75rem;margin-bottom:6px">${ic}</div>
      <div style="font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px">${l}</div>
      <div style="font-size:16px;font-weight:700;color:${vc || 'var(--t)'};margin-bottom:3px">${v}</div>
      <div style="font-size:11px;color:var(--t3)">${s}</div>
    </div>
  `).join('');
        }

        /* ═══════════════════════════════════════════
           PREP & TIPS ACCORDIONS
        ═══════════════════════════════════════════ */
        const PREP_BEFORE = [
            { ic: '🛂', t: 'Paspor & E-Passport', c: ['Jepang bebas visa untuk WNI pemegang e-passport. Masa berlaku minimal 6 bulan.', 'Cara buat paspor: kunjungi Kantor Imigrasi atau daftar di imigrasi.go.id', 'Dokumen: KTP asli, KK, Akta Lahir/Ijazah, foto background biru', 'Biaya: Paspor biasa Rp 350.000 • Paspor elektronik Rp 650.000', 'Proses 3–5 hari kerja. Paspor HARUS jenis elektronik (ada chip icon di sampul)'] },
            { ic: '✈️', t: 'Visa & Visa Waiver', c: ['WNI dengan e-passport bisa masuk Jepang BEBAS VISA hingga 30 hari', 'Paspor non-elektronik: daftar visa turis di Kedutaan Jepang Jakarta', 'Biaya visa ~Rp 400.000, proses 4–5 hari. Siapkan slip gaji, rekening 3 bulan, itinerary'] },
            { ic: '💴', t: 'Persiapan Uang & Kartu', c: ['Tukar sebagian di money changer Indonesia sebelum terbang', 'Sisanya tarik di ATM 7-Eleven Jepang (terima kartu Visa/Mastercard Indonesia)', 'Bawa minimal ¥30,000–50,000 cash untuk awal perjalanan', 'Siapkan kartu kredit/debit Visa atau Mastercard sebagai backup'] },
            { ic: '📱', t: 'SIM Card & Internet', c: ['eSIM TERBAIK: IIJmio, Airalo, Ubigi. Beli sebelum terbang, aktif langsung landing. $9–15 untuk 7 hari.', 'SIM Card Fisik: beli di vending machine bandara. ¥3,000–5,000 untuk 7–14 hari.', 'Pocket WiFi: booking online, pick-up bandara. ~¥1,500/hari, bagus untuk grup.'] },
            { ic: '🏥', t: 'Asuransi Perjalanan', c: ['WAJIB! Biaya medis di Jepang sangat mahal — kunjungan dokter mulai ¥5,000', 'Pilihan: Traveloka Insurance, AXA Smart Traveller, Allianz Travel, Tokio Marine', 'Pastikan cover: emergency medical, trip cancellation, lost baggage'] },
            { ic: '🧳', t: 'Packing Checklist', c: ['✓ Paspor + fotokopi (simpan terpisah)', '✓ Adaptor steker Type A (sama bentuk Indo, tegangan 100V)', '✓ Power bank max 100Wh (hanya di kabin pesawat!)', '✓ Sajadah lipat & mukena (untuk Muslim)', '✓ Obat-obatan pribadi', '✓ Sunscreen SPF 50+', '✓ Sepatu nyaman (berjalan 15.000+ langkah/hari!)'] },
            { ic: '🛫', t: 'Persiapan di Bandara', c: ['Check-in minimal 3 jam sebelum flight internasional', 'Timbang bagasi (umumnya 20–30 kg ekonomi)', 'Liquid max 100ml di kabin, dalam zip-lock bag 1L', 'Isi Visit Japan Web sebelum terbang (percepat imigrasi & bea cukai)', 'Beli IC Card Suica + SIM card di bandara kedatangan'] },
        ];
        const PREP_AFTER = [
            { ic: '🛃', t: 'Bea Cukai Indonesia', c: ['Bebas pajak hingga USD 500 per orang (barang non-komersial)', 'Lebih dari USD 500 kena bea masuk 10–25%', 'Wajib isi formulir pabean di pesawat atau aplikasi Bea Cukai Mobile', 'Barang mewah (jam tangan, tas branded) HARUS dideklarasikan'] },
            { ic: '🚫', t: 'Barang Dilarang Dibawa', c: ['DILARANG: Narkoba, senjata tajam, uang > Rp 100 juta tanpa deklarasi', 'DILARANG di kabin: power bank > 100Wh, liquid > 100ml', 'Buah segar, sayur segar, daging segar, tanaman hidup DILARANG masuk Indonesia'] },
            { ic: '✈️', t: 'Aturan Bagasi Kembali', c: ['AirAsia: 20–30 kg • Garuda: 30 kg • Batik Air: 20 kg', 'Tips bagasi penuh: kirim paket via Japan Post EMS ke Indonesia (3–5 hari, aman)', 'Beli vacuum bag di 100¥ shop untuk kompres baju'] },
            { ic: '🎁', t: 'Oleh-oleh Rekomendasi', c: ['KitKat Japan flavors (matcha, sakura, sake) — konbini & airport', 'Tokyo Banana, LeTAO Double Fromage, Royce Chocolate', 'Skincare Jepang (Hada Labo, SKII, DHC) — lebih murah di sana', 'Anime merchandise dari Akihabara, Tenugui, Kokeshi doll'] },
            { ic: '💱', t: 'Tax Free Refund', c: ['Beli minimal ¥5,000 di satu toko dalam satu hari', 'Tunjukkan PASPOR ASLI ke kasir', 'Tax refund ~8–10% langsung dikurangi dari harga di kasir', 'Barang tax free TIDAK BOLEH dibuka di Jepang — disegel plastik'] },
        ];

        function renderAccordions(items, containerId) {
            const container = document.getElementById(containerId);
            if (!container) {
                console.warn(`renderAccordions: Container element with id '${containerId}' not found.`);
                return;
            }
            if (!Array.isArray(items)) {
                console.warn(`renderAccordions: Items is not an array for container '${containerId}'.`);
                return;
            }
            container.innerHTML = items.map((item, i) => `
    <div class="accordion" id="acc-${containerId}-${i}">
      <div class="accordion-head" onclick="toggleAcc('${containerId}',${i})">
        <span class="acc-icon">${item.ic}</span>
        <span class="acc-title">${item.t}</span>
        <span class="acc-arrow">▼</span>
      </div>
      <div class="accordion-body">
        <div class="acc-content">
          ${(item.c || []).map(line => `<div class="acc-line"><span class="arrow">→</span>${line}</div>`).join('')}
          ${item.rows ? `<div style="overflow-x:auto"><table class="data-table"><thead><tr><th>Indonesia</th><th>日本語</th><th>Romaji</th></tr></thead><tbody>${item.rows.map(([id, jp, rm]) => `<tr><td style="color:var(--t2)">${id}</td><td style="color:var(--s);font-family:'Noto Serif JP';font-weight:700">${jp}</td><td style="color:var(--t3);font-style:italic">${rm}</td></tr>`).join('')}</tbody></table></div>` : ''}
        </div>
      </div>
    </div>
  `).join('');
        }

        function toggleAcc(containerId, i) {
            const el = document.getElementById(`acc-${containerId}-${i}`);
            if (el) {
                el.classList.toggle('open');
            } else {
                console.error(`toggleAcc: Accordion element '#acc-${containerId}-${i}' not found.`);
            }
        }

        function setPrepTab(tab) {
            state.prepTab = tab;
            const btnBefore = document.getElementById('btn-before');
            const btnAfter = document.getElementById('btn-after');
            if (btnBefore) btnBefore.classList.toggle('active', tab === 'before');
            if (btnAfter) btnAfter.classList.toggle('active', tab === 'after');
            renderPrep();
        }

        function renderPrep() {
            if (typeof state === 'undefined' || !state) {
                console.error("renderPrep: Global state object is undefined.");
                return;
            }
            const items = state.prepTab === 'before' ? PREP_BEFORE : PREP_AFTER;
            renderAccordions(items, 'prep-accordions');
        }

        // Format Rupiah dengan ribuan dot — tanpa ambiguitas
        function fmtRp(n) { return 'Rp\u00a0' + Math.round(n).toLocaleString('id-ID'); }

        function renderPlanOptions() {
            const el = document.getElementById('plan-options');
            if (!el) return;
            el.innerHTML = PLAN_OPTIONS.map(opt => {
                const active = state.planSel === opt.id;
                const isGroup = opt.persons > 1;
                const perPerson = isGroup ? opt.totalIDR / opt.persons : null;
                return `
      <div class="plan-option-card${active ? ' active' : ''}" onclick="selectPlan('${opt.id}')"
        style="background:${active ? opt.colorDim : 'rgba(255,255,255,.03)'};border-color:${active ? opt.colorBorder : 'rgba(255,255,255,.07)'};box-shadow:${active ? `0 0 32px ${opt.colorBorder},0 16px 40px rgba(0,0,0,.35)` : 'none'}">

        <!-- Header -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.85rem">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:1.8rem">${opt.icon}</span>
            <div>
              <div style="font-family:'Playfair Display';font-weight:700;font-size:16px;color:var(--t)">${opt.label}</div>
              <div style="font-size:11px;color:${opt.color};font-weight:600;margin-top:2px">${opt.stars} ${opt.style}</div>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px">
            ${active ? `<span style="font-size:10px;font-weight:700;background:${opt.colorDim};color:${opt.color};border:1px solid ${opt.colorBorder};padding:3px 9px;border-radius:100px">AKTIF</span>` : ''}
            ${isGroup ? `<span style="font-size:10px;font-weight:700;background:rgba(192,132,252,.15);color:#c084fc;border:1px solid rgba(192,132,252,.3);padding:3px 9px;border-radius:100px">👥 ${opt.persons} Orang</span>` : '<span style="font-size:10px;color:var(--t3);padding:3px 9px">1 Orang</span>'}
          </div>
        </div>

        <div style="font-size:12px;color:var(--t2);line-height:1.6;margin-bottom:1rem">${opt.desc}</div>

        <!-- Total Budget Block -- Format jelas, tidak ambigu -->
        <div style="background:${opt.colorDim};border:1px solid ${opt.colorBorder};border-radius:12px;padding:.9rem 1rem;margin-bottom:.9rem">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem;flex-wrap:wrap">
            <div>
              <div style="font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.1em;margin-bottom:3px">💰 TOTAL BUDGET</div>
              <div style="font-family:'Playfair Display';font-size:1.55rem;font-weight:700;color:${opt.color};line-height:1">${fmtRp(opt.totalIDR)}</div>
              <div style="font-size:10px;color:var(--t3);margin-top:3px">7 hari • termasuk pesawat</div>
            </div>
            ${isGroup ? `
            <div style="text-align:right;background:rgba(192,132,252,.12);border:1px solid rgba(192,132,252,.25);border-radius:8px;padding:.6rem .85rem">
              <div style="font-size:9px;color:#c084fc;text-transform:uppercase;letter-spacing:.1em;font-weight:700;margin-bottom:2px">PATUNGAN ${opt.persons} ORANG</div>
              <div style="font-family:'Playfair Display';font-size:1.15rem;font-weight:700;color:#c084fc;line-height:1">${fmtRp(perPerson)}</div>
              <div style="font-size:9px;color:var(--t3);margin-top:2px">per orang</div>
            </div>
            ` : ''}
          </div>
        </div>

        <!-- Category Breakdown -->
        <div style="display:flex;flex-direction:column;gap:4px">
          ${[
            { l: '✈️ Tiket Pesawat', v: opt.flight, note: opt.flightNote },
            { l: '🏨 Hotel (7 malam)', v: opt.hotel, note: opt.hotelNote },
            { l: '🍱 Makan & Jajanan', v: opt.food, note: opt.foodNote },
            { l: '🚆 Transportasi', v: opt.transport, note: opt.transportNote },
            { l: '🎁 Souvenir & Shopping', v: opt.souvenir, note: opt.souvenirNote },
          ].map(({ l, v, note }) => {
            const pct = Math.round((v / opt.totalIDR) * 100);
            return `
            <div style="padding:5px 0;border-bottom:1px solid rgba(255,255,255,.05)">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">
                <span style="font-size:12px;color:var(--t2)">${l}</span>
                <span style="font-size:12px;font-weight:600;color:var(--t)">${fmtRp(v)}</span>
              </div>
              <div style="height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden">
                <div style="height:100%;width:${pct}%;background:${opt.color};border-radius:2px;transition:width .5s ease"></div>
              </div>
              <div style="font-size:10px;color:var(--t3);margin-top:2px">${note} • ${pct}% dari total</div>
            </div>
          `}).join('')}
        </div>

        ${currencyMode === 'dual' ? `<div style="margin-top:.85rem;text-align:center;padding:7px;border-radius:9px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);font-size:11px;color:var(--t3)">≈ ${jpy(Math.round(opt.totalIDR / IDR))} total dalam JPY</div>` : ''}
      </div>
    `;
            }).join('');
        }

        function selectPlan(id) {
            state.planSel = id;
            state.openDay = null;
            const opt = PLAN_OPTIONS.find(p => p.id === id);
            state.planPersons = opt ? opt.persons : 1;
            renderPlanOptions();
            renderPlanBanner();
            renderBudgetDashboard();
            renderItinerary();
        }

        // Toggle jumlah orang (untuk section budget dashboard)
        function setPlanPersons(n) {
            state.planPersons = n;
            document.querySelectorAll('.persons-btn').forEach(b => b.classList.toggle('active', parseInt(b.dataset.n) === n));
            renderBudgetDashboard();
        }

        function renderPlanBanner() {
            const bannerEl = document.getElementById('plan-banner');
            if (!bannerEl) return;
            const opt = PLAN_OPTIONS.find(p => p.id === state.planSel);
            const isGroup = opt.persons > 1;
            const perPerson = opt.totalIDR / opt.persons;
            bannerEl.style.cssText = `background:linear-gradient(135deg,${opt.colorDim},rgba(255,255,255,.02));border:1px solid ${opt.colorBorder};border-radius:16px;padding:1.4rem 1.75rem;margin-bottom:2rem;display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap`;
            bannerEl.innerHTML = `
    <div style="font-size:2.5rem">${opt.icon}</div>
    <div style="flex:1;min-width:200px">
      <div style="font-family:'Playfair Display';font-size:1.3rem;font-weight:700;color:var(--t)">${opt.label} — Option ${opt.id} ${isGroup ? '👥' : '👤'}</div>
      <div style="font-size:13px;color:var(--t2);margin-top:3px">${opt.desc}</div>
      ${isGroup ? `<div style="margin-top:6px;display:inline-block;background:rgba(192,132,252,.15);border:1px solid rgba(192,132,252,.3);color:#c084fc;font-size:11px;font-weight:700;padding:3px 10px;border-radius:100px">${opt.groupNote || 'Group Travel'}</div>` : ''}
    </div>
    <div style="text-align:right">
      <div style="font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.08em">Total Budget</div>
      <div style="font-family:'Playfair Display';font-size:1.8rem;font-weight:700;color:${opt.color}">${fmtRp(opt.totalIDR)}</div>
      ${isGroup ? `
      <div style="margin-top:5px;background:${opt.colorDim};border:1px solid ${opt.colorBorder};border-radius:8px;padding:5px 10px;text-align:right">
        <div style="font-size:9px;color:var(--t3);text-transform:uppercase">per orang (${opt.persons} orang)</div>
        <div style="font-size:1.15rem;font-weight:700;color:#c084fc">${fmtRp(perPerson)}</div>
      </div>
      ` : `<div style="font-size:11px;color:var(--t3);margin-top:2px">7 hari • ${opt.style}</div>`}
    </div>
  `;
        }

        /* ── Budget Dashboard ── */
        function renderBudgetDashboard() {
            const el = document.getElementById('plan-budget-dashboard');
            if (!el) return;
            const opt = PLAN_OPTIONS.find(p => p.id === state.planSel);
            const n = state.planPersons || opt.persons;

            const cats = [
                { ic: '✈️', label: 'Penginapan', key: 'hotel', color: '#f4a7b9', sub: opt.hotelNote, desc: '7 malam' },
                { ic: '🚆', label: 'Transportasi', key: 'transport', color: '#6699ff', sub: opt.transportNote, desc: 'JR Pass + IC Card' },
                { ic: '🍱', label: 'Makan & Jajanan', key: 'food', color: '#d4af37', sub: opt.foodNote, desc: '7 hari × 3 meal' },
                { ic: '🎟️', label: 'Tiket Wisata', key: 'wisata', color: '#c084fc', sub: opt.wisataNote, desc: 'Tiket masuk' },
                { ic: '🛍️', label: 'Shopping & Souvenir', key: 'souvenir', color: '#f5a623', sub: opt.souvenirNote, desc: 'Budget fleksibel' },
            ];
            // recalc proportional to n persons
            const baseTotal = opt.totalIDR - opt.flight; // non-flight total

            // Persons toggle buttons
            const personsHTML = `
            <div style="display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin-bottom:1.5rem">
                <span style="font-size:12px;color:var(--t2);font-weight:600">Hitung untuk:</span>
                ${[1,2,3].map(i => `<button class="persons-btn${n===i?' active':''}" data-n="${i}" onclick="setPlanPersons(${i})" style="padding:7px 16px;border-radius:100px;border:1.5px solid ${n===i?opt.colorBorder:'rgba(255,255,255,.1)'};background:${n===i?opt.colorDim:'transparent'};color:${n===i?opt.color:'var(--t3)'};font-size:12px;font-weight:700;transition:all .2s;cursor:pointer">${i} Orang</button>`).join('')}
                <span style="font-size:11px;color:var(--t3);margin-left:4px">← klik untuk hitung per kapita</span>
            </div>`;

            // Category cards
            const catsHTML = cats.map(cat => {
                const totalCat = opt[cat.key] || 0;
                const perPerson = totalCat / n;
                const pct = opt.totalIDR > 0 ? Math.round((totalCat / opt.totalIDR) * 100) : 0;
                if (totalCat === 0) return '';
                return `
                <div class="budget-cat-card" style="--cat-color:${cat.color}">
                    <div class="bcc-header">
                        <div class="bcc-icon">${cat.ic}</div>
                        <div class="bcc-meta">
                            <div class="bcc-label">${cat.label}</div>
                            <div class="bcc-desc">${cat.desc}</div>
                        </div>
                        <div class="bcc-pct">${pct}%</div>
                    </div>
                    <div class="bcc-bar-wrap">
                        <div class="bcc-bar" style="width:${pct}%;background:${cat.color}"></div>
                    </div>
                    <div class="bcc-prices">
                        <div class="bcc-price-block bcc-total">
                            <div class="bcc-price-lbl">TOTAL ${n > 1 ? n + ' ORANG' : ''}</div>
                            <div class="bcc-price-val" style="color:${cat.color}">${fmtRp(totalCat)}</div>
                        </div>
                        ${n > 1 ? `
                        <div class="bcc-divider">→</div>
                        <div class="bcc-price-block bcc-per-person">
                            <div class="bcc-price-lbl">PER ORANG</div>
                            <div class="bcc-price-val" style="color:#c084fc">${fmtRp(perPerson)}</div>
                        </div>` : ''}
                    </div>
                    <div class="bcc-note">${cat.sub}</div>
                </div>`;
            }).join('');

            // Pesawat separate
            const flightTotal = opt.flight;
            const flightPerPerson = flightTotal / n;

            // Summary
            const totalTrip = opt.totalIDR;
            const perPersonTotal = totalTrip / n;
            const perHari = perPersonTotal / 7;

            // Pie chart data
            const pieLabels = ['✈️ Pesawat', '🏨 Hotel', '🍱 Makan', '🚆 Transport', '🛍️ Shopping', '🎟️ Wisata'];
            const pieValues = [opt.flight, opt.hotel, opt.food, opt.transport, opt.souvenir, opt.wisata || 0];
            const pieColors = ['#f4a7b9', '#6699ff', '#d4af37', '#3ddc84', '#f5a623', '#c084fc'];

            el.innerHTML = `
            <div class="budget-dashboard-wrap">

                <!-- Section Header -->
                <div style="display:flex;align-items:center;gap:.7rem;margin-bottom:1.5rem">
                    <div style="width:4px;height:24px;background:${opt.color};border-radius:2px"></div>
                    <div>
                        <div style="font-family:'Playfair Display';font-size:1.15rem;font-weight:700;color:var(--t)">📊 Visualisasi Budget — Option ${opt.id}</div>
                        <div style="font-size:12px;color:var(--t3);margin-top:1px">Breakdown lengkap setiap kategori pengeluaran</div>
                    </div>
                </div>

                <!-- Person Toggle -->
                ${personsHTML}

                <!-- Top Summary Strip -->
                <div class="budget-summary-strip" style="border-color:${opt.colorBorder};background:linear-gradient(135deg,${opt.colorDim},transparent)">
                    <div class="bss-item">
                        <div class="bss-label">💰 TOTAL TRIP</div>
                        <div class="bss-value" style="color:${opt.color}">${fmtRp(totalTrip)}</div>
                        <div class="bss-sub">7 hari all-in</div>
                    </div>
                    <div class="bss-separator"></div>
                    <div class="bss-item">
                        <div class="bss-label">👤 PER ORANG</div>
                        <div class="bss-value" style="color:${opt.color}">${fmtRp(perPersonTotal)}</div>
                        <div class="bss-sub">${n > 1 ? `patungan ${n} orang` : 'traveler tunggal'}</div>
                        ${n > 1 ? `
                        <div style="margin-top:.85rem;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:10px;padding:.75rem">
                            <div style="font-size:11px;color:var(--t3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Rincian Per Orang:</div>
                            ${[
                                { l: '🚆 Transport', v: opt.transport },
                                { l: '🛍️ Shopping', v: opt.souvenir },
                                { l: '🎟️ Wisata', v: opt.wisata || 0 },
                            ].filter(x => x.v > 0).map(({ l, v }) => `
                                <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.05)">
                                    <span style="font-size:12px;color:var(--t2)">${l}</span>
                                    <div style="text-align:right">
                                        <div style="font-size:11px;color:#c084fc;font-weight:700">${fmtRp(v/n)}/orang</div>
                                        <div style="font-size:10px;color:var(--t3)">total ${fmtRp(v)}</div>
                                    </div>
                                </div>
                            `).join('')}
                            <div style="margin-top:.7rem;padding:.6rem .75rem;background:rgba(192,132,252,.12);border-radius:8px;display:flex;justify-content:space-between;align-items:center">
                                <span style="font-size:13px;font-weight:700;color:var(--t)">TOTAL PER ORANG</span>
                                <span style="font-family:'Playfair Display';font-size:1.2rem;font-weight:700;color:#c084fc">${fmtRp(perPersonTotal)}</span>
                            </div>
                        </div>` : ''}
                    </div>
                </div>

            </div>`;

            // Render pie chart
            setTimeout(() => {
                const canvas = document.getElementById('plan-pie-chart');
                if (!canvas) return;
                if (state.planPieChart) { state.planPieChart.destroy(); state.planPieChart = null; }
                const filtered = pieLabels.map((l, i) => ({ l, v: pieValues[i], c: pieColors[i] })).filter(d => d.v > 0);
                state.planPieChart = new Chart(canvas.getContext('2d'), {
                    type: 'doughnut',
                    data: {
                        labels: filtered.map(d => d.l),
                        datasets: [{ data: filtered.map(d => d.v), backgroundColor: filtered.map(d => d.c), borderWidth: 2, borderColor: '#07070f' }]
                    },
                    options: {
                        cutout: '65%',
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: ctx => {
                                        const val = ctx.parsed;
                                        const pct = Math.round((val / opt.totalIDR) * 100);
                                        return ` ${fmtRp(val)} (${pct}%)`;
                                    }
                                }
                            }
                        }
                    }
                });
                // Custom legend
                const legendEl = document.getElementById('pie-legend');
                if (legendEl) {
                    legendEl.innerHTML = filtered.map(d => {
                        const pct = Math.round((d.v / opt.totalIDR) * 100);
                        return `<div style="display:flex;align-items:center;justify-content:space-between;gap:6px">
                            <div style="display:flex;align-items:center;gap:7px">
                                <div style="width:10px;height:10px;border-radius:2px;background:${d.c};flex-shrink:0"></div>
                                <span style="font-size:11px;color:var(--t2)">${d.l}</span>
                            </div>
                            <div style="text-align:right">
                                <span style="font-size:11px;font-weight:700;color:${d.c}">${pct}%</span>
                                <span style="font-size:10px;color:var(--t3);margin-left:5px">${fmtRp(d.v)}</span>
                            </div>
                        </div>`;
                    }).join('');
                }
            }, 50);
        }

        const TIPS_ITEMS = [
            { ic: '🚆', t: 'Cara Naik Kereta Jepang', c: ['1. Beli IC Card (Suica/Pasmo) di mesin vending bandara — isi ¥2,000–5,000', '2. Gunakan Google Maps Transit untuk navigasi — sangat akurat', '3. Antre di garis yang ditandai di lantai peron', '4. Tap IC card di gate masuk DAN keluar — lupa tap out = denda!', '5. JR Pass untuk multi-kota (Tokyo↔Kyoto↔Osaka) sangat worth it', '6. Shinkansen: Tokyo→Osaka hanya 2.5 jam!'] },
            { ic: '🛍️', t: 'Tax Free Shopping Guide', c: ['Minimum ¥5,000 per toko untuk mendapat tax free (8–10% discount)', 'Tunjukkan PASPOR ASLI — bukan foto, bukan KTP', 'Tax free dipotong langsung di kasir, tidak perlu klaim di bandara', 'Don Quijote = surga tax free untuk turis — konter khusus tersedia', 'Barang TIDAK BOLEH dibuka di Jepang — disegel plastik'] },
            { ic: '💴', t: 'Cash vs Kartu di Jepang', c: ['💴 CASH untuk: warung kecil, ramen lokal, kuil, pasar, taxi, vending machine', '💳 KARTU untuk: mall, department store, chain restaurant, hotel, tax-free', 'ATM terbaik untuk kartu Indonesia: 7-Eleven ATM dan Japan Post ATM', 'Pilih JPY (bukan IDR) saat gesek kartu — hindari Dynamic Currency Conversion'] },
            {
                ic: '🗣️', t: 'Frasa Bahasa Jepang Penting', rows: [
                    ['Terima kasih', 'ありがとうございます', 'Arigatou gozaimasu'],
                    ['Permisi / Maaf', 'すみません', 'Sumimasen'],
                    ['Di mana toilet?', 'トイレはどこですか？', 'Toire wa doko desu ka?'],
                    ['Berapa harganya?', 'いくらですか？', 'Ikura desu ka?'],
                    ['Ini halal?', 'これはハラールですか？', 'Kore wa Hararu desu ka?'],
                    ['Tidak ada babi?', '豚肉は入っていませんか？', 'Butaniku wa haitte imasen ka?'],
                    ['Tax free bisa?', '免税できますか？', 'Menzei dekimasu ka?'],
                    ['Tolong bantu!', '助けてください！', 'Tasukete kudasai!'],
                    ['Enak sekali!', 'おいしい！', 'Oishii!'],
                    ['Saya tersesat', '道に迷いました', 'Michi ni mayoimashita'],
                ]
            },
            { ic: '🎌', t: 'Etika & Aturan Penting', c: ['🗑️ SAMPAH: Hampir tidak ada tempat sampah di jalan — simpan di tas, buang di konbini', '🚆 KERETA: Bicara pelan, telepon DILARANG, gunakan earphone', '↕️ ESKALATOR: Berdiri di kiri (kecuali Osaka: kanan untuk jalan)', '💰 TIP: JANGAN memberi tip — dianggap kasar di Jepang!', '📸 FOTO: Minta izin sebelum foto orang atau properti privat'] },
            { ic: '📱', t: 'Aplikasi Wajib Jepang', c: ['🗺️ Google Maps — navigasi kereta, jalan, dan transit terbaik', '☪️ Muslim Pro / HalalNavi — musholla & restoran halal', '🌏 Navitime for Japan — jadwal kereta termasuk JR', '💴 XE Currency — kurs real-time IDR/JPY', '🗾 Visit Japan Web — registrasi sebelum terbang (percepat imigrasi)'] },
            { ic: '🕌', t: 'Panduan Muslim di Jepang', c: ['Tokyo Camii (Yoyogi/Shibuya) — masjid terbesar, welcome all Muslims', 'Bandara Narita & Haneda — prayer room tersedia, tanya info desk', 'Download Muslim Pro / HalalNavi sebelum berangkat', 'Bawa sajadah lipat & mukena sendiri', 'Air wudhu: toilet umum Jepang sangat bersih dan aman'] },
            { ic: '🚌', t: 'Strategi Transport Terhemat', c: ['IC Card Suica/Pasmo — wajib! Untuk kereta, bus, subway, dan konbini (¥500 deposit)', 'Tokyo Metro Day Pass ¥600 — worth it jika naik 5+ stasiun dalam sehari', 'JR Pass 7 hari ~¥50,000 — worth it untuk Tokyo+Kyoto+Osaka', 'Night bus Tokyo→Osaka ¥3,000–5,000 — hemat hotel sekaligus', 'JANGAN taksi dari bandara — selalu naik kereta (NEX atau Limousine Bus)'] },
        ];

        function renderTips() {
            renderAccordions(TIPS_ITEMS, 'tips-accordions');
        }

        const TYPE_COLORS = { Free: '#3ddc84', Ticket: '#f4a7b9', Food: '#d4af37', Shopping: '#6699ff', Culture: '#c084fc', Market: '#f5a623', Transport: '#94a3b8', Entertainment: '#f4a7b9', Explore: '#3ddc84', Admin: '#94a3b8', Drinks: '#6699ff' };
        const TYPE_BG = { Free: 'rgba(61,220,132,.2)', Ticket: 'rgba(244,167,185,.2)', Food: 'rgba(212,175,55,.2)', Shopping: 'rgba(102,153,255,.2)', Culture: 'rgba(192,132,252,.2)', Market: 'rgba(245,166,35,.2)', Transport: 'rgba(148,163,184,.2)', Entertainment: 'rgba(244,167,185,.2)', Explore: 'rgba(61,220,132,.2)', Admin: 'rgba(148,163,184,.2)', Drinks: 'rgba(102,153,255,.2)' };

        function renderItinerary() {
            const wrap = document.getElementById('plan-itinerary');
            if (!wrap) return;
            if (state.planSel !== 'A') {
                const opt = PLAN_OPTIONS.find(p => p.id === state.planSel);
                wrap.innerHTML = `<div style="border-radius:16px;padding:3rem;text-align:center;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07)"><div style="font-size:3rem;margin-bottom:1rem">${opt.icon}</div><div style="font-family:'Playfair Display';font-size:1.5rem;color:var(--t);margin-bottom:.5rem">Option ${opt.id} — ${opt.label}</div><div style="font-size:13px;color:var(--t3);margin-bottom:1.5rem">Itinerary detail untuk option ini akan segera tersedia. Gunakan struktur Option A sebagai referensi dengan menyesuaikan akomodasi dan anggaran makan.</div><div style="display:inline-block;padding:.75rem 1.75rem;border-radius:100px;background:${opt.colorDim};border:1px solid ${opt.colorBorder};color:${opt.color};font-size:13px;font-weight:600">Total Budget: ${fmtIDR(opt.totalIDR)} • 7 Hari • ${opt.style}</div></div>`;
                return;
            }
            // Day pills
            let html = `<div style="margin-bottom:1rem"><h3 style="font-family:'Playfair Display';font-size:1.3rem;color:var(--t);margin-bottom:.4rem">🗓 Itinerary 7 Hari — Option A</h3><p style="font-size:13px;color:var(--t3)">Dikelompokkan per area untuk menghemat biaya transportasi. Klik hari untuk melihat detail.</p></div>`;
            html += `<div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:1.5rem">`;
            html += ITIN.map(d => `<button class="day-pill${state.openDay === d.day ? ' active' : ''}" onclick="toggleDay(${d.day})" style="border-color:${state.openDay === d.day ? d.color : 'rgba(255,255,255,.1)'};background:${state.openDay === d.day ? d.color + '26' : 'transparent'};color:${state.openDay === d.day ? d.color : 'var(--t3)'}">D${d.day} ${d.title}</button>`).join('');
            html += `</div>`;
            html += ITIN.filter(d => state.openDay === null || state.openDay === d.day).map(day => {
                const open = state.openDay === day.day;
                return `
      <div class="day-block${open ? ' open' : ''}">
        <div class="day-head" onclick="toggleDay(${day.day})" style="background:linear-gradient(90deg,${day.color}14,transparent)">
          <div class="day-num" style="background:${day.color}2e"><span style="color:${day.color}">D${day.day}</span></div>
          <div class="day-head-info">
            <div class="day-title">${day.title}</div>
            <div class="day-sector">📍 ${day.sector}</div>
          </div>
          <div class="day-stats">
            <div class="day-stat"><div class="day-stat-lbl">Transport</div><div class="day-stat-val" style="color:${day.color}">¥${day.transportCost}</div></div>
            <div class="day-stat"><div class="day-stat-lbl">Makan</div><div class="day-stat-val" style="color:var(--g)">¥${day.foodCost}</div></div>
            <div class="day-stat"><div class="day-stat-lbl">Mode</div><div class="day-stat-val" style="color:var(--t2);font-size:10px">${day.transport}</div></div>
          </div>
          <span class="day-arrow" style="color:${day.color}">▼</span>
        </div>
        ${open ? `<div class="day-places">
          ${day.places.map(p => `<div class="place-card"><div class="place-img"><div class="place-img-bg" style="background-image:url('${p.img}')"></div><div class="place-img-grad"></div><div class="place-time">⏰ ${p.time}</div><div class="place-type-badge" style="background:${TYPE_BG[p.type] || 'rgba(255,255,255,.1)'};color:${TYPE_COLORS[p.type] || 'white'}">${p.type}</div><div class="place-name">${p.name}</div></div><div class="place-body"><p class="place-desc">${p.desc}</p><div class="place-spend-row"><span class="place-spend-lbl">💴 Estimasi</span><span class="place-spend-val">${p.spend}</span></div></div></div>`).join('')}
          <div class="day-summary" style="background:${day.color}12;border:1px solid ${day.color}33">
            <div class="day-sum-transport"><div class="day-sum-trl">🚆 Transport Rekomendasi</div><div class="day-sum-trv">${day.transport}</div></div>
            <div class="day-sum-nums">
              <div class="day-sum-num"><div class="day-sum-nl">Transport</div><div class="day-sum-nv" style="color:${day.color}">¥${day.transportCost}</div></div>
              <div class="day-sum-num"><div class="day-sum-nl">Makan</div><div class="day-sum-nv" style="color:var(--g)">¥${day.foodCost}</div></div>
              <div class="day-sum-num"><div class="day-sum-nl">Est. Total</div><div class="day-sum-nv" style="color:var(--s)">¥${day.transportCost + day.foodCost}</div></div>
            </div>
          </div>
        </div>`: ''}
      </div>
    `;
            }).join('');
            // Budget summary
            html += `
    <div style="margin-top:2rem;border-radius:16px;padding:1.5rem;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08)">
      <h3 style="font-family:'Playfair Display';font-size:1.2rem;color:var(--t);margin-bottom:1rem">💰 Ringkasan Budget Option A — 7 Hari Tokyo</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:1rem">
        ${[{ l: '✈️ Tiket Pesawat', v: 'Rp 3.600.000', sub: 'CGK–NRT PP', c: 'var(--s)' }, { l: '🏨 Hostel 7 Malam', v: 'Rp 1.700.000', sub: '~¥2,300/malam', c: 'var(--g)' }, { l: '🍱 Makan 7 Hari', v: '~¥14,700', sub: '≈ Rp 1.529.000', c: 'var(--j)' }, { l: '🚆 Transportasi', v: '~¥8,900', sub: '≈ Rp 925.000', c: 'var(--b)' }, { l: '🎁 Souvenir & Misc', v: 'Rp 600.000', sub: 'Budget fleksibel', c: '#c084fc' }].map(({ l, v, sub, c }) => `<div style="padding:.85rem;background:rgba(255,255,255,.03);border-radius:10px;border:1px solid rgba(255,255,255,.06)"><div style="font-size:11px;color:var(--t3);margin-bottom:4px">${l}</div><div style="font-size:16px;font-weight:700;color:${c}">${v}</div><div style="font-size:11px;color:var(--t3);margin-top:2px">${sub}</div></div>`).join('')}
      </div>
      <div style="padding:.9rem 1rem;background:rgba(61,220,132,.07);border:1px solid rgba(61,220,132,.2);border-radius:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem">
        <div><div style="font-size:11px;color:var(--t3)">💚 TOTAL BUDGET OPTION A</div><div style="font-family:'Playfair Display';font-size:2rem;font-weight:700;color:var(--j)">Rp 8.000.000</div><div style="font-size:12px;color:var(--t3);margin-top:2px">Termasuk pesawat, hotel, makan, transport & souvenir</div></div>
        <div style="text-align:right"><div style="font-size:11px;color:var(--t3)">Per hari rata-rata</div><div style="font-size:1.4rem;font-weight:700;color:var(--g)">~Rp 614.000/hari</div></div>
      </div>
    </div>
  `;
            wrap.innerHTML = html;
        }

        function toggleDay(d) {
            state.openDay = state.openDay === d ? null : d;
            renderItinerary();
            // scroll to day
            setTimeout(() => { const el = document.querySelector('.day-block.open'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
        }

        /* ═══════════════════════════════════════════
           LOADING
        ═══════════════════════════════════════════ */
        function runLoader() {
            let pct = 0;
            const bar = document.getElementById('load-bar');
            const pctEl = document.getElementById('load-pct');
            const t = setInterval(() => {
                pct += 2;
                bar.style.width = pct + '%';
                pctEl.textContent = pct + '%';
                if (pct >= 100) {
                    clearInterval(t);
                    setTimeout(() => {
                        document.getElementById('loading').classList.add('done');
                        setTimeout(() => document.getElementById('loading').remove(), 600);
                    }, 300);
                }
            }, 28);
        }

        /* ═══════════════════════════════════════════
           INIT
        ═══════════════════════════════════════════ */
        document.addEventListener('DOMContentLoaded', () => {
            bootSakura();
            renderSidebar();
            initHome();
            runLoader();
            // Initialize currency display system
            if (typeof window.refreshCurrencyDependentUI === 'function') {
                window.refreshCurrencyDependentUI();
            }
        });
    