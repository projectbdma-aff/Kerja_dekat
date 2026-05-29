// NAVIGATION

function goTo(page){
  window.location.href = page;
}

// FIREBASE RECAPTCHA

window.onload = function(){

  if(document.getElementById('recaptcha-container')){

    window.recaptchaVerifier =
      new firebase.auth.RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'normal',
          callback: function(response){
            console.log("Recaptcha verified");
          }
        }
      );

    recaptchaVerifier.render();
  }

};

// SEND OTP

function sendOTP(){

  const phoneNumber =
    document.getElementById("phone").value;

  if(phoneNumber === ""){

    alert("Masukkan nomor HP");

    return;
  }

  const appVerifier =
    window.recaptchaVerifier;

  auth.signInWithPhoneNumber(
    phoneNumber,
    appVerifier
  )

  .then(function(confirmationResult){

    window.confirmationResult =
      confirmationResult;

    localStorage.setItem(
      "phoneNumber",
      phoneNumber
    );

    alert("OTP berhasil dikirim");

    goTo("otp.html");

  })

  .catch(function(error){

    console.log(error);

    alert(
      "Gagal mengirim OTP"
    );

  });

}

// VERIFY OTP

function verifyOTP(){

  const code =
    document.getElementById("otpCode").value;

  if(code === ""){

    alert("Masukkan kode OTP");

    return;
  }

  window.confirmationResult
    .confirm(code)

    .then(function(result){

      const user = result.user;

      console.log(user);

      alert("Login berhasil");

      goTo("home.html");

    })

    .catch(function(error){

      console.log(error);

      alert("OTP salah");

    });

}

// CHECK LOGIN

auth.onAuthStateChanged(function(user){

  if(user){

    console.log(
      "User login:",
      user.phoneNumber
    );

  }else{

    console.log(
      "Belum login"
    );

  }

});

// LOGOUT

function logout(){

  auth.signOut()

  .then(function(){

    alert("Logout berhasil");

    goTo("index.html");

  });

}
