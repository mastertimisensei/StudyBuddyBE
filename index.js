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



console.log("Firebase initialized")





// add another user to the a user's buddy list
async function AddBuddy(email, buddy_email) {
    try {
        // get the user's uid
        const uid = await getUserUid(email);
        // get the buddy's uid
        const buddy_uid = await getUserUid(buddy_email);
        // get the user's buddies
        const userRef = admin.firestore().collection('users').doc(email);
        const snapshot = await userRef.get();
        const swipedThem = snapshot.data().swipedThem;
        // add the buddy to the user's buddy list
        swipedThem.push(buddy_uid);
        // update the user's buddy list
        await userRef.update({
          swipedThem: swipedThem
        });
        console.log('Successfully added buddy to user buddy list');
    } catch (error) {
        console.error('Error adding buddy to user buddy list:', error);
    }
}


// add a buddy to a user's buddy list
addBuddy('jobavaw504@syinxun.com','johnsnow@gmail.com');
