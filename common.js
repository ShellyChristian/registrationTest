const {Builder, By, until} = require('selenium-webdriver');
const fileStream = require('fs');
const explicitTimeout = 10000;

function log(message){
  console.log(message);
  fileStream.appendFileSync("umbrellar_automation.LOG", message + "\r\n");
}

async function launchBrowser(browserName){
  log('Launching new browser instance ' + browserName);
  let browser = await new Builder().forBrowser(browserName).build();
  return browser;
}

async function closeBrowser(driver){
    log('Closing the browser instance');
    await driver.quit();
}

async function launchTestUrl(expectedPageTitle, driver){
    log('Launching test url');
    await driver.get('https://react-redux-registration-login-example.stackblitz.io/login');
    await driver.wait(until.titleIs(expectedPageTitle), explicitTimeout);
    await driver.wait(until.elementLocated(By.name('username')), explicitTimeout);
    log('test page displayed successfully');
  }

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function clickElement(element, name, driver){
  log('Clicking element ' + name);
  await element.click();
}

async function registerNewUser(firstname, lastname, username, password, driver){
  log('Registering new user ' + firstname + ' ' + lastname);
  await driver.wait(until.elementLocated(By.xpath("//a[text() = 'Register']")), explicitTimeout).click();
  let registerButton = await driver.wait(until.elementLocated(By.xpath("//button[text() = 'Register']")), explicitTimeout);  
  await driver.wait(until.elementLocated(By.name("firstName")), explicitTimeout).sendKeys(firstname);
  await driver.wait(until.elementLocated(By.name("lastName")), explicitTimeout).sendKeys(lastname);
  await driver.wait(until.elementLocated(By.name("username")), explicitTimeout).sendKeys(username);
  await driver.wait(until.elementLocated(By.name("password")), explicitTimeout).sendKeys(password);
  await registerButton.click();
  await sleep(5000);
}

async function getRegistrationMessage(driver){
  let successText = await driver.wait(until.elementLocated(By.xpath("//*[contains(@class, 'alert alert-success')]")), explicitTimeout).getText();
  log('Fetched the registration status [' + successText + ']');
  return successText;
}

async function login(username, password, driver){
  log('Login as [' + username + ']');
  await driver.wait(until.elementLocated(By.name("username")), explicitTimeout).sendKeys(username);
  await driver.wait(until.elementLocated(By.name("password")), explicitTimeout).sendKeys(password);
  await driver.wait(until.elementLocated(By.xpath("//button[text() = 'Login']")), explicitTimeout).click();  
  await driver.wait(until.elementLocated(By.xpath("//a[text() = 'Logout']")), explicitTimeout);
  log('Login Success');
}

async function getWelcomeMessage(driver){
  let text = await driver.wait(until.elementLocated(By.xpath("//div[@id='app']//h1")), explicitTimeout).getText(); 
  log('Fetched Welcome Message [' + text + ']');
  return text;
}

async function validateUserRegistration(fullname, driver){
  log('Validating registration for user [' + fullname + ']');
  let registeredUsers = await driver.wait(until.elementLocated(By.xpath("//div[@id='app']//li[text()='" + fullname + "']")), explicitTimeout);
  log('User ' + fullname + ' has registered successfully');
  return true;
}

async function logout(driver){
  log('Logging out of registration system');
  await driver.wait(until.elementLocated(By.xpath("//a[text()='Logout']")), explicitTimeout).click();
}

module.exports = {
  launchBrowser,
  log,
  closeBrowser,
  launchTestUrl,
  registerNewUser,
  getRegistrationMessage,
  login,
  getWelcomeMessage,
  validateUserRegistration,
  logout
};
