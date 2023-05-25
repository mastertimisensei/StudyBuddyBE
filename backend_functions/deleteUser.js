// Function for deleting a user
const {app, admin} = require('../firebaseConfig.js');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const {removeUserFromBuddyList} = require('./utilities.js');

const auth = getAuth();

async function getUserEmail(uid) {
    try {
      const userRecord = await admin.auth().getUser(uid);
      return userRecord.email;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  }

const deleteUser = async (uid) => {
    return new Promise(async (resolve, reject) => {
        const email = await getUserEmail(uid);
        console.log(email);
        admin.auth().getUserByEmail(email)
        const userRef = admin.firestore().collection('users').doc(email);
        //get user's buddy list
        const buddyList = await userRef.get().buddies;
        //remove user from all buddy lists
        for (const buddy of buddyList) {
            console.log("buddy: ");
            console.log(buddy);
            buddy_email = await getUserEmail(buddy);
            removeUserFromBuddyList(buddy_email, email);
        }
        userRef.delete().then(() => {
            console.log('User data deleted successfully');
        }).catch((error) => {
        console.error('Error deleting user data:', error);
        });
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



module.exports = {
    deleteUser,
    getUserEmail
};
//deleteUser('ckAaGRP3JfRCpM1RdoNlHksgN6z2');
