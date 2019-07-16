/**
 *
**/

const fetch = require('node-fetch');
const config = require('./config');

class SnickersApi {
  constructor(skuId) {
    this.skuId = skuId;
    this.visitorId = this.generateNikeId();
    this.checkoutId = null;
    this.itemId = null;
    this.addressId = this.generateNikeId();
    this.paymentId = null;
    this.productId = null;
    this.productTitle = null;
    this.paymentToken = null;
    this.totalPrice = null;
  }

  // requires: visitorId
  getHeaders() {
    return {
      'accept': 'application/json',
      'appid': 'com.nike.commerce.nikedotcom.web',
      'Content-Type': 'application/json; charset=UTF-8',
      'x-nike-visitid': '1',
      'x-nike-visitorid': this.visitorId,
      'user-agent': 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
    }
  }
  
  // requires: none
  // sets: productId
  getProductInfo() {
    const that = this; // necessary bc no instance scope inside response callback
    return fetch('https://www.nike.com/checkout/services/v1/skus/' + this.skuId, {
      method: 'GET'
    })
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      that.productId = json['skus'][0]['product']['id']
      that.productTitle = json['skus'][0]['product']['content']['fullTitle']
      return json
    })
    .catch(function(error) {
      console.log(`Failed to get product info for ${that.skuId}\n`);
      throw error
    });
  }

  // requires: skuId
  // sets: itemId
  addToCart() {
    const that = this; // necessary bc no instance scope inside response callback
    return fetch('https://api.nike.com/buy/carts/v2/US/NIKE/NIKECOM?modifiers=VALIDATELIMITS,VALIDATEAVAILABILITY', {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify([{
        'op': 'add',
        'path': '/items',
        'value': {
          'skuId': this.skuId,
          'quantity': 1
        }
      }])
    })
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      that.itemId = json['items'][0]['id']
      return json
    })
    .catch(function(error) {
      console.log(`Failed to add ${that.skuId} to cart\n`);
      throw error;
    });
  }

  // requires: none
  // sets: totalPrice
  getCheckoutPreview() {
    const that = this;
    return fetch('https://api.nike.com/buy/checkout_previews/v2/jobs/' + this.checkoutId, {
      method: 'GET',
      headers: this.getHeaders()
    })
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      that.totalPrice = json['response']['totals']['total'];
      return json
    });
  }

  // requires: checkoutId, itemId, skuId
  // sets: none
  setShippingInfo() {
    const that = this;
    return fetch('https://api.nike.com/buy/checkout_previews/v2/' + this.checkoutId, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({
        'request': {
          'email': config.email,
          'country': 'US',
          'currency': 'USD',
          'locale': 'en_US',
          'channel': 'NIKECOM',
          'items': [{
            'id': this.itemId,
            'skuId': this.skuId,
            'shippingAddress': {
              'address1': config.address1,
              'address2': '',
              'city': config.city,
              'state': config.state,
              'country': config.country,
              'postalCode': config.postalCode,
              'preferred': false,
              'email': config.email,
              'phoneNumber': config.phoneNumber,
              'addressId': this.addressId
            },
            'recipient': {
              'firstName': config.firstName,
              'lastName': config.lastName
            },
            'shippingMethod': 'STANDARD',
            'quantity': 1,
            'contactInfo': {
              'phoneNumber': config.phoneNumber,
              'email': config.email 
            }
          }],
          'promotionCodes': []
        }
      })
    })
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      return json;
    })
    .catch(function(error) {
      console.log(`Failed to add shipping information for checkoutId ${that.checkoutId}`);
      throw error;
    });
  };

  // requires: checkoutId, productId, addressId, paymentId
  // sets: paymentToken
  setPaymentInfo() {
    const that = this; // necessary bc no instance scope inside response callback
    return fetch('https://api.nike.com/payment/preview/v2', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        'checkoutId': this.checkoutId,
        'total': this.totalPrice,
        'currency': 'USD',
        'country': config.country,
        'items': [{
          'productId': this.productId,
          'shippingAddress': {
            'address1': config.address1,
            'address2': '',
            'city': config.city,
            'state': config.state,
            'country': config.country,
            'postalCode': config.postalCode,
            'preferred': false,
            'email': config.email,
            'phoneNumber': config.phoneNumber,
            'addressId': this.addressId
          }
        }],
        'paymentInfo': [{
          'id': this.paymentId,
          'creditCardInfoId': this.paymentId,
          'type': 'CreditCard',
          'cardType': 'VISA',
          'lastFour': config.creditCardlastFour,
          'expiryMonth': config.creditCardExpiryMonth,
          'expiryYear': config.creditCardExpiryYear,
          'accountNumber': config.creditCardNumber,
          'billingInfo': {
            'name': {
              'firstName': config.firstName,
              'lastName': config.lastName
            },
            'address': {
              'address1': config.address1,
              'address2': '',
              'city': config.city,
              'state': config.state,
              'postalCode': config.postalCode,
              'country': config.country
            },
            'contactInfo': {
              'phoneNumber': config.phoneNumber,
              'email': config.email
            }
          },
          'dateOfBirth': ''
        }]
      })
    })
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      that.paymentToken = json['id'];
      return json;
    });
  };

  // requires: paymentId
  // sets: none
  getPaymentPreview() {
    return fetch('https://api.nike.com/payment/preview/v2/jobs/' + this.paymentToken, {
      method: 'GET',
      headers: this.getHeaders()
    })
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      return json
    });
  };

  // requires: checkoutId, itemId, skuId, addressId, paymentToken
  // sets: none
  setCheckouts() {
    return fetch('https://api.nike.com/buy/checkouts/v2/' + this.checkoutId, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({
        'request': {
          'email': config.email,
          'country': 'US',
          'currency': 'USD',
          'locale': 'en_US',
          'channel': 'NIKECOM',
          'items': [{
            'id': this.itemId,
            'skuId': this.skuId,
            'valueAddedServices': [],
            'shippingAddress': {
              'address1': config.address1,
              'address2': '',
              'city': config.city,
              'state': config.state,
              'country': config.country,
              'postalCode': config.postalCode,
              'preferred': false,
              'email': config.email,
              'phoneNumber': config.phoneNumber,
              'addressId': this.addressId
            },
            'recipient': {
              'firstName': config.firstName,
              'lastName': config.lastName
            },
            'shippingMethod': 'STANDARD',
            'quantity': 1,
            'contactInfo': {
              'phoneNumber': config.phoneNumber,
              'email': config.email 
            }
          }],
          'paymentToken': this.paymentToken,
          'promotionCodes': []
        }
      })
    })
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      return json
    });
  }

  getCheckouts() {
    return fetch('https://api.nike.com/buy/checkouts/v2/jobs/' + this.checkoutId, {
      method: 'GET',
      headers: this.getHeaders()
    })
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      return json
    });
  }

  generateNikeId() {
    return this.generateAlphanumeric(8) + '-'
            + this.generateAlphanumeric(4) + '-'
            + this.generateAlphanumeric(4) + '-'
            + this.generateAlphanumeric(4) + '-'
            + this.generateAlphanumeric(12)
  }

  generateAlphanumeric(length) {
    let result = '';
    const chars = 'abcdef0123456789';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result;
  }
}

module.exports = SnickersApi;
