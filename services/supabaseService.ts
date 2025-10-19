import { createClient } from '@supabase/supabase-js';

// Variabel ini akan diambil dari pengaturan environment di Vercel saat deploy.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// To prevent the app from crashing when environment variables are not set,
// we'll use placeholder values and log a warning. The app will load but Supabase
// functionality will be disabled until the variables are set.
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL and/or Anon Key are not set in environment variables. ' +
    'The app will use placeholder values, and Supabase features will not work. ' +
    'Please set SUPABASE_URL and SUPABASE_ANON_KEY for full functionality.'
  );
}

// Inisialisasi dan ekspor klien Supabase
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder.anon.key'
);

// Tipe data untuk event autentikasi sekarang dapat diimpor langsung 
// dari '@supabase/supabase-js' di file yang membutuhkannya, seperti di useAuth.tsx.
