// =====================================
// NAVIGATION
// =====================================

function goTo(page){

  window.location.href = page;

}

// =====================================
// REGISTER USER
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

  // VALIDATION

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

  // REGISTER FIREBASE AUTH

  auth.createUserWithEmailAndPassword(
    email,
    password
  )

  .then(async function(result){

    const user =
      result.user;

    // SAVE USER TO FIRESTORE

    await db.collection("users")

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

    });

    alert(
      "Register berhasil"
    );

    goTo("home.html");

  })

  .catch(function(error){

    console.log(error);

    if(
      error.code ===
      "auth/email-already-in-use"
    ){

      alert(
        "Email sudah terdaftar"
      );

    }else if(
      error.code ===
      "auth/weak-password"
    ){

      alert(
        "Password minimal 6 karakter"
      );

    }else{

      alert(
        error.message
      );

    }

  });

}

// =====================================
// LOGIN USER
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
      "Email atau password salah"
    );

  });

}

// =====================================
// CHECK LOGIN
// =====================================

auth.onAuthStateChanged(
  function(user){

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

  }
);

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
// LOAD PROFILE FINAL
// =====================================

function loadProfile(){

  const profileContainer =
    document.getElementById(
      "profileData"
    );

  if(!profileContainer){

    return;

  }

  
  // LOADING SPINNER

  profileContainer.innerHTML = `

    <div class="loading-box">

      <div class="spinner"></div>

      <p>
        Loading profile...
      </p>

    </div>

  `;

  auth.onAuthStateChanged(
    function(user){

      if(!user){

        return;

      }

      db.collection("users")

      .doc(user.uid)

      .onSnapshot(function(doc){

        if(!doc.exists){

          profileContainer.innerHTML =
            "Profile tidak ditemukan";

          return;

        }

        const data =
          doc.data();

        let avatar = "";

        // FOTO PROFILE

        if(
          data.photo &&
          data.photo !== ""
        ){

          avatar = `

            <img
              src="${data.photo}"
              class="avatar-image"
            >

          `;

        }else{

          // FALLBACK HURUF

          avatar = `

            <div class="avatar-letter">

              ${data.name.charAt(0)}
              
            </div>

          `;

        }

        // RENDER PROFILE

        
      profileContainer.innerHTML = `

          <div class="card profile-card">

            ${avatar}

            <br><br>

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

      
        // AUTO FILL EDIT FORM

        const editName =
          document.getElementById(
            "editName"
          );

        const editPhone =
          document.getElementById(
            "editPhone"
          );

        const editLocation =
          document.getElementById(
            "editLocation"
          );

        const editCategory =
          document.getElementById(
            "editCategory"
          );

        const editPhoto =
          document.getElementById(
            "editPhoto"
          );

        if(editName){

          editName.value =
            data.name || "";

        }

        if(editPhone){

          editPhone.value =
            data.phone || "";

        }

        if(editLocation){

          editLocation.value =
            data.location || "";

        }

        if(editCategory){

          editCategory.value =
            data.category || "";

        }

        if(editPhoto){

          editPhoto.value =
            data.photo || "";

        }

      });

    }
  );

}

// =====================================
// UPDATE PROFILE
// =====================================

function updateProfile(){

  const user =
    auth.currentUser;

  if(!user){

    alert(
      "Harus login"
    );

    return;

  }

  const name =
    document.getElementById(
      "editName"
    ).value;

  const phone =
    document.getElementById(
      "editPhone"
    ).value;

  const location =
    document.getElementById(
      "editLocation"
    ).value;

  const category =
    document.getElementById(
      "editCategory"
    ).value;

  const photo =
    document.getElementById(
      "editPhoto"
    ).value;

  if(
    name === "" ||
    phone === "" ||
    location === "" ||
    category === ""
  ){

    alert(
      "Lengkapi profile"
    );

    return;

  }

  db.collection("users")

  .doc(user.uid)

  .update({

    name: name,

    phone: phone,

    location: location,

    category: category,

    photo: photo

  })

  .then(function(){

    alert(
      "Profile berhasil diperbarui"
    );

  })

  .catch(function(error){

    console.log(error);

    alert(
      "Gagal update profile"
    );

  });

}


// =====================================
// SUBMIT REVIEW
// =====================================

function submitReview(){

  const user =
    auth.currentUser;

  if(!user){

    alert(
      "Harus login"
    );

    return;

  }

  // USER YANG DIREVIEW

  const toUserId =
    localStorage.getItem(
      "reviewUserId"
    );

  // JOB ID

  const jobId =
    localStorage.getItem(
      "reviewJobId"
    );

  // RATING

  const rating =
    parseInt(
      document.getElementById(
        "reviewRating"
      ).value
    );

  // COMMENT

  const comment =
    document.getElementById(
      "reviewComment"
    ).value;

  if(comment === ""){

    alert(
      "Tulis ulasan"
    );

    return;

  }

  // SAVE REVIEW

  db.collection("reviews")

  .add({

    fromUserId:
      user.uid,

    toUserId:
      toUserId,

    jobId:
      jobId,

    rating:
      rating,

    comment:
      comment,

    createdAt:
      firebase.firestore
      .FieldValue
      .serverTimestamp()

  })

  .then(function(){

    // UPDATE USER RATING

    updateUserRating(
      toUserId
    );

    alert(
      "Ulasan berhasil dikirim"
    );

    goTo("profile.html");

  })

  .catch(function(error){

    console.log(error);

    alert(
      "Gagal mengirim ulasan"
    );

  });

}

// =====================================
// UPDATE USER RATING
// =====================================

function updateUserRating(userId){

  db.collection("reviews")

  .where(
    "toUserId",
    "==",
    userId
  )

  .get()

  .then(function(snapshot){

    let total =
      0;

    let count =
      snapshot.size;

    snapshot.forEach(function(doc){

      total +=
        doc.data().rating;

    });

    // BELUM ADA REVIEW

    if(count === 0){

      db.collection("users")

      .doc(userId)

      .update({

        averageRating:
          0,

        totalReviews:
          0

      });

      return;

    }

    // RATA RATA

    const average =
      (
        total / count
      ).toFixed(1);

    // UPDATE USER

    db.collection("users")

    .doc(userId)

    .update({

      averageRating:
        parseFloat(
          average
        ),

      totalReviews:
        count

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

    loadProfile();

  }
);
