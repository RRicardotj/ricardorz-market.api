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
    this.getProductsInCart = this.getProductsInCart.bind(this);
  }

  async getCartById(cartId, customerId) {
    let cart = await this.findOne({ where: { cart_id: cartId } });

    if (!cart) {
      throw new this.CustomError(this.getMessage(this.LITERALS.NOT_FOUND), 403);
    }

    if ((cart.customerId && !customerId) || (cart.customerId && (cart.customerId !== customerId))) {
      throw new this.CustomError(this.getMessage(this.LITERALS.CART_BELONGS_OTHER_USER), 401);
    }

    if (!cart.customerId && customerId) {
      cart = await this.findOne({ where: { customer_id: customerId } });
      const shoppingCart = await ShoppingCart.findAll({
        where: { cart_id: cart.cartId },
        attributes: ['itemId', 'quantity', 'productId', 'attributes'],
        include: [{
          model: Product,
          as: 'product',
          attributes: ['name', 'description', 'price', 'discountedPrice', 'thumbnail', 'image', 'image2', 'productId'],
          raw: true,
        }],
      });

      const items = [];

      for (let i = 0; i < shoppingCart.length; i += 1) {
        const item = shoppingCart[i].toJSON();

        const { product } = item;
        product.thumbnail = `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/product_image/${product.thumbnail}`;
        product.image = `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/product_image/${product.image}`;
        product.image2 = `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/product_image/${product.image2}`;

        item.attributes = JSON.parse(item.attributes);

        const colorsAvealibles = await Product.getAttributesAvealible(item.product.productId, 'Color');
        console.log(colorsAvealibles);

        const sizeAvealibles = await Product.getAttributesAvealible(item.product.productId, 'Size');
        item.colorsAvealibles = colorsAvealibles;
        item.sizeAvealibles = sizeAvealibles;

        items.push(item);
      }

      return { ...cart.toJSON(), shoppingCart: items };
    }

    const shoppingCart = await ShoppingCart.findAll({
      where: { cart_id: cart.cartId },
      attributes: ['itemId', 'quantity', 'productId', 'attributes'],
      include: [{
        model: Product,
        as: 'product',
        attributes: ['name', 'description', 'price', 'discountedPrice', 'thumbnail', 'image', 'image2', 'productId'],
        raw: true,
      }],
    });

    const items = [];

    for (let i = 0; i < shoppingCart.length; i += 1) {
      const item = shoppingCart[i].toJSON();

      const { product } = item;
      product.thumbnail = `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/product_image/${product.thumbnail}`;
      product.image = `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/product_image/${product.image}`;
      product.image2 = `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/product_image/${product.image2}`;

      item.attributes = JSON.parse(item.attributes);

      const colorsAvealibles = await Product.getAttributesAvealible(item.product.productId, 'Color');
      console.log(colorsAvealibles);

      const sizeAvealibles = await Product.getAttributesAvealible(item.product.productId, 'Size');
      item.colorsAvealibles = colorsAvealibles;
      item.sizeAvealibles = sizeAvealibles;

      items.push(item);
    }

    return { ...cart.toJSON(), shoppingCart: items };
  }

  async getCartByCustomerId(customerId) {
    try {
      const cart = await this.findOne({ where: { customerId } });

      if (!cart) {
        throw new this.CustomError(this.getMessage(this.LITERALS.NOT_FOUND), 403);
      }

      const shoppingCart = await ShoppingCart.findAll({
        where: { cart_id: cart.cartId },
        attributes: ['itemId', 'quantity', 'productId', 'attributes'],
        include: [{
          model: Product,
          as: 'product',
          attributes: ['name', 'description', 'price', 'discountedPrice', 'thumbnail', 'image', 'image2', 'productId'],
          raw: true,
        }],
      });

      const items = [];

      for (let i = 0; i < shoppingCart.length; i += 1) {
        const item = shoppingCart[i].toJSON();

        const { product } = item;
        product.thumbnail = `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/product_image/${product.thumbnail}`;
        product.image = `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/product_image/${product.image}`;
        product.image2 = `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/product_image/${product.image2}`;

        item.attributes = JSON.parse(item.attributes);

        const colorsAvealibles = await Product.getAttributesAvealible(item.product.productId, 'Color');
        console.log(colorsAvealibles);

        const sizeAvealibles = await Product.getAttributesAvealible(item.product.productId, 'Size');
        item.colorsAvealibles = colorsAvealibles;
        item.sizeAvealibles = sizeAvealibles;

        items.push(item);
      }

      return { ...cart.toJSON(), shoppingCart: items };
    } catch (error) {
      throw error;
    }
  }

  async addProduct({
    productId, data, cartId, customerId,
  }) {
    console.log(productId, data, cartId, customerId);
    if (!data) {
      throw new this.CustomError(this.getMessage(this.LITERALS.SHOPPING_CART_DATA_NEEDIT), 403);
    }

    data.attributes = data.attributes ? JSON.stringify(data.attributes) : '{}';

    if (!productId) {
      throw new this.CustomError(this.getMessage(this.LITERALS.PRODUCT_ID_NEEDIT), 403);
    }

    if (customerId) {
      const cart = await this.findOne({ where: { customer_id: customerId } });

      if (!cart) {
        throw new this.CustomError(this.getMessage(this.LITERALS.NOT_FOUND), 500);
      }

      let shoppingCart = await ShoppingCart.findOne({
        where: { cart_id: cart.cartId, product_id: productId },
        include: [{
          model: Product,
          as: 'product',
          attributes: ['name', 'description', 'price', 'discountedPrice', 'thumbnail', 'productId'],
        }],
      });

      if (shoppingCart) {
        shoppingCart = await shoppingCart.update(data);
      } else {
        await ShoppingCart.create({
          ...data, productId, cartId: cart.cartId, addedOn: new Date(),
        });
      }

      shoppingCart = await ShoppingCart.findAll({
        where: { cart_id: cart.cartId },
        include: [{
          model: Product,
          as: 'product',
          attributes: ['name', 'description', 'price', 'discountedPrice', 'thumbnail', 'productId'],
        }],
      }).then(items => items.map((item) => {
        const { product } = item;
        product.thumbnail = `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/product_image/${product.thumbnail}`;
        return item;
      }));
      return { ...cart.toJSON(), shoppingCart };
    }

    if (cartId) {
      let cart = await this.findOne({ where: { cart_id: cartId } });

      if (cart.customer_id) {
        cart = await this.create({
          createdAt: new Date(),
          isEnabled: true,
        });

        await ShoppingCart.create({
          ...data, productId, cartId: cart.cartId, addedOn: new Date(),
        });
      } else {
        let shoppingCart = await ShoppingCart.findOne({
          where: { cart_id: cart.cartId, product_id: productId },
          include: [{
            model: Product,
            as: 'product',
            attributes: ['name', 'description', 'price', 'discountedPrice', 'thumbnail', 'productId'],
          }],
        });

        if (shoppingCart) {
          shoppingCart = await shoppingCart.update(data);
        } else {
          await ShoppingCart.create({
            ...data, productId, cartId: cart.cartId, addedOn: new Date(),
          });
        }

        shoppingCart = await ShoppingCart.findAll({
          where: { cart_id: cart.cartId },
          include: [{
            model: Product,
            as: 'product',
            attributes: ['name', 'description', 'price', 'discountedPrice', 'thumbnail', 'productId'],
          }],
        }).then(items => items.map((item) => {
          const { product } = item;
          product.thumbnail = `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/product_image/${product.thumbnail}`;
          return item;
        }));
        return { ...cart.toJSON(), shoppingCart };
      }
    }

    const cart = await this.create({
      createdAt: new Date(),
      isEnabled: true,
    });

    await ShoppingCart.create({
      ...data, productId, cartId: cart.cartId, addedOn: new Date(),
    });

    const shoppingCart = await ShoppingCart.findAll({
      where: { cart_id: cart.cartId },
      include: [{
        model: Product,
        as: 'product',
        attributes: ['name', 'description', 'price', 'discountedPrice', 'thumbnail', 'productId'],
      }],
    }).then(items => items.map((item) => {
      const { product } = item;
      product.thumbnail = `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/product_image/${product.thumbnail}`;
      return item;
    }));
    return { ...cart.toJSON(), shoppingCart };
  }

  async getProductsInCart(cartId) {
    const shoppingCart = await ShoppingCart.findAll({
      where: { cart_id: cartId },
      attributes: ['itemId', 'quantity', 'productId', 'attributes'],
      include: [{
        model: Product,
        as: 'product',
        attributes: ['name', 'description', 'price', 'discountedPrice', 'thumbnail', 'image', 'image2', 'productId'],
        raw: true,
      }],
    });

    const items = [];

    for (let i = 0; i < shoppingCart.length; i += 1) {
      const item = shoppingCart[i].toJSON();

      const { product } = item;
      product.thumbnail = `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/product_image/${product.thumbnail}`;
      product.image = `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/product_image/${product.image}`;
      product.image2 = `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/product_image/${product.image2}`;

      item.attributes = JSON.parse(item.attributes);

      const colorsAvealibles = await Product.getAttributesAvealible(item.product.productId, 'Color');
      console.log(colorsAvealibles);

      const sizeAvealibles = await Product.getAttributesAvealible(item.product.productId, 'Size');
      item.colorsAvealibles = colorsAvealibles;
      item.sizeAvealibles = sizeAvealibles;

      items.push(item);
    }

    return items;
  }
}

module.exports = CartController;
