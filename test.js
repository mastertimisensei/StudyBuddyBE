// Import the necessary modules
const assert = require('assert');
const {getUserUid, countUsers, getAllUsers, getAllUsersData, getUserData } = require('./backend_functions/utilities'); // Assuming there's a calculator module

// Describe a test suite
describe('Testing our UID Function', function () {
  // Describe a test case
  describe('Second User UID', function () {
    it('should correctly give us the right User UID', async function () {
      // Test the getUserUid function
        assert.strictEqual(await getUserUid('seconduser@gmail.com'), 'SGnoSk4LSsR2cT4JpkuzEos3Y233');
        assert.notStrictEqual(await getUserUid('phone@test.com'),'SGnoSk4LSsR2cT4JpkuzEos3Y233');
    });
  });

    describe('Count Users', function () {
    it('Count Users should correctly give us the right number of users', async function () {
      // Test the countUsers function
        assert.strictEqual(await countUsers(), await countUsers());
        assert.notStrictEqual(await countUsers(), 10);
    });
    it('Database should contain right number of users', async function () {
        // get all the users ID of the users
        let users = await getAllUsers();
        // get all the users data of the users;

        // check if the number of users is equal to the number of users ID
        assert.strictEqual(await countUsers(), users.length);
        setTimeout(async function() {
        let usersData = await getAllUsersData();
        assert.strictEqual(await countUsers(), usersData.length);
        assert.strictEqual(await users.length, usersData.length);
        }, 3000);
});
});

describe('Get a Users Data', function () {
    it('Get a Users Data should correctly give us the right data', async function () {
      // Test the getUserData function
      setTimeout(async function() {
        let user = await getUserData('SGnoSk4LSsR2cT4JpkuzEos3Y233');
        assert.strictEqual(user.email, 'seconduser@gmail.com');
        assert.strictEqual(user.name, 'Second User');
        assert.strictEqual(user.flag, true);
        assert.strictEqual(user.age,"23");
      }, 3000);
});
});

describe('Get a Users Buddies', function () {
    it('Get a Users Buddies should correctly give us the right data', async function () {
      // Test the getUserData function
      setTimeout(async function() {
        let user = await getUserData('SGnoSk4LSsR2cT4JpkuzEos3Y233');
        assert.ok(user.buddies);
        assert.ok(user.messages);
});
});
});
});
