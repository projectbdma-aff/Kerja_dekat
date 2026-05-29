// =====================================
// NAVIGATION
// =====================================

function goTo(page){
  window.location.href = page;
}

// =====================================
// FIREBASE RECAPTCHA
// =====================================

window.onload = function(){

  if(document.getElementById('recaptcha-container')){

    window.recaptchaVerifier =
      new firebase.auth.RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'normal',

          callback: function(response){

            console.log(
              "Recaptcha verified"
            );

          }
        }
      );

    recaptchaVerifier.render();
  }

};

// =====================================
// SEND OTP
// =====================================

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

    // simpan verification id

    localStorage.setItem(
      "verificationId",
      confirmationResult.verificationId
    );

    alert("OTP berhasil dikirim");

    goTo("otp.html");

  })

  .catch(function(error){

    console.log(error);

    alert("Gagal mengirim OTP");

  });

}

// =====================================
// VERIFY OTP
// =====================================

function verifyOTP(){

  const code =
    document.getElementById("otpCode").value;

  if(code === ""){

    alert("Masukkan kode OTP");

    return;
  }

  const verificationId =
    localStorage.getItem(
      "verificationId"
    );

  const credential =
    firebase.auth.PhoneAuthProvider
    .credential(
      verificationId,
      code
    );

  auth.signInWithCredential(
    credential
  )

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

// =====================================
// CHECK LOGIN
// =====================================

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

// =====================================
// LOGOUT
// =====================================

function logout(){

  auth.signOut()

  .then(function(){

    alert("Logout berhasil");

    goTo("index.html");

  });

}

// =====================================
// CREATE JOB REALTIME
// =====================================

function createJob(){

  const title =
    document.getElementById(
      "jobTitle"
    ).value;

  const description =
    document.getElementById(
      "jobDescription"
    ).value;

  const price =
    document.getElementById(
      "jobPrice"
    ).value;

  const location =
    document.getElementById(
      "jobLocation"
    ).value;

  const user =
    auth.currentUser;

  if(!user){

    alert("Harus login");

    return;
  }

  if(
    title === "" ||
    description === "" ||
    price === "" ||
    location === ""
  ){

    alert("Lengkapi semua data");

    return;
  }

  db.collection("jobs")

  .add({

    title: title,

    description: description,

    price: price,

    location: location,

    userPhone:
      user.phoneNumber,

    status: "open",

    createdAt:
      firebase.firestore
      .FieldValue
      .serverTimestamp()

  })

  .then(function(){

    alert(
      "Job berhasil dibuat"
    );

    goTo("home.html");

  })

  .catch(function(error){

    console.log(error);

    alert(
      "Gagal membuat job"
    );

  });

}

// =====================================
// LOAD JOB REALTIME
// =====================================

function loadJobs(){

  const jobList =
    document.getElementById(
      "jobList"
    );

  if(!jobList){

    return;
  }

  db.collection("jobs")

  .orderBy(
    "createdAt",
    "desc"
  )

  .onSnapshot(function(snapshot){

    jobList.innerHTML = "";

    snapshot.forEach(function(doc){

      const job =
        doc.data();

      jobList.innerHTML += `

        <div class="job-card">

          <div class="job-title">
            ${job.title}
          </div>

          <div class="job-price">
            Rp${job.price}
          </div>

          <div class="job-location">
            📍 ${job.location}
          </div>

          <br>

          <p>
            ${job.description}
          </p>

          <br>

          <button
            class="btn"
            onclick="openJob('${doc.id}')"
          >
            Detail Job
          </button>

        </div>

      `;

    });

  });

}

// =====================================
// OPEN DETAIL JOB
// =====================================

function openJob(jobId){

  localStorage.setItem(
    "selectedJob",
    jobId
  );

  goTo("detail-job.html");

}

// =====================================
// LOAD DETAIL JOB
// =====================================

function loadJobDetail(){

  const detailContainer =
    document.getElementById(
      "jobDetail"
    );

  if(!detailContainer){

    return;
  }

  const jobId =
    localStorage.getItem(
      "selectedJob"
    );

  if(!jobId){

    return;
  }

  db.collection("jobs")

  .doc(jobId)

  .get()

  .then(function(doc){

    if(doc.exists){

      const job =
        doc.data();

      detailContainer.innerHTML = `

        <div class="job-card">

          <div class="job-title">
            ${job.title}
          </div>

          <div class="job-price">
            Rp${job.price}
          </div>

          <div class="job-location">
            📍 ${job.location}
          </div>

          <br>

          <p>
            ${job.description}
          </p>

          <br>

          <p>
            Status:
            ${job.status}
          </p>

          <br>

          <button
            class="btn"
            onclick="acceptJob('${doc.id}')"
          >
            Ambil Job
          </button>

        </div>

      `;

    }

  });

}

// =====================================
// ACCEPT JOB
// =====================================

function acceptJob(jobId){

  const user =
    auth.currentUser;

  if(!user){

    alert("Harus login");

    return;
  }

  db.collection("jobs")

  .doc(jobId)

  .update({

    status: "accepted",

    workerPhone:
      user.phoneNumber

  })

  .then(function(){

    alert(
      "Job berhasil diambil"
    );

  })

  .catch(function(error){

    console.log(error);

    alert(
      "Gagal mengambil job"
    );

  });

}

// =====================================
// SEARCH JOB
// =====================================

function searchJobs(){

  const keyword =
    document.getElementById(
      "searchInput"
    ).value
    .toLowerCase();

  const jobList =
    document.getElementById(
      "jobList"
    );

  if(!jobList){

    return;
  }

  db.collection("jobs")

  .orderBy(
    "createdAt",
    "desc"
  )

  .onSnapshot(function(snapshot){

    jobList.innerHTML = "";

    snapshot.forEach(function(doc){

      const job =
        doc.data();

      const title =
        job.title.toLowerCase();

      if(title.includes(keyword)){

        jobList.innerHTML += `

          <div class="job-card">

            <div class="job-title">
              ${job.title}
            </div>

            <div class="job-price">
              Rp${job.price}
            </div>

            <div class="job-location">
              📍 ${job.location}
            </div>

            <br>

            <button
              class="btn"
              onclick="openJob('${doc.id}')"
            >
              Detail
            </button>

          </div>

        `;

      }

    });

  });

}

// =====================================
// AUTO LOAD
// =====================================

window.addEventListener(
  "load",
  function(){

    loadJobs();

    loadJobDetail();

  }
);
