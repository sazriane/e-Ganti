// Masukkan kredensial Supabase anda
const SUPABASE_URL = 'https://ftwatlxvmosbbbhystsy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0d2F0bHh2bW9zYmJiaHlzdHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5MDA0MzgsImV4cCI6MjEwNDQ3NjQzOH0.YfpRFIyDMrhQqOfpA-32Ti--pl6a7gpRdVWxfcVnpS8';

// Initialize Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Fungsi untuk panggil senarai guru dari database
async function dapatkanSenaraiGuru() {
    const container = document.getElementById('senarai-guru-container');
    container.innerHTML = 'Memuatkan data...';

    const { data, error } = await supabase
        .from('guru')
        .select('*')
        .order('nama', { ascending: true });

    if (error) {
        console.error('Error fetching data:', error);
        container.innerHTML = '<p style="color:red;">Gagal memuatkan data dari Supabase.</p>';
        return;
    }

    if (data.length === 0) {
        container.innerHTML = '<p>Belum ada data guru direkodkan.</p>';
        return;
    }

    // Bina jadual HTML untuk paparkan guru
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nama Guru</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(guru => {
        tableHTML += `
            <tr>
                <td>${guru.id}</td>
                <td>${guru.nama}</td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table>`;
    container.innerHTML = tableHTML;
}

// Fungsi sementara untuk masukkan data guru sebagai ujian (Testing)
async function tambahGuruTest() {
    const namaGuru = prompt("Masukkan nama guru baru (Contoh: Cikgu Ahmad):");
    
    if(namaGuru) {
        const { data, error } = await supabase
            .from('guru')
            .insert([{ nama: namaGuru }]);

        if (error) {
            alert('Ralat semasa menambah guru!');
            console.error(error);
        } else {
            alert('Berjaya ditambah!');
            dapatkanSenaraiGuru(); // Refresh jadual
        }
    }
}

// Panggil fungsi ini semasa page di-load
window.onload = () => {
    dapatkanSenaraiGuru();
};

// ==========================================
// KAWALAN DRAWER / HAMBURGER MENU (MOBILE)
// ==========================================
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

function toggleDrawer() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

// Buka laci bila butang ☰ ditekan
menuToggle.addEventListener('click', toggleDrawer);

// Tutup laci bila bahagian gelap (overlay) ditekan
overlay.addEventListener('click', toggleDrawer);

// (Pilihan) Tutup laci bila menu di klik
const menuLinks = document.querySelectorAll('.sidebar ul li a');
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Hanya tutup automatik jika dalam mode telefon
        if (window.innerWidth <= 768) {
            toggleDrawer();
        }
    });
});
