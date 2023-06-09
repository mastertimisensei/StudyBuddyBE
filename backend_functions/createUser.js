const {app, admin} = require('../firebaseConfig.js');

const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');


async function createUser(name,email, password, Location = "", set = null, flag = false) {
    try {
        //check if email is in right format
        if (!email.includes('@') || !email.includes('.')) {
            console.log('Email is not in the right format');
            throw new Error('Email is not in the right format');
        }
        //check if password is in right format
        if (password.length < 6) {
          throw new Error('Password is too short');
        }
        //check if email is already in use
        //create user
      const userRecord = await admin.auth().createUser({
        email: email,
        password: password
      });
        const userRef = admin.firestore().collection('users').doc(userRecord.email);
        const snapshot = await userRef.get();
        await userRef.set({
            email: email,
            name: name,
            uid: userRecord.uid,
            buddies: [],
            swipedThem: [],
            swipedMe: [],
            photoUrl: [],
            Language: [],
            Location: Location,
            Major: "",
            University: "",
            bio: "",
            age: "",
            InterestedSubjects: [],
            flag: flag
            //
            //photoURL: user.photoURL,
        });
      console.log('Successfully created new user:', userRecord.uid);
    } catch (error) {
      console.error('Error creating new user:', error);
      throw new Error("Error creating new user. Email may already exist.");
    }
  }

module.exports = {createUser};
