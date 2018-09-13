const common = require('./common.js');
const assert = require('assert');
let driver = null;

async function registrationTest(){
  try{
  common.log('Start of Registration Test');
  driver = await common.launchBrowser('chrome');
  await common.launchTestUrl("React + Redux - User Registration and Login Example & Tutorial", driver);
  await common.registerNewUser("shelly", "christian", "shellyc", "12345", driver);
  await assert.equal(await common.getRegistrationMessage(driver), 'Registration successful');
  await common.login("shellyc", "12345", driver);
  await assert.equal(await common.getWelcomeMessage(driver), 'Hi shelly!');
  await assert.equal(await common.validateUserRegistration("shelly christian", driver), true);
  await common.logout(driver);
  common.log('Registration Test Passed')
}
catch(error){
  common.log(error);
  return common.log('Registration Test Failed : About to exit test due to error');
}
}

registrationTest().then(f => {
  common.closeBrowser(driver);}
);
