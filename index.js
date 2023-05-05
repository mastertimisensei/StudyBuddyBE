const {app, admin} = require('./firebaseConfig.js');

//lets create a user
createUser('John Snow','johnsnow@gmail.com', 'password');
signInWithEmail('johnsnow@gmail.com', 'password');
signInWithEmail('jobavaw504@syinxun.com', 'password');
sleep(5000);
signOutUser();
createUser('Joseph Akra','jobavaw504@syinxun.com', 'password');

// Function to count the number of users
countUsers();

//deleteUser('c9HuchgW8gdcl68eh4haV2FyMH42')

//sleep for 5 seconds
sleep(5000).then(() => {
    checkUserLoggedIn();
    signOutUser();
    checkUserLoggedIn();
});

//signOutUser();


// get user's uid

// lets get a user's uid
//console.log(getUserUid('c9HuchgW8gdcl68eh4haV2FyMH42'));

// Usage example
//deleteUser('c9HuchgW8gdcl68eh4haV2FyMH42')



console.log("Firebase initialized");



