// js/supabase.js
(function () {
    // ====================================================================
    // CONFIG PRODUKSI SUPABASE (HARDCODED ATAU NETLIFY ENVIRONMENT)
    // ====================================================================
    // Silakan isi langsung URL dan ANON KEY proyek Supabase Anda di bawah ini:
    let url = 'https://xkhuccemhjnceqsxwpcw.supabase.co';
    let key = 'sb_publishable_jK2VrzVwA8w675XX53iK1A_7wT8NRZE'

    // Fallback: Membaca dari window (misal disuntikkan via Netlify Snippets)
    if (typeof window !== 'undefined') {
        url = url || window.ENV_SUPABASE_URL || window.SUPABASE_URL;
        key = key || window.ENV_SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY;
    }

    // Fallback: Membaca dari environment variables (jika ada build step di Netlify)
    if (typeof process !== 'undefined' && process.env) {
        url = url || process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
        key = key || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    }

    // Default placeholders jika belum diisi agar tidak error saat inisialisasi awal
    url = url || 'https://YOUR_SUPABASE_PROJECT.supabase.co';
    key = key || 'YOUR_SUPABASE_ANON_KEY';

    window.SUPABASE_CONFIGURED = false;
    window.supabaseClient = null;

    // Periksa apakah url/key valid dan bukan placeholder bawaan
    const isUrlPlaceholder = url.includes('YOUR_SUPABASE_PROJECT') || url === '';
    const isKeyPlaceholder = key.includes('YOUR_SUPABASE_ANON_KEY') || key === '';

    if (!isUrlPlaceholder && !isKeyPlaceholder) {
        try {
            // Inisialisasi client global dari global window.supabase (loaded via CDN)
            window.supabaseClient = window.supabase.createClient(url.trim(), key.trim());
            window.SUPABASE_CONFIGURED = true;
            console.log("Supabase Client initialized successfully.");
        } catch (e) {
            console.error("Gagal menginisialisasi Supabase Client:", e);
        }
    } else {
        console.warn("Supabase belum terkonfigurasi. Silakan isi URL & Anon Key di js/supabase.js atau melalui variabel lingkungan Netlify.");
    }
})();
