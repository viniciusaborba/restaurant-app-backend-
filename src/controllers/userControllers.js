const { hash, compare } = require("bcryptjs");
const knex = require("../database/knex/connection");
const AppError = require("../utils/AppError");

class UserController {
  async create(req, res) {
    const { name, email, password, city, isAdmin } = req.body;

    const alreadyExists = await knex("users").where({ email }).first();
    if (alreadyExists) {
      throw new AppError("Este email já está em uso", 401);
    }

    const validationPasswordLength =
      password.length <= 8 || password.length > 30;

    if (validationPasswordLength) {
      throw new AppError(
        "Senha deve ter no mínimo 8 caracteres e, no máximo, 30 caracteres",
        401
      );
    }

    const hashed = await hash(password, 8);
    await knex("users").insert({
      name,
      email,
      password: hashed,
      city,
      isAdmin,
    });

    res.status(201).json({ message: "Conta criada com sucesso" });
  }

  async delete(req, res) {
    const user_id = req.user.id;

    const user = await knex("users").where({ id: user_id }).first();

    if (!user) {
      throw new AppError("Usuário inexistente", 404);
    }

    await knex("users").where({ id: user_id }).delete();

    res.status(200).json({ message: "Conta excluída com sucesso" });
  }

  async index(req, res) {
    const user = await knex("users").orderBy("name");

    return res.status(200).json(user);
  }

  async update(req, res) {
    const { name, email, newPassword, oldPassword, city } = req.body;
    const user_id = req.user.id;

    const user = await knex("users").where({ id: user_id }).first();
    const matchPassword = await compare(oldPassword, user.password);
    const passwordAlreadyBeingUsed = await compare(newPassword, user.password);

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.city = city ?? user.city;

    if (!matchPassword) {
      throw new AppError("Senha antiga incorreta", 403);
    }

    if (email) {
      const isEmailInUse = await knex("users").where({ email }).first();

      if (isEmailInUse) {
        throw new AppError(`E-mail ${email} já está em uso`, 401);
      }
    }

    if (passwordAlreadyBeingUsed) {
      throw new AppError("Nova senha não pode ser igual à anterior!", 400);
    }

    user.password = await hash(newPassword, 8);

    await knex("users").where({ id: user_id }).update(user);

    res.status(200).json({ message: "Dados atualizados com sucesso" });
  }
}

module.exports = UserController;
