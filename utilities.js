const {app, admin} = require('./firebaseConfig.js');
const { deleteUser, getUserEmail } = require('./deleteUser.js');
const { getAuth, signInWithEmailAndPassword, onAuthStateChanged } = require('firebase/auth');

// CHECK IF USER IS LOGGED IN
async function checkUserLoggedIn() {
    // Get the auth object
    const auth = getAuth();
    // Check if user is logged in
    onAuthStateChanged(auth, (user) => {

        if (user) {
            // User is signed in
            console.log("User is signed in");
            //console.log(user);
        } else {
            // User is signed out
            console.log("User is signed out");
        }
    }
    );
}
//checkUserLoggedIn();

// function to check if a particuluar user uid is logged in


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
const updateUserPassword =  (uid, password) => {
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
const updateUserEmail = async (uid, emil) => {
    return new Promise(async (resolve, reject) => {
        //update the email in the firestore
        const email = await getUserEmail(uid);
        console.log(email);
        admin.auth().getUserByEmail(email)
        const userRef = admin.firestore().collection('users').doc(email);
        admin.firestore().collection('users').doc(email).update({
            email: emil
        })
            .then(() => {
                console.log('Successfully updated user email in firestore');
                resolve();
            })
        admin.auth().updateUser(uid, {
            email: emil,
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

//updateUserEmail('tBIJMmcfoqO39tq6N0lhiyC4cQx2', 'jonsnow@gmail.com')

// Function for return all the users in the json format
const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        admin.auth().listUsers()
            .then((listUsersResult) => {
                //console.log('Total users:', listUsersResult.users.length);
                resolve(listUsersResult.users);
            })
            .catch((error) => {
                console.log('Error listing users:', error);
                reject(error);
            });
    });
};

//function for getting all the user data in the json format
const getAllUsersData = async () => {
    const usersData = [];
    const users = await getAllUsers();
    // loop through all the users
    for (let i = 0; i < users.length; i++) {
        // get the user data from firestore
        const user = await admin.firestore().collection('users').doc(users[i].email).get();
        // push the user data to the usersData array
        usersData.push(user.data());
    }
    //console.log(usersData);
    return usersData;
};
//getAllUsersData();


// function to delete all the users in the database and auth
const deleteAllUsers = async () => {
    const users = await getAllUsers();
    for (let i = 0; i < users.length; i++) {
        await deleteUser(users[i].uid);
    }
};

//deleteAllUsers();
// fill a users data in firestore
const setUserData = async (uid, age, Language,Major, InterestedSubjects, Location) => {
    const email = await getUserEmail(uid);
    console.log(email);
    admin.auth().getUserByEmail(email)
    const userRef = admin.firestore().collection('users').doc(email);

    admin.firestore().collection('users').doc(email).update({
        age: age,
        Language: Language,
        Major: Major,
        InterestedSubjects: InterestedSubjects,
        Location: Location
    })
        .then(() => {
            console.log('Successfully updated user email in firestore');
            
        })
}

// get user data from firestore
const getUserData = async (uid) => {
    const email = await getUserEmail(uid);
    console.log(email);
    admin.auth().getUserByEmail(email)
    const userRef = admin.firestore().collection('users').doc(email);
    admin.firestore().collection('users').doc(email).get()
        .then((doc) => {
            if (doc.exists) {
                //console.log("hi")
                console.log("Document data:", doc.data());
                return doc.data();
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                return null;
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
            return null;
        });
}


module.exports = {
    checkUserLoggedIn,
    countUsers,
    getUserUid,
    updateUserPassword,
    updateUserEmail,
    getAllUsers,
    deleteAllUsers,
    setUserData,
    getUserData,
    sleep,
    getAllUsersData
};

