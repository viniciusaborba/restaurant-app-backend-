const knex = require('../database/knex/connection')

class DishesControllers {
    
    async create(req, res) {
        const { title, description, price, categories, ingredients } = req.body

        const alreadyExists = await knex('dishes').where({ title }).first()

        if (alreadyExists) {
            return res.status(400).json({ message: 'Este prato já está cadastrado' })
        }
        
        const [ dish_id ] = await knex('dishes').insert({ title, description, price })

        const ingredientInsert = ingredients.map((ingredient) => {
            return {
                dish_id,
                name: ingredient
            }
        })

        await knex('ingredients').insert(ingredientInsert)

        const categoriesInsert = categories.map((category) => {
            return {
                dish_id,
                name: category
            }
        })

        await knex('categories').insert(categoriesInsert)

        res.status(200).json({ message: 'Prato criado com sucesso' })

    }

    async delete(req, res) {
        const { id } = req.params

        await knex('dishes').where({ id }).delete()

        res.status(200).json({ message: 'Prato excluído com sucesso' })
    }

    async update(req, res) {
        
        const { title, description, price, categories, ingredients } = req.body
        const { id } = req.params

        const titleAlreadyUsed = await knex('dishes').where({ title }).first()

        if (titleAlreadyUsed) {
            res.status(400).json({ message: "Título já está em uso" })
        }

        await knex('dishes').where({ id }).first().update({ title, description, price })

        const ingredientsUpdate = ingredients.map((ingredient) => {
            return {
                name: ingredient
            }
        })

        await knex('ingredients').update(ingredientsUpdate)

        const categoriesUpdate = categories.map((category) => {
            return {
                name: category
            }
        })

        await knex('categories').update(categoriesUpdate)

        res.status(200).json({ message: 'Prato atualizado com sucesso' })

    }
}

module.exports = DishesControllers