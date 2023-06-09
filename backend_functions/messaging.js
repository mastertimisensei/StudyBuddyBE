const {app, admin} = require('../firebaseConfig.js');
const { deleteUser, getUserEmail } = require('./deleteUser.js');
const { getAuth, signInWithEmailAndPassword, onAuthStateChanged } = require('firebase/auth');

const { getStorage } = require('firebase-admin/storage');

const fs = require('fs');
const { firestore } = require('firebase-admin');
//function to message a buddy

async function messageBuddy(email, buddyEmail, message) {
    try {
    const userRef = admin.firestore().collection('users').doc(email);
    const buddyRef = admin.firestore().collection('users').doc(buddyEmail);
        // check if the messages map exists in the user document
    const userDoc = await userRef.get();
    let messagesMap = userDoc.data().messages || {};
    // get the user document
    let messageId = messagesMap[buddyEmail];
    // get the buddy document
    const buddyDoc = await buddyRef.get();
    // get user name and buddy name
    if (!messageId) {
            // create a new message reference
            const messageRef = admin.firestore().collection('messages').doc();
            // add the users to the message
            await messageRef.set({
                users: [email, buddyEmail]
            });
            // add the message id to the messages map
            messagesMap[buddyEmail] = messageRef.id;
            await userRef.update({ messages: messagesMap });
            messageId = messageRef.id;
            let buddyMessagesMap = buddyDoc.data().messages || {};
            // add the message id to the buddy's messages map
            buddyMessagesMap[email] = messageRef.id;
            //
            await buddyRef.update({ messages: buddyMessagesMap });
        }

    // add the new message to the subcollection of the message document
        const messageDocRef = admin.firestore().collection('messages').doc(messageId).collection('messages').doc();
        const newMessage = {
            from: email,
            message: message,
            time: admin.firestore.Timestamp.now()
        }
        await messageDocRef.set(newMessage);
    } catch (error) {
        console.log(error);
    }
}

// test messageBuddy
//messageBuddy('jobavaw504@syinxun.com','ameliasmith@fakemaill.com', 'No cap, I am a real person');
//messageBuddy('jobavaw504@syinxun.com','danielmartinez@fakemaill.com', 'No cap, I am a AI');



async function getMessages(email, buddyEmail) {
    const userRef = admin.firestore().collection('users').doc(email);
    const userDoc = await userRef.get();

    if (userDoc.exists && userDoc.data().messages && userDoc.data().messages[buddyEmail]) {
        const messageRef = admin.firestore().collection('messages').doc(userDoc.data().messages[buddyEmail]);
        const messageDoc = await messageRef.collection('messages').orderBy("time", "asc").get();
        let messages = "[";
        messageDoc.forEach(doc => {
            const message = doc.data();
            const time = message.time.toDate().toISOString().replace('T', ' ').substr(0, 19);
            messages += `{ "time": "${time}", "message": "${message.message}", "sender": "${message.from}" },`;
        });
        messages = messages.slice(0, -1) + "]";
        return messages;
    }

    console.log("No messages");
    return "[]";
}

// get message based on chatId
async function getMessagesByChatId(chatId) {
    //check if chatId in messages collection
    const messageRef = admin.firestore().collection('messages').doc(chatId);
    // check if messageRef exists
    const messageDoc = await messageRef.collection('messages').orderBy("time", "asc").get();
    if (messageDoc.empty) {
        console.log("No messages");
        return "[]";
    }
    let messages = "[";
    messageDoc.forEach(doc => {
        const message = doc.data();
        const time = message.time.toDate().toISOString().replace('T', ' ').substr(0, 19);
        messages += `{ "time": "${time}", "message": "${message.message}", "sender": "${message.from}" },`;
    });
    messages = messages.slice(0, -1) + "]";
    return messages;
}



module.exports = { messageBuddy, getMessages, getMessagesByChatId };
