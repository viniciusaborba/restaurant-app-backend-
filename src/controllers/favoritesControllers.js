const knex = require("../database/knex/connection");
const AppError = require("../utils/AppError");

class FavoritesControllers {
  async create(req, res) {
    const user_id = req.user.id;

    const { title, image, category, id } = req.body;

    const alreadyExists = await knex("favorites")
      .where({ name: title })
      .first();

    if (alreadyExists) {
      await knex("favorites").where({ name: title }).delete();
      return res.status(200).json({ message: "Este prato já existe!" });
    }

    await knex("favorites").insert({
      name: title,
      category,
      imageUrl: image,
      dish_id: id,
      user_id,
    });

    return res.status(201).json({ message: "Favorite created successfully" });
  }

  async index(req, res) {
    const user_id = req.user.id;

    const favoriteList = await knex("favorites").where({ user_id });

    return res.status(200).json(favoriteList);
  }

  async delete(req, res) {
    const { name } = req.query;

    if (!name) {
      throw new AppError("Prato não encontrado.", 404);
    }

    await knex("favorites").where({ name }).delete();

    return res.status(200).json({ message: "Excluído com sucesso" });
  }

  async check(req, res) {
    const { name } = req.query;
    const favoriteDishExists = await knex("favorites").where({ name }).first();

    if (favoriteDishExists) {
      return res.json({ isFavorite: true });
    } else {
      return res.json({ isFavorite: false });
    }
  }
}

module.exports = FavoritesControllers;
