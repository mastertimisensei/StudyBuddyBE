const {app, admin} = require('../firebaseConfig.js');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const {checkUserLoggedIn, countUsers, getUserUid, updateUserPassword, updateUserEmail,getAllUsers} = require('./utilities.js');

// add another user to the a user's buddy list
async function swipeThem(email, buddy_email) {
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
        // update the user's swipedThem list
        await userRef.update({
          swipedThem: swipedThem
        });
        // get the buddy's swipedMe list
        const buddyRef = admin.firestore().collection('users').doc(buddy_email);
        const buddySnapshot = await buddyRef.get();
        const swipedMe = buddySnapshot.data().swipedMe;
        // add the user to the buddy's swipedMe list
        swipedMe.push(uid);
        // update the buddy's swipedMe list
        await buddyRef.update({
            swipedMe: swipedMe
        });

        console.log('Successfully Swipe');
    } catch (error) {
        console.error('Successfully Swipe', error);
    }
    // check if they matched
    await checkMatch(email, buddy_email);
}

// check if both users had swiped each other
async function checkMatch(email, buddy_email) {
    try {
        // get the user's uid
        const uid = await getUserUid(email);
        // get the buddy's uid
        const buddy_uid = await getUserUid(buddy_email);
        // get the user's swipedThem list
        const userRef = admin.firestore().collection('users').doc(email);
        const snapshot = await userRef.get();
        const swipedThem = snapshot.data().swipedThem;
        // get the buddy's swipedMe list
        const buddyRef = admin.firestore().collection('users').doc(buddy_email);
        const buddySnapshot = await buddyRef.get();
        const swipedMe = buddySnapshot.data().swipedMe;
        // check if the user's swipedThem list contains the buddy's uid
        if (swipedThem.includes(buddy_uid)) {
            // check if the buddy's swipedMe list contains the user's uid
            if (swipedMe.includes(uid)) {
                // add the buddy to the user's buddy list
                const userRef = admin.firestore().collection('users').doc(email);
                const snapshot = await userRef.get();
                const buddies = snapshot.data().buddies;
                buddies.push(buddy_uid);
                await userRef.update({
                    buddies: buddies
                });
                // add the user to the buddy's buddy list
                const buddyRef = admin.firestore().collection('users').doc(buddy_email);
                const buddySnapshot = await buddyRef.get();
                const buddyBuddies = buddySnapshot.data().buddies;
                buddyBuddies.push(uid);
                await buddyRef.update({
                    buddies: buddyBuddies
                });
                console.log('Successfully Match');
            }
        }
    } catch (error) {
        console.error('Unsuccessfully Match', error);
    }
}

// add a buddy to a user's buddy list
//swipeThem('johnsnow@gmail.com','jojostalinbigsick@sicleadmin.com');

module.exports = {swipeThem};