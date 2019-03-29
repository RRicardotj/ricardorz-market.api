/* eslint-disable class-methods-use-this */
const bcrypt = require('bcryptjs');
const Handler = require('../Handler');
const Customer = require('../../models/Customer');
const Cart = require('../../models/Cart');
const ShippingRegion = require('../../models/ShippingRegion');

class CustomerController extends Handler {
  constructor(model = Customer, language) {
    super(model, language);

    this.signUp = this.signUp.bind(this);
  }

  async signUp({
    email, password, confirm, name, shippingRegionId, cartId,
  }) {
    try {
      email = email.toLowerCase();
      const response = await this.sequelize.transaction(async (transaction) => {
        const existEmail = await this.model.existEmail(email);

        if (existEmail) {
          throw new this.CustomError(this.getMessage(this.LITERALS.EMAIL_TAKEN));
        }

        if (password !== confirm) {
          throw new this.CustomError(this.getMessage(this.LITERALS.PASSWORD_NOT_IDENTICAL));
        }

        const shippingRegionExist = await ShippingRegion.shippingRegionExist(shippingRegionId);

        if (!shippingRegionExist) {
          throw new this.CustomError(this.getMessage(this.LITERALS.SHIPPING_RG_NO_FOUND));
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const customer = await this.model.create({
          email, password: hashedPassword, name, shippingRegionId,
        }, { transaction });

        let cart = await Cart.findOne({ where: { cartId }, transaction });

        if (!cart || (cart && cart.customerId)) {
          cart = await Cart.create({
            customerId: customer.customerId,
            createdAt: new Date(),
            isEnabled: false,
          }, { transaction });
        } else {
          cart.update({ customerId: customer.customerId }, { transaction });
        }

        return customer.toJSON();
      }).catch((err) => { throw err; });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CustomerController;
