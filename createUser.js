const {app, admin} = require('./firebaseConfig.js');

const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

function createUser(name, email, password, set) {
  // Check if email is in right format
  if (!email.includes('@') || !email.includes('.')) {
    console.log('Email is not in the right format');
    throw new Error('Email is not in the right format');
  }

  // Check if password is in right format
  if (password.length < 6) {
    throw new Error('Password is too short');
  }

  return admin.auth().createUser({
    email: email,
    password: password
  })
  .then((userRecord) => {
    const userRef = admin.firestore().collection('users').doc(userRecord.email);

    return userRef.get()
    .then((snapshot) => {
      return userRef.set({
        email: email,
        name: name,
        uid: userRecord.uid,
        buddies: [],
        swipedThem: [],
        swipedMe: [],
        notMatches: [],
        photoUrl: "",
        Language: [],
        Major: "",
        University: "",
        age: "",
        InterestedSubjects: []
      });
    })
    .then(() => {
      console.log('Successfully created new user:', userRecord.uid);
    });
  })
  .catch((error) => {
    console.error('Error creating new user:', error);
  });
}


//createUser('Joseph Akra','jobavaw504@syinxun.com', 'password');
//createUser('John Snow','johnsnow@gmail.com', 'password');
//createUser('Josep Stalink','jostallinbigsick@sicleadmin.com', 'password');
//createUser('Josep Waterson','jojostalinbigsick@sicleadmin2.com', 'password');
module.exports = {createUser};
