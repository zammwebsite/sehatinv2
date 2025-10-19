
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// --- PENTING: Ganti dengan kredensial Supabase Anda ---
// Anda bisa mendapatkan URL dan Kunci Anon ini dari dashboard proyek Supabase Anda
// di bawah Pengaturan > API.
const supabaseUrl = 'GANTI_DENGAN_URL_SUPABASE_ANDA';
const supabaseAnonKey = 'GANTI_DENGAN_KUNCI_ANON_SUPABASE_ANDA';

let supabase: SupabaseClient;

const areCredentialsMissing = supabaseUrl.startsWith('GANTI_DENGAN') || supabaseAnonKey.startsWith('GANTI_DENGAN');

if (areCredentialsMissing) {
  // Tampilkan pesan error yang jelas di konsol developer
  console.error(
    '===================================================\n' +
    'ERROR: KREDENSIAL SUPABASE TIDAK DITEMUKAN!\n' +
    '===================================================\n' +
    'Aplikasi ini tidak akan dapat terhubung ke database.\n' +
    'Fitur seperti login, pendaftaran, riwayat chat, dan cek kesehatan akan GAGAL.\n\n' +
    'Untuk memperbaikinya:\n' +
    '1. Buka file `services/supabaseService.ts`.\n' +
    '2. Ganti placeholder `GANTI_DENGAN_URL_SUPABASE_ANDA` dengan URL Supabase Anda.\n' +
    '3. Ganti placeholder `GANTI_DENGAN_KUNCI_ANON_SUPABASE_ANDA` dengan Kunci Anon Supabase Anda.\n' +
    '==================================================='
  );

  // Buat mock client untuk mencegah aplikasi crash dan memberikan feedback error di UI
  const errorMessage = { message: 'Supabase tidak dikonfigurasi. Mohon periksa file services/supabaseService.ts' };
  
  const mockQueryBuilder: any = {
    select: () => mockQueryBuilder,
    insert: () => Promise.resolve({ error: errorMessage, data: null }),
    eq: () => mockQueryBuilder,
    order: () => mockQueryBuilder,
    // Buat builder bisa di-'await' untuk query select, kembalikan data kosong
    then: (resolve: (value: any) => void) => resolve({ data: [], error: null }),
  };

  supabase = {
    auth: {
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: errorMessage }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: errorMessage }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      updateUser: () => Promise.resolve({ data: { user: null }, error: errorMessage }),
    },
    from: () => mockQueryBuilder,
  } as any;

} else {
  // Inisialisasi klien Supabase yang sesungguhnya jika kredensial ada
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
