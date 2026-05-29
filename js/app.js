// =====================================
// NAVIGATION
// =====================================

function goTo(page){

  window.location.href = page;

}

// =====================================
// REGISTER
// =====================================

function registerUser(){

  const name =
    document.getElementById(
      "registerName"
    ).value;

  const email =
    document.getElementById(
      "registerEmail"
    ).value;

  const password =
    document.getElementById(
      "registerPassword"
    ).value;

  const phone =
    document.getElementById(
      "registerPhone"
    ).value;

  const location =
    document.getElementById(
      "registerLocation"
    ).value;

  const category =
    document.getElementById(
      "registerCategory"
    ).value;

  if(
    name === "" ||
    email === "" ||
    password === "" ||
    phone === "" ||
    location === "" ||
    category === ""
  ){

    alert(
      "Semua data wajib diisi"
    );

    return;
  }

  auth.createUserWithEmailAndPassword(
    email,
    password
  )

  .then(function(result){

    const user =
      result.user;

    // SAVE USER DATA

    db.collection("users")

    .doc(user.uid)

    .set({

      uid: user.uid,

      name: name,

      email: email,

      phone: phone,

      location: location,

      category: category,

      photo: "",

      rating: 5,

      createdAt:
        firebase.firestore
        .FieldValue
        .serverTimestamp()

    })

    .then(function(){

      alert(
        "Pendaftaran berhasil"
      );

      goTo("home.html");

    });

  })

  .catch(function(error){

    console.log(error);

    alert(
      error.message
    );

  });

}

// =====================================
// LOGIN
// =====================================

function loginUser(){

  const email =
    document.getElementById(
      "loginEmail"
    ).value;

  const password =
    document.getElementById(
      "loginPassword"
    ).value;

  if(
    email === "" ||
    password === ""
  ){

    alert(
      "Lengkapi login"
    );

    return;
  }

  auth.signInWithEmailAndPassword(
    email,
    password
  )

  .then(function(){

    alert(
      "Login berhasil"
    );

    goTo("home.html");

  })

  .catch(function(error){

    console.log(error);

    alert(
      error.message
    );

  });

}

// =====================================
// CHECK LOGIN
// =====================================

auth.onAuthStateChanged(function(user){

  if(user){

    console.log(
      "Login:",
      user.email
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

    alert(
      "Logout berhasil"
    );

    goTo("index.html");

  });

}

// =====================================
// CREATE JOB
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

    alert(
      "Harus login"
    );

    return;
  }

  if(
    title === "" ||
    description === "" ||
    price === "" ||
    location === ""
  ){

    alert(
      "Lengkapi data job"
    );

    return;
  }

  db.collection("jobs")

  .add({

    title: title,

    description: description,

    price: price,

    location: location,

    userId: user.uid,

    userEmail: user.email,

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
// LOAD JOBS REALTIME
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
// OPEN JOB DETAIL
// =====================================

function openJob(jobId){

  localStorage.setItem(
    "selectedJob",
    jobId
  );

  goTo("detail-job.html");

}

// =====================================
// LOAD PROFILE
// =====================================

function loadProfile(){

  const profileContainer =
    document.getElementById(
      "profileData"
    );

  if(!profileContainer){

    return;
  }

  const user =
    auth.currentUser;

  if(!user){

    return;
  }

  db.collection("users")

  .doc(user.uid)

  .get()

  .then(function(doc){

    const data =
      doc.data();

    profileContainer.innerHTML = `

      <div class="card profile-box">

        <div class="avatar">
          ${data.name.charAt(0)}
        </div>

        <h2>
          ${data.name}
        </h2>

        <br>

        <p>
          📧 ${data.email}
        </p>

        <br>

        <p>
          📱 ${data.phone}
        </p>

        <br>

        <p>
          📍 ${data.location}
        </p>

        <br>

        <p>
          💼 ${data.category}
        </p>

        <br>

        <p>
          ⭐ ${data.rating}
        </p>

      </div>

    `;

  });

}

// =====================================
// AUTO LOAD
// =====================================

window.addEventListener(
  "load",
  function(){

    loadJobs();

    loadProfile();

  }
);
