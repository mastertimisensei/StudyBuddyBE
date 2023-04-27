const names = ["Emma Thompson", "Oliver Jackson", "Sophia Garcia", "William Lee", "Ava Chen", "Mason Kim", "Isabella Perez", "Jacob Nguyen", "Mia Rodriguez", "Ethan Hernandez", "Charlotte Davis", "Michael Wilson", "Amelia Smith", "Alexander Johnson", "Harper Taylor", "Benjamin Brown", "Evelyn Martin", "Daniel Martinez", "Abigail Jones", "Matthew Anderson"];
//console.log(names.length);
const fs = require('fs');
const { randomInt } = require('crypto');
const { createUser } = require('./createUser.js');
const {app, admin} = require('./firebaseConfig.js');
const { getUserUid,setUserData,sleep } = require('./utilities.js');

// Load the data from the JSON file
const data = fs.readFileSync('schooldata.json');
const { universityMajors, languages, universityCourses } = JSON.parse(data);

//console.log(universityMajors.length);
//console.log(languages.length);

// Define a function to generate a random integer between min and max (inclusive)
function randomAge(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Define a function to get a random element from an array
function randomElement(array) {
  return array[randomInt(array.length)];
}

// Define a function to generate a random list of languages (between 1 and 3)
function randomLanguages() {
  const numLanguages = randomInt(1, 3);
  const result = [];
  for (let i = 0; i < numLanguages; i++) {
    const language = randomElement(languages);
    if (!result.includes(language)) {
      result.push(language);
    }
  }
  return result;
}

// Define a function to generate a random list of courses (between 1 and 3)
function randomCourses(major) {
    const numCourses = randomInt(1, 3);
    const result = [];
    for (let i = 0; i < numCourses; i++) {
        const course = randomElement(universityCourses[major]);
        if (!result.includes(course)) {
            result.push(course);
        }
    }
    return result;
}

console.log(languages);

const users = names.map(name => {
    const age = randomAge(17, 25);
    const mjr = randomElement(universityMajors);
    const courses = randomCourses(mjr);
    const languages = randomLanguages();
    const email = name.replace(/\s/g, '').toLowerCase() + '@fakemaill.com';
    return {
        name,
      age,
      universityMajors: mjr,
      courses,
      languages,
        email
    };
  });

    //console.log(users);
    //console.log(users[0].name.replace(/\s/g, '').toLowerCase() + '@fakemaill.comm');
    async function createRandomUsers() {
        for (const user of users) {
          await createUser(user.name, user.email, 'password');
          const uid = await getUserUid(user.email);
          await sleep(1000);
          await setUserData(uid, user.age, user.languages, user.universityMajors, user.courses);
        }
      }

//createRandomUsers();
