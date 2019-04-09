/* eslint-disable class-methods-use-this */
const Handler = require('../Handler');
const Cart = require('../../models/Cart');
const ShoppingCart = require('../../models/ShoppingCart');
const Product = require('../../models/Product');

class CartController extends Handler {
  constructor(model = Cart, language) {
    super(model, language);

    this.getCartById = this.getCartById.bind(this);
    this.addProduct = this.addProduct.bind(this);
    this.getCartByCustomerId = this.getCartByCustomerId.bind(this);
    this.getShoppingCartByCartId = this.getShoppingCartByCartId.bind(this);
  }

  async getShoppingCartByCartId(cartId, transaction) {
    const shoppingCart = await ShoppingCart.findAll({
      where: { cartId, buyNow: true },
      attributes: ['itemId', 'quantity', 'productId', 'attributes'],
      include: [{
        model: Product,
        as: 'product',
        attributes: ['name', 'description', 'price', 'discountedPrice', 'thumbnail', 'image', 'image2', 'productId'],
        raw: true,
      }],
      transaction,
    });

    const items = [];

    for (let i = 0; i < shoppingCart.length; i += 1) {
      const item = shoppingCart[i].toJSON();

      const { product } = item;
      product.thumbnail = `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/product_image/${product.thumbnail}`;
      product.image = `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/product_image/${product.image}`;
      product.image2 = `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/product_image/${product.image2}`;

      item.attributes = JSON.parse(item.attributes);

      const colorsAvailable = await Product.getAttributesAvailable(item.product.productId, 'Color');

      const sizeAvailable = await Product.getAttributesAvailable(item.product.productId, 'Size');
      item.colorsAvailable = colorsAvailable;
      item.sizeAvailable = sizeAvailable;

      items.push(item);
    }

    return items;
  }

  async getCartById(cartId, customerId) {
    let cart = await this.findOne({ where: { cartId } });

    if (!cart) {
      throw new this.CustomError(this.getMessage(this.LITERALS.NOT_FOUND), 403);
    }

    if ((cart.customerId && !customerId) || (cart.customerId && (cart.customerId !== customerId))) {
      throw new this.CustomError(this.getMessage(this.LITERALS.CART_BELONGS_OTHER_USER), 401);
    }

    if (!cart.customerId && customerId) {
      cart = await this.findOne({ where: { customerId } });
    }

    const items = await this.getShoppingCartByCartId(cart.cartId);

    return { ...cart.toJSON(), shoppingCart: items };
  }

  async getCartByCustomerId(customerId) {
    try {
      const cart = await this.findOne({ where: { customerId } });

      if (!cart) {
        throw new this.CustomError(this.getMessage(this.LITERALS.NOT_FOUND), 403);
      }

      const items = await this.getShoppingCartByCartId(cart.cartId);

      return { ...cart.toJSON(), shoppingCart: items };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add product to shopping cart
   * @param {Object} { productId, data, cartId, customerId }
   * return cart and shopping cart items
   */
  async addProduct({
    productId, data, cartId, customerId,
  }) {
    // Data is required
    if (!data) {
      throw new this.CustomError(this.getMessage(this.LITERALS.SHOPPING_CART_DATA_NEEDIT), 403);
    }

    data.attributes = data.attributes ? JSON.stringify(data.attributes) : '{}';

    // productId is required
    if (!productId) {
      throw new this.CustomError(this.getMessage(this.LITERALS.PRODUCT_ID_NEEDIT), 403);
    }

    // create a cart undefined
    let cart;

    /** NEXT STEPS ASSIGN VALUE TO cart depends on customerId or cartId */

    // if customer id exist find cart by customer id
    if (customerId) {
      cart = await this.findOne({ where: { customer_id: customerId } });

      if (!cart) {
        throw new this.CustomError(this.getMessage(this.LITERALS.NOT_FOUND), 500);
      }
    }

    // if cart id exist find cart by cart id
    if (!customerId && cartId) {
      // This cart must have not customer id
      cart = await this.findOne({ where: { cartId } });

      // If this cart have customer id thats mean that cart have other owner
      // For that reason must create a new one
      if (cart.customerId) {
        cart = await this.create({
          createdAt: new Date(),
          isEnabled: true,
          customerId,
        });
      }
    }

    // If there are not cartId and customerId, it's important created a new cart with no onwer
    if (!cart) {
      cart = await this.create({
        createdAt: new Date(),
        isEnabled: true,
      });
    }

    // Create a shoppingCart item
    await ShoppingCart.create({
      ...data, productId, cartId: cart.cartId, addedOn: new Date(),
    });

    // Shopping cart formated
    const items = await this.getShoppingCartByCartId(cart.cartId);
    return { ...cart.toJSON(), shoppingCart: items };
  }
}

module.exports = CartController;
