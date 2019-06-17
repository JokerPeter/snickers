/**
 *
 *
**/

const puppeteer = require('puppeteer');
const { performance } = require('perf_hooks');
const SnickersApi = require('./SnickersApi');

const skuId = '1261a97f-79e6-5dd1-95e2-0e6ed39f414f';
const visitorId = SnickersApi.generateNikeId();
const cookie = {
  name: 'visitData',
  value: `{"visit":"1","visitor":"${visitorId}"}`,
  domain: 'unite.nike.com',
  path: '/',
  httpOnly: false,
  secure: false,
  sameSite: 'no_restriction'
};

console.log(visitorId);

try {
  (async () => {
    const v0 = performance.now();

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const snickers = new SnickersApi(skuId, visitorId);

    // 1. Add shoe to cart
    snickers.addToCart();

    // 2. Navigate to page with cookie data
    await page.setCookie(cookie),
    await page.goto('https://www.nike.com/checkout', {
      waitUntil: 'networkidle2'
    });

    await page.screenshot({path: 'step_one.png'});
    console.log('checkout');

    // 3. Login
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

    // 3. Get checkoutId in sessionStorage
    const checkoutId = await page.evaluate(() => {
      return sessionStorage.getItem('checkoutId');
    });
    snickers.setCheckoutId(checkoutId);
    await page.screenshot({path: 'step_two.png'});
    console.log('checkout id: ' + snickers.checkoutId);

    // 4. Add shipping information
    snickers.addShippingInformation();
    console.log('added shipping');

    await browser.close();
    console.log('total milliseconds: ' + (performance.now() - v0));
  })();
} catch (err) {
  console.log(err);
}
