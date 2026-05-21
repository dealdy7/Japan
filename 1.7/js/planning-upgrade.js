/**
 * planning-upgrade.js
 * Upgrade tab "Planning Trip" dengan visualisasi budget group travel
 * OVERRIDE fungsi planning di baru-logic.js
 */

// ══════════════════════════════════════════════════════
// FORMAT HELPERS — Format harga yang jelas & tidak ambigu
// ══════════════════════════════════════════════════════
function fmtRp(n) {
    // Format: "Rp 8.000.000" — tidak menggunakan "/" yang bisa disalahartikan
    return 'Rp\u00a0' + Math.round(n).toLocaleString('id-ID');
}

function getExchangeRate() {
    const saved = localStorage.getItem('jpy_idr_rate');
    if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    if (typeof KURS_RATE !== 'undefined') return KURS_RATE;
    return 105; // Fallback
}

function fmtValWithSubtitle(val, isRupiah, htmlMode = true) {
    const rounded = Math.round(val);
    const hasDecimals = (val % 1 !== 0) || (val !== rounded);
    
    if (isRupiah) {
        const roundedStr = 'Rp\u00a0' + rounded.toLocaleString('id-ID');
        if (hasDecimals) {
            const exactStr = 'Rp\u00a0' + val.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
            if (htmlMode) {
                return `${roundedStr} <span style="font-size: 10px; color: var(--t3); font-weight: 400; display: inline-block;">(asli: ${exactStr})</span>`;
            } else {
                return `${roundedStr} (asli: ${exactStr})`;
            }
        }
        return roundedStr;
    } else {
        const roundedStr = '≈ ¥' + rounded.toLocaleString('id-ID');
        if (hasDecimals) {
            const exactStr = '¥' + val.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
            if (htmlMode) {
                return `${roundedStr} <span style="font-size: 10px; color: var(--t3); font-weight: 400; display: inline-block;">(asli: ${exactStr})</span>`;
            } else {
                return `${roundedStr} (asli: ${exactStr})`;
            }
        }
        return roundedStr;
    }
}

// ══════════════════════════════════════════════════════
// CENTRALIZED STATE & PERSISTENCE FOR GROUP TRIP (OPTION D)
// ══════════════════════════════════════════════════════
let groupTripState = {
    persons: 3,
    flightPerPerson: 3500000,
    hotelPerNight: 800000,
    nights: 6,
    transportPerPerson: 600000,
    souvenirPerPerson: 300000
};

// Load saved preset if exists
function loadGroupTripState() {
    const saved = localStorage.getItem('nippon_group_trip_preset');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
                groupTripState = { ...groupTripState, ...parsed };
            }
        } catch (e) {
            console.error('Failed to load group trip preset:', e);
        }
    }
}
loadGroupTripState();

function saveGroupTripState() {
    localStorage.setItem('nippon_group_trip_preset', JSON.stringify(groupTripState));
}

function resetGroupTripState() {
    groupTripState = {
        persons: 3,
        flightPerPerson: 3500000,
        hotelPerNight: 800000,
        nights: 6,
        transportPerPerson: 600000,
        souvenirPerPerson: 300000
    };
    saveGroupTripState();
}

function getUpdatedOptionD() {
    const n = groupTripState.persons;
    const nights = groupTripState.nights;
    const days = nights + 1;

    // Makanan: Rp300.000 per hari, 2 hari konbini Rp150.000 per hari. Hitung otomatis.
    const foodPerPerson = Math.max(0, days - 2) * 300000 + Math.min(days, 2) * 150000;
    
    const flightTotal = groupTripState.flightPerPerson * n;
    const hotelTotal = groupTripState.hotelPerNight * nights; // Shared hotel
    const foodTotal = foodPerPerson * n;
    const transportTotal = groupTripState.transportPerPerson * n;
    const souvenirTotal = groupTripState.souvenirPerPerson * n;

    // Budget flat Rp8.000.000 per person
    const budgetPerPerson = 8000000;
    const totalIDR = budgetPerPerson * n;

    // Wisata & Cadangan (sebagai penyeimbang budget flat)
    const hotelPerPerson = hotelTotal / n;
    const wisataPerPerson = budgetPerPerson - groupTripState.flightPerPerson - hotelPerPerson - groupTripState.transportPerPerson - foodPerPerson - groupTripState.souvenirPerPerson;
    const wisataTotal = wisataPerPerson * n;

    const sisaSpendingIDR = budgetPerPerson - groupTripState.flightPerPerson - hotelPerPerson;
    const sisaSpendingJPY = sisaSpendingIDR / getExchangeRate();

    return {
        id: 'D', label: 'Group Patungan', icon: '👥',
        totalIDR: totalIDR, persons: n,
        flight: flightTotal, hotel: hotelTotal, food: foodTotal, transport: transportTotal, souvenir: souvenirTotal, wisata: wisataTotal,
        flightNote: `Tiket PP (${fmtRp(groupTripState.flightPerPerson)}/org)`,
        hotelNote: `Hotel shared (${nights} malam, ${fmtRp(groupTripState.hotelPerNight)}/malam)`,
        foodNote: `Makan ${days} hari (${fmtRp(foodPerPerson)}/org, 2 hari konbini)`,
        transportNote: `Transport (${fmtRp(groupTripState.transportPerPerson)}/org)`,
        souvenirNote: `Souvenir & Belanja (${fmtRp(groupTripState.souvenirPerPerson)}/org)`,
        wisataNote: `Wisata & Cadangan (${fmtValWithSubtitle(wisataPerPerson, true)})`,
        color: '#c084fc', colorDim: 'rgba(192,132,252,.1)', colorBorder: 'rgba(192,132,252,.22)',
        desc: `Trip seru bareng ${n} orang — bayar lebih hemat, pengalaman lebih meriah!`,
        style: `Business Hotel (shared ${n} org)`, stars: '★★★',
        highlights: [
            `Patungan ${n} orang = ${fmtRp(budgetPerPerson)}/orang (Flat!)`,
            `Hotel shared room (${fmtRp(groupTripState.hotelPerNight)}/malam)`,
            `Sisa spending Jepang: ${fmtValWithSubtitle(sisaSpendingIDR, true, false)}`,
            `Yen bisa dipakai: ${fmtValWithSubtitle(sisaSpendingJPY, false, false)}`
        ],
        groupNote: `Budget Patungan ${n} Orang`
    };
}

// ══════════════════════════════════════════════════════
// DATA STRUCTURE — PLAN OPTIONS (4 options termasuk Group)
// Cara tambah opsi baru: tambah objek ke array ini
// Field 'persons': jumlah orang patungan (default 1)
// Semua harga dalam IDR
// ══════════════════════════════════════════════════════
const PLAN_OPTIONS_V2 = [
    {
        id: 'A', label: 'Budget Traveler', icon: '🎒',
        totalIDR: 8000000, persons: 1,
        flight: 3600000, hotel: 1700000, food: 1200000, transport: 900000, souvenir: 600000, wisata: 0,
        flightNote: 'CGK–NRT PP promo',
        hotelNote: 'Hostel / Capsule, ~¥2.300/malam',
        foodNote: 'Konbini + budget resto',
        transportNote: 'IC Card + JR Pass partial',
        souvenirNote: 'Budget fleksibel',
        wisataNote: 'Banyak destinasi gratis',
        color: '#3ddc84', colorDim: 'rgba(61,220,132,.1)', colorBorder: 'rgba(61,220,132,.22)',
        desc: 'Perjalanan hemat maksimal — konbini, hostel, dan IC Card.',
        style: 'Hostel / Capsule Hotel', stars: '★★',
        highlights: ['Hostel dorm atau capsule hotel', 'Makan konbini 2–3x/hari', 'IC Card untuk semua transport', 'Wisata gratis & low cost']
    },
    {
        id: 'B', label: 'Mid Traveler', icon: '🧳',
        totalIDR: 14000000, persons: 1,
        flight: 5500000, hotel: 4500000, food: 2000000, transport: 1200000, souvenir: 800000, wisata: 0,
        flightNote: 'Tiket reguler CGK–NRT PP',
        hotelNote: 'Business Hotel ★★★, ~¥6.000/malam',
        foodNote: 'Restoran budget + konbini',
        transportNote: 'JR Pass 7 hari + IC Card',
        souvenirNote: 'Oleh-oleh standar',
        wisataNote: 'Tiket wisata berbayar',
        color: '#f4a7b9', colorDim: 'rgba(244,167,185,.1)', colorBorder: 'rgba(244,167,185,.22)',
        desc: 'Keseimbangan kenyamanan & budget — hotel bintang 3, restoran.',
        style: 'Business Hotel ★★★', stars: '★★★',
        highlights: ['Business hotel ★★★ twin/double', 'Mix konbini + restoran halal', 'JR Pass 7 hari full', 'Museum & tempat berbayar']
    },
    {
        id: 'C', label: 'Comfortable', icon: '✈️',
        totalIDR: 22000000, persons: 1,
        flight: 8000000, hotel: 9000000, food: 3000000, transport: 1500000, souvenir: 500000, wisata: 1000000,
        flightNote: 'Direct flight CGK–NRT',
        hotelNote: 'Hotel ★★★★–★★★★★, ~¥12.000/malam',
        foodNote: 'Fine dining & restoran premium',
        transportNote: 'JR Pass + private transfer',
        souvenirNote: 'Oleh-oleh premium',
        wisataNote: 'Tiket premium & priority',
        color: '#d4af37', colorDim: 'rgba(212,175,55,.1)', colorBorder: 'rgba(212,175,55,.22)',
        desc: 'Pengalaman premium — hotel bintang 4-5 dan fine dining.',
        style: 'Hotel ★★★★–★★★★★', stars: '★★★★★',
        highlights: ['Hotel mewah ★★★★–★★★★★', 'Fine dining & restoran premium', 'Direct flight + private car', 'Wisata VIP & priority access']
    },
    {
        // Placeholder for Option D, will be synced dynamically
        id: 'D', label: 'Group Patungan', icon: '👥',
        totalIDR: 24000000, persons: 3,
        flight: 10500000, hotel: 5600000, food: 3000000, transport: 1800000, souvenir: 900000, wisata: 2200000,
        flightNote: 'Tiket PP (×Rp3.5jt/orang)',
        hotelNote: 'Hotel shared (7 malam, Rp800rb/malam)',
        foodNote: 'Makan 7 hari (Rp1jt/orang)',
        transportNote: 'Transport (Rp600rb/orang)',
        souvenirNote: 'Souvenir & Belanja (Rp300rb/orang)',
        wisataNote: 'Wisata & Cadangan (Rp733.333/orang)',
        color: '#c084fc', colorDim: 'rgba(192,132,252,.1)', colorBorder: 'rgba(192,132,252,.22)',
        desc: 'Trip seru bareng 3 orang — bayar lebih hemat, pengalaman lebih meriah!',
        style: 'Business Hotel (shared 3 org)', stars: '★★★',
        highlights: ['Patungan 3 orang = Rp8.000.000/orang', 'Hotel shared room (Rp800rb/malam)', 'Transport manual input: Rp600.000', 'Wisata & Cadangan: Rp733.333'],
        groupNote: 'Budget Patungan 3 Orang'
    },
];

// Helper to sync Option D dynamic data
function syncPlanOptions() {
    const updatedD = getUpdatedOptionD();
    PLAN_OPTIONS_V2[3] = updatedD;
    if (typeof PLAN_OPTIONS !== 'undefined') {
        if (PLAN_OPTIONS.length > 3) {
            PLAN_OPTIONS[3] = updatedD;
        } else {
            PLAN_OPTIONS.length = 0;
            PLAN_OPTIONS_V2.forEach(opt => PLAN_OPTIONS.push(opt));
        }
    }
}
syncPlanOptions();


// State untuk planning
let planPersonsOverride = 1;
let planPieChartRef = null;

// Parameter update functions for Group Patungan
function updateGroupParam(key, val) {
    let num = parseInt(val) || 0;
    if (key === 'nights') {
        num = Math.max(1, num);
    }
    groupTripState[key] = num;
    syncPlanOptions();
    // Render ulang UI
    renderPlanOptionsV2();
    renderPlanBannerV2();
    renderBudgetDashboard();
    renderItinerary();
}

function resetGroupTripParams() {
    resetGroupTripState();
    syncPlanOptions();
    renderPlanOptionsV2();
    renderPlanBannerV2();
    renderBudgetDashboard();
    renderItinerary();
}

function saveGroupTripParams() {
    saveGroupTripState();
    const btn = document.querySelector('button[onclick="saveGroupTripParams()"]');
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Tersimpan!';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 1500);
    }
}

// ══════════════════════════════════════════════════════
// OVERRIDE: selectPlan — gabungkan dengan update persons
// ══════════════════════════════════════════════════════
function selectPlan(id) {
    state.planSel = id;
    state.openDay = null;
    syncPlanOptions(); // Pastikan data Option D sinkron sebelum render
    const opt = PLAN_OPTIONS_V2.find(p => p.id === id);
    if (id === 'D') {
        planPersonsOverride = groupTripState.persons;
    } else {
        planPersonsOverride = opt ? opt.persons : 1;
    }
    renderPlanOptionsV2();
    renderPlanBannerV2();
    renderBudgetDashboard();
    renderItinerary();
}

// ══════════════════════════════════════════════════════
// OVERRIDE: Toggle jumlah orang untuk kalkulator budget
// Cara mengubah jumlah orang: panggil setPlanPersons(n)
// ══════════════════════════════════════════════════════
function setPlanPersons(n) {
    planPersonsOverride = n;
    if (state.planSel === 'D') {
        groupTripState.persons = n;
        syncPlanOptions();
        // Render ulang kartu pilihan dan banner agar sinkron
        renderPlanOptionsV2();
        renderPlanBannerV2();
    }
    document.querySelectorAll('.persons-btn').forEach(b => {
        b.classList.toggle('active', parseInt(b.dataset.n) === n);
    });
    renderBudgetDashboard();
}

// ══════════════════════════════════════════════════════
// OVERRIDE: renderPlanning — tambah budget dashboard
// ══════════════════════════════════════════════════════
function renderPlanning() {
    renderPlanOptionsV2();
    renderPlanBannerV2();
    renderBudgetDashboard();
    renderItinerary();
}

// ══════════════════════════════════════════════════════
// OVERRIDE: renderPlanOptions — tampilkan 4 opsi dengan
// format harga yang jelas (TOTAL + PER ORANG terpisah)
// ══════════════════════════════════════════════════════
function renderPlanOptionsV2() {
    const el = document.getElementById('plan-options');
    if (!el) return;

    el.innerHTML = PLAN_OPTIONS_V2.map(opt => {
        const active = state.planSel === opt.id;
        const isGroup = opt.persons > 1;
        const perPerson = isGroup ? Math.round(opt.totalIDR / opt.persons) : null;
        const nights = opt.id === 'D' ? groupTripState.nights : 6;

        const cats = [
            { l: '✈️ Tiket Pesawat', v: opt.flight, note: opt.flightNote },
            { l: '🏨 Hotel (' + nights + ' malam)', v: opt.hotel, note: opt.hotelNote },
            { l: '🍱 Makan & Jajanan', v: opt.food, note: opt.foodNote },
            { l: '🚆 Transportasi', v: opt.transport, note: opt.transportNote },
            { l: '🎁 Souvenir', v: opt.souvenir, note: opt.souvenirNote },
        ];

        return `
        <div class="plan-option-card${active ? ' active' : ''}" onclick="selectPlan('${opt.id}')"
            id="plan-opt-${opt.id}"
            style="background:${active ? opt.colorDim : 'rgba(255,255,255,.03)'};
                   border-color:${active ? opt.colorBorder : 'rgba(255,255,255,.07)'};
                   box-shadow:${active ? `0 0 32px ${opt.colorBorder},0 16px 40px rgba(0,0,0,.35)` : 'none'}">

            <!-- HEADER ROW -->
            <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.8rem;gap:8px">
                <div style="display:flex;align-items:center;gap:10px">
                    <span style="font-size:1.8rem;flex-shrink:0">${opt.icon}</span>
                    <div>
                        <div style="font-family:'Playfair Display';font-weight:700;font-size:15px;color:var(--t);line-height:1.2">${opt.label}</div>
                        <div style="font-size:11px;color:${opt.color};font-weight:600;margin-top:3px">${opt.stars} ${opt.style}</div>
                    </div>
                </div>
                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0">
                    ${active ? `<span style="font-size:10px;font-weight:700;background:${opt.colorDim};color:${opt.color};border:1px solid ${opt.colorBorder};padding:3px 9px;border-radius:100px">AKTIF</span>` : ''}
                    ${isGroup
                        ? `<span style="font-size:10px;font-weight:700;background:rgba(192,132,252,.15);color:#c084fc;border:1px solid rgba(192,132,252,.3);padding:3px 9px;border-radius:100px">👥 ${opt.persons} Orang</span>`
                        : `<span style="font-size:10px;color:var(--t3);padding:3px 9px">👤 1 Orang</span>`}
                </div>
            </div>

            <!-- DESKRIPSI -->
            <div style="font-size:12px;color:var(--t2);line-height:1.6;margin-bottom:.9rem">${opt.desc}</div>

            <!-- BUDGET BLOCK — Format TOTAL dan PER ORANG yang jelas -->
            <div style="background:${opt.colorDim};border:1px solid ${opt.colorBorder};border-radius:12px;padding:.85rem 1rem;margin-bottom:.9rem">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem;flex-wrap:wrap">
                    <!-- TOTAL -->
                    <div>
                        <div style="font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:.1em;font-weight:700;margin-bottom:3px">💰 TOTAL BUDGET</div>
                        <div style="font-family:'Playfair Display';font-size:1.5rem;font-weight:700;color:${opt.color};line-height:1">${fmtValWithSubtitle(opt.totalIDR, true)}</div>
                        <div style="font-size:9px;color:var(--t3);margin-top:3px">7 hari all-in termasuk tiket pesawat</div>
                    </div>
                    <!-- PER ORANG (hanya untuk group) -->
                    ${isGroup ? `
                    <div style="text-align:right;background:rgba(192,132,252,.12);border:1px solid rgba(192,132,252,.3);border-radius:8px;padding:.6rem .85rem">
                        <div style="font-size:9px;color:#c084fc;text-transform:uppercase;letter-spacing:.1em;font-weight:700;margin-bottom:3px">PATUNGAN ${opt.persons} ORANG</div>
                        <div style="font-family:'Playfair Display';font-size:1.15rem;font-weight:700;color:#c084fc;line-height:1">${fmtValWithSubtitle(perPerson, true)}</div>
                        <div style="font-size:9px;color:var(--t3);margin-top:2px">per orang</div>
                    </div>` : ''}
                </div>
            </div>

            <!-- KATEGORI BREAKDOWN dengan mini progress bar -->
            <div style="display:flex;flex-direction:column;gap:5px">
                ${cats.map(({ l, v, note }) => {
                    const pct = opt.totalIDR > 0 ? Math.round((v / opt.totalIDR) * 100) : 0;
                    return `
                    <div style="padding:4px 0;border-bottom:1px solid rgba(255,255,255,.05)">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">
                            <span style="font-size:11px;color:var(--t2)">${l}</span>
                            <span style="font-size:12px;font-weight:600;color:var(--t)">${fmtValWithSubtitle(v, true)}</span>
                        </div>
                        <div style="height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden;margin-bottom:2px">
                            <div style="height:100%;width:${pct}%;background:${opt.color};border-radius:2px"></div>
                        </div>
                        <div style="font-size:9px;color:var(--t3)">${note} • ${pct}%</div>
                    </div>`;
                }).join('')}
            </div>

            ${(typeof currencyMode !== 'undefined' && currencyMode === 'dual') ? `
            <div style="margin-top:.8rem;text-align:center;padding:6px;border-radius:9px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);font-size:10px;color:var(--t3)">
                ≈ ${typeof jpy === 'function' && typeof IDR !== 'undefined' ? jpy(Math.round(opt.totalIDR / IDR)) : ''} total dalam JPY
            </div>` : ''}
        </div>`;
    }).join('');
}

// ══════════════════════════════════════════════════════
// OVERRIDE: renderPlanBanner — tampilkan info group
// ══════════════════════════════════════════════════════
function renderPlanBannerV2() {
    const bannerEl = document.getElementById('plan-banner');
    if (!bannerEl) return;
    const opt = PLAN_OPTIONS_V2.find(p => p.id === state.planSel);
    if (!opt) return;

    const isGroup = opt.persons > 1;
    const perPerson = Math.round(opt.totalIDR / opt.persons);

    bannerEl.style.cssText = `background:linear-gradient(135deg,${opt.colorDim},rgba(255,255,255,.02));border:1px solid ${opt.colorBorder};border-radius:16px;padding:1.4rem 1.75rem;margin-bottom:2rem;display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap`;
    bannerEl.innerHTML = `
        <div style="font-size:2.5rem">${opt.icon}</div>
        <div style="flex:1;min-width:200px">
            <div style="font-family:'Playfair Display';font-size:1.3rem;font-weight:700;color:var(--t)">${opt.label} — Option ${opt.id} ${isGroup ? '👥' : '👤'}</div>
            <div style="font-size:13px;color:var(--t2);margin-top:3px">${opt.desc}</div>
            ${isGroup ? `<div style="margin-top:7px;display:inline-block;background:rgba(192,132,252,.15);border:1px solid rgba(192,132,252,.3);color:#c084fc;font-size:11px;font-weight:700;padding:3px 12px;border-radius:100px">${opt.groupNote || 'Group Travel'}</div>` : ''}
        </div>
        <div style="text-align:right">
            <div style="font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.08em">Total Budget</div>
            <div style="font-family:'Playfair Display';font-size:1.8rem;font-weight:700;color:${opt.color}">${fmtValWithSubtitle(opt.totalIDR, true)}</div>
            ${isGroup ? `
            <div style="margin-top:6px;background:${opt.colorDim};border:1px solid ${opt.colorBorder};border-radius:8px;padding:5px 10px;text-align:right">
                <div style="font-size:9px;color:var(--t3);text-transform:uppercase">per orang (${opt.persons} orang)</div>
                <div style="font-size:1.1rem;font-weight:700;color:#c084fc">${fmtValWithSubtitle(perPerson, true)}</div>
            </div>
            ` : `<div style="font-size:11px;color:var(--t3);margin-top:2px">7 hari • ${opt.style}</div>`}
        </div>
    `;
}

// ══════════════════════════════════════════════════════
// BARU: renderBudgetDashboard
// ══════════════════════════════════════════════════════
function renderBudgetDashboard() {
    const el = document.getElementById('plan-budget-dashboard');
    if (!el) return;

    const opt = PLAN_OPTIONS_V2.find(p => p.id === state.planSel);
    if (!opt) return;

    const n = planPersonsOverride || opt.persons;
    const isGroupD = opt.id === 'D';

    // Budget Per Orang
    const budgetPerPerson = isGroupD ? 8000000 : Math.round(opt.totalIDR / n);
    const totalGroupBudget = isGroupD ? (8000000 * n) : opt.totalIDR;

    // Flight
    const flightPerPerson = isGroupD ? groupTripState.flightPerPerson : Math.round(opt.flight / n);
    const flightTotal = isGroupD ? (flightPerPerson * n) : opt.flight;

    // Hotel (nights based)
    const nights = isGroupD ? groupTripState.nights : 6;
    const days = nights + 1;
    const hotelTotal = isGroupD ? (groupTripState.hotelPerNight * nights) : opt.hotel;
    const hotelPerPerson = hotelTotal / n;

    // Food
    const foodPerPerson = isGroupD 
        ? (Math.max(0, days - 2) * 300000 + Math.min(days, 2) * 150000) 
        : Math.round(opt.food / n);
    const foodTotal = isGroupD ? (foodPerPerson * n) : opt.food;

    // Transport
    const transportPerPerson = isGroupD ? groupTripState.transportPerPerson : Math.round(opt.transport / n);
    const transportTotal = isGroupD ? (transportPerPerson * n) : opt.transport;

    // Souvenir
    const souvenirPerPerson = isGroupD ? groupTripState.souvenirPerPerson : Math.round(opt.souvenir / n);
    const souvenirTotal = isGroupD ? (souvenirPerPerson * n) : opt.souvenir;

    // Wisata & Cadangan (Balancer for D, split for others)
    const wisataPerPerson = isGroupD
        ? (budgetPerPerson - flightPerPerson - hotelPerPerson - transportPerPerson - foodPerPerson - souvenirPerPerson)
        : Math.round((opt.wisata || 0) / n);
    const wisataTotal = isGroupD ? (wisataPerPerson * n) : (opt.wisata || 0);

    // Total Terpakai (5 Pos Utama)
    const totalTerpakai = flightPerPerson + hotelPerPerson + transportPerPerson + foodPerPerson + souvenirPerPerson;

    // Sisa Spending Jepang (Highlight)
    const sisaSpendingIDR = budgetPerPerson - flightPerPerson - hotelPerPerson;
    const sisaSpendingJPY = sisaSpendingIDR / getExchangeRate();

    // Kategori pengeluaran (selain pesawat)
    const cats = [
        { ic: '🏨', label: 'Penginapan', key: 'hotel', color: '#f4a7b9', desc: `${nights} malam`, note: opt.hotelNote },
        { ic: '🚆', label: 'Transportasi', key: 'transport', color: '#6699ff', desc: 'IC Card / Pass', note: opt.transportNote },
        { ic: '🍱', label: 'Makan & Jajanan', key: 'food', color: '#d4af37', desc: `${days} hari`, note: opt.foodNote },
        { ic: '🎟️', label: 'Tiket Wisata', key: 'wisata', color: '#c084fc', desc: 'Wisata & Cadangan', note: opt.wisataNote },
        { ic: '🛍️', label: 'Shopping & Souvenir', key: 'souvenir', color: '#f5a623', desc: 'Belanja & Oleh-oleh', note: opt.souvenirNote },
    ].filter(cat => {
        if (cat.key === 'wisata') return true; 
        const val = cat.key === 'hotel' ? hotelTotal 
                  : cat.key === 'food' ? foodTotal 
                  : cat.key === 'transport' ? transportTotal 
                  : cat.key === 'souvenir' ? souvenirTotal 
                  : 0;
        return val > 0;
    });

    const pieData = [
        { l: '✈️ Pesawat', v: flightTotal, c: '#f4a7b9' },
        { l: '🏨 Hotel', v: hotelTotal, c: '#6699ff' },
        { l: '🍱 Makan', v: foodTotal, c: '#d4af37' },
        { l: '🚆 Transport', v: transportTotal, c: '#3ddc84' },
        { l: '🛍️ Shopping', v: souvenirTotal, c: '#f5a623' },
        { l: '🎟️ Wisata', v: wisataTotal > 0 ? wisataTotal : 0, c: '#c084fc' },
    ].filter(d => d.v > 0);

    const activeId = document.activeElement ? document.activeElement.id : null;
    const activeSelectionStart = document.activeElement ? document.activeElement.selectionStart : null;
    const activeSelectionEnd = document.activeElement ? document.activeElement.selectionEnd : null;

    let wisataNoteHtml = '';
    if (isGroupD) {
        if (wisataPerPerson >= 0) {
            wisataNoteHtml = `*Terdapat sisa cadangan belanja/wisata sebesar <strong>${fmtValWithSubtitle(wisataPerPerson, true)}</strong> agar total pas Rp8.000.000.`;
        } else {
            wisataNoteHtml = `<span style="color: #ef4444; font-weight: 600;">⚠️ Defisit Budget: ${fmtValWithSubtitle(Math.abs(wisataPerPerson), true)}</span> (Total pengeluaran melebihi flat budget Rp8.000.000 per orang. Kurangi parameter hotel/pesawat/transport atau tambah jumlah anggota kelompok).`;
        }
    }

    el.innerHTML = `
    <div class="budget-dashboard-wrap">
        <div style="display:flex;align-items:center;gap:.7rem;margin-bottom:1.5rem">
            <div style="width:4px;height:26px;background:${opt.color};border-radius:2px"></div>
            <div>
                <div style="font-family:'Playfair Display';font-size:1.15rem;font-weight:700;color:var(--t)">📊 Visualisasi Budget — Option ${opt.id}</div>
                <div style="font-size:12px;color:var(--t3);margin-top:1px">Breakdown lengkap setiap kategori pengeluaran</div>
            </div>
        </div>

        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:1.5rem;padding:.85rem 1rem;background:rgba(255,255,255,.025);border-radius:10px;border:1px solid rgba(255,255,255,.06)">
            <div style="display:flex;align-items:center;gap:6px">
                <span style="font-size:12px;color:var(--t2);font-weight:600;margin-right:4px">🧮 Hitung untuk:</span>
                ${(opt.id === 'D' ? [2, 3, 4, 5] : [1, 2, 3]).map(i => `
                <button class="persons-btn${n===i?' active':''}" data-n="${i}" onclick="setPlanPersons(${i})"
                    style="padding:8px 18px;border-radius:100px;border:1.5px solid ${n===i?opt.colorBorder:'rgba(255,255,255,.1)'};background:${n===i?opt.colorDim:'transparent'};color:${n===i?opt.color:'var(--t3)'};font-size:12px;font-weight:700;transition:all .2s;cursor:pointer">
                    ${i} Orang
                </button>`).join('')}
            </div>
        </div>

        ${opt.id === 'D' ? `
        <div class="card" style="padding:1.5rem;margin-bottom:1.5rem;background:rgba(192,132,252,.03);border-color:rgba(192,132,252,.15)">
            <h3 style="font-size:13px;font-weight:700;color:#c084fc;margin-bottom:1rem;display:flex;align-items:center;gap:6px">
                ⚙️ Pengaturan Parameter Trip Kelompok (Option D)
            </h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.2rem;margin-bottom:1rem">
                <div>
                    <label style="font-size:10px;color:var(--t2);display:block;margin-bottom:4px">✈️ Pesawat PP / Orang</label>
                    <input type="number" id="group-param-flight" class="conv-input" style="width:100%;padding:6px 10px;font-size:12px" 
                        value="${groupTripState.flightPerPerson}" oninput="updateGroupParam('flightPerPerson', this.value)">
                </div>
                <div>
                    <label style="font-size:10px;color:var(--t2);display:block;margin-bottom:4px">🏨 Hotel / Kamar / Malam</label>
                    <input type="number" id="group-param-hotel" class="conv-input" style="width:100%;padding:6px 10px;font-size:12px" 
                        value="${groupTripState.hotelPerNight}" oninput="updateGroupParam('hotelPerNight', this.value)">
                    <span style="font-size:9px;color:var(--t3);display:block;margin-top:2px">*Shared hingga 6 orang</span>
                </div>
                <div>
                    <label style="font-size:10px;color:var(--t2);display:block;margin-bottom:4px">📅 Jumlah Malam</label>
                    <input type="number" id="group-param-nights" class="conv-input" style="width:100%;padding:6px 10px;font-size:12px" 
                        value="${groupTripState.nights}" oninput="updateGroupParam('nights', this.value)">
                </div>
                <div>
                    <label style="font-size:10px;color:var(--t2);display:block;margin-bottom:4px">🚆 Transport / Orang</label>
                    <input type="number" id="group-param-transport" class="conv-input" style="width:100%;padding:6px 10px;font-size:12px" 
                        value="${groupTripState.transportPerPerson}" oninput="updateGroupParam('transportPerPerson', this.value)">
                    <span style="font-size:9px;color:var(--t3);display:block;margin-top:2px;line-height:1.2">*Biasanya Rp300.000 - Rp600.000 tergantung area dan intensitas perjalanan</span>
                </div>
                <div>
                    <label style="font-size:10px;color:var(--t2);display:block;margin-bottom:4px">🍜 Makan / Orang (Otomatis)</label>
                    <input type="number" class="conv-input" style="width:100%;padding:6px 10px;font-size:12px;background:rgba(255,255,255,.03);color:var(--t3)" 
                        value="${foodPerPerson}" readonly>
                    <span style="font-size:9px;color:var(--t3);display:block;margin-top:2px;line-height:1.2">*2 hari diasumsikan makan hemat di konbini</span>
                </div>
                <div>
                    <label style="font-size:10px;color:var(--t2);display:block;margin-bottom:4px">🎁 Souvenir / Orang</label>
                    <input type="number" id="group-param-souvenir" class="conv-input" style="width:100%;padding:6px 10px;font-size:12px" 
                        value="${groupTripState.souvenirPerPerson}" oninput="updateGroupParam('souvenirPerPerson', this.value)">
                </div>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:8px">
                <button class="hero-btn" onclick="resetGroupTripParams()" style="padding:6px 12px;font-size:11px;background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.1);color:var(--t2)">
                    🔄 Reset Default
                </button>
                <button class="hero-btn" onclick="saveGroupTripParams()" style="padding:6px 12px;font-size:11px;background:rgba(192,132,252,.15);border-color:rgba(192,132,252,.3);color:#c084fc">
                    💾 Simpan Preset
                </button>
            </div>
        </div>
        ` : ''}

        <div class="budget-summary-strip" style="border-color:${opt.colorBorder};background:linear-gradient(135deg,${opt.colorDim},transparent);margin-bottom:1.5rem">
            <div class="bss-item">
                <div class="bss-label">💰 BUDGET PER ORANG</div>
                <div class="bss-value" style="color:${opt.color}">${fmtValWithSubtitle(budgetPerPerson, true)}</div>
            </div>
            <div class="bss-separator"></div>
            <div class="bss-item">
                <div class="bss-label">👥 TOTAL BUDGET GROUP</div>
                <div class="bss-value" style="color:#c084fc">${fmtValWithSubtitle(totalGroupBudget, true)}</div>
            </div>
            <div class="bss-separator"></div>
            <div class="bss-item">
                <div class="bss-label">💴 SISA SPENDING JEPANG</div>
                <div class="bss-value" style="color:var(--j);font-weight:800">${fmtValWithSubtitle(sisaSpendingIDR, true)}</div>
            </div>
            <div class="bss-separator"></div>
            <div class="bss-item">
                <div class="bss-label">🇯🇵 YEN YANG BISA DIPAKAI</div>
                <div class="bss-value" style="color:var(--g);font-weight:800">${fmtValWithSubtitle(sisaSpendingJPY, false)}</div>
            </div>
        </div>

        <div class="budget-vis-grid">
            <div>
                <div style="font-size:11px;color:var(--t3);text-transform:uppercase;letter-spacing:.1em;font-weight:700;margin-bottom:.85rem">Rincian Kategori Pengeluaran</div>
                <div class="budget-cat-card" style="--cat-color:#f4a7b9;margin-bottom:.65rem">
                    <div class="bcc-header">
                        <div class="bcc-icon">✈️</div>
                        <div class="bcc-meta">
                            <div class="bcc-label">Tiket Pesawat</div>
                        </div>
                        <div class="bcc-pct">${Math.round((flightTotal/totalGroupBudget)*100)}%</div>
                    </div>
                    <div class="bcc-bar-wrap">
                        <div class="bcc-bar" style="width:${Math.round((flightTotal/totalGroupBudget)*100)}%;background:#f4a7b9"></div>
                    </div>
                    <div class="bcc-prices">
                        <div class="bcc-price-block bcc-total">
                            <div class="bcc-price-lbl">TOTAL GROUP (${n} ORG)</div>
                            <div class="bcc-price-val" style="color:#f4a7b9">${fmtValWithSubtitle(flightTotal, true)}</div>
                        </div>
                        ${n > 1 ? `
                        <div class="bcc-divider">→</div>
                        <div class="bcc-price-block bcc-per-person">
                            <div class="bcc-price-lbl">PER ORANG</div>
                            <div class="bcc-price-val" style="color:#c084fc">${fmtValWithSubtitle(flightPerPerson, true)}</div>
                        </div>` : ''}
                    </div>
                </div>

                ${cats.map(cat => {
                    const totalCat = cat.key === 'hotel' ? hotelTotal 
                                   : cat.key === 'food' ? foodTotal 
                                   : cat.key === 'transport' ? transportTotal 
                                   : cat.key === 'souvenir' ? souvenirTotal 
                                   : wisataTotal;
                    const catPerPerson = cat.key === 'hotel' ? hotelPerPerson 
                                       : cat.key === 'food' ? foodPerPerson 
                                       : cat.key === 'transport' ? transportPerPerson 
                                       : cat.key === 'souvenir' ? souvenirPerPerson 
                                       : wisataPerPerson;
                    const pct = totalGroupBudget > 0 ? Math.round((totalCat / totalGroupBudget) * 100) : 0;
                    return `
                    <div class="budget-cat-card" style="--cat-color:${cat.color};margin-bottom:.65rem">
                        <div class="bcc-header">
                            <div class="bcc-icon">${cat.ic}</div>
                            <div class="bcc-meta">
                                <div class="bcc-label">${cat.label}</div>
                            </div>
                            <div class="bcc-pct">${pct}%</div>
                        </div>
                        <div class="bcc-bar-wrap">
                            <div class="bcc-bar" style="width:${pct}%;background:${cat.color}"></div>
                        </div>
                        <div class="bcc-prices">
                            <div class="bcc-price-block bcc-total">
                                <div class="bcc-price-lbl">TOTAL GROUP (${n} ORG)</div>
                                <div class="bcc-price-val" style="color:${cat.color}">${fmtValWithSubtitle(totalCat, true)}</div>
                            </div>
                            ${n > 1 ? `
                            <div class="bcc-divider">→</div>
                            <div class="bcc-price-block bcc-per-person">
                                <div class="bcc-price-lbl">PER ORANG</div>
                                <div class="bcc-price-val" style="color:#c084fc">${fmtValWithSubtitle(catPerPerson, true)}</div>
                            </div>` : ''}
                        </div>
                    </div>`;
                }).join('')}
            </div>

            <div>
                <div class="card" style="padding:1.2rem">
                    <canvas id="plan-pie-chart-v2" height="200"></canvas>
                    <div style="margin-top:.85rem;display:flex;flex-direction:column;gap:6px" id="pie-legend-v2"></div>
                </div>
            </div>
        </div>

        <div style="margin-top:2rem;border-top:2px dashed rgba(255,255,255,.1);padding-top:1.5rem">
            <h3 style="font-family:'Playfair Display';font-size:1.3rem;font-weight:700;color:var(--t);margin-bottom:0.5rem;display:flex;align-items:center;gap:8px">
                👤 PENGELUARAN PER ORANG
            </h3>
            <div style="max-width:550px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:14px;padding:1.5rem;margin:0 auto">
                <div style="display:flex;flex-direction:column;gap:12px">
                    <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:4px;border-bottom:1px dashed rgba(255,255,255,.04)">
                        <span style="font-size:13px;color:var(--t2)">✈️ Pesawat</span>
                        <span style="font-size:14px;font-weight:700;color:var(--t)">${fmtValWithSubtitle(flightPerPerson, true)}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:4px;border-bottom:1px dashed rgba(255,255,255,.04)">
                        <span style="font-size:13px;color:var(--t2)">🏨 Share Hotel</span>
                        <span style="font-size:14px;font-weight:700;color:var(--t)">${fmtValWithSubtitle(hotelPerPerson, true)}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:4px;border-bottom:1px dashed rgba(255,255,255,.04)">
                        <span style="font-size:13px;color:var(--t2)">🚆 Transport</span>
                        <span style="font-size:14px;font-weight:700;color:var(--t)">${fmtValWithSubtitle(transportPerPerson, true)}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:4px;border-bottom:1px dashed rgba(255,255,255,.04)">
                        <span style="font-size:13px;color:var(--t2)">🍜 Makanan</span>
                        <span style="font-size:14px;font-weight:700;color:var(--t)">${fmtValWithSubtitle(foodPerPerson, true)}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:4px;border-bottom:1px dashed rgba(255,255,255,.04)">
                        <span style="font-size:13px;color:var(--t2)">🎁 Souvenir</span>
                        <span style="font-size:14px;font-weight:700;color:var(--t)">${fmtValWithSubtitle(souvenirPerPerson, true)}</span>
                    </div>
                </div>
                
                <div style="margin-top:1.5rem;padding:0.85rem 1rem;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;display:flex;justify-content:space-between;align-items:center">
                    <div>
                        <div style="font-size:10px;color:var(--t3);font-weight:700;letter-spacing:.05em">TOTAL TERPAKAI</div>
                    </div>
                    <div style="font-family:'Playfair Display';font-size:1.4rem;font-weight:900;color:var(--t)">${fmtValWithSubtitle(totalTerpakai, true)}</div>
                </div>

                <div style="margin-top:1rem;padding:1rem 1.2rem;background:${opt.colorDim};border:1px solid ${opt.colorBorder};border-radius:12px;display:flex;justify-content:space-between;align-items:center">
                    <div>
                        <div style="font-size:11px;color:${opt.color};font-weight:700;letter-spacing:.05em">💴 SISA SPENDING JEPANG</div>
                    </div>
                    <div style="text-align:right">
                        <div style="font-family:'Playfair Display';font-size:1.6rem;font-weight:900;color:${opt.color}">${fmtValWithSubtitle(sisaSpendingIDR, true)}</div>
                        <div style="font-size:12px;font-weight:700;color:var(--g);margin-top:3px">${fmtValWithSubtitle(sisaSpendingJPY, false)}</div>
                    </div>
                </div>
                
                ${isGroupD ? `
                <div style="margin-top:0.75rem;padding:0.65rem;font-size:11px;color:var(--t3);text-align:center;background:rgba(255,255,255,.015);border-radius:8px;border:1px solid rgba(255,255,255,.04)">
                    ${wisataNoteHtml}
                </div>` : ''}
            </div>
        </div>
    </div>`;

    if (activeId) {
        const activeEl = document.getElementById(activeId);
        if (activeEl) {
            activeEl.focus();
            if (activeSelectionStart !== null && activeSelectionEnd !== null && activeEl.setSelectionRange) {
                try {
                    activeEl.setSelectionRange(activeSelectionStart, activeSelectionEnd);
                } catch (e) {}
            }
        }
    }

    setTimeout(() => {
        const canvas = document.getElementById('plan-pie-chart-v2');
        if (!canvas || typeof Chart === 'undefined') return;
        if (planPieChartRef) { planPieChartRef.destroy(); planPieChartRef = null; }

        planPieChartRef = new Chart(canvas.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: pieData.map(d => d.l),
                datasets: [{
                    data: pieData.map(d => d.v),
                    backgroundColor: pieData.map(d => d.c),
                    borderWidth: 2,
                    borderColor: '#07070f'
                }]
            },
            options: {
                cutout: '65%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: ctx => {
                                const val = ctx.parsed;
                                return ` ${fmtValWithSubtitle(val, true, false)}`;
                            }
                        }
                    }
                }
            }
        });

        // Custom legend
        const legendEl = document.getElementById('pie-legend-v2');
        if (legendEl) {
            legendEl.innerHTML = pieData.map(d => {
                const pct = Math.round((d.v / opt.totalIDR) * 100);
                return `
                <div style="display:flex;align-items:center;justify-content:space-between;gap:6px">
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
    }, 80);
}

// ══════════════════════════════════════════════════════
// PATCH: Override PLAN_OPTIONS global yang digunakan
// oleh fungsi-fungsi lain (renderItinerary dll)
// ══════════════════════════════════════════════════════
// Ganti referensi global PLAN_OPTIONS dengan v2
if (typeof PLAN_OPTIONS !== 'undefined') {
    // Copy all v2 options into the existing array
    PLAN_OPTIONS.length = 0;
    PLAN_OPTIONS_V2.forEach(opt => PLAN_OPTIONS.push(opt));
}

console.log('[planning-upgrade.js] Planning upgrade loaded. PLAN_OPTIONS:', PLAN_OPTIONS.length, 'options.');
