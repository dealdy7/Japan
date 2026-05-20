/**
 * NIPPON — Premium Japan Travel Dashboard
 * Halal Food Data (Fully Merged & Enriched)
 *
 * Sync: baru.html + index.html (2026-05-20)
 * Sources: original modular data + baru.html HALAL constant
 * Added: rating, enriched menu descriptions, better images, Takoyaki Dotonbori
 */

const halalDataCache = {
  halalRestaurants: {

    /* ─────────────── TOKYO ─────────────── */
    tokyo: [
      {
        id: "r-t1",
        name: "Gyumon Halal Yakiniku",
        price: "¥2,500–4,000",
        priceRaw: 3500,
        cert: "certified",
        certLabel: "Halal Certified",
        menu: "A5 Wagyu halal, kalbi, short rib premium, daging lembu bakar panggang",
        location: "Shinjuku, 5 mnt berjalan kaki dari stesen",
        area: "Shinjuku",
        rating: 4.8,
        mapQ: "Halal+Yakiniku+Shinjuku+Tokyo",
        img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=700&q=80"
      },
      {
        id: "r-t2",
        name: "Naritaya Asakusa",
        price: "¥1,200–2,000",
        priceRaw: 1600,
        cert: "muslim-friendly",
        certLabel: "Muslim Friendly",
        menu: "Ramen halal broth sapi & ayam berempah, gyoza rangup, tsukemen",
        location: "Asakusa, berhampiran kuil Senso-ji",
        area: "Asakusa",
        rating: 4.6,
        mapQ: "Naritaya+Asakusa+Halal+Ramen",
        img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700&q=80"
      },
      {
        id: "r-t3",
        name: "Halal Wagyu Yakiniku Momo",
        price: "¥3,000–5,000",
        priceRaw: 4000,
        cert: "certified",
        certLabel: "Halal Certified",
        menu: "A5 Wagyu halal, tongue, premium cuts, set yakiniku mewah",
        location: "Ikebukuro",
        area: "Ikebukuro",
        rating: 4.7,
        mapQ: "Halal+Wagyu+Ikebukuro+Tokyo",
        img: "https://images.unsplash.com/photo-1558030006-450675393462?w=700&q=80"
      },
      {
        id: "r-t4",
        name: "Ayam-Ya Shinjuku",
        price: "¥800–1,200",
        priceRaw: 1000,
        cert: "certified",
        certLabel: "Halal Certified",
        menu: "Ayam goreng crispy Jepang, nasi, set menu value murah",
        location: "Shinjuku 3-chome",
        area: "Shinjuku",
        rating: 4.5,
        mapQ: "Ayam-Ya+Shinjuku+Halal",
        img: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=700&q=80"
      },
      {
        id: "r-t5",
        name: "Tokyo Halal Restaurant",
        price: "¥1,000–1,800",
        priceRaw: 1400,
        cert: "certified",
        certLabel: "Halal Certified",
        menu: "Nasi goreng, soto ayam, masakan Indonesia & Malaysia authentic",
        location: "Shibuya, dekat stasiun",
        area: "Shibuya",
        rating: 4.4,
        mapQ: "Tokyo+Halal+Restaurant+Shibuya",
        img: "https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=700&q=80"
      },
      {
        id: "r-t6",
        name: "Matagi Halal Burger",
        price: "¥1,000–1,500",
        priceRaw: 1250,
        cert: "no-pork",
        certLabel: "No Pork No Lard",
        menu: "Beef burger halal premium, loaded fries, classic milkshake",
        location: "Akihabara area",
        area: "Akihabara",
        rating: 4.4,
        mapQ: "Halal+Burger+Akihabara",
        img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&q=80"
      }
    ],

    /* ─────────────── OSAKA ─────────────── */
    osaka: [
      {
        id: "r-o1",
        name: "Halal Okonomiyaki Kaname",
        price: "¥1,200–1,800",
        priceRaw: 1500,
        cert: "certified",
        certLabel: "Halal Certified",
        menu: "Okonomiyaki halal seafood & beef, yakisoba, pancake kubis khas Osaka",
        location: "Dotonbori area, Osaka",
        area: "Dotonbori",
        rating: 4.7,
        mapQ: "Halal+Okonomiyaki+Dotonbori+Osaka",
        img: "https://images.unsplash.com/photo-1570275239925-4af0aa93a0dc?w=700&q=80"
      },
      {
        id: "r-o2",
        name: "Halal Takoyaki Dotonbori",
        price: "¥500–800",
        priceRaw: 650,
        cert: "no-pork",
        certLabel: "No Pork No Lard",
        menu: "Takoyaki halal fresh gurita crispy, halal mayo, bonito flakes, saus manis",
        location: "Dotonbori, depan Glico sign",
        area: "Dotonbori",
        rating: 4.5,
        mapQ: "Halal+Takoyaki+Dotonbori+Osaka",
        img: "https://static01.nyt.com/images/2024/01/10/multimedia/ND-Takoyaki-wfhg/ND-Takoyaki-wfhg-superJumbo.jpg"
      },
      {
        id: "r-o3",
        name: "Naritaya Osaka Namba",
        price: "¥1,200–2,000",
        priceRaw: 1600,
        cert: "certified",
        certLabel: "Halal Certified",
        menu: "Ramen halal legendaris cabang Osaka, broth sapi pekat, chashu ayam",
        location: "Namba, 3 mnt jalan kaki dari stasiun",
        area: "Namba",
        rating: 4.8,
        mapQ: "Naritaya+Namba+Osaka+Halal",
        img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700&q=80"
      },
      {
        id: "r-o4",
        name: "Ramen Halal Osaka Noodles",
        price: "¥900–1,400",
        priceRaw: 1150,
        cert: "muslim-friendly",
        certLabel: "Muslim Friendly",
        menu: "Shoyu ramen, miso ramen tanpa babi, tsukemen Osaka style",
        location: "Shinsaibashi",
        area: "Shinsaibashi",
        rating: 4.3,
        mapQ: "Halal+Ramen+Shinsaibashi+Osaka",
        img: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=700&q=80"
      },
      {
        id: "r-o5",
        name: "Grand Front Halal Corner",
        price: "¥1,500–2,500",
        priceRaw: 2000,
        cert: "no-pork",
        certLabel: "No Pork No Lard",
        menu: "Berbagai pilihan makan siang halal-friendly, curry, bento set",
        location: "Grand Front Osaka, Umeda",
        area: "Umeda",
        rating: 4.2,
        mapQ: "Grand+Front+Osaka+Halal",
        img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=700&q=80"
      }
    ],

    /* ─────────────── KYOTO ─────────────── */
    kyoto: [
      {
        id: "r-k1",
        name: "Halal Nishiki Tofu Set",
        price: "¥1,000–1,800",
        priceRaw: 1400,
        cert: "certified",
        certLabel: "Halal Certified",
        menu: "Tofu kaiseki khas Kyoto, soba halal gandum segar buatan tangan, Kyoto bento",
        location: "Nishiki Market, Kawasan Pasar Basah",
        area: "Nishiki Market",
        rating: 4.6,
        mapQ: "Halal+Nishiki+Tofu+Kyoto",
        img: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=700&q=80"
      },
      {
        id: "r-k2",
        name: "Nishiki Karaage Halal",
        price: "¥600–900",
        priceRaw: 750,
        cert: "certified",
        certLabel: "Halal Certified",
        menu: "Karaage halal crispy juicy, onigiri halal salmon & tuna, snack jalanan",
        location: "Karasuma Oike",
        area: "Karasuma",
        rating: 4.4,
        mapQ: "Halal+Karaage+Nishiki+Kyoto",
        img: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=700&q=80"
      },
      {
        id: "r-k3",
        name: "Kyoto Halal Udon & Yudofu",
        price: "¥1,200–2,000",
        priceRaw: 1600,
        cert: "muslim-friendly",
        certLabel: "Muslim Friendly",
        menu: "Udon kuah halal, yudofu (tofu hot pot tradisional), set vegan-friendly Gion",
        location: "Gion district, dekat Yasaka Shrine",
        area: "Gion",
        rating: 4.5,
        mapQ: "Halal+Udon+Gion+Kyoto",
        img: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=700&q=80"
      },
      {
        id: "r-k4",
        name: "Arashiyama Halal Bento",
        price: "¥1,000–1,500",
        priceRaw: 1250,
        cert: "certified",
        certLabel: "Halal Certified",
        menu: "Bento halal take-away premium, onigiri set, nasi salmon panggang",
        location: "Arashiyama, dekat gerbang utama",
        area: "Arashiyama",
        rating: 4.3,
        mapQ: "Halal+Bento+Arashiyama+Kyoto",
        img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=700&q=80"
      }
    ],

    /* ─────────────── HOKKAIDO ─────────────── */
    hokkaido: [
      {
        id: "r-h1",
        name: "Sapporo Halal Lamb BBQ",
        price: "¥2,500–4,000",
        priceRaw: 3500,
        cert: "certified",
        certLabel: "Halal Certified",
        menu: "Jingisukan domba halal khas Hokkaido, panggang di meja, sayur segar",
        location: "Kawasan komersil Susukino, Sapporo",
        area: "Susukino, Sapporo",
        rating: 4.9,
        mapQ: "Halal+Jingisukan+Sapporo",
        img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=700&q=80"
      },
      {
        id: "r-h2",
        name: "Sapporo Miso Ramen Halal",
        price: "¥1,000–1,500",
        priceRaw: 1250,
        cert: "muslim-friendly",
        certLabel: "Muslim Friendly",
        menu: "Miso ramen Hokkaido rich & creamy tanpa babi, corn butter topping",
        location: "Sapporo Susukino, dekat TV Tower",
        area: "Susukino, Sapporo",
        rating: 4.6,
        mapQ: "Halal+Miso+Ramen+Sapporo",
        img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700&q=80"
      },
      {
        id: "r-h3",
        name: "Otaru Halal Seafood Bowl",
        price: "¥2,000–3,500",
        priceRaw: 2750,
        cert: "no-pork",
        certLabel: "No Pork",
        menu: "Kaisen-don seafood bowl segar: salmon, ikura, uni, ikan panggang khas Otaru",
        location: "Otaru Sankaku Market, dekat kanal",
        area: "Otaru Market",
        rating: 4.7,
        mapQ: "Halal+Kaisen+Otaru+Hokkaido",
        img: "https://images.squarespace-cdn.com/content/v1/5021287084ae954efd31e9f4/940bf98a-a6e9-450a-babb-ce4be90225a1/Kaisen+Chirashi+Don+-+online+delivery+and+ordering.jpg"
      },
      {
        id: "r-h4",
        name: "Hakodate Halal Morning Market",
        price: "¥1,500–3,000",
        priceRaw: 2250,
        cert: "no-pork",
        certLabel: "No Pork",
        menu: "Seafood breakfast set, crab donburi, squid sashimi segar dari pasar pagi",
        location: "Hakodate Morning Market",
        area: "Hakodate",
        rating: 4.5,
        mapQ: "Halal+Hakodate+Morning+Market+Hokkaido",
        img: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=700&q=80"
      }
    ]
  },

  /* ─────────────── KONBINI GUIDE ─────────────── */
  konbiniData: [
    {
      logo: "🟢",
      name: "Lawson",
      items: [
        "Onigiri isi Salmon / Kombu / Tuna Mayo",
        "Sandwich telur rebus hancur (Egg Salad)",
        "Udon cup berkuah segera (mesra vegetarian)",
        "Roti kacang merah empuk (An-pan)",
        "Snek kek mochi coklat & strawberry"
      ]
    },
    {
      logo: "🔵",
      name: "FamilyMart",
      items: [
        "Onigiri isi salmon panggang masin",
        "Edamame rebus segar dingin",
        "Puding karamel & custard Meiji",
        "Pasta tomato sauce cup tanpa daging babi",
        "Teh hijau dingin Oi Ocha"
      ]
    },
    {
      logo: "🟠",
      name: "7-Eleven",
      items: [
        "Onigiri isi tuna mayonis & nori",
        "Soba sejuk cup khas kicap nipis",
        "Kacang campur & buah-buahan kering",
        "Yogurt probiotik minuman buah segar",
        "Kopi ais hitam cold brew Starbucks"
      ]
    }
  ],

  /* ─────────────── MUSHOLLA GUIDE ─────────────── */
  mushollaGuide: [
    "Tokyo Camii (Yoyogi/Shibuya) — masjid terbesar Jepang, fasilitas lengkap",
    "Bandara Narita & Haneda — prayer room tersedia, tanya info desk",
    "AEON Mall & Grand Front Osaka — musholla tersedia di dalam mall",
    "Download Muslim Pro / HalalNavi — cari musholla & halal food terdekat",
    "Masjid Kyoto (Nakagyo-ku) — musholla & kajian Islam aktif",
    "Sapporo Mosque (Kita-ku) — komunitas Muslim aktif di Hokkaido",
    "Bawa sajadah lipat & mukena sendiri untuk ketenangan"
  ],

  /* ─────────────── SOUVENIRS ─────────────── */
  souvenirs: [
    { emoji: "🍫", name: "KitKat Japan Flavors", price: "¥300–800", priceRaw: 550, place: "Don Quijote, kombini, airport", taxFree: false, tags: ["Matcha", "Sakura", "Sake", "Hokkaido Milk"] },
    { emoji: "🍵", name: "Matcha Premium", price: "¥500–3,000", priceRaw: 1750, place: "Ippodo Tea (Kyoto), Lupicia", taxFree: true, tags: ["Ceremonial", "Cooking", "Sets"] },
    { emoji: "⚔️", name: "Samurai Souvenir Set", price: "¥1,000–5,000", priceRaw: 3000, place: "Asakusa Nakamise, Kamakura", taxFree: false, tags: ["Fans", "Chopsticks", "Noren"] },
    { emoji: "🎌", name: "Anime Merchandise", price: "¥500–10,000", priceRaw: 5250, place: "Akihabara, Nakano Broadway", taxFree: true, tags: ["Figures", "Manga", "Plushies"] },
    { emoji: "🧴", name: "Skincare Jepang", price: "¥800–3,000", priceRaw: 1900, place: "Matsumoto Kiyoshi, Don Quijote", taxFree: true, tags: ["Hada Labo", "SKII", "DHC"] },
    { emoji: "🍬", name: "Dagashi Candy Set", price: "¥300–800", priceRaw: 550, place: "Dagashi-ya, konbini", taxFree: false, tags: ["Umaibo", "Hi-Chew", "Pocky"] },
    { emoji: "🏮", name: "Traditional Crafts", price: "¥500–5,000", priceRaw: 2750, place: "Kyoto Nishiki, Asakusa", taxFree: false, tags: ["Tenugui", "Furoshiki", "Kokeshi"] },
    { emoji: "🍪", name: "Don Quijote Items", price: "¥200–2,000", priceRaw: 1100, place: "Don Quijote (nationwide)", taxFree: true, tags: ["Snacks", "Cosmetics", "Novelty"] }
  ]
};
