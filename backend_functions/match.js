const {app, admin} = require('../firebaseConfig.js');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const {checkUserLoggedIn, countUsers, getUserUid, updateUserPassword, updateUserEmail,getAllUsers} = require('./utilities.js');

// add another user to the a user's buddy list
/*
async function swipeThem(email, buddy_email, swipe ) {
    try {
        // Validate input
        if (typeof email !== 'string' || typeof buddy_email !== 'string' || typeof swipe !== 'boolean') {
            throw new Error('Invalid input parameters');
        }
        
        // Get user uids
        const [uid, buddy_uid] = await Promise.all([
            getUserUid(email),
            getUserUid(buddy_email),
        ]);
        
    
        // Perform updates inside a transaction
        await admin.firestore().runTransaction(async (transaction) => {
            const userRef = admin.firestore().collection('users').doc(email);
            const buddyRef = admin.firestore().collection('users').doc(buddy_email);
            const [userDoc, buddyDoc] = await Promise.all([
                transaction.get(userRef),
                transaction.get(buddyRef),
            ]);
    
            if (swipe) {
                // Add buddy to user's swipedThem set
                let swipedThem = new Set(userDoc.data().swipedThem || []);
                swipedThem.add(buddy_uid);
                swipedThem = Array.from(swipedThem);
                transaction.update(userRef, { swipedThem: swipedThem });
    
                // Add user to buddy's swipedMe set
                let swipedMe = new Set(buddyDoc.data().swipedMe || []);
                //console.log(swipedMe);
                swipedMe.add(uid);
                swipedMe = Array.from(swipedMe);
                transaction.update(buddyRef, { swipedMe: swipedMe });
            } 
            else {
                return;
            }
            // Check for a match
            const swipedThem = new Set(userDoc.data().swipedThem || []);
            console.log("My swipedThem:");
            console.log(swipedThem);
            const swipedMe = new Set(buddyDoc.data().swipedMe || []);
            console.log("Buddy swipedMe:");
            console.log(swipedMe);
            const hasMatch = swipedThem.has(buddy_uid) && swipedMe.has(uid);
            console.log("Has match:");
            console.log(hasMatch);
            if (hasMatch) {
                const buddies = new Set(userDoc.data().buddies || []);
                console.log(buddies);
                const buddybuddies = new Set(buddyDoc.data().buddies || []);
                console.log(buddybuddies);
                const timestamp = admin.firestore.Timestamp.now();
    
                // Update user's matches
                buddies.add(buddy_uid);
                console.log(buddies);
                transaction.update(userRef, { buddies: Array.from(buddies) });
    
                // Update buddy's buddies
                buddybuddies.add(uid);
                console.log(buddybuddies);
                transaction.update(buddyRef, { buddies: Array.from(buddybuddies) });
    }
        });
        console.log('swipe complete');
        return true;
    }
     catch (error) {
        console.error(error);
        return false;
    }
    } 
*/
async function swipeThem(email, buddy_email, swipe) {
    try {
        // Validate input
        if (typeof email !== 'string' || typeof buddy_email !== 'string' || typeof swipe !== 'boolean') {
            throw new Error('Invalid input parameters');
        }

        // Get user uids
        const [uid, buddy_uid] = await Promise.all([
            getUserUid(email),
            getUserUid(buddy_email),
        ]);

        const userRef = admin.firestore().collection('users').doc(email);
        const buddyRef = admin.firestore().collection('users').doc(buddy_email);
        const [userDoc, buddyDoc] = await Promise.all([
            userRef.get(),
            buddyRef.get(),
        ]);

        if (swipe) {
            // Add buddy to user's swipedThem set
            let swipedThem = new Set(userDoc.data().swipedThem || []);
            swipedThem.add(buddy_uid);
            swipedThem = Array.from(swipedThem);
            swipedThem = new Set(swipedThem);
            await userRef.update({ swipedThem: Array.from(swipedThem) });

            // Add user to buddy's swipedMe set
            let swipedMe = new Set(buddyDoc.data().swipedMe || []);
            swipedMe.add(uid);
            swipedMe = Array.from(swipedMe);
            swipedMe = new Set(swipedMe);
            await buddyRef.update({ swipedMe: Array.from(swipedMe) });
        } else {
            return;
        }

        // Check for a match
        let newUserDoc = await userRef.get();
        let newBuddyDoc = await buddyRef.get();
        const swipedThem = new Set(newUserDoc.data().swipedThem || []);
        const swipedMe = new Set(newUserDoc.data().swipedMe || []);
        console.log("swipedThem: " + Array.from(swipedThem));
        console.log("swipedMe: " + Array.from(swipedMe));
        const hasMatch = swipedThem.has(buddy_uid) && swipedMe.has(buddy_uid);
        console.log("swipedThem.has(buddy_uid): " + swipedThem.has(buddy_uid));
        console.log("swipedMe.has(buddy_uid): " + swipedMe.has(buddy_uid));
        console.log("Has match: " + hasMatch);
        
        if (hasMatch) {
            const buddies = new Set(userDoc.data().buddies || []);
            const buddybuddies = new Set(buddyDoc.data().buddies || []);
            const timestamp = admin.firestore.Timestamp.now();

            // Update user's matches
            buddies.add(buddy_uid);
            await userRef.update({ buddies: Array.from(buddies) });

            // Update buddy's buddies
            buddybuddies.add(uid);
            await buddyRef.update({ buddies: Array.from(buddybuddies) });
        }

        console.log('swipe complete');
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}



// add a buddy to a user's buddy list
//swipeThem('masonkim@fakemaill.com','rancisggpoperdbf@gmaik.com');
//swipeThem('rancisggpoperdbf@gmaik.com','masonkim@fakemaill.com');

module.exports = {swipeThem};
