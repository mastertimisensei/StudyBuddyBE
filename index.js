const {app, admin} = require('./firebaseConfig.js');
const {countUsers, uploadProfilePicture} = require('./backend_functions/utilities.js');
const {messageBuddy, getMessages} = require('./backend_functions/messaging.js');
const {getAllUsersExceptCurrentUser, removeUserFromBuddyList} = require('./backend_functions/utilities.js');
const {swipeThem} = require('./backend_functions/match.js');
const {deleteUser} = require('./backend_functions/deleteUser.js');



//lets create a user
//createUser('John Snow','johnsnow@gmail.com', 'password');
//signInWithEmail('johnsnow@gmail.com', 'password');
//signInWithEmail('jobavaw504@syinxun.com', 'password');
//sleep(5000);
//signOutUser();
//createUser('Joseph Akra','jobavaw504@syinxun.com', 'password');

// Function to count the number of users
//countUsers();

//deleteUser('c9HuchgW8gdcl68eh4haV2FyMH42')

//sleep for 5 seconds
/*
sleep(5000).then(() => {
    checkUserLoggedIn();
    signOutUser();
    checkUserLoggedIn();
});
*/
//signOutUser();


// get user's uid

// lets get a user's uid
//console.log(getUserUid('c9HuchgW8gdcl68eh4haV2FyMH42'));

// Usage example
//deleteUser('c9HuchgW8gdcl68eh4haV2FyMH42')

//uploadProfilePicture('wsMwmGOMRGUh4vWtAaMQbjrW8w82', 'download.jpeg');

//console.log("Firebase initialized");


//messageBuddy('abigailjones@fakemaill.com','jobavaw504syinxuncom', 'text message');
//swipeThem('newuser@gmail.com','firstuser@gmail.com',true);

