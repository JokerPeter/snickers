/**
 * Bot class
**/

const request = require('request');

class SnickersApi {
  constructor(skuId, visitorId) {
    this.skuId = skuId;
    this.visitorId = visitorId;
    this.checkoutId = null;
  }

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

  addToCart() {
    const options = {
      url: 'https://api.nike.com/buy/carts/v2/US/NIKE/NIKECOM?modifiers=VALIDATELIMITS,VALIDATEAVAILABILITY',
      method: 'PATCH',
      headers: this.getHeaders(),
      json: [{
        'op': 'add',
        'path': '/items',
        'value': {
          'skuId': this.skuId,
          'quantity': 1
        }
      }]
    }

    request(options, function(err, res, body) {
      console.log(body);
    });
    // self.cartItemId = response['items'][0]['id']
  }

  setCheckoutId(checkoutId) {
    this.checkoutId = checkoutId;
  }

  addShippingInformation() {
    const options = {
      url: `https://api.nike.com/buy/checkout_previews/v2/${this.checkoutId}`,
      method: 'PUT',
      headers: this.getHeaders(),
      json: {
        'request': {
          'email': 'paulyeo21@gmail.com',
          'country': 'US',
          'currency': 'USD',
          'locale': 'en_US',
          'channel': 'NIKECOM',
          'items': [{
            'id': '',
            'skuId': '',
            'shippingAddress': {
              'address1': '',
              'address2': '',
              'city': '',
              'state': '',
              'country': '',
              'postalCode': '',
              'preferred': false,
              'email': '',
              'phoneNumber': '',
              'addressId': ''
            },
            'recipient': {

            },
            'shippingMethod': 'STANDARD',
            'quantity': 1,
            'contactInfo': {
              'phoneNumber': '',
              'email': ''
            }
          }],
          'promotionCodes': []
        }
      }
    }

    request(options, function(err, res, body) {
      console.log(body);
    });
  }

  static generateNikeId() {
    return this.generateAlphanumeric(8) + '-'
            + this.generateAlphanumeric(4) + '-'
            + this.generateAlphanumeric(4) + '-'
            + this.generateAlphanumeric(4) + '-'
            + this.generateAlphanumeric(12)
  }

  static generateAlphanumeric(length) {
    let result = '';
    const chars = 'abcdef0123456789';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result;
  }
}

module.exports = SnickersApi;
