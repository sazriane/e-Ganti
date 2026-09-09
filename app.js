// Konfigurasi Supabase
const SUPABASE_URL = 'https://ftwatlxvmosbbbhystsy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0d2F0bHh2bW9zYmJiaHlzdHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5MDA0MzgsImV4cCI6MjEwNDQ3NjQzOH0.YfpRFIyDMrhQqOfpA-32Ti--pl6a7gpRdVWxfcVnpS8';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fungsi untuk test sambungan (Panggil senarai guru)
async function testConnection() {
    console.log("Sedang menyambung ke pangkalan data...");
    
    let { data: teachers, error } = await supabase
        .from('teachers')
        .select('*');
        
    if (error) {
        console.error("Ralat sambungan:", error.message);
    } else {
        console.log("Berjaya! Senarai guru:", teachers);
        // Memandangkan database masih kosong, ia akan papar array kosong []
    }
}

testConnection();
