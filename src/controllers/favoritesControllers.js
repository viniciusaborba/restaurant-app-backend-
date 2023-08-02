const knex = require('../database/knex/connection')
const AppError = require('../utils/AppError')

class FavoritesControllers {
    async create(req, res) {
        const user_id = req.user.id
        
        const { name } = req.body

        const alreadyExists = await knex('favorites').where({ name }).first()
        
        if (alreadyExists) {
            await knex('favorites').where({ name }).delete()
            return res.status(200).json({message: 'Este prato já existe!'})
        }
        
        if (!name) {
            throw new AppError("Name is required", 400);
        }

        await knex('favorites').insert({ name, user_id })
        
        return res.status(201).json({'message': 'Favorite created successfully' });
    }

    async index(req, res) {
        const user_id = req.user.id

        const favoriteList = await knex('favorites').where({ user_id })

        return res.status(200).json(favoriteList)
    }

    async delete(req,res) {
        const { id } = req.params

        if (!id) {
            throw new AppError("Prato não encontrado.", 404)
        }
        
        await knex('favorites').where({ id }).delete()

        return res.status(200).json({ message: 'Excluído com sucesso' })
    }
}

module.exports = FavoritesControllers