const knex = require("../database/knex/connection");
const AppError = require("../utils/AppError");
const DiskStorage = require('../providers/DiskStorage')

class DishesControllers {
  async create(req, res) {
    const { title, description, price, categories, ingredients } = req.body;

    const { filename: imageFileName } = req.file

    const diskStorage = new DiskStorage()

    const filename = await diskStorage.saveFile(imageFileName)

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
      image: filename
    });

    const ingredientsArray = ingredients.split(',')
    
    const ingredientInsert = ingredientsArray.map((ingredient) => {
      return {
        dish_id,
        name: ingredient,
      };
    });

    await knex("ingredients").insert(ingredientInsert);

    const categoriesArray = categories.split(',')

    const categoriesInsert = categoriesArray.map((category) => {
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
    
    const { filename: imageFileName } = req.file

    const diskStorage = new DiskStorage()

    const filename = await diskStorage.saveFile(imageFileName)

    if (!description || !title || !price || !categories || !ingredients) {
      throw new AppError("Todos os campos são obrigatórios", 400);
    }

    const plate = await knex("dishes").where({ id }).first();

    if (plate.image) {
      await diskStorage.deleteFile(plate.image)
    }

    plate.title = title ?? plate.title;
    plate.description = description ?? plate.description;
    plate.price = price ?? plate.price;
    plate.image = filename ?? plate.image

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

    await knex("dishes").where({ id }).update(plate);

    const ingredientsArray = ingredients.split(',')

    const ingredientsInsert = ingredientsArray.map((ingredient) => {
      return {
        dish_id: id,
        name: ingredient,
      };
    });

    await knex("ingredients").where({ dish_id: id }).delete();

    await knex("ingredients").where({ dish_id: id }).insert(ingredientsInsert);

    const categoriesArray = categories.split(',')

    const categoriesInsert = categoriesArray.map((category) => {
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
          plate.description = plate.description.substring(0, 60).concat("...");
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
    }

    if (ingredients) {
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

    if (!title && !ingredients) {
      const dishes = await knex("dishes").orderBy("title");

      dishes.map((dish) => {
        dish.description = dish.description.substring(0, 60).concat("...");
      });

      return res.status(200).json(dishes);
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
