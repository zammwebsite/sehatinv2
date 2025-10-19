import { createClient } from '@supabase/supabase-js';

// Variabel ini akan diambil dari pengaturan environment di Vercel saat deploy.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Pesan ini akan muncul jika variabel lingkungan belum diatur.
  throw new Error("Supabase URL and Anon Key are required. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.");
}

// Inisialisasi dan ekspor klien Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipe data untuk event autentikasi sekarang dapat diimpor langsung 
// dari '@supabase/supabase-js' di file yang membutuhkannya, seperti di useAuth.tsx.
