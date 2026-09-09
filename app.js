// Gantikan dengan URL dan Anon Key dari projek Supabase awak (Settings > API)
const SUPABASE_URL = 'https://URL_SUPABASE_AWAK.supabase.co';
const SUPABASE_ANON_KEY = 'ANON_KEY_SUPABASE_AWAK';

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Uji sambungan (Kita cuba ambil senarai guru)
async function testConnection() {
    const { data, error } = await supabase
        .from('teachers')
        .select('*');
        
    if (error) {
        console.error('Ralat sambungan:', error.message);
    } else {
        console.log('Berjaya! Senarai Guru:', data);
    }
}

// Jalankan ujian apabila halaman dimuat turun
testConnection();

