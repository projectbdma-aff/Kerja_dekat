import { initializeApp } from "https://gstatic.com";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from "https://gstatic.com";

// !!! SALIN DAN REPLACE DENGAN KONFIGURASI ASLI DARI FIREBASE CONSOLE ANDA !!!
const firebaseConfig = {
    apiKey: "AIzaSyAxxxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "://firebaseapp.com",
    projectId: "kerja-dekat",
    storageBucket: "://appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Elemen Dom
const authTitle = document.getElementById('auth-title');
const bannerSub = document.getElementById('banner-sub');
const btnMain = document.getElementById('btn-main');
const switchWrapper = document.getElementById('switch-wrapper');

let isLoginMode = true;

// Delegasi Event untuk menangani klik tombol ganti mode (karena teks diperbarui dinamis)
document.addEventListener('click', function(e) {
    if(e.target && e.target.id === 'switch-mode') {
        isLoginMode = !isLoginMode;
        if (isLoginMode) {
            authTitle.innerText = "Masuk ke Akun";
            bannerSub.innerText = "Masuk menggunakan akun Anda";
            btnMain.innerText = "Masuk";
            btnMain.className = "btn-primary";
            switchWrapper.innerHTML = 'Belum punya akun? <span id="switch-mode">Daftar di sini</span>';
        } else {
            authTitle.innerText = "Daftar Akun Baru";
            bannerSub.innerText = "Buat akun KerjaDekat gratis";
            btnMain.innerText = "Daftar Sekarang";
            btnMain.className = "btn-secondary";
            switchWrapper.innerHTML = 'Sudah punya akun? <span id="switch-mode">Log in di sini</span>';
        }
    }
});

// Aksi Autentikasi
btnMain.addEventListener('click', () => {
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;

    if (!email || !password) {
        alert("Kolom email dan password tidak boleh kosong!");
        return;
    }

    if (isLoginMode) {
        // Proses Masuk
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                alert("Login berhasil!");
                window.location.href = "dashboard.html"; // Ubah ke nama berkas dashboard utama Anda setelah login
            })
            .catch((error) => {
                handleAuthError(error.code);
            });
    } else {
        // Proses Registrasi
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                alert("Pendaftaran akun berhasil!");
                window.location.href = "dashboard.html"; // Ubah ke nama berkas dashboard utama Anda setelah login
            })
            .catch((error) => {
                handleAuthError(error.code);
            });
    }
});

// Penanganan Pesan Error Firebase
function handleAuthError(errorCode) {
    switch (errorCode) {
        case 'auth/invalid-email':
            alert('Format penulisan email salah.');
            break;
        case 'auth/email-already-in-use':
            alert('Alamat email tersebut sudah terdaftar.');
            break;
        case 'auth/weak-password':
            alert('Kata sandi terlalu pendek. Minimal gunakan 6 karakter.');
            break;
        case 'auth/invalid-credential':
            alert('Kombinasi email atau kata sandi Anda salah.');
            break;
        default:
            alert('Gagal memproses autentikasi: ' + errorCode);
    }
}
