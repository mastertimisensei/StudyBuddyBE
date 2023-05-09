const {app, admin} = require('../firebaseConfig.js');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const {checkUserLoggedIn, countUsers, getUserUid, updateUserPassword, updateUserEmail,getAllUsers} = require('./utilities.js');

// add another user to the a user's buddy list
async function swipeThem(email, buddy_email, swipe = true) {
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
                var swipedThem = new Set(userDoc.data().swipedThem || []);
                swipedThem.add(buddy_uid);
                swipedThem = new Set(swipedThem);
                transaction.update(userRef, { swipedThem: Array.from(swipedThem) });
    
                // Add user to buddy's swipedMe set
                const swipedMe = new Set(buddyDoc.data().swipedMe || []);
                swipedMe.add(uid);
                swipedThem = new Set(swipedThem);
                transaction.update(buddyRef, { swipedMe: Array.from(swipedMe) });
            } else {
                // Add buddy to user's notMatches set
                var notMatches = new Set(userDoc.data().notMatches || []);
                notMatches.add(buddy_uid);
                notMatches = new Set(notMatches);
                transaction.update(userRef, { notMatches: Array.from(notMatches) });
    
                // Add user to buddy's notMatches set
                const notMatchesBud = new Set(buddyDoc.data().notMatches || []);
                notMatchesBud.add(uid);
                transaction.update(buddyRef, { notMatches: Array.from(notMatchesBud) });
    
                // Remove user from buddy's swipedMe set
                const swipedMe = new Set(buddyDoc.data().swipedMe || []);
                swipedMe.delete(uid);
                transaction.update(buddyRef, { swipedMe: Array.from(swipedMe) });
    
                // Remove buddy from user's swipedThem set
                const swipedThem = new Set(userDoc.data().swipedThem || []);
                swipedThem.delete(buddy_uid);
                transaction.update(userRef, { swipedThem: Array.from(swipedThem) });
            }
    
            // Check for a match
            const swipedThem = new Set(userDoc.data().swipedThem || []);
            const swipedMe = new Set(buddyDoc.data().swipedMe || []);
            const notMatches = new Set(userDoc.data().notMatches || []);
            const notMatchesBud = new Set(buddyDoc.data().notMatches || []);
            const hasMatch = swipedThem.has(buddy_uid) && swipedMe.has(uid) && !notMatches.has(buddy_uid) && !notMatchesBud.has(uid);
            
            if (hasMatch) {
                const buddies = new Set(userDoc.data().buddies || []);
                const buddybuddies = new Set(buddyDoc.data().buddies || []);
                const timestamp = admin.firestore.Timestamp.now();
    
                // Update user's matches
                buddies.add(buddy_uid);
                transaction.update(userRef, { buddies: Array.from(buddies) });
    
                // Update buddy's buddies
                buddybuddies.add(uid);
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




// add a buddy to a user's buddy list
//swipeThem('masonkim@fakemaill.com','rancisggpoperdbf@gmaik.com');
swipeThem('rancisggpoperdbf@gmaik.com','masonkim@fakemaill.com');

//module.exports = {swipeThem};