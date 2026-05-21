// js/savings.js
(function() {
    let savingsData = [];
    const GROUP_TARGET = 24000000;
    let isRealtimeSubscribed = false;

    // Load page template and data
    async function loadSavingsPage() {
        const container = document.getElementById('savings-page');
        if (!container) return;

        // Fetch template jika kosong
        if (!container.innerHTML.trim()) {
            try {
                const response = await fetch('pages/savings.html');
                if (response.ok) {
                    container.innerHTML = await response.text();
                } else {
                    console.error("Gagal memuat template halaman tabungan.");
                }
            } catch (e) {
                console.error("Error memuat halaman tabungan:", e);
            }
        }

        // Render tabungan terkini
        await fetchSavings();
        renderSavingsUI();
        setupRealtimeSubscription();
    }

    // Fetch savings data from Supabase
    async function fetchSavings() {
        if (!window.supabaseClient) {
            console.warn("Supabase Offline atau belum terkonfigurasi.");
            // Di demo mode, pastikan setidaknya ada data currentUser jika savingsData kosong
            if (window.currentUser && savingsData.length === 0) {
                const fullName = window.currentUser.user_metadata?.full_name || window.currentUser.email;
                const displayName = window.currentUserProfile?.username || fullName;
                savingsData = [{
                    username: displayName,
                    amount: 0,
                    target: 8000000,
                    role: window.currentUserProfile?.role || 'member',
                    user_id: window.currentUser.id
                }];
            }
            return;
        }

        try {
            const { data, error } = await window.supabaseClient
                .from('savings')
                .select('*')
                .order('updated_at', { ascending: true });

            if (error) throw error;

            if (data) {
                // Compare database values with local state for toast notifications & logs
                if (savingsData.length > 0) {
                    data.forEach(dbRow => {
                        const oldMatch = savingsData.find(s => s.user_id === dbRow.user_id);
                        if (oldMatch) {
                            const oldAmount = oldMatch.amount;
                            const newAmount = Number(dbRow.amount);
                            const oldRole = (oldMatch.role || 'member').toLowerCase();
                            const newRole = (dbRow.role || 'member').toLowerCase();
                            const oldUsername = oldMatch.username;
                            const newUsername = dbRow.username;

                            if (oldAmount !== newAmount) {
                                const isSelf = window.currentUser && window.currentUser.id === dbRow.user_id;
                                if (!isSelf) {
                                    showToast(`💰 ${dbRow.username} baru saja memperbarui tabungan menjadi Rp ${newAmount.toLocaleString('id-ID')}!`, 'success');
                                    setTimeout(() => triggerVisualFlash(dbRow.username), 100);
                                }
                                logActivity(dbRow.username, newAmount);
                            }
                            if (oldRole !== newRole) {
                                const isSelf = window.currentUser && window.currentUser.id === dbRow.user_id;
                                if (!isSelf) {
                                    showToast(`🔑 Peran ${dbRow.username} berubah menjadi ${newRole.charAt(0).toUpperCase() + newRole.slice(1)}!`, 'info');
                                }
                            }
                            if (oldUsername !== newUsername) {
                                const isSelf = window.currentUser && window.currentUser.id === dbRow.user_id;
                                if (!isSelf) {
                                    showToast(`👤 ${oldUsername} mengubah namanya menjadi ${newUsername}!`, 'info');
                                }
                            }
                        }
                    });
                }

                // Mapping data dari database ke savingsData
                savingsData = data.map(dbRow => ({
                    username: dbRow.username,
                    amount: Number(dbRow.amount),
                    target: 8000000,
                    role: dbRow.role || 'member',
                    user_id: dbRow.user_id
                }));

                // Auto-create row jika user login belum punya data di tabel
                if (window.currentUser) {
                    const hasSelf = savingsData.some(s => s.user_id === window.currentUser.id);
                    if (!hasSelf && typeof window.ensureSavingsRow === 'function') {
                        console.log("Current user not found in savings table. Auto-creating row...");
                        await window.ensureSavingsRow(window.currentUser);
                        
                        // Refetch to get the updated row
                        const { data: refreshedData, error: refreshError } = await window.supabaseClient
                            .from('savings')
                            .select('*')
                            .order('updated_at', { ascending: true });
                        if (!refreshError && refreshedData) {
                            savingsData = refreshedData.map(dbRow => ({
                                username: dbRow.username,
                                amount: Number(dbRow.amount),
                                target: 8000000,
                                role: dbRow.role || 'member',
                                user_id: dbRow.user_id
                            }));
                        }
                    }
                }

                // Sync current user's profile role from the latest database fetch
                if (window.currentUser) {
                    const selfRow = savingsData.find(s => s.user_id === window.currentUser.id);
                    if (selfRow) {
                        window.currentUserProfile = {
                            id: selfRow.user_id,
                            user_id: selfRow.user_id,
                            username: selfRow.username,
                            role: selfRow.role.toLowerCase(),
                            amount: selfRow.amount
                        };
                        if (typeof window.renderProfileHeader === 'function') {
                            window.renderProfileHeader();
                        }
                        if (typeof window.applyTripSettingsAccess === 'function') {
                            window.applyTripSettingsAccess();
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Gagal fetch tabungan dari database:", e);
        }
    }

    // Render Savings UI elements
    function renderSavingsUI() {
        const statusDot = document.getElementById('savings-sync-status');
        if (statusDot) {
            if (window.SUPABASE_CONFIGURED) {
                statusDot.textContent = "Supabase Realtime Connected";
                statusDot.parentElement.classList.add('connected');
            } else {
                statusDot.textContent = "Demo Mode (Offline)";
                statusDot.parentElement.classList.remove('connected');
            }
        }

        const grid = document.getElementById('savings-grid');
        if (!grid) return;

        // Jika user belum login, tampilkan banner ajakan masuk
        if (!window.currentUser) {
            grid.innerHTML = `
                <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.08); border-radius: 16px;">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem;">🌸</div>
                    <h3 style="color: var(--t); margin-bottom: 0.5rem; font-family: 'Playfair Display';">Tabungan Kelompok Nippon</h3>
                    <p style="color: var(--t3); font-size: 13px; max-width: 440px; margin: 0 auto 1.5rem;">Masuk atau daftarkan akun baru Anda untuk melihat status tabungan kelompok dan berpartisipasi dalam target trip Jepang secara realtime.</p>
                    <button class="hero-btn" onclick="openAuthModal()" style="padding: 8px 20px;">👤 Masuk / Daftar Sekarang</button>
                </div>
            `;

            // Reset summary values jika belum login
            updateSummaryUI(0, 0);
            return;
        }

        // Pastikan current user memiliki entry di savingsData (bahkan jika database kosong / offline)
        if (window.currentUser) {
            const hasSelf = savingsData.some(s => s.user_id === window.currentUser.id);
            if (!hasSelf) {
                const fullName = window.currentUser.user_metadata?.full_name || window.currentUser.email;
                const displayName = window.currentUserProfile?.username || fullName;
                savingsData.push({
                    username: displayName,
                    amount: 0,
                    target: 8000000,
                    role: window.currentUserProfile?.role || 'member',
                    user_id: window.currentUser.id
                });
            }
        }

        // Hitung total tabungan kelompok
        const totalSavings = savingsData.reduce((acc, curr) => acc + curr.amount, 0);
        const groupPct = Math.min(100, Math.round((totalSavings / GROUP_TARGET) * 100));
        const shortage = Math.max(0, GROUP_TARGET - totalSavings);

        updateSummaryUI(totalSavings, groupPct, shortage);

        // Kosongkan grid sebelum merender ulang secara dinamis
        grid.innerHTML = '';

        if (savingsData.length === 0) {
            grid.innerHTML = `
                <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 2rem; background: rgba(255,255,255,0.01); border-radius: 12px; color: var(--t3);">
                    Belum ada data tabungan anggota terdaftar.
                </div>
            `;
            return;
        }

        // Render card masing-masing anggota secara dinamis dari database
        savingsData.forEach(member => {
            const memberPct = Math.min(100, Math.round((member.amount / member.target) * 100));
            
            // Tentukan visual styling berdasarkan role
            let avatarBg, avatarColor, chipClass, roleLabel;
            const memberRole = (member.role || 'member').toLowerCase();
            if (memberRole === 'owner') {
                avatarBg = 'rgba(244,167,185,0.15)';
                avatarColor = 'var(--s)';
                chipClass = 'chip-s';
                roleLabel = '👑 Owner';
            } else if (memberRole === 'admin') {
                avatarBg = 'rgba(102,153,255,0.15)';
                avatarColor = 'var(--b)';
                chipClass = 'chip-b';
                roleLabel = '🛡️ Admin';
            } else {
                avatarBg = 'rgba(61,220,132,0.15)';
                avatarColor = 'var(--j)';
                chipClass = 'chip-j';
                roleLabel = '👤 Member';
            }

            // Hak edit didasarkan pada perbandingan UUID atau role Owner
            const userRole = (window.currentUserProfile?.role || 'member').toLowerCase();
            const isOwner = userRole === 'owner';
            const canEdit = window.currentUser && (isOwner || window.currentUser.id === member.user_id);

            const card = document.createElement('div');
            card.className = 'card savings-member-card';
            card.id = `savings-card-${member.username}`;
            
            card.innerHTML = `
              <div class="member-avatar-row">
                <div class="member-avatar" style="background: ${avatarBg}; color: ${avatarColor};">${member.username.charAt(0).toUpperCase()}</div>
                <div class="member-meta">
                  <div class="member-name">${member.username}</div>
                  <span class="chip ${chipClass}" style="font-size: 9px; padding: 2px 7px;">${roleLabel}</span>
                </div>
              </div>
              
              <div class="member-amount-row">
                <div class="member-amount-label">Jumlah Tabungan</div>
                <div class="member-amount" id="savings-amount-${member.username}">Rp ${member.amount.toLocaleString('id-ID')}</div>
              </div>

              <!-- Member Progress -->
              <div class="member-progress-row">
                <div style="display:flex; justify-content:space-between; font-size: 10px; color: var(--t2); margin-bottom: 4px;">
                  <span>Progress Target</span>
                  <span id="savings-pct-${member.username}">${memberPct}%</span>
                </div>
                <div class="progress-bar-container" style="height: 6px; background: rgba(255,255,255,0.04); border-radius: 3px; overflow: hidden;">
                  <div class="progress-bar-fill" id="savings-bar-${member.username}" style="width: ${memberPct}%; height:100%; background: ${avatarColor}; transition: width 0.5s;"></div>
                </div>
              </div>

              <!-- Edit Section (Hanya tampil untuk pemilik slot) -->
              <div class="member-edit-section" id="savings-edit-${member.username}" style="display: ${canEdit ? 'flex' : 'none'};">
                <input type="number" class="conv-input saving-input" id="savings-input-${member.username}" placeholder="Masukkan nominal" min="0" value="${member.amount}">
                <button class="hero-btn update-saving-btn" id="savings-btn-${member.username}" onclick="updateSaving('${member.username}')">Simpan</button>
              </div>
              <div class="member-status-msg" id="savings-status-${member.username}">
                ${canEdit ? '🔓 Anda mengontrol slot tabungan ini' : `🔒 Hanya ${member.username} yang bisa mengedit`}
              </div>
            `;
            
            const statusMsg = card.querySelector('.member-status-msg');
            if (statusMsg) {
                statusMsg.style.color = canEdit ? 'var(--j)' : 'var(--t3)';
            }
            
            grid.appendChild(card);
        });
    }

    // Helper untuk update Summary Card UI
    function updateSummaryUI(totalSavings, groupPct, shortage = GROUP_TARGET) {
        const totalEl = document.getElementById('group-total-savings');
        const shortageEl = document.getElementById('group-savings-shortage');
        const pctEl = document.getElementById('group-savings-pct');
        const barEl = document.getElementById('group-savings-bar');

        if (totalEl) totalEl.textContent = `Rp ${totalSavings.toLocaleString('id-ID')}`;
        if (shortageEl) {
            if (totalSavings >= GROUP_TARGET) {
                shortageEl.innerHTML = "🎉 <strong>Selamat! Target Tabungan Kelompok Telah Tercapai!</strong>";
                shortageEl.style.color = "var(--j)";
            } else {
                shortageEl.textContent = `Kekurangan: Rp ${shortage.toLocaleString('id-ID')}`;
                shortageEl.style.color = "var(--t2)";
            }
        }
        if (pctEl) pctEl.textContent = `${groupPct}%`;
        if (barEl) barEl.style.width = `${groupPct}%`;
    }

    // Update / Upsert saving in Supabase
    window.updateSaving = async function(username) {
        const inputEl = document.getElementById(`savings-input-${username}`);
        const btn = document.getElementById(`savings-btn-${username}`);
        if (!inputEl) return;

        const newAmount = parseInt(inputEl.value) || 0;

        if (newAmount < 0) {
            showToast("Nominal tabungan tidak boleh negatif!", "error");
            return;
        }

        // Visual loading
        if (btn) btn.disabled = true;

        if (!window.supabaseClient) {
            // Demo mode fallback
            const match = savingsData.find(s => s.username === username);
            if (match) match.amount = newAmount;
            renderSavingsUI();
            logActivity(username, newAmount);
            showToast(`[Demo] Tabungan ${username} berhasil diperbarui menjadi Rp ${newAmount.toLocaleString('id-ID')}`, 'success');
            if (btn) btn.disabled = false;
            return;
        }

        try {
            const user = window.currentUser;
            if (!user) {
                showToast("Anda harus masuk terlebih dahulu!", "error");
                if (btn) btn.disabled = false;
                return;
            }

            // Find target member in savingsData
            const targetMember = savingsData.find(s => s.username === username);
            if (!targetMember) {
                showToast("Data anggota tidak ditemukan!", "error");
                if (btn) btn.disabled = false;
                return;
            }

            // Verify permission
            const userRole = (window.currentUserProfile?.role || 'member').toLowerCase();
            const isOwner = userRole === 'owner';
            const canEdit = isOwner || (user.id === targetMember.user_id);

            if (!canEdit) {
                showToast("Anda tidak memiliki izin untuk mengedit tabungan ini!", "error");
                if (btn) btn.disabled = false;
                return;
            }

            // Gunakan upsert dengan onConflict pada user_id
            const { error } = await window.supabaseClient
                .from('savings')
                .upsert({
                    user_id: targetMember.user_id,
                    username: targetMember.username,
                    role: targetMember.role,
                    amount: newAmount,
                    updated_at: new Date()
                }, {
                    onConflict: 'user_id'
                });

            if (error) throw error;
            showToast(`Tabungan ${targetMember.username} berhasil diperbarui!`, "success");
            logActivity(targetMember.username, newAmount);
        } catch (e) {
            console.error("Gagal update/upsert tabungan:", e);
            showToast(e.message || "Gagal memperbarui tabungan.", "error");
        } finally {
            if (btn) btn.disabled = false;
        }
    };

    // Log savings updates on UI list
    function logActivity(username, amount) {
        const logContainer = document.getElementById('savings-activity-log');
        if (!logContainer) return;

        const emptyMsg = logContainer.querySelector('.empty-log-msg');
        if (emptyMsg) emptyMsg.remove();

        const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const logItem = document.createElement('div');
        logItem.className = 'activity-log-item au';
        logItem.innerHTML = `
            <span class="log-time">[${time}]</span>
            <span class="log-text"><strong>${username}</strong> memperbarui tabungannya menjadi <span style="color:var(--j)">Rp ${amount.toLocaleString('id-ID')}</span></span>
        `;

        logContainer.insertBefore(logItem, logContainer.firstChild);

        // Limit log items to 8
        if (logContainer.children.length > 8) {
            logContainer.lastChild.remove();
        }
    }

    // Reload database-driven savings data
    async function reloadSavingsData() {
        await fetchSavings();
        renderSavingsUI();
    }
    window.reloadSavingsData = reloadSavingsData;

    // Supabase Realtime DB Listeners
    function setupRealtimeSubscription() {
        // Diserahkan sepenuhnya pada global listener 'savings-role' di js/auth.js
    }

    // Trigger visual pulse glow on saving change
    function triggerVisualFlash(username) {
        const card = document.getElementById(`savings-card-${username}`);
        if (card) {
            card.classList.add('flash-glow');
            setTimeout(() => card.classList.remove('flash-glow'), 1800);
        }
    }

    // Triggered when Auth state changes
    window.onUserAuthChanged = function() {
        if (window.location.hash === '#savings' || (typeof state !== 'undefined' && state.page === 'savings')) {
            loadSavingsPage();
        } else {
            // Reload if needed
            fetchSavings().then(() => renderSavingsUI());
        }
    };

    // Initial load check & navigation hook registration
    document.addEventListener('DOMContentLoaded', () => {
        const originalNavigate = window.navigate;
        if (typeof originalNavigate === 'function') {
            window.navigate = function(id) {
                originalNavigate(id);
                if (id === 'savings') {
                    loadSavingsPage();
                }
            };
        }

        if (typeof state !== 'undefined' && state.page === 'savings') {
            loadSavingsPage();
        }
    });

})();
