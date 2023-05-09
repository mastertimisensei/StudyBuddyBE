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
                // Add buddy to user's swipedThem list
                const swipedThem = userDoc.data().swipedThem || [];
                swipedThem.push(buddy_uid);
                transaction.update(userRef, { swipedThem });

                // Add user to buddy's swipedMe list
                const swipedMe = buddyDoc.data().swipedMe || [];
                swipedMe.push(uid);
                transaction.update(buddyRef, { swipedMe });
            } else {
                // Add buddy to user's notMatches list
                const notMatches = userDoc.data().notMatches || [];
                notMatches.push(buddy_uid);
                transaction.update(userRef, { notMatches });

                // Add user to buddy's notMatches list
                const notMatchesBud = buddyDoc.data().notMatches || [];
                notMatchesBud.push(uid);
                transaction.update(buddyRef, { notMatches: notMatchesBud });

                // Remove user from buddy's swipedMe list
                const swipedMe = buddyDoc.data().swipedMe || [];
                const index = swipedMe.indexOf(uid);
                if (index !== -1) {
                    swipedMe.splice(index, 1);
                    transaction.update(buddyRef, { swipedMe });
                }

                // Remove buddy from user's swipedThem list
                const swipedThem = userDoc.data().swipedThem || [];
                const buddyIndex = swipedThem.indexOf(buddy_uid);
                if (buddyIndex !== -1) {
                    swipedThem.splice(buddyIndex, 1);
                    transaction.update(userRef, { swipedThem });
                }
            }

            // Check for a match
            const swipedThem = userDoc.data().swipedThem || [];
            const swipedMe = buddyDoc.data().swipedMe || [];
            const notMatches = userDoc.data().notMatches || [];
            const notMatchesBud = buddyDoc.data().notMatches || [];
            const hasMatch = swipedThem.includes(buddy_uid) && swipedMe.includes(uid) && !notMatches.includes(buddy_uid) && !notMatchesBud.includes(uid);
                        
            if (hasMatch) {
                const matches = userDoc.data().matches || [];
                const buddyMatches = buddyDoc.data().matches || [];
                const timestamp = admin.firestore.Timestamp.now();
    
                // Update user's matches
                matches.push({
                    uid: buddy_uid,
                    email: buddy_email,
                    timestamp,
                });
                transaction.update(userRef, { matches });
    
                // Update buddy's matches
                buddyMatches.push({
                    uid,
                    email,
                    timestamp,
                });
                transaction.update(buddyRef, { matches: buddyMatches });
            }
        });
    
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
    } 




// add a buddy to a user's buddy list
//swipeThem('masonkim@fakemaill.com','rancisggpoperdbf@gmaik.com');
swipeThem('rancisggpoperdbf@gmaik.com','masonkim@fakemaill.com');

//module.exports = {swipeThem};