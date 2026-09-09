// Konfigurasi Supabase
const SUPABASE_URL = 'https://ftwatlxvmosbbbhystsy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0d2F0bHh2bW9zYmJiaHlzdHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5MDA0MzgsImV4cCI6MjEwNDQ3NjQzOH0.YfpRFIyDMrhQqOfpA-32Ti--pl6a7gpRdVWxfcVnpS8';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- BAHAGIAN 1: PENGURUSAN GURU ---
const teacherForm = document.getElementById('addTeacherForm');
const teacherContainer = document.getElementById('teacherContainer');

// Fungsi Tambah Guru
teacherForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const name = document.getElementById('teacherName').value;
    const maxPeriods = document.getElementById('maxPeriods').value;

    const { data, error } = await supabase
        .from('teachers')
        .insert([{ name: name, max_periods_per_day: maxPeriods }]);

    if (error) {
        alert('Ralat menambah guru: ' + error.message);
    } else {
        alert('Guru berjaya ditambah! 🎀');
        teacherForm.reset();
        fetchTeachers(); 
    }
});

// Fungsi Papar Senarai Guru
async function fetchTeachers() {
    teacherContainer.innerHTML = '<p>Sedang memuatkan senarai guru...</p>';
    
    let { data: teachers, error } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        teacherContainer.innerHTML = `<p style="color:red;">Ralat: ${error.message}</p>`;
        return;
    }

    teacherContainer.innerHTML = ''; 

    if (teachers.length === 0) {
        teacherContainer.innerHTML = '<p>Belum ada guru yang didaftarkan.</p>';
        return;
    }

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

// Panggil fungsi papar guru apabila web dibuka
fetchTeachers();


// --- BAHAGIAN 2: MUAT NAIK JADUAL (CSV) ---
const uploadCsvBtn = document.getElementById('uploadCsvBtn');

uploadCsvBtn.addEventListener('click', async () => {
    const fileInput = document.getElementById('csvFile');
    
    if (!fileInput.files.length) {
        alert('Sila pilih fail CSV dahulu! 🌸');
        return;
    }

    uploadCsvBtn.innerText = "Sedang memproses... ⏳";

    // Ambil senarai guru untuk padankan ID
    const { data: teachers, error: teacherError } = await supabase
        .from('teachers')
        .select('id, name');

    if (teacherError) {
        alert('Ralat mengambil senarai guru: ' + teacherError.message);
        uploadCsvBtn.innerText = "🚀 Proses & Simpan Jadual";
        return;
    }

    // Buat pemetaan nama ke ID
    const teacherMap = {};
    teachers.forEach(t => {
        teacherMap[t.name.toLowerCase().trim()] = t.id;
    });

    // Baca CSV guna PapaParse
    Papa.parse(fileInput.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: async function(results) {
            const rows = results.data;
            const timetablesToInsert = [];
            let missingTeachers = [];

            for (let row of rows) {
                const csvName = row['Nama Guru'] ? row['Nama Guru'].toLowerCase().trim() : '';
                
                if (teacherMap[csvName]) {
                    timetablesToInsert.push({
                        teacher_id: teacherMap[csvName],
                        day_of_week: row['Hari'],
                        period_number: parseInt(row['Waktu']),
                        class_name: row['Kelas'],
                        subject: row['Subjek']
                    });
                } else if (row['Nama Guru']) {
                    if(!missingTeachers.includes(row['Nama Guru'])) {
                        missingTeachers.push(row['Nama Guru']);
                    }
                }
            }

            if (timetablesToInsert.length > 0) {
                const { error: insertError } = await supabase
                    .from('timetables')
                    .insert(timetablesToInsert);

                if (insertError) {
                    alert('Ralat menyimpan jadual: ' + insertError.message);
                } else {
                    alert(`Berjaya! 🎉 ${timetablesToInsert.length} slot jadual telah disimpan.`);
                    if (missingTeachers.length > 0) {
                        alert(`Nota: Guru ini tiada dalam sistem dan jadualnya diabaikan:\n${missingTeachers.join(', ')}`);
                    }
                    fileInput.value = ''; 
                }
            } else {
                alert('Tiada data yang sah. Pastikan nama lajur CSV betul dan guru telah didaftarkan.');
            }
            
            uploadCsvBtn.innerText = "🚀 Proses & Simpan Jadual";
        }
    });
});
