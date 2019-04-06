const express = require('express');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const router = express.Router();

const mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_KEY, domain: process.env.MAILGUN_DOMAIN });
const pug = require('pug');
const withCatchAsync = require('../../common/catchAsyncErrors');
const Validator = require('../../common/validator');
const CustomerController = require('./CustomerController');
const CartController = require('../CartController/CartController');
const LITERALS = require('../../utils/LITERALS');


/**
 * Send email
 * @param {Object} dataMailGun and object with email information
 * @param {String} dataMailGun.to destination email address
 * @param {String} dataMailGun.from source email address
 * @param {String} dataMailGun.subject email subject
 * @param {string} dataMailGun.html html template to send
 * @returns {undefined}
 */
const sendMailHandler = dataMailgun => mailgun.messages().send(dataMailgun, (error) => {
  if (error) {
    console.log(error); // eslint-disable-line
  }
});


/**
 * @return {Object} rules
 */
function getValidationRules() {
  return {
    titles: {},
    rules: {
      email: 'required',
      password: 'required|confirmed',
      name: 'required',
      shippingRegionId: 'required',
    },
  };
}

const checkHandler = async (req, res) => {
  const customerController = new CustomerController(undefined, req.query.language);

  const verify = promisify(jwt.verify);
  let token = req.headers.authorization || req.query.token;
  token = token.split(' ');

  if (!token) {
    res.json({ isValid: false });
  }

  const decode = await verify((token.length > 1 ? token[1] : token[0]), process.env.KEY_APP)
    .catch(() => false);

  let isValid = !!decode;
  let cartId;
  let shoppingCart;

  if (decode && decode.type === 'customer') {
    isValid = await customerController.isValidCustomer(decode.customerId)
      .catch(() => (res.json({ isValid: false })));

    if (isValid) {
      const cartController = new CartController(undefined, decode.customerLanguage);

      const cart = await cartController.getCartByCustomerId(decode.customerId)
        .catch(() => (res.json({ isValid: false })));

      cartId = cart.cartId; // eslint-disable-line
      shoppingCart = cart.shoppingCart; // eslint-disable-line
    }
  }

  return res.json({ isValid, cartId, shoppingCart });
};

const signUpHandler = async (req, res) => {
  try {
    const customerController = new CustomerController(undefined, req.query.language);

    const {
      email, password, confirm, name, shippingRegionId, cartId,
    } = req.body;

    const data = {
      email,
      password,
      confirm,
      name,
      shippingRegionId,
      cartId,
      password_confirmation: confirm,
    };

    const isValid = await Validator.validateAsync(data, getValidationRules());

    if (isValid !== true) { return res.errorValidation(isValid); }

    const customer = await customerController.signUp(data);
    const message = LITERALS.getMessage(LITERALS.CUSTOMER_CREATED, customer.language);

    const html = pug.renderFile('./templates/activeAccount.pug', {
      endpoint: `${process.env.SRV_DOMAIN}${process.env.SRV_PORT ? `:${process.env.SRV_PORT}` : ''}/customer/${customer.customerId}/activate`,
    });

    const dataMailgun = {
      from: `Ricardorz market <${process.env.MAILGUN_SENDER}@${process.env.MAILGUN_DOMAIN}>`,
      to: customer.email,
      subject: 'Activation',
      html,
    };


    await sendMailHandler(dataMailgun);
    return res.json({ message });
  } catch (error) {
    throw error;
  }
};

const activateHandler = async (req, res) => {
  try {
    const customerController = new CustomerController();

    const customer = await customerController.activateCustomer(req.params.id);

    const token = jwt.sign({
      customerId: customer.customerId,
      type: 'customer',
      cartId: customer.cart.cartId,
      customerLanguage: customer.language,
    }, process.env.KEY_APP, { expiresIn: '48h' });

    return res.redirect(`${process.env.SRV_DOMAIN_CLIENT}:${process.env.SRV_PORT_CLIEN}/activated?cartId=${customer.cart.cartId}&token=${token}`);
  } catch (error) {
    throw error;
  }
};

const signInHandler = async (req, res) => {
  try {
    const customerController = new CustomerController();

    const customer = await customerController.signIn(req.body.email, req.body.password);

    const token = jwt.sign({
      customerId: customer.customerId,
      type: 'customer',
      cartId: customer.cart.cartId,
      customerLanguage: customer.language,
    }, process.env.KEY_APP, { expiresIn: '48h' });

    return res.json({
      token, shoppingCart: customer.cart.shoppingCart, cartId: customer.cart.cartId,
    });
  } catch (error) {
    throw error;
  }
};

router.get('/check', withCatchAsync(checkHandler));

router.post('/signup', withCatchAsync(signUpHandler));

router.post('/signin', withCatchAsync(signInHandler));

router.get('/:id/activate', withCatchAsync(activateHandler));

module.exports = router;
