const {app, admin} = require('./firebaseConfig.js');

const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');


async function createUser(name,email, password, set = null) {
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
            notMatches: [],
            photoUrl: "",
            Language: [],
            Major: "",
            University: "",
            age: "",
            InterestedSubjects: []
            //
            //photoURL: user.photoURL,
        });
      console.log('Successfully created new user:', userRecord.uid);
    } catch (error) {
      console.error('Error creating new user:', error);
    }
    //send verification email
    
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      await admin.auth().generateEmailVerificationLink(email);
      //send the verification email
      console.log('Successfully sent verification email to:', userRecord.uid);
  } catch (error) {
      console.error('Error sending verification email:', error);
  }
  }


//createUser('Joseph Akra','jobavaw504@syinxun.com', 'password');
//createUser('John Snow','johnsnow@gmail.com', 'password');
//createUser('Josep Stalink','jostallinbigsick@sicleadmin.com', 'password');
//createUser('Josep Waterson','jojostalinbigsick@sicleadmin2.com', 'password');
module.exports = {createUser};
