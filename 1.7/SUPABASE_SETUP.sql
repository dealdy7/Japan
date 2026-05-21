-- ====================================================================
-- SUPABASE POSTGRESQL SCHEMA FOR JAPAN COLLABORATIVE TRIP PLANNER & SAVINGS
-- ====================================================================
--
-- CARA RESET & SETUP ULANG:
-- 1. Buka dashboard Supabase Anda (https://supabase.com).
-- 2. Masuk ke menu "SQL Editor" di sidebar kiri.
-- 3. Klik "New query" dan salin seluruh script SQL di bawah ini.
-- 4. Klik tombol "Run" di pojok kanan bawah editor untuk mengeksekusi script.
-- ====================================================================

-- ==========================================
-- 0. CLEANING SCHEMA LAMA (RESET TOTAL)
-- ==========================================
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user() cascade;

drop table if exists public.trip_settings cascade;
drop table if exists public.savings cascade;
drop table if exists public.profiles cascade; -- Hapus tabel profiles lama agar arsitektur bersih

-- ==========================================
-- 1. PEMBUATAN TABEL UTAMA
-- ==========================================

-- A. Tabel Savings/Tabungan (Berisi Nominal Tabungan Anggota & Role)
-- Tabel ini adalah Single Source of Truth untuk data user & role di aplikasi.
create table public.savings (
  user_id uuid references auth.users on delete cascade not null primary key,
  username text not null,
  role text default 'member' check (role in ('owner', 'admin', 'member')),
  amount numeric default 0 not null check (amount >= 0),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  constraint savings_user_id_unique unique (user_id)
);

-- B. Tabel Trip Settings (Parameter Rencana Perjalanan Kelompok Option D)
create table public.trip_settings (
  id text not null primary key default 'group_trip_option_d',
  persons integer default 3 not null check (persons > 0),
  flight_per_person numeric default 3500000 not null,
  hotel_per_night numeric default 800000 not null,
  nights integer default 6 not null check (nights > 0),
  transport_per_person numeric default 600000 not null,
  souvenir_per_person numeric default 300000 not null,
  updated_by_name text default 'System',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Seed parameter default untuk Option D jika tabel kosong
insert into public.trip_settings (id, persons, flight_per_person, hotel_per_night, nights, transport_per_person, souvenir_per_person, updated_by_name)
values ('group_trip_option_d', 3, 3500000, 800000, 6, 600000, 300000, 'System')
on conflict (id) do nothing;


-- ==========================================
-- 2. TRIGGER OTOMATIS SAAT USER MENDAFTAR (AUTH SIGN-UP)
-- ==========================================
-- Fungsi handle_new_user() mendeteksi email pendaftar, menentukan username
-- dan menetapkan level akses (owner/admin/member) lalu menyisipkannya ke
-- tabel savings secara otomatis.
create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_username text;
  v_role text;
begin
  -- Deteksi email prefix untuk membagi user
  if new.email ilike 'aldy%' then
    v_username := 'Aldy';
    v_role := 'owner';
  elsif new.email ilike 'tyo%' then
    v_username := 'Tyo';
    v_role := 'admin';
  elsif new.email ilike 'caesar%' then
    v_username := 'Caesar';
    v_role := 'member';
  else
    v_username := split_part(new.email, '@', 1);
    -- Ubah format agar huruf pertama kapital (contoh: budi@domain.com -> Budi)
    v_username := initcap(v_username);
    v_role := 'member';
  end if;

  -- Menyisipkan data tabungan & role default (Default: Rp 0)
  insert into public.savings (user_id, username, role, amount, updated_at)
  values (new.id, v_username, v_role, 0, now())
  on conflict (user_id) do update
  set role = excluded.role;

  return new;
end;
$$ language plpgsql security definer;

-- Daftarkan fungsi handle_new_user sebagai trigger auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ==========================================
-- 3. HAK AKSES DAN SECURITY POLICIES (RLS)
-- ==========================================

-- Aktifkan Row Level Security (RLS) untuk semua tabel
alter table public.savings enable row level security;
alter table public.trip_settings enable row level security;

-- A. Kebijakan Tabel savings (Tabungan):
-- * Siapa saja yang login dapat melihat seluruh tabungan anggota kelompok.
-- * User hanya diperbolehkan mengupdate tabungan miliknya sendiri, KECUALI jika user tersebut memiliki role 'owner' (maka dia bisa mengupdate milik siapapun).
create policy "Allow select savings for authenticated" 
  on public.savings for select 
  to authenticated 
  using (true);

create policy "Allow insert own savings only" 
  on public.savings for insert 
  to authenticated 
  with check (auth.uid() = user_id);

create policy "Allow update savings for owner or self" 
  on public.savings for update 
  to authenticated 
  using (
    auth.uid() = user_id or 
    exists (
      select 1 from public.savings
      where savings.user_id = auth.uid()
      and savings.role = 'owner'
    )
  )
  with check (
    auth.uid() = user_id or 
    exists (
      select 1 from public.savings
      where savings.user_id = auth.uid()
      and savings.role = 'owner'
    )
  );

-- B. Kebijakan Tabel trip_settings (Parameter Trip):
-- * Semua user yang login dapat membaca parameter trip kelompok.
-- * Sesuai aturan baru: SEMUA user yang login (authenticated) dapat mengubah parameter trip settings.
create policy "Allow select trip_settings for authenticated" 
  on public.trip_settings for select 
  to authenticated 
  using (true);

create policy "Allow update trip_settings for authenticated users" 
  on public.trip_settings for update 
  to authenticated 
  using (true)
  with check (true);


-- ==========================================
-- 4. REALTIME REPLICATION CONFIGURATION
-- ==========================================
-- Tambahkan tabel savings dan trip_settings ke sistem publikasi realtime Supabase
-- agar perubahan di tabel-tabel ini langsung disiarkan secara instant ke frontend klien.

begin;
  -- Hapus dari publikasi lama jika ada untuk menghindari konflik penambahan
  alter publication supabase_realtime drop table if exists public.savings;
  alter publication supabase_realtime drop table if exists public.trip_settings;
  
  -- Tambahkan ke publikasi Supabase Realtime
  alter publication supabase_realtime add table public.savings;
  alter publication supabase_realtime add table public.trip_settings;
commit;
