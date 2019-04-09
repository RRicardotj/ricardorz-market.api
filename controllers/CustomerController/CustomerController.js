/* eslint-disable no-await-in-loop */
/* eslint-disable class-methods-use-this */
const bcrypt = require('bcryptjs');
const Handler = require('../Handler');
const Customer = require('../../models/Customer');
const Cart = require('../../models/Cart');
const ShippingRegion = require('../../models/ShippingRegion');
const ShoppingCart = require('../../models/ShoppingCart');
const Product = require('../../models/Product');
const CartController = require('../CartController/CartController');

class CustomerController extends Handler {
  constructor(model = Customer, language) {
    super(model, language);

    this.signUp = this.signUp.bind(this);
    this.activateCustomer = this.activateCustomer.bind(this);
    this.isValidCustomer = this.isValidCustomer.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  async signUp({
    email, password, confirm, name, shippingRegionId, cartId,
  }) {
    try {
      email = email.toLowerCase();
      const response = await this.sequelize.transaction(async (transaction) => {
        const existEmail = await this.model.existEmail(email);

        if (existEmail) {
          throw new this.CustomError(this.getMessage(this.LITERALS.EMAIL_TAKEN), 401);
        }

        if (password !== confirm) {
          throw new this.CustomError(this.getMessage(this.LITERALS.PASSWORD_NOT_IDENTICAL), 403);
        }

        const shippingRegionExist = await ShippingRegion.shippingRegionExist(shippingRegionId);

        if (!shippingRegionExist) {
          throw new this.CustomError(this.getMessage(this.LITERALS.SHIPPING_RG_NO_FOUND), 403);
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        console.log(password, hashedPassword);

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
          await cart.update({ customerId: customer.customerId }, { transaction });
        }

        return customer.toJSON();
      }).catch((err) => { throw err; });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async activateCustomer(customerId) {
    try {
      let customer = await this.findOne({ where: { customerId } });
      customer = await customer.update({ isActived: true });

      this.language = customer.language;

      let cart = await Cart.findOne({ where: { customerId } });
      const shoppingCart = await ShoppingCart.findAll({
        where: { cart_id: cart.cartId, buyNow: true },
        include: [{
          model: Product,
          as: 'product',
          attributes: ['name', 'description', 'price', 'discountedPrice', 'thumbnail', 'productId'],
        }],
      }).then(items => items.map((item) => {
        const { product } = item;
        product.thumbnail = `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/product_image/${product.thumbnail}`;
        return product;
      }));

      cart = { ...cart.toJSON(), shoppingCart };

      customer = customer.toJSON();

      delete customer.password;

      return { ...customer, cart };
    } catch (error) {
      throw error;
    }
  }

  async isValidCustomer(customerId) {
    const customer = await this.findOne({
      where: { customerId },
      attributes: ['isActived', 'isEnabled'],
    });

    return (customer.isActived && customer.isEnabled);
  }

  async signIn(email, password) {
    try {
      let customer = await this.findOne({ where: { email } });

      if (!customer) {
        throw new this
          .CustomError(this.LITERALS.getMessage(this.LITERALS.INVALID_CREDENTIALS), 401);
      }

      this.language = customer.language;

      const cartController = new CartController(undefined, customer.language);

      if (!customer.isActived) {
        throw new this.CustomError(this.LITERALS.getMessage(this.LITERALS.USER_NON_ACIVATED), 401);
      }

      if (!customer.isEnabled) {
        throw new this.CustomError(this.LITERALS.getMessage(this.LITERALS.USER_DISABLED), 401);
      }

      const isValid = await bcrypt.compare(String(password), customer.password);

      if (!isValid) {
        throw new this
          .CustomError(this.LITERALS.getMessage(this.LITERALS.INVALID_CREDENTIALS), 401);
      }

      const shoppingCart = await cartController.getCartByCustomerId(customer.customerId);

      customer = customer.toJSON();

      delete customer.password;

      return { ...customer, ...shoppingCart };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CustomerController;
