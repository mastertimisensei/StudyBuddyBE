const {app, admin} = require('./firebaseConfig.js');

// CHECK IF USER IS LOGGED IN
async function checkUserLoggedIn() {
    // Get the auth object
    const auth = getAuth();
    // Add a listener
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            console.log("User is signed in");
            //console.log(user);
        } else {
            // User is not signed in
            console.log("No user signed in");
        }
    });
}

// lets count the number of users
const countUsers = () => {
    return new Promise((resolve, reject) => {
        admin.auth().listUsers()
            .then((listUsersResult) => {
                console.log('Total users:', listUsersResult.users.length);
                resolve(listUsersResult.users.length);
            })
            .catch((error) => {
                console.log('Error listing users:', error);
                reject(error);
            });
    });
};

async function getUserUid(email) {
    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        //console.log('Successfully fetched user data:', userRecord.toJSON());

        
        return userRecord.uid;
    } catch (error) {
        console.log('Error fetching user data:', error);
    }
}

//sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function for updating a user's password
const updateUserPassword = (uid, password) => {
    return new Promise((resolve, reject) => {
        admin.auth().updateUser(uid, {
            password: password,
        })
            .then(() => {
                console.log('Successfully updated user');
                resolve();
            })
            .catch((error) => {
                console.log('Error updating user:', error);
                reject(error);
            });
    });
}

// Function for updating a user's email
const updateUserEmail = (uid, email) => {
    return new Promise((resolve, reject) => {
        admin.auth().updateUser(uid, {
            email: email,
        })
            .then(() => {
                console.log('Successfully updated user');
                resolve();
            })
            .catch((error) => {
                console.log('Error updating user:', error);
                reject(error);
            });
    });
};

// Function for return all the users in the json format
const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        admin.auth().listUsers()
            .then((listUsersResult) => {
                console.log('Total users:', listUsersResult.users.length);
                resolve(listUsersResult.users);
            })
            .catch((error) => {
                console.log('Error listing users:', error);
                reject(error);
            });
    });
};


    

module.exports = {
    checkUserLoggedIn,
    countUsers,
    getUserUid,
    updateUserPassword,
    updateUserEmail,
    getAllUsers
}

