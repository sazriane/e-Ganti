// Konfigurasi Supabase
const SUPABASE_URL = 'https://ftwatlxvmosbbbhystsy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0d2F0bHh2bW9zYmJiaHlzdHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5MDA0MzgsImV4cCI6MjEwNDQ3NjQzOH0.YfpRFIyDMrhQqOfpA-32Ti--pl6a7gpRdVWxfcVnpS8';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Rujukan elemen HTML
const teacherForm = document.getElementById('addTeacherForm');
const teacherContainer = document.getElementById('teacherContainer');

// 1. Fungsi Tambah Guru
teacherForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Elak page refresh
    
    const name = document.getElementById('teacherName').value;
    const maxPeriods = document.getElementById('maxPeriods').value;

    // Masukkan data ke table 'teachers'
    const { data, error } = await supabase
        .from('teachers')
        .insert([{ name: name, max_periods_per_day: maxPeriods }]);

    if (error) {
        alert('Ralat menambah guru: ' + error.message);
    } else {
        alert('Guru berjaya ditambah! 🎀');
        teacherForm.reset();
        fetchTeachers(); // Segar semula senarai guru di bawah
    }
});

// 2. Fungsi Papar Senarai Guru
async function fetchTeachers() {
    teacherContainer.innerHTML = '<p>Sedang memuatkan senarai guru...</p>';
    
    // Ambil data dari table 'teachers', susun ikut masa terkini
    let { data: teachers, error } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        teacherContainer.innerHTML = `<p style="color:red;">Ralat: ${error.message}</p>`;
        return;
    }

    teacherContainer.innerHTML = ''; // Kosongkan tulisan 'loading'

    if (teachers.length === 0) {
        teacherContainer.innerHTML = '<p>Belum ada guru yang didaftarkan.</p>';
        return;
    }

    // Loop data dan hasilkan kad untuk setiap guru
    teachers.forEach(teacher => {
        const card = document.createElement('div');
        card.className = 'teacher-card';
        card.innerHTML = `
            <div>
                <strong>${teacher.name}</strong><br>
                <small>Maksimum: ${teacher.max_periods_per_day} waktu/sehari</small>
            </div>
        `;
        teacherContainer.appendChild(card);
    });
}

// Panggil fungsi papar guru apabila fail siap dimuat turun
fetchTeachers();
