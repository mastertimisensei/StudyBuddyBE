const {app, admin} = require('../firebaseConfig.js');
const { deleteUser, getUserEmail } = require('./deleteUser.js');
const { getAuth, signInWithEmailAndPassword, onAuthStateChanged } = require('firebase/auth');

const { getStorage } = require('firebase-admin/storage');

const fs = require('fs');

// function to send a message
//async function sendMessage(email, buddy_email, message) {
    //try{
