// Function for deleting a user
const app = require('./firebaseConfig.js');
const admin = require('./firebaseConfig.js');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const auth = getAuth();

const deleteUser = (uid) => {
    return new Promise((resolve, reject) => {
        admin.auth().deleteUser(uid)
            .then(() => {
                console.log('Successfully deleted user');
                resolve();
            })
            .catch((error) => {
                console.log('Error deleting user:', error);
                reject(error);
            });
    });
};

