const express = require('express');
const app2 = express();
const bodyParser = require('body-parser');
const { createUser } = require('./backend_functions/createUser');
const {signInWithEmail, signOutUser, verifyIdToken} = require('./backend_functions/signIn');
const {checkUserLoggedIn, countUsers, getUserUid, updateUserPassword, updateUserEmail,getAllUsers, getAllUsersData, setUserData, getUserData, getAllUsersExceptCurrentUser, uploadProfilePicture, showProfilePicture, deleteUser,removeUserFromBuddyList, checkFlag } = require('./backend_functions/utilities');
const {swipeThem} = require('./backend_functions/match');
const {messageBuddy, getMessages, getMessagesByChatId} = require('./backend_functions/messaging');


app2.use(bodyParser.json());

app2.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3000;

app2.post('/createUser', async (req, res) => {
  if (!req.body) {
    return res.status(400).send('Request body is missing');
  }

  const { name, email, password} = req.body;
  
  try {
    await createUser(name, email, password);
    res.status(200).send('User created successfully');
    //res.status(200).send("No")
  } catch (error) {
    res.status(500).send('Error creating user');
  }
});

  //send hello world to '/'
  app2.get('/', (req, res) => {
    res.status(200).send('Study Buddy Backend is running');
  });

  //list all the users
  app2.get('/listUsers', async (req, res) => {
    try {
      const users = await getAllUsers();
      res.status(200).send(users);
    } catch (error) {
      res.status(500).send('Error listing users');
    }
  });

  //sign in a user
  app2.post('/signIn', async (req, res) => {
    const { email, password } = req.body;
    const user = await signInWithEmail(email, password);
    const flag = await checkFlag(email);
    try {
      res.status(200).json({token: user, flag: flag});
    } catch (error) {
      res.status(500).send(user);
    }
  });


  /*
  app2.post('/signIn', async (req, res) => {
//     // Extract the token from the Authorization header
//     const bearerToken = req.headers.authorization;
//     if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
//       return res.status(401).send('Unauthorized');
//     }
//     const idToken = bearerToken.split('Bearer ')[1];

//     // Verify the token
//     const decodedToken = await verifyIdToken(idToken);

    // Sign in process..
    const { email, password} = req.body;
    const user = await signInWithEmail(email, password);
    try {
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send(user);
    }
  });*/

  //sign out a user
  app2.post('/signOut', async (req, res) => {
    try {
      signOutUser();
      res.status(200).send('User signed out successfully');
    } catch (error) {
      res.status(500).send('Error signing out user');
    }
  });

  //update a user's email
  app2.post('/updateEmail', async (req, res) => {
    const { token, email } = req.body;
    try {
      verifyIdToken(token);
      await updateUserEmail(email);
      res.status(200).send('User email updated successfully');
    } catch (error) {
      res.status(500).send('Error updating user email');
    }
  });

  //update a user's password
  app2.post('/updatePassword', async (req, res) => {
    const {token, password } = req.body;
    try {
      verifyIdToken(token);
      await updateUserPassword(password);
      res.status(200).send('User password updated successfully');
    } catch (error) {
      res.status(500).send('Error updating user password');
    }
  });

  //function to get all users data
  app2.get('/getAllUsersData', async (req, res) => {
    try {
      const users = await getAllUsersData();
      res.status(200).send(users);
    } catch (error) {
      res.status(500).send('Error listing users');
    }
  });

  //function to edit a user's data
  app2.post('/setUserData', async (req, res) => {
    const {token, name, age, Language,Major, InterestedSubjects, Location, University, bio, photoUrl, flag} = req.body;
    try {
      const uid = (await verifyIdToken(token)).uid;
      console.log(uid);
      try {
      await setUserData(uid,name, age, Language,Major, InterestedSubjects, Location,University, bio, photoUrl, flag);
      } catch (error) {
        res.status(500).send('Error setting user data');
      }
      res.status(200).send('User data updated successfully');
    } catch (error) {
      res.status(500).send('Error updating user data');
    }
  });


  //function to check if user is logged in
  app2.get('/checkUserLoggedIn', async (req, res) => {
    try {
      const user = await checkUserLoggedIn();
      //res.status(200).send({email: user});
      res.status(200).send("User is signed in");
    } catch (error) {
      res.status(500).send('Error checking if user is logged in');
    }
  });

  // function to get a particular user data based on uid
  app2.post('/getUserData', async (req, res) => {
    const {token} = req.body;
    try {
      const uid = (await verifyIdToken(token)).uid;
      console.log(uid);
      const user = await getUserData(uid);
      console.log(user);
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send('Error getting user data');
    }
  });


  app2.post('/getAdminUserData', async (req, res) => {
    const {uid} = req.body;
    try {
      const user = await getUserData(uid);
      console.log(user);
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send('Error getting user data');
    }
  });
  // function to get all the user data except the current user
  app2.get('/getAllOtherUsers', async (req, res) => {
    try {
      const token = req.headers.authorization.split('Bearer ')[1];
      console.log(token)
      await verifyIdToken(token).then(async (decodedToken) => {
      const uid = decodedToken.uid;
      const users = await getAllUsersExceptCurrentUser(uid);
      res.status(200).send(users);
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error getting user data');
    }
  });
  

  app2.get('/getAllOtherUsers2', async (req, res) => {
    try {
      const uid = req.headers.authorization.split('Bearer ')[1];
      console.log(uid)
      const users = await getAllUsersExceptCurrentUser(uid);
      res.status(200).send(users);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error getting user data');
    }
  });


  // function to return the number of users
  app2.get('/countUsers', async (req, res) => {
    try {
      await countUsers().then((count) => {
        res.status(200).json({ users: count });
      }
      );
    } catch (error) {
      res.status(500).send('Error counting users');
    }
  });

  // function for a user send message to a buddy
  app2.post('/sendMessage', async (req, res) => {
    const { token, buddy_email, message } = req.body;
    try {
      const email = (await verifyIdToken(token)).email;
      await messageBuddy(email, buddy_email, message);
      res.status(200).send('Message sent successfully');
    } catch (error) {
      res.status(500).send('Error sending message');
    }
  });

  // function for the swiping feature
  app2.post('/swipe', async (req, res) => {
    const { email, buddy_email, swipe } = req.body;
    console.log(req.body);
    console.log(email);
    console.log(buddy_email);
    console.log(swipe);
    try {
      //const uid_email = (await verifyIdToken(token)).email;
      await swipeThem(email, buddy_email, swipe);
      // swipe is a boolean value with true as its default
      res.status(200).send('Swipe sent successfully');
    } catch (error) {
      res.status(500).send('Error swiping');
      console.log(error);
    }
  });

  // function to get the users buddies
  app2.post('/getBuddies', async (req, res) => {
    const { token } = req.body;
    try {
      const uid = (await verifyIdToken(token)).uid;
      const buddies = await getUserData(uid);
      // convert buddies to a json object
      buddiesJson = JSON.parse(buddies);
      console.log(buddiesJson);
      // get buddies from the user data
      console.log(buddiesJson.buddies);

      res.status(200).send(buddiesJson.buddies);
    } catch (error) {
      res.status(500).send('Error getting buddies');
    }
  });

// function to get data based on uid for buddy data
app2.get('/getUserData/:uid', async (req, res) => {
    const uid = req.params.uid;
    try {
      const user = await getUserData(uid);
      console.log(user);
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send('Error getting user data');
    }
});

  // functions to remove a buddy
  app2.post('/removeBuddy', async (req, res) => {
    const { token, buddy_email } = req.body;
    try {
      const email = (await verifyIdToken(token)).email;
      await removeUserFromBuddyList(email, buddy_email);
      res.status(200).send('Buddy removed successfully');
    } catch (error) {
      //console.log(error);
      res.status(500).send('Error removing buddy');
    }
  });

  // function to get the messages
  
  app2.post('/getMessages', async (req, res) => {
    const { token, buddy_email } = req.body;
    try {
      const email = (await verifyIdToken(token)).email;
      const messages = await getMessages(email, buddy_email);
      //console.log(messages);
      res.status(200).send(messages);
    } catch (error) {
      res.status(500).send('Error getting messages');
    }
  });

  // function to get the messages
  app2.post('/getMessages2', async (req, res) => {
    const { chatId } = req.body;
    try {
      const messages = await getMessagesByChatId(chatId);
      //console.log(messages);
      res.status(200).send(messages);
    } catch (error) {
      res.status(500).send('Error getting messages');
    }
  });

  app2.post('/uploadProfilePicture', async (req, res) => {
    const { uid, image } = req.body;
    //image is a path to the image
    try {
      await uploadProfilePicture(uid, image);
      res.status(200).send('Profile picture uploaded successfully');
    } catch (error) {
      res.status(500).send('Error uploading profile picture');
    }
  });

  // function to show a profile picture
  app2.post('/showProfilePicture', async (req, res) => {
    const { uid } = req.body;
    try {
      const image = await showProfilePicture(uid);
      res.status(200).send(image);
    } catch (error) {
      res.status(500).send('Error downloading profile picture');
    }
  });

  // function to show recommendation score for buddies using a python shell and a python script
  /*
  app2.post('/showRecommendationScore', async (req, res) => {
    const { token, uid } = req.body;
*/

  
app2.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

