// js/auth.js
(function() {
    window.currentUser = null;
    window.currentUserProfile = null;

    // Toast Notification System
    window.showToast = function(message, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast-item toast-${type} au`;
        
        let emoji = '🌸';
        if (type === 'success') emoji = '✅';
        else if (type === 'error') emoji = '❌';
        else if (type === 'warning') emoji = '⚠️';
        else if (type === 'info') emoji = 'ℹ️';

        toast.innerHTML = `
            <span class="toast-emoji">${emoji}</span>
            <div class="toast-content">${message}</div>
        `;

        container.appendChild(toast);

        // Remove toast after 4 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-12px)';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    };

    // Load Login Modal Template dynamically
    async function initAuth() {
        try {
            // Ciptakan kontainer modal jika belum ada
            let container = document.getElementById('login-modal-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'login-modal-container';
                document.body.appendChild(container);
            }

            // Fetch template
            const response = await fetch('components/login-modal.html');
            if (response.ok) {
                container.innerHTML = await response.text();
            } else {
                console.error("Gagal memuat template login modal.");
            }
        } catch (e) {
            console.error("Error menginisialisasi Auth:", e);
        }

        // Setup user header in index.html
        renderProfileHeader();

        // Listen for Supabase Auth state changes
        if (window.supabaseClient) {
            window.supabaseClient.auth.onAuthStateChange(async (event, session) => {
                console.log("Auth State Changed Event:", event);
                if (session) {
                    window.currentUser = session.user;
                    await window.ensureSavingsRow(session.user);
                    await fetchUserProfile(session.user.id);
                    setupGlobalSavingsSubscription();
                    showToast(`Selamat datang kembali, ${window.currentUserProfile?.username || session.user.email}!`, 'success');
                } else {
                    window.currentUser = null;
                    window.currentUserProfile = null;
                    teardownGlobalSavingsSubscription();
                    console.log("User logged out or session ended.");
                }
                
                // Update UIs
                renderProfileHeader();
                
                // Callback jika halaman tabungan / planning sedang dibuka
                if (window.onUserAuthChanged) {
                    window.onUserAuthChanged();
                }
            });
        } else {
            console.warn("Supabase tidak aktif. Login system berjalan dalam mode demo/offline.");
        }
    }

    // Fetch user profile info from Supabase database (using savings table as source of truth for role)
    async function fetchUserProfile(userId) {
        if (!window.supabaseClient) return null;
        try {
            const { data, error } = await window.supabaseClient
                .from('savings')
                .select('*')
                .eq('user_id', userId)
                .single();
            
            if (data) {
                window.currentUserProfile = data;
                return data;
            } else {
                // Jika trigger baru berjalan, butuh jeda singkat untuk fetch profile
                for (let i = 0; i < 3; i++) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    const { data: retryData } = await window.supabaseClient
                        .from('savings')
                        .select('*')
                        .eq('user_id', userId)
                        .single();
                    if (retryData) {
                        window.currentUserProfile = retryData;
                        return retryData;
                    }
                }
            }
        } catch (err) {
            console.error("Error fetching user profile from savings:", err);
        }
        return null;
    }


    // Ensure savings row exists for the user in database
    window.ensureSavingsRow = async function(user) {
        if (!window.supabaseClient) return;
        try {
            const { data, error } = await window.supabaseClient
                .from('savings')
                .select('user_id')
                .eq('user_id', user.id)
                .maybeSingle();

            if (error) {
                console.error("Gagal mengecek data tabungan:", error);
            }

            if (!data) {
                console.log("Data tabungan tidak ditemukan untuk user. Membuat row default...");
                const fullName = user.user_metadata?.full_name || user.email;
                let username = fullName.split('@')[0];
                username = username.charAt(0).toUpperCase() + username.slice(1);

                // Biarkan database yang menentukan role default via trigger handle_new_user atau default value table
                const { error: upsertError } = await window.supabaseClient
                    .from('savings')
                    .upsert({
                        user_id: user.id,
                        username: username,
                        amount: 0,
                        updated_at: new Date()
                    }, {
                        onConflict: 'user_id'
                    });

                if (upsertError) {
                    console.error("Gagal melakukan upsert savings default:", upsertError);
                } else {
                    console.log("Row savings default berhasil dibuat.");
                }
            }
        } catch (e) {
            console.error("Error di ensureSavingsRow:", e);
        }
    };

    // Global Realtime Savings Subscription
    let globalSavingsChannel = null;

    function setupGlobalSavingsSubscription() {
        if (!window.supabaseClient || !window.currentUser || globalSavingsChannel) return;

        try {
            console.log("Setting up global realtime subscription for savings table...");
            globalSavingsChannel = window.supabaseClient
                .channel('savings-role')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'savings'
                    },
                    async (payload) => {
                        console.log("Global Realtime Savings Event Received (savings-role):", payload);
                        
                        // Update currentUserProfile if their own row changed
                        if (window.currentUser) {
                            const updatedRow = payload.new || payload.old;
                            if (updatedRow && updatedRow.user_id === window.currentUser.id) {
                                console.log("Your own savings/role row updated:", updatedRow);
                                window.currentUserProfile = {
                                    id: updatedRow.user_id,
                                    user_id: updatedRow.user_id,
                                    username: updatedRow.username,
                                    role: updatedRow.role,
                                    amount: Number(updatedRow.amount)
                                };
                                renderProfileHeader();
                                if (typeof window.applyTripSettingsAccess === 'function') {
                                    window.applyTripSettingsAccess();
                                }
                            }
                        }

                        // Reload savings cards data if reloadSavingsData function is loaded in DOM
                        if (typeof window.reloadSavingsData === 'function') {
                            await window.reloadSavingsData();
                        }
                    }
                )
                .subscribe((status) => {
                    console.log("Global Savings Realtime Status (savings-role):", status);
                });
        } catch (e) {
            console.error("Gagal menyambung ke global realtime savings:", e);
        }
    }

    function teardownGlobalSavingsSubscription() {
        if (globalSavingsChannel) {
            console.log("Removing global realtime subscription for savings table...");
            if (window.supabaseClient) {
                window.supabaseClient.removeChannel(globalSavingsChannel);
            }
            globalSavingsChannel = null;
        }
    }


    // Render User Header Profile Widget
    window.renderProfileHeader = function() {
        const header = document.getElementById('user-profile-header');
        if (!header) return;

        if (window.currentUser) {
            const u = window.currentUser;
            const profile = window.currentUserProfile;
            const displayName = profile?.username || u.email.split('@')[0];
            const role = (profile?.role || 'member').toLowerCase();
            const initial = displayName.charAt(0).toUpperCase();

            let roleBadge = '<span class="role-badge badge-member">👤 Member</span>';
            if (role === 'owner') roleBadge = '<span class="role-badge badge-owner">👑 Owner</span>';
            else if (role === 'admin') roleBadge = '<span class="role-badge badge-admin">🛡️ Admin</span>';

            header.innerHTML = `
                <div class="user-profile-widget card">
                    <div class="widget-avatar">${initial}</div>
                    <div class="widget-info">
                        <div class="widget-name">${displayName}</div>
                        ${roleBadge}
                    </div>
                    <button class="widget-logout-btn" onclick="handleLogout()" title="Keluar">➔</button>
                </div>
            `;
        } else {
            header.innerHTML = `
                <button class="hero-btn login-trigger-btn" onclick="openAuthModal()">
                    👤 Masuk / Daftar
                </button>
            `;
        }
    };

    // Modal Control functions
    window.openAuthModal = function() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.classList.add('open');
        } else {
            initAuth().then(() => {
                const modal = document.getElementById('login-modal');
                if (modal) modal.classList.add('open');
            });
        }
    };

    window.closeAuthModal = function() {
        const modal = document.getElementById('login-modal');
        if (modal) modal.classList.remove('open');
    };

    // Switch Tabs inside Login modal
    window.switchAuthTab = function(tab) {
        const btnLogin = document.getElementById('tab-login');
        const btnRegister = document.getElementById('tab-register');
        const submitBtn = document.getElementById('auth-submit-btn');
        const btnText = document.getElementById('auth-btn-text');

        if (tab === 'login') {
            btnLogin.classList.add('active');
            btnRegister.classList.remove('active');
            btnText.textContent = "Masuk Sekarang";
            submitBtn.dataset.mode = "login";
        } else {
            btnLogin.classList.remove('active');
            btnRegister.classList.add('active');
            btnText.textContent = "Buat Akun Baru";
            submitBtn.dataset.mode = "register";
        }
    };

    // Handle Form Submit (Manual Login/Register)
    window.handleAuthSubmit = async function(event) {
        event.preventDefault();
        if (!window.supabaseClient) {
            showToast("Supabase belum dikonfigurasi! Harap isi setup developer di bawah.", "warning");
            return;
        }

        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        const submitBtn = document.getElementById('auth-submit-btn');
        const mode = submitBtn.dataset.mode || 'login';

        // Show loading state
        submitBtn.classList.add('loading');

        try {
            if (mode === 'login') {
                const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });
                if (error) throw error;
                closeAuthModal();
            } else {
                const { data, error } = await window.supabaseClient.auth.signUp({
                    email: email,
                    password: password
                });
                if (error) throw error;
                showToast("Pendaftaran sukses! Silakan periksa email konfirmasi jika verifikasi email diaktifkan.", "success");
                closeAuthModal();
            }
        } catch (err) {
            console.error("Auth error:", err);
            showToast(err.message || "Terjadi kesalahan sistem otentikasi.", "error");
        } finally {
            submitBtn.classList.remove('loading');
        }
    };

    // Handle Logout
    window.handleLogout = async function() {
        if (!window.supabaseClient) {
            window.currentUser = null;
            renderProfileHeader();
            showToast("Mode Demo: Logout Berhasil.", "success");
            return;
        }
        try {
            const { error } = await window.supabaseClient.auth.signOut();
            if (error) throw error;
            showToast("Anda telah keluar.", "info");
            window.location.reload(); // Refresh untuk reset state total
        } catch (err) {
            console.error("Logout error:", err);
            showToast(err.message, "error");
        }
    };

    // Handle Google Login
    window.handleGoogleLogin = async function() {
        if (!window.supabaseClient) {
            showToast("Supabase belum dikonfigurasi!", "warning");
            return;
        }
        try {
            const { error } = await window.supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + window.location.pathname
                }
            });
            if (error) throw error;
        } catch (err) {
            console.error("Google Auth error:", err);
            showToast(err.message, "error");
        }
    };



    // Init on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        initAuth();
    });

})();
