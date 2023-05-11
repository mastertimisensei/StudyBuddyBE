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
messageBuddy('jobavaw504@syinxun.com','ameliasmith@fakemaill.com', 'No cap, I am a real person');
messageBuddy('jobavaw504@syinxun.com','danielmartinez@fakemaill.com', 'No cap, I am a AI');


//function to get messages between two users(for admin side)
/*
async function getMessages(email, buddyEmail) {
    // get the user reference
    //console.log(email + buddyEmail);
    const userRef = admin.firestore().collection('users').doc(email);
    // get messages from the userRef
    const userDoc = await userRef.get();
    // check if the buddy email is part of the messages map

    if (userDoc.data().messages[buddyEmail] !== null) {
        // get the message reference
        const messageRef = admin.firestore().collection('messages').doc(userDoc.data().messages[buddyEmail]);
        // get the message document
        const messageDoc = await messageRef.collection('message').orderBy("time","asc").get();
        // order the messages by time
        // return the message document
        var text = "[";
        console.log(messageDoc);
        messageDoc.forEach((doc) => {
            // add the messages to text in json format
            console.log(doc.data());
            text += JSON.stringify(doc.data()) + ",";
        });
        // remove the last comma
        text = text.slice(0, -1);
        text += "]";
        //console.log(text);
        return text;
        // return messageDoc.data().message;
    }
    // if the message does not exist, return null
    console.log("No messages");
    return null;
}
/*
function listenForNewMessages(chatId) {
    return new Promise((resolve, reject) => {
      const messageRef = admin.firestore().collection('messages').doc(chatId).collection('messages');
      const unsubscribe = messageRef.orderBy("time").onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const message = change.doc.data();
            resolve({
              timestamp: message.time.toDate(),
              text: message.text,
              sender: message.sender,
              // Add more fields as needed
            });
          }
        });
      }
      );
      //Messagelisteners[chatId] = unsubscribe;
    });
  }

// stop listening for new messages
/*
function stopListeningForNewMessages(chatId) {
    if (Messagelisteners[chatId]) {
        Messagelisteners[chatId]();
        delete Messagelisteners[chatId];
    }
}*/

//test getMessages

/*
getMessages('alexanderjohnson@fakemaill.com','sophiagarcia@fakemaill.com').then((data) => {
    console.log(data);
}
);*/

//test listenForNewMessages
//listenForNewMessages('RcUBX7PPEBM1QFUdmsU9');
//listenForNewMessages('ywFefzpndETusBjCa0n8');
module.exports = { messageBuddy, getMessages, Messagelisteners };
