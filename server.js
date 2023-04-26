

const express = require('express');
const app2 = express();
const { createUser } = require('./createUser');
const {signInWithEmail, signOutUser} = require('./signIn');
const {checkUserLoggedIn, countUsers, getUserUid, updateUserPassword, updateUserEmail} = require('./utilities');

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
    res.send('Hello World!');
  });



app2.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });