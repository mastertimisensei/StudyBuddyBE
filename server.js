const express = require('express');
const app2 = express();
const { createUser } = require('./createUser');
const {signInWithEmail, signOutUser} = require('./signIn');
const {checkUserLoggedIn, countUsers, getUserUid, updateUserPassword, updateUserEmail,getAllUsers, getAllUsersData} = require('./utilities');

const PORT = process.env.PORT || 3000;

app2.post('/createUser', async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      await createUser(name, email, password);
      res.status(200).send('User created successfully');
    } catch (error) {
      res.status(500).send('Error creating user');
    }
  });

  //send hello world to '/'
  app2.get('/', (req, res) => {
    res.status(200).send('Hello World!');
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
    try {
      signInWithEmail(email, password);
      res.status(200).send('User signed in successfully');
    } catch (error) {
      res.status(500).send('Error signing in user');
    }
  });

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
    const { email } = req.body;
    try {
      await updateUserEmail(email);
      res.status(200).send('User email updated successfully');
    } catch (error) {
      res.status(500).send('Error updating user email');
    }
  });

  //update a user's password
  app2.post('/updatePassword', async (req, res) => {
    const { password } = req.body;
    try {
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
  


app2.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

