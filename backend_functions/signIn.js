const {app, admin} = require('../firebaseConfig.js');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const {getUserData} = require('./utilities.js');


async function signInWithEmail(email, password) {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    //get the token
    const token = await user.getIdToken();
    // return token
    return token;
    //catch error
  } catch (error) {
    console.error('Error signing in with email and password', error);
    // throw the error
    throw new Error("Invalid email or password");
  }
}


/*
async function signInWithEmail(email, password) {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    //get the token
    const token = await user.getIdToken();
    //get the user data
   // const userData = await getUserData(user.uid);
    //add the token to the user data
    //let flag = true;
    // return token and flag as json
    return token;
    //catch error
  } catch (error) {
    console.error('Error signing in with email and password', error);
  }
}
*/
async function verifyIdToken(idToken) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    throw error;
  }
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
    signOutUser,
    verifyIdToken
};

//console.log(signInWithEmail('masonkim@fakemaill.com', 'password'));