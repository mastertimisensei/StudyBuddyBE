const {app, admin} = require('../firebaseConfig.js');
const { deleteUser, getUserEmail } = require('./deleteUser.js');
const { getAuth, signInWithEmailAndPassword, onAuthStateChanged } = require('firebase/auth');

const { getStorage } = require('firebase-admin/storage');

const fs = require('fs');
const { firestore } = require('firebase-admin');

//function to message a buddy

async function messageBuddy(email, buddyEmail, message) {
    // get the user reference
    const userRef = admin.firestore().collection('users').doc(email);
    // get the buddy reference
    const buddyRef = admin.firestore().collection('users').doc(buddyEmail);
    // get the user document
    const userDoc = await userRef.get();
    // get the buddy document
    const buddyDoc = await buddyRef.get();
    // get user name and buddy name
    const userName = userDoc.data().name;
    const buddyName = buddyDoc.data().name;
    try {
        const newMessage = {
            from: email,
            message: message,
            time: firestore.Timestamp.now()
        }
        //check if the message already exist between the two users
        //const 

        // if the message does not exist, create a new message
        //if (messageRef.empty) {
            // create a new message reference
            const messageRef = admin.firestore().collection('messages').doc();
            // add the users to the message
            await messageRef.set({
                users: [email, buddyEmail]
            });
        //}
        //add new document to message reference
        const messageDoc = await messageRef.collection("message").doc();
        await messageDoc.set(newMessage);
        // add the message ref to the user's messages
        //create a dictionary of the message and the buddy
        const messageDict1 = {
            email: buddyEmail,
            message: messageRef.id

        }
        const messageDict2 = {
            email: email,
            message: messageRef.id
        }
        
        await userRef.update({
            messages: admin.firestore.FieldValue.arrayUnion(messageDict1)
        });
        // add the message ref to the buddy's messages
        await buddyRef.update({
            messages: admin.firestore.FieldValue.arrayUnion(messageDict2)
        });
        // send a notification to the buddy
        //await sendNotification(buddyEmail, "{name} sent you a message".formatUnicorn({name: userName}), "{name} sent you a message: {message}".formatUnicorn({name: userName, message: message}));
    } catch (error) {
        console.log(error);
    }
}

// test messageBuddy
messageBuddy('jobavaw504@syinxun.com','ameliasmith@fakemaill.com', 'text message');

//function to get messages between two users(for admin side)
/*
async function getMessages(email, buddyEmail) {
    // get the user reference
    //console.log(email + buddyEmail);
    const userRef = admin.firestore().collection('users').doc(email);
    // get messages from the userRef
    const userDoc = await userRef.get();
    // check if the buddy email is part of the message
    console.log(userDoc.data().messages.includes(email + buddyEmail));
    console.log(userDoc.data().messages.includes(buddyEmail + email));
    if (userDoc.data().messages.includes(email + buddyEmail)) {
        // get the message reference
        const messageRef = admin.firestore().collection('messages').doc(email + buddyEmail);
        // get the message document
        const messageDoc = await messageRef.collection('message').orderBy("time","asc").get();
        // order the messages by time
        //messageDoc.orderBy("time");
        // return the message document
        text = "[";
        messageDoc.forEach((doc) => {
            // add the messages to text in json format
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
}*/

function listenForNewMessages(chatId) {
    const messageRef = admin.firestore().collection('messages').doc(chatId).collection('message');
    messageRef.orderBy("time").onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          // Handle new message added to the chat
          const message = change.doc.data();
          console.log("New message:", message);
  
          //const messageElement = document.createElement('div');
          //messageElement.textContent = message.text;
          //document.getElementById('messages').appendChild(messageElement);
        }
      });
    });
  }

// test getMessages
/*
getMessages('abigailjones@fakemaill.com','jobavaw504@syinxun.com').then((data) => {
    console.log(data);
}
);*/
// test listenForNewMessages
//listenForNewMessages('abigailjones@fakemaill.comjobavaw504@syinxun.com');

//module.exports = { messageBuddy, getMessages, listenForNewMessages };
    