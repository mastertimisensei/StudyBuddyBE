// Function for deleting a user
const {app, admin} = require('./firebaseConfig.js');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const auth = getAuth();

const deleteUser = async (uid) => {
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

deleteUser('c9HuchgW8gdcl68eh4haV2FyMH42')