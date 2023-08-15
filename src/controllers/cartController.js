const knex = require("../database/knex/connection");
const { z } = require("zod");

class CartController {
  async create(req, res) {
    const createCartBodySchema = z.object({
      title: z.string(),
      price: z.number(),
      quantity: z.number(),
      image: z.string(),
      dish_id: z.number(),
    });

    const { title, price, quantity, image, dish_id } =
      createCartBodySchema.parse(req.body);
    const user_id = req.user.id;

    const dishAlreadyInCart = await knex("cart").where({ title }).first();
    if (dishAlreadyInCart) {
      return res.status(400).json({
        error: "Dish already in cart!",
      });
    }

    await knex("cart").insert({
      title,
      price,
      quantity,
      image,
      user_id,
      dish_id,
    });

    return res.status(201).json({
      message: "Produto adicionado ao carrinho",
    });
  }

  async index(req, res) {
    const user_id = req.user.id;
    const cartItems = await knex("cart").where({ user_id }).orderBy("title");

    return res.status(200).json({
      cartItems,
    });
  }

  async show(req, res) {
    const user_id = req.user.id;
    const getRequestParamsSchema = z.object({ id: z.string() });
    const { id } = getRequestParamsSchema.parse(req.params);

    const cartItem = await knex("cart").where({ user_id, id }).first();
    return res.status(200).json({
      cartItem,
    });
  }

  async delete(req, res) {
    const getRequestParamsSchema = z.object({ id: z.string() });
    const { id } = getRequestParamsSchema.parse(req.params);

    await knex("cart")
      .where({ dish_id: Number(id) })
      .delete();
    return res.status(200).json({
      message: "Prato removido do carrinho!",
    });
  }
}

module.exports = CartController;
