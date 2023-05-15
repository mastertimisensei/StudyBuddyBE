const {app, admin} = require('../firebaseConfig.js');
const { deleteUser, getUserEmail } = require('./deleteUser.js');
const { getAuth, signInWithEmailAndPassword, onAuthStateChanged } = require('firebase/auth');
const { getStorage } = require('firebase-admin/storage');
const fs = require('fs');
const path = require('path');


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
                //console.log('Total users:', listUsersResult.users.length);
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
        return userRecord.uid;
    } catch (error) {
        console.log('Error fetching user data:', error);
    }
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
    // filter out null and undefined values
    const filteredUsersData = usersData.filter(function (el) {
        return el != null && el != undefined;
    });
    //console.log(filteredUsersData);
    return filteredUsersData;
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
const setUserData = async (uid,name ,age, Language,Major, InterestedSubjects, Location, University, bio, photoPath, flag = true) => {
    const email = await getUserEmail(uid);
    console.log(email);
    admin.auth().getUserByEmail(email)
    const userRef = admin.firestore().collection('users').doc(email);
    await uploadProfilePicture(uid, photoPath);
    //var photoLink = await getProfilePicture(uid);
    photoLink = await showProfilePicture(uid);
    admin.firestore().collection('users').doc(email).update({
        name: name,
        age: age,
        Language: Language,
        Major: Major,
        InterestedSubjects: InterestedSubjects,
        Location: Location,
        University: University,
        bio: bio,
        photoUrl: photoLink,
        flag: flag
    })
        .then(() => {
            console.log('Successfully updated user email in firestore');
            
        })
}

// get user data from firestore
const getUserData = async (uid) => {
    const email = await getUserEmail(uid);
    const userRef = admin.firestore().collection('users').doc(email);
    return new Promise((resolve, reject) => {
        userRef.get()
            .then((doc) => {
                if (doc.exists) {
                    const data = JSON.stringify(doc.data());
                    resolve(data);
                } else {
                    console.log("No such document!");
                    resolve(null);
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
                reject(error);
            });
    });
}


// function to get all the users except the current user, the user's matches and the people who the user has already swiped
const getAllUsersExceptCurrentUser = async (uid) => {
    const usersData = [];
    const users = await getAllUsersData();
    // loop through all the users
    for (let i = 0; i < users.length; i++) {
      // if the user is not the current user, the user's matches and the people who the user has already swiped
      if (users[i].uid !== uid && !users[i].buddies.includes(uid) && !users[i].swipedMe.includes(uid)) {
        // push the user data to the usersData array
        usersData.push(users[i]);
      }
    }
    //convert user data to json
    const usersDataJson = JSON.stringify(usersData);
    return usersDataJson;
  };



// function for uploading a user's profile picture to the storage
const uploadProfilePicture = async (uid, uri) => {
    const email = await getUserEmail(uid);
    const storage = getStorage();
    const storageRef = storage.bucket();
    const fileRef = storageRef.file(`profilePics/${uid}`);
  
    const response = await fetch(uri);
    const fileBuffer = await response.buffer();
  
    const stream = fileRef.createWriteStream({
      metadata: {
        contentType: 'image/jpeg',
      }
    });
  
    stream.on('error', (err) => {
      console.error(err);
    });
  
    stream.on('finish', () => {
      console.log(`File uploaded to ${fileRef.name}`);
    });
  
    stream.end(fileBuffer);
    
    // update the user's profile picture url in firestore
    admin.firestore().collection('users').doc(email).update({
        photoUrl: `https://firebasestorage.googleapis.com/v0/b/${storageRef.name}/o/${encodeURIComponent(fileRef.name)}?alt=media`
    })
  };

//uploadProfilePicture('wsMwmGOMRGUh4vWtAaMQbjrW8w82', 'download.jpeg');

//function to show the profile picture
const showProfilePicture = async (uid) => {
    const email = await getUserEmail(uid);
    const storage = getStorage();
    const storageRef = storage.bucket();
    const fileRef = storageRef.file(`profilePics/${uid}`);
    const downloadUrl = await fileRef.getSignedUrl({
        action: 'read',
        expires: '03-09-2491'
    });
    //console.log(downloadUrl);
    return downloadUrl;
};

// function to remove user from buddy list
const removeUserFromBuddyList = async (email, buddy_email) => {
    const userRef = admin.firestore().collection('users').doc(email);
    const buddyRef = admin.firestore().collection('users').doc(buddy_email);
    //get the buddies uid
    const buddy_uid = await getUserUid(buddy_email);
    //get the user's uid
    const user_uid = await getUserUid(email);
    // remove the buddy from the user's buddy list
    await userRef.update({
        buddies: admin.firestore.FieldValue.arrayRemove(buddy_uid),
    });
    // remove the user from the buddy's buddy list
    await buddyRef.update({
        buddies: admin.firestore.FieldValue.arrayRemove(user_uid)
    });
};


const checkFlag = async (email) => {
    try {
        const userRef = admin.firestore().collection('users').doc(email);
        const user = await userRef.get();
        const flag = user.data().flag;
        return flag;
    } catch (error) {
        console.error('Error with checkFlag', error);
    }
};




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
    getAllUsersData,
    getAllUsersExceptCurrentUser,
    uploadProfilePicture,
    showProfilePicture,
    removeUserFromBuddyList,
    checkFlag
};

