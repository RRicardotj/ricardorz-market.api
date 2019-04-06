const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const LITERALS = require('../utils/LITERALS');

const jwtVerify = promisify(jwt.verify);

const jwtAuth = async (req, res, next) => {
  let token = req.headers.authorization || req.query.token;
  if (req.path.substring(0, 6) !== '/admin' && req.path.substring(0, 5) !== '/user') {
    if (token) {
      token = token.split(' ');

      const decoded = await jwtVerify((token.length > 1 ? token[1] : token[0]), process.env.KEY_APP)
        .catch((err) => {
          console.log(err.message); // eslint-disable-line
          return res
            .error(LITERALS.getMessage(LITERALS.TOKEN_INVALID, req.query.language), 401, req.path);
        });

      const customer = await Customer.findOne({
        where: { customerId: decoded.customerId },
        attributes: ['isActived', 'customerId', 'isEnabled', 'language'],
      });

      if (customer.isEnabled && customer.isActived) {
        req.customerId = decoded.customerId;
        req.customerLanguage = customer.language;
      }

      return next();
    }

    return next();
  }

  if (!token) { return res.error('TOKEN_NOT_PROVIDED', 403, req.path); }

  token = token.split(' ');

  jwt.verify(
    (token.length > 1 ? token[1] : token[0]),
    process.env.KEY_APP, async (err, decoded) => {
      if (err) {
        console.log(err.message); // eslint-disable-line
        return res
          .error(LITERALS.getMessage(LITERALS.TOKEN_INVALID, req.query.language), 401, req.path);
      }
      const customer = await Customer.findOne({
        where: { customerId: decoded.customerId },
        attributes: ['isActived', 'customerId', 'isEnabled', 'language'],
      });

      if (!customer.isEnabled) {
        return res
          .error(LITERALS.getMessage(LITERALS.USER_DISABLED, customer.language), 401, req.path);
      }

      if (!customer.isActived) {
        return res
          .error(LITERALS.getMessage(LITERALS.USER_NON_ACIVATED, customer.language), 401, req.path);
      }


      req.customerId = decoded.customerId;
      req.customerLanguage = customer.language;
      return next();
    },
  );
  return undefined;
};

module.exports = jwtAuth;
