// js/trip-settings.js
(function() {
    let isRealtimeSubscribed = false;

    // Fetch initial settings from Supabase
    async function fetchTripSettings() {
        if (!window.supabaseClient) return;

        try {
            const { data, error } = await window.supabaseClient
                .from('trip_settings')
                .select('*')
                .eq('id', 'group_trip_option_d')
                .maybeSingle();

            if (error) throw error;

            if (data) {
                // Update local state
                if (typeof groupTripState !== 'undefined') {
                    groupTripState.persons = data.persons;
                    groupTripState.flightPerPerson = Number(data.flight_per_person);
                    groupTripState.hotelPerNight = Number(data.hotel_per_night);
                    groupTripState.nights = data.nights;
                    groupTripState.transportPerPerson = Number(data.transport_per_person);
                    groupTripState.souvenirPerPerson = Number(data.souvenir_per_person);

                    // Sync and re-render if planning page is active
                    if (typeof syncPlanOptions === 'function') {
                        syncPlanOptions();
                        if (typeof state !== 'undefined' && state.page === 'planning') {
                            renderPlanOptionsV2();
                            renderPlanBannerV2();
                            renderBudgetDashboard();
                            renderItinerary();
                        }
                    }
                }
            } else {
                // Seed default settings row if not found (only owner/admin can write, so we handle gracefully)
                if (window.currentUser && (window.currentUserProfile?.role === 'owner' || window.currentUserProfile?.role === 'admin')) {
                    await seedDefaultTripSettings();
                }
            }
        } catch (e) {
            console.error("Gagal mengambil trip settings dari database:", e);
        }
    }

    // Seed default settings to database
    async function seedDefaultTripSettings() {
        if (!window.supabaseClient || typeof groupTripState === 'undefined') return;
        try {
            const username = window.currentUserProfile?.username || 'System';
            await window.supabaseClient
                .from('trip_settings')
                .insert({
                    id: 'group_trip_option_d',
                    persons: groupTripState.persons,
                    flight_per_person: groupTripState.flightPerPerson,
                    hotel_per_night: groupTripState.hotelPerNight,
                    nights: groupTripState.nights,
                    transport_per_person: groupTripState.transportPerPerson,
                    souvenir_per_person: groupTripState.souvenirPerPerson,
                    updated_by_name: username
                });
            console.log("Default trip settings seeded successfully.");
        } catch (e) {
            console.warn("Gagal seed default trip settings:", e);
        }
    }

    // Override updateGroupParam to send updates to Supabase
    const originalUpdateGroupParam = window.updateGroupParam;
    window.updateGroupParam = async function(key, val) {
        let num = parseInt(val) || 0;
        if (key === 'nights') {
            num = Math.max(1, num);
        }

        // Check permissions: all logged-in users can edit
        const canWrite = !window.currentUser || !!window.currentUser;

        if (window.supabaseClient && window.currentUser && !canWrite) {
            showToast("⚠️ Silakan masuk terlebih dahulu untuk mengubah parameter trip!", "warning");
            fetchTripSettings();
            return;
        }

        // Update local state first for instant responsiveness
        if (typeof groupTripState !== 'undefined') {
            groupTripState[key] = num;
            if (typeof syncPlanOptions === 'function') syncPlanOptions();
            
            if (typeof renderPlanOptionsV2 === 'function') renderPlanOptionsV2();
            if (typeof renderPlanBannerV2 === 'function') renderPlanBannerV2();
            if (typeof renderBudgetDashboard === 'function') renderBudgetDashboard();
            if (typeof renderItinerary === 'function') renderItinerary();
        }

        // Push to Supabase if connected
        if (window.supabaseClient && window.currentUser && canWrite) {
            try {
                const username = window.currentUserProfile?.username || window.currentUser.email.split('@')[0];
                const { error } = await window.supabaseClient
                    .from('trip_settings')
                    .upsert({
                        id: 'group_trip_option_d',
                        persons: groupTripState.persons,
                        flight_per_person: groupTripState.flightPerPerson,
                        hotel_per_night: groupTripState.hotelPerNight,
                        nights: groupTripState.nights,
                        transport_per_person: groupTripState.transportPerPerson,
                        souvenir_per_person: groupTripState.souvenirPerPerson,
                        updated_by_name: username,
                        updated_at: new Date()
                    });

                if (error) throw error;
            } catch (err) {
                console.error("Gagal push trip settings ke Supabase:", err);
            }
        }
    };

    // Override resetGroupTripParams to seed defaults
    window.resetGroupTripParams = async function() {
        const canWrite = !window.currentUser || !!window.currentUser;

        if (window.supabaseClient && window.currentUser && !canWrite) {
            showToast("⚠️ Silakan masuk terlebih dahulu untuk menyetel ulang parameter!", "warning");
            return;
        }

        if (typeof resetGroupTripState === 'function') {
            resetGroupTripState();
            if (typeof syncPlanOptions === 'function') syncPlanOptions();
            if (typeof renderPlanOptionsV2 === 'function') renderPlanOptionsV2();
            if (typeof renderPlanBannerV2 === 'function') renderPlanBannerV2();
            if (typeof renderBudgetDashboard === 'function') renderBudgetDashboard();
            if (typeof renderItinerary === 'function') renderItinerary();
        }

        if (window.supabaseClient && window.currentUser && canWrite) {
            try {
                const username = window.currentUserProfile?.username || 'System';
                await window.supabaseClient
                    .from('trip_settings')
                    .update({
                        persons: 3,
                        flight_per_person: 3500000,
                        hotel_per_night: 800000,
                        nights: 6,
                        transport_per_person: 600000,
                        souvenir_per_person: 300000,
                        updated_by_name: username,
                        updated_at: new Date()
                    })
                    .eq('id', 'group_trip_option_d');
                showToast("Parameter trip diset ulang ke default.", "info");
            } catch (e) {
                console.error(e);
            }
        }
    };

    // Apply UI Locks based on user role
    window.applyTripSettingsAccess = function() {
        // Semua user terautentikasi (maupun mode demo) memiliki akses tulis
        const canWrite = true;

        const inputs = [
            'group-param-flight',
            'group-param-hotel',
            'group-param-nights',
            'group-param-transport',
            'group-param-souvenir'
        ];

        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.disabled = !canWrite;
                if (!canWrite) {
                    input.style.opacity = '0.5';
                    input.style.cursor = 'not-allowed';
                    input.title = "Hanya Owner/Admin yang bisa mengedit parameter utama.";
                } else {
                    input.style.opacity = '1';
                    input.style.cursor = 'auto';
                    input.title = "";
                }
            }
        });

        // Add visual badge lock to section header
        const header = document.querySelector('.budget-dashboard-wrap h3');
        if (header) {
            const existingBadge = document.getElementById('trip-settings-lock-badge');
            if (existingBadge) {
                existingBadge.remove();
            }
            const badge = document.createElement('span');
            badge.id = 'trip-settings-lock-badge';
            if (window.currentUser) {
                badge.className = 'role-badge badge-owner';
                badge.style.fontSize = '9px';
                badge.style.marginLeft = '8px';
                badge.textContent = '🔓 Write Access';
            }
            header.appendChild(badge);
        }
    };

    // Intercept renderBudgetDashboard to apply access locks
    const originalRenderBudgetDashboard = window.renderBudgetDashboard;
    if (typeof originalRenderBudgetDashboard === 'function') {
        window.renderBudgetDashboard = function() {
            originalRenderBudgetDashboard();
            applyTripSettingsAccess();
        };
    }

    // Subscribe to Supabase Realtime updates
    function setupRealtimeSubscription() {
        if (!window.supabaseClient || isRealtimeSubscribed) return;

        try {
            window.supabaseClient
                .channel('realtime_trip_settings_channel')
                .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'trip_settings', filter: 'id=eq.group_trip_option_d' }, (payload) => {
                    console.log("Realtime Trip Settings Update Received:", payload);
                    const row = payload.new;

                    if (row && typeof groupTripState !== 'undefined') {
                        groupTripState.persons = row.persons;
                        groupTripState.flightPerPerson = Number(row.flight_per_person);
                        groupTripState.hotelPerNight = Number(row.hotel_per_night);
                        groupTripState.nights = row.nights;
                        groupTripState.transportPerPerson = Number(row.transport_per_person);
                        groupTripState.souvenirPerPerson = Number(row.souvenir_per_person);

                        if (typeof syncPlanOptions === 'function') syncPlanOptions();

                        // Render UIs
                        if (typeof renderPlanOptionsV2 === 'function') renderPlanOptionsV2();
                        if (typeof renderPlanBannerV2 === 'function') renderPlanBannerV2();
                        if (typeof renderBudgetDashboard === 'function') renderBudgetDashboard();
                        if (typeof renderItinerary === 'function') renderItinerary();

                        // Toast warning
                        const isSelf = window.currentUser && (window.currentUserProfile?.username === row.updated_by_name);
                        if (!isSelf) {
                            showToast(`🔧 Parameter trip telah diperbarui oleh ${row.updated_by_name}!`, 'info');
                        }
                    }
                })
                .subscribe();

            isRealtimeSubscribed = true;
        } catch (e) {
            console.error("Gagal menyambung ke realtime trip settings:", e);
        }
    }

    // Callback on Auth change
    window.onUserAuthChanged = (function(oldCallback) {
        return function() {
            if (typeof oldCallback === 'function') oldCallback();
            fetchTripSettings().then(() => {
                applyTripSettingsAccess();
                setupRealtimeSubscription();
            });
        };
    })(window.onUserAuthChanged);

    // Initial setups
    document.addEventListener('DOMContentLoaded', () => {
        fetchTripSettings();
        setupRealtimeSubscription();
    });

})();
