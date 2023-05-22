const {app, admin} = require('../firebaseConfig.js');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const {checkUserLoggedIn, countUsers, getUserUid, updateUserPassword, updateUserEmail,getAllUsers} = require('./utilities.js');


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
        const hasMatch = swipedThem.has(buddy_uid) && swipedMe.has(buddy_uid);
        
        if (hasMatch) {
            const buddies = new Set(userDoc.data().buddies || []);
            const buddybuddies = new Set(buddyDoc.data().buddies || []);

            // Update user's matches
            buddies.add(buddy_uid);
            await userRef.update({ buddies: Array.from(buddies) });

            // Update buddy's buddies
            buddybuddies.add(uid);
            await buddyRef.update({ buddies: Array.from(buddybuddies) });
            console.log('creating message');
        const messageRef = admin.firestore().collection('messages').doc();
        await messageRef.set({
            users: [email, buddy_email]
        });
        let buddyMessagesMap = buddyDoc.data().messages || {};
        let messagesMap = userDoc.data().messages || {};
        messagesMap[buddy_email] = messageRef.id;
        buddyMessagesMap[email] = messageRef.id;
        await userRef.update({ messages: messagesMap });
        await buddyRef.update({ messages: buddyMessagesMap });
        console.log('message doc created');
        // create add a time stamp to the message
        //const timeStamp = admin.firestore.FieldValue.serverTimestamp();
        return true;
        }

        console.log('swipe complete');
        // create a new message reference
    } catch (error) {
        console.error(error);
        return false;
    }
}



// add a buddy to a user's buddy list
//swipeThem('masonkim@fakemaill.com','rancisggpoperdbf@gmaik.com');
//swipeThem('rancisggpoperdbf@gmaik.com','masonkim@fakemaill.com');

module.exports = {swipeThem};
