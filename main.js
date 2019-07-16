/**
 *
**/

const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const { performance } = require('perf_hooks');
const SnickersApi = require('./SnickersApi');
const config = require('./config');

const skuId = '7ea790b7-d918-5bab-9773-5ae1ac9ad339';
const snickers = new SnickersApi(skuId);
const visitorId = snickers.visitorId;
const cookie = {
  name: 'visitData',
  value: `{"visit":"1","visitor":"${visitorId}"}`,
  domain: 'unite.nike.com',
  path: '/',
  httpOnly: false,
  secure: false,
  sameSite: 'no_restriction'
};

puppeteer.use(pluginStealth());

puppeteer.launch({headless: true, slowMo: 10}).then(async browser => {
  try {
    const v0 = performance.now();
    const page = await browser.newPage();
    await page.setViewport({width: 1200, height: 800})

    // Set cookie data
    // await page.setCookie(cookie)
    // await page.goto('https://bot.sannysoft.com/');
    // await page.screenshot({path: 'example1.png', fullPage: true});

    await page.goto('https://nike.com/launch');

    // Login
    const loginModalBtn = 'li.member-nav-item.d-sm-ib.va-sm-m > button';
    const emailField = 'input[type="email"]';
    const passwordField = 'input[type="password"]';
    const loginBtn = 'input[value="LOG IN"]';
    await page.click(loginModalBtn);
    await page.type(emailField, config.nikeEmail);
    await page.waitFor(500);
    await page.type(passwordField, config.nikePassword);
    await page.waitFor(500);
    await page.click(loginBtn);
    await page.waitFor(500);
    await page.screenshot({path: 'example2.png', fullPage: true});

    // const emailField = 'input[type="email"]';
    // const passwordField = 'input[type="password"]';
    // const loginBtn = '.checkoutLoginSubmit input[value="MEMBER CHECKOUT"]';
    // await page.type(emailField, config.nikeEmail);
    // await page.type(passwordField, config.nikePassword);
    
    // // ERROR: can't get it to process login (currently times out)
    // await page.click(loginBtn);
    // await page.waitFor(1000);
    // // await page.waitForNavigation({waitUntil: 'domcontentloaded'});
    // await page.screenshot({
    //   path: 'example2.png',
    //   fullPage: true
    // });

    // // Add shoe to cart
    // await snickers.getProductInfo();
    // await snickers.addToCart()

    // // Navigate to checkout page
    // await page.goto('https://www.nike.com/checkout', {
    //   waitUntil: 'networkidle2'
    // });

    // // Get checkoutId in sessionStorage
    // const checkoutId = await page.evaluate(() => {
    //   return sessionStorage.getItem('checkoutId');
    // });
    // snickers.checkoutId = checkoutId;

    // Continue to payment
    // await page.waitFor(1000);
    // await page.click(continueBtn);
    // await page.screenshot({path: 'example2.png'});

    // Add shipping information
    // await snickers.setShippingInfo();
    // await page.waitFor(200);

    // Check checkout preview and set total price
    // console.log(await snickers.getCheckoutPreview());

    // Add payment info
    // await snickers.setPaymentInfo();
    // console.log(await snickers.getPaymentPreview());

    // Finalize transaction
    // await snickers.setCheckouts();

    // console.log(await snickers.getCheckouts());

    await browser.close();
    console.log(snickers);
    console.log('total milliseconds: ' + (performance.now() - v0));

  } catch (err) {
    console.log(err);
    process.exit(1)
  }
});

    // Login
    // const emailField = 'input[type="email"]';
    // const passwordField = 'input[type="password"]';
    // const loginBtn = 'input[value="MEMBER CHECKOUT"]';
    // await page.type(emailField, 'paulyeo21@gmail.com');
    // await page.type(passwordField, 'Pauly3ok');
    //
    // ERROR: can't get it to process login (currently times out)
    // await page.click(loginBtn);
    // await page.waitForNavigation({waitUntil: 'domcontentloaded'});
    // await page.screenshot({path: 'step_two.png'});
    // console.log('login');
    //
    // // Add shipping information
    // const firstNameField = 'input#firstName';
    // const lastNameField = 'input#lastName';
    // const addressField = 'input#address1';
    // const cityField = 'input#city';
    // const stateField = 'select#state';
    // const postalCodeField = 'input#postalCode';
    // const emailField = 'input#email';
    // const phoneNumberField = 'input#phoneNumber';
    // const continueBtn = 'button.ncss-btn-accent';
    // await page.type(firstNameField, config.firstName);
    // await page.type(lastNameField, config.lastName);
    // await page.type(addressField, config.address1);
    // await page.type(cityField, config.city);
    // await page.select(stateField, config.state);
    // await page.type(postalCodeField, config.postalCode);
    // await page.type(emailField, config.email);
    // await page.type(phoneNumberField, config.phoneNumber);
    // await page.click(continueBtn);
    // await page.screenshot({path: 'step_four.png'});

    // // Continue to payment
    // await page.click(continueBtn);
    // await page.screenshot({path: 'step_five.png'});
    // console.log('added shipping information\n');

    // // Add payment information
    // const creditCardField = 'input#creditCardNumber';
    // const expirationField = 'input#expirationDate';
    // const securityCodeField = 'input#cvNumber';
    // await page.type(creditCardField, config.creditCardNumber);
    // await page.type(expirationField, config.expirationDate);
    // await page.type(securityCodeField, config.securityCode);
    // await page.screenshot({path: 'step_six.png'});
    // console.log('added credit card information\n');
