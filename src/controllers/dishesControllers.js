const knex = require("../database/knex/connection");
const AppError = require("../utils/AppError");

class DishesControllers {
  async create(req, res) {
    const { title, description, price, categories, ingredients } = req.body;

    if (!description || !title || !price || !categories || !ingredients) {
      throw new AppError("Todos os campos são obrigatórios!", 400);
    }

    const titleLength = title.length > 40;
    const descriptionLength = description.length > 240;

    const dishAlreadyExists = await knex("dishes").where({ title }).first();

    const priceIsNaN = isNaN(price);

    if (priceIsNaN) {
      throw new AppError("Preço deve ser número", 400);
    }

    if (dishAlreadyExists) {
      throw new AppError("Prato já existente", 400);
    }

    if (titleLength) {
      throw new AppError("Título muito longo! Máximo de 40 caracteres", 400);
    }

    if (descriptionLength) {
      throw new AppError(
        "Descrição muito longa! Máxima de 240 caracteres",
        400
      );
    }

    const [dish_id] = await knex("dishes").insert({
      title,
      description,
      price,
    });

    const ingredientInsert = ingredients.map((ingredient) => {
      return {
        dish_id,
        name: ingredient,
      };
    });

    await knex("ingredients").insert(ingredientInsert);

    const categoriesInsert = categories.map((category) => {
      return {
        dish_id,
        name: category,
      };
    });

    await knex("categories").insert(categoriesInsert);

    res.status(200).json({ message: "Prato criado com sucesso" });
  }

  async delete(req, res) {
    const { id } = req.params;
    const plateExists = await knex("dishes").where({ id }).first();

    if (!plateExists) {
      throw new AppError("Prato inexistente", 404);
    }

    await knex("dishes").where({ id }).delete();

    res.status(200).json({ message: "Prato excluído com sucesso" });
  }

  async update(req, res) {
    const { title, description, price, categories, ingredients } = req.body;
    const { id } = req.params;

    if (!description || !title || !price || !categories || !ingredients) {
      throw new AppError("Todos os campos são obrigatórios", 400);
    }

    const plate = await knex("dishes").where({ id }).first();

    const titleAlreadyUsed = await knex("dishes").where({ title }).first();

    const titleLength = title.length > 40;
    const descriptionLength = description.length > 240;
    const priceIsNaN = isNaN(price);

    if (priceIsNaN) {
      throw new AppError("Preço deve ser número", 400);
    }

    if (titleLength) {
      throw new AppError("Título muito longo! Máximo de 40 caracteres", 400);
    }

    if (descriptionLength) {
      throw new AppError(
        "Descrição muito longa! Máxima de 240 caracteres",
        400
      );
    }

    if (titleAlreadyUsed) {
      throw new AppError("O título já está em uso", 400);
    }

    await knex("dishes").where({ id }).first().update(plate);

    const ingredientsInsert = ingredients.map((ingredient) => {
      return {
        dish_id: id,
        name: ingredient,
      };
    });

    await knex("ingredients").where({ dish_id: id }).delete();

    await knex("ingredients").where({ dish_id: id }).insert(ingredientsInsert);

    const categoriesInsert = categories.map((category) => {
      return {
        dish_id: id,
        name: category,
      };
    });

    await knex("categories").where({ dish_id: id }).delete();
    await knex("categories").where({ dish_id: id }).insert(categoriesInsert);

    res.status(200).json({ message: "Dados do prato atualizados com sucesso" });
  }

  async index(req, res) {
    const { title, ingredients } = req.query;

    if (title) {
      const plates = await knex("dishes")
        .whereLike("title", `%${title}%`)
        .orderBy("title");

      if (!plates) {
        throw new Error(`Nenhum prato encontrado para o título ${title}`, 400);
      }

      const dishesComponents = await Promise.all(
        plates.map(async (plate) => {
          const ingredients = await knex("ingredients").where({
            dish_id: plate.id,
          });
          const categories = await knex("categories").where({
            dish_id: plate.id,
          });

          return { ...plate, ingredients, categories };
        })
      );

      return res.status(200).json(dishesComponents);
    } else {
      const ingredientsSearch = await knex("ingredients")
        .whereLike("name", `%${ingredients}%`)
        .orderBy("name");

      const ingredientsPlates = await Promise.all(
        ingredientsSearch.map(async (ingredient) => {
          const dishes = await knex("dishes").where({ id: ingredient.dish_id });

          return { ...ingredient, dishes };
        })
      );

      return res.status(200).json(ingredientsPlates);
    }
  }

  async show(req, res) {
    const { id } = req.params;

    const plateInformation = await knex("dishes").where({ id }).first();
    const ingredients = await knex("ingredients").where({ dish_id: id });
    const categories = await knex("categories").where({ dish_id: id });

    if (!plateInformation) {
      throw new AppError("Prato inexistente", 404);
    }

    res.status(200).json({ ...plateInformation, ingredients, categories });
  }
}

module.exports = DishesControllers;
