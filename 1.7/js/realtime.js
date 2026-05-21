// js/realtime.js
(function() {
    window.activeRealtimeChannels = {};

    // Check realtime system status
    window.checkRealtimeStatus = function() {
        if (!window.supabaseClient) {
            updateStatusText("Demo Mode (Offline)", "warning");
            return;
        }

        if (window.SUPABASE_CONFIGURED) {
            updateStatusText("Supabase Connected", "success");
        } else {
            updateStatusText("Supabase Config Required", "info");
        }
    };

    function updateStatusText(text, status) {
        const elements = document.querySelectorAll('#savings-sync-status');
        elements.forEach(el => {
            el.textContent = text;
            if (status === 'success') {
                el.parentElement.classList.add('connected');
            } else {
                el.parentElement.classList.remove('connected');
            }
        });
    }

    // Keep track of initialized channels
    window.registerChannel = function(name, channel) {
        window.activeRealtimeChannels[name] = channel;
        console.log(`Realtime channel registered: ${name}`);
    };

    // Clean up channels on logout/unload
    window.unsubscribeAllRealtime = function() {
        if (!window.supabaseClient) return;
        Object.keys(window.activeRealtimeChannels).forEach(key => {
            try {
                window.supabaseClient.removeChannel(window.activeRealtimeChannels[key]);
                console.log(`Unsubscribed from channel: ${key}`);
            } catch (e) {
                console.error(`Gagal unsubscribe channel ${key}:`, e);
            }
        });
        window.activeRealtimeChannels = {};
    };

    // Listen to network status changes
    window.addEventListener('online', () => {
        showToast("Koneksi internet pulih. Menghubungkan kembali realtime sync...", "success");
        checkRealtimeStatus();
    });

    window.addEventListener('offline', () => {
        showToast("Koneksi internet terputus. Realtime sync dinonaktifkan sementara.", "warning");
        updateStatusText("Offline / No Internet", "error");
    });

    document.addEventListener('DOMContentLoaded', () => {
        checkRealtimeStatus();
    });

})();
