# Panduan Setup & Deploy Nippon Travel Planner (Supabase + Netlify)

Panduan ini menjelaskan langkah demi langkah untuk mengonfigurasi database Supabase, mengaktifkan otentikasi (Email & Google), menghubungkan frontend menggunakan Developer Setup Panel, dan mendeploy aplikasi web ke Netlify secara gratis.

---

## 📋 DAFTAR ISI
1. [Prasyarat](#1-prasyarat)
2. [Langkah 1: Setup Proyek Supabase](#langkah-1-setup-proyek-supabase)
3. [Langkah 2: Menyiapkan Otentikasi Supabase](#langkah-2-menyiapkan-otentikasi-supabase)
4. [Langkah 3: Konfigurasi Frontend (Developer Panel & Kunci Produksi)](#langkah-3-konfigurasi-frontend-developer-panel--kunci-produksi)
5. [Langkah 4: Pengujian Fitur Realtime Secara Lokal](#langkah-4-pengujian-fitur-realtime-secara-lokal)
6. [Langkah 5: Deploy ke Netlify](#langkah-5-deploy-ke-netlify)

---

## 1. Prasyarat
Sebelum memulai, pastikan Anda memiliki:
* Akun [Supabase](https://supabase.com) (gratis)
* Akun [Google Cloud Console](https://console.cloud.google.com) (jika ingin Google Login aktif)
* Akun [Netlify](https://netlify.com) untuk hosting frontend.

---

## Langkah 1: Setup Proyek Supabase

1. **Buat Project Baru**:
   * Masuk ke [Supabase Dashboard](https://supabase.com/dashboard).
   * Klik **New Project**, pilih organisasi Anda.
   * Masukkan nama proyek (contoh: `Nippon Travel`), kata sandi database, dan pilih regional server terdekat (**Singapore** untuk latensi rendah dari Indonesia).
   * Klik **Create new project** dan tunggu proses inisialisasi selesai (1-2 menit).

2. **Eksekusi SQL Schema**:
   * Setelah proyek siap, buka menu **SQL Editor** di sidebar kiri.
   * Klik tombol **New query** (klik **+ New Query**).
   * Buka file [SUPABASE_SETUP.sql](file:///c:/Users/Aldy/Downloads/Japan/1.7/SUPABASE_SETUP.sql) yang terletak di root direktori proyek ini, lalu salin seluruh kodenya.
   * Tempelkan kode SQL tersebut ke dalam SQL Editor Supabase.
   * Klik tombol **Run** di pojok kanan bawah editor. Pastikan muncul status sukses (`Success. No rows returned`).

---

## Langkah 2: Menyiapkan Otentikasi Supabase

### A. Otentikasi Email & Password (Manual)
Otentikasi email diaktifkan secara default di Supabase. Namun, demi kemudahan pengujian, Anda bisa menonaktifkan fitur konfirmasi email agar user bisa langsung aktif setelah mendaftar:
1. Buka menu **Authentication** -> **Providers** di dashboard Supabase Anda.
2. Cari provider **Email** dan klik untuk membukanya.
3. Matikan toggle **Confirm email** (jika ingin user bisa langsung login tanpa verifikasi tautan email).
4. Klik **Save**.

### B. Otentikasi Google Login (OAuth2)
Untuk mengaktifkan Google Login:
1. Buka [Google Cloud Console](https://console.cloud.google.com).
2. Buat proyek baru atau pilih proyek yang sudah ada.
3. Masuk ke **APIs & Services** -> **OAuth consent screen**, atur aplikasi Anda ke tipe **External**, lalu isi nama aplikasi serta email dukungan.
4. Pergi ke **APIs & Services** -> **Credentials**.
5. Klik **+ Create Credentials** -> **OAuth client ID**.
6. Pilih application type **Web application**.
7. Di bagian **Authorized redirect URIs**, masukkan URI redirect dari Supabase.
   * Cari URI ini di dashboard Supabase Anda di bagian **Authentication** -> **Providers** -> **Google**.
   * Formatnya biasanya seperti: `https://<project-id>.supabase.co/auth/v1/callback`
8. Salin **Client ID** dan **Client Secret** yang dihasilkan dari Google Console.
9. Tempelkan nilai tersebut ke konfigurasi **Google** provider di dashboard Supabase Anda, aktifkan togglenya, lalu klik **Save**.

---

## Langkah 3: Konfigurasi Kunci Produksi Supabase

Untuk menghubungkan frontend dengan proyek Supabase Anda secara otomatis:

1. Buka file [js/supabase.js](file:///c:/Users/Aldy/Downloads/Japan/1.7/js/supabase.js).
2. Temukan variabel `url` dan `key` di bagian atas file:
   ```javascript
   let url = '';
   let key = '';
   ```
3. Ubah nilainya dengan kredensial Supabase proyek Anda (dapat disalin dari dashboard Supabase di **Project Settings** -> **API**):
   ```javascript
   let url = 'https://your-project-id.supabase.co';
   let key = 'your-anon-public-api-key';
   ```
4. Simpan file tersebut. Kredensial ini akan otomatis digunakan oleh aplikasi saat website dibuka.

### Integrasi Variabel Lingkungan Netlify (Opsional):
Jika mendeploy melalui Netlify, Anda dapat menyuntikkan environment variables secara langsung. Proyek ini siap membaca `SUPABASE_URL` dan `SUPABASE_ANON_KEY` dari environment variables `process.env` atau window scope jika diinjeksi oleh build script Anda.

---

## Langkah 4: Pengujian Fitur Realtime Secara Lokal

Untuk menguji fitur realtime (Tabungan Group & Sinkronisasi Trip):
1. Jalankan web server lokal di komputer Anda (misalnya dengan VS Code Live Server atau menggunakan terminal: `npx http-server ./`).
2. Buka dua jendela browser yang berbeda secara berdampingan (misalnya Google Chrome reguler dan mode Incognito).
3. **Jendela Browser A (Aldy)**:
   * Lakukan pendaftaran akun atau masuk menggunakan email `aldy@domain.com` (kata sandi bebas, minimal 6 karakter).
   * Masuk ke tab **Tabungan** (atau melalui navigasi sidebar/bawah).
   * Pada kartu tabungan Aldy, masukkan nilai `3000000` pada kolom input nominal dan klik **Simpan**.
4. **Jendela Browser B (Tyo / Caesar)**:
   * Masuk menggunakan email `tyo@domain.com` atau `caesar@domain.com`.
   * Buka tab **Tabungan**.
   * Perhatikan kartu tabungan Aldy di layar Browser B — nilainya akan langsung berubah menjadi **Rp 3.000.000** tanpa perlu memuat ulang halaman!
   * Log Aktivitas di bawahnya juga akan mencatat riwayat pembaharuan realtime.
5. Coba juga pada halaman **Planning Trip** di subsection **Pengaturan Parameter Trip Kelompok** (Option D):
   * Edit budget atau jumlah malam menggunakan akun Aldy (Owner) atau Tyo (Admin).
   * Layar Caesar (Member) akan memperbarui data trip tersebut secara instan, namun Caesar tidak akan bisa mengubah slider parameter trip (slider terkunci & tertulis 🔒 Read-Only).

---

## Langkah 5: Deploy ke Netlify

Untuk mendeploy website ini ke Netlify secara gratis:

### Metode A: Drag and Drop (Paling Mudah)
1. Buat folder arsip `.zip` dari seluruh file proyek ini (pastikan folder `assets`, `css`, `js`, `components`, `pages`, `data`, dan `index.html` berada di tingkat teratas arsip zip).
2. Masuk ke [Netlify Dashboard](https://app.netlify.com).
3. Seret file `.zip` tersebut ke area dropzone bertuliskan **Drag and drop your site folder here** pada halaman Netlify.
4. Netlify akan memproses pengunggahan dan website Anda langsung online dalam hitungan detik!

### Metode B: Integrasi Git (Rekomendasi untuk Continuous Deployment)
1. Unggah kode Anda ke repositori pribadi/publik di GitHub, GitLab, atau Bitbucket.
2. Di dashboard Netlify, klik **Add new site** -> **Import an existing project**.
3. Hubungkan dengan akun Git Anda, lalu pilih repositori proyek ini.
4. Pada setelan Build settings:
   * **Build command**: Kosongkan (karena proyek ini pure HTML/CSS/JS tanpa framework build step).
   * **Publish directory**: isi `./` atau kosongkan.
5. Klik **Deploy site**. Netlify akan mendeploy ulang otomatis setiap kali Anda melakukan `git push` ke branch utama Anda.
