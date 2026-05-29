// NAVIGATION

function goTo(page){
  window.location.href = page;
}

// LOGIN

function loginUser(){

  const phone = document.getElementById("phone").value;

  if(phone === ""){
    alert("Masukkan nomor HP");
    return;
  }

  alert("OTP dikirim");

  goTo("otp.html");
}

// OTP

function verifyOTP(){

  alert("Login berhasil");

  goTo("home.html");
}

// JOB

function submitJob(){

  alert("Job berhasil diposting");

  goTo("home.html");
}

function acceptJob(){

  alert("Permintaan menerima job dikirim");
}

// CHAT

function sendMessage(){

  const input = document.getElementById("chatInput");

  if(input.value === ""){
    return;
  }

  alert("Pesan terkirim");

  input.value = "";
}

// ESCROW

function payNow(){

  alert("Membuka pembayaran");
}

// REPORT

function reportUser(){

  alert("User berhasil dilaporkan");
}

// PROFILE

function logout(){

  const confirmLogout = confirm("Keluar dari akun?");

  if(confirmLogout){
    goTo("index.html");
  }
}
