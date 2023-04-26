const app = require('./firebaseConfig.js');
const admin = require('./firebaseConfig.js');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

function signInWithEmail(email, password) {
    // Get the auth object
    const auth = getAuth();
    // Sign in with email and password
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Logged in successfully
        const user = userCredential.user;
        //console.log("Logged in user:", user);
      })
      .catch((error) => {
        // Error occurred during login
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Login error:", errorCode, errorMessage);
      });
  }


  function signOutUser () {
    // Get the auth object
    const auth = getAuth();
    // Sign out the user
    auth.signOut()
      .then(() => {
        // Sign-out successful
        console.log("User signed out.");
      })
      .catch((error) => {
        // An error occurred while signing out
        console.error("Sign-out error:", error);
      });
  }

module.exports = {
    signInWithEmail,
    signOutUser
};

//signInWithEmail('jobavaw504@syinxun.com', 'password');