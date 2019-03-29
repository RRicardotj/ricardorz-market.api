const express = require('express');

const router = express.Router();

const mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_KEY, domain: process.env.MAILGUN_DOMAIN });
const pug = require('pug');
const withCatchAsync = require('../../common/catchAsyncErrors');
const Validator = require('../../common/validator');
const CustomerController = require('./CustomerController');
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
const sendMailHandler = dataMailgun => mailgun.messages().send(dataMailgun, (error, body) => {
  console.log(error); // eslint-disable-line
  console.log(`SENDING TO: ${dataMailgun.to}>>> ${JSON.stringify(body)}`); // eslint-disable-line
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
  res.json({ isValid: true });
};

const signUpHandler = async (req, res) => {
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

  const customer = await customerController.signUp();
  const message = LITERALS.getMessage(LITERALS.CUSTOMER_CREATED, customer.language);

  const html = pug.renderFile('./templates/activeAccount.pug', {
    endpoint: `${process.env.SRV_DOMAIN}/customer/${customer.customerId}/activate`,
  });

  const dataMailgun = {
    from: `Notificaciones <${process.env.MAILGUN_SENDER}@${process.env.MAILGUN_DOMAIN}>`,
    to: customer.email,
    subject: 'Activation',
    html,
  };

  await sendMailHandler(dataMailgun);
  return res.json({ message });
};

router.get('/check', withCatchAsync(checkHandler));

router.post('/signup', withCatchAsync(signUpHandler));

module.exports = router;
