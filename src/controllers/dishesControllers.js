const knex = require('../database/knex/connection')

class DishesControllers {
    
    async create(req, res) {
        const { title, description, price, categories, ingredients } = req.body

        const dishAlreadyExists = await knex('dishes').where({ title }).first()

        if (dishAlreadyExists) {
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
            return res.status(400).json({ message: "Título já está em uso" })
        }

        await knex('dishes').where({ id }).first().update({ title, description, price })

        const ingredientsInsert = ingredients.map((ingredient) => {
            return {
                dish_id: id,
                name: ingredient
            }
        })

        await knex('ingredients').where({ dish_id: id }).delete()

        await knex('ingredients').where({ dish_id: id }).insert(ingredientsInsert)
        
        const categoriesInsert = categories.map((category) => {
            return {
                dish_id: id,
                name: category
            }
        })

        await knex('categories').where({ dish_id: id }).delete()
        await knex('categories').where({ dish_id: id }).insert(categoriesInsert)
        
        res.status(200).json({ message: 'Dados do prato atualizados com sucesso' })

    }

    async index(req, res) {
        const { title, ingredients } = req.query

        if ( title) {
            const plates = await knex('dishes').whereLike('title', `%${title}%`).orderBy('title')

            const dishesComponents =  await Promise.all(plates.map(async (plate) => {
            
                const ingredients = await knex('ingredients').where({ dish_id: plate.id })
                const categories = await knex('categories').where({ dish_id: plate.id })
    
                return { ...plate, ingredients, categories }
            }))
            
            return res.status(200).json(dishesComponents)
        
        } else {
            const ingredientsSearch = await knex('ingredients').whereLike('name', `%${ingredients}%`).orderBy('name')

            const ingredientsPlates = await Promise.all(ingredientsSearch.map(async (ingredient) => {
                const dishes = await knex('dishes').where({ id: ingredient.dish_id })

                return {  ...ingredient, dishes }

        }))
        
            return res.status(200).json(ingredientsPlates)
        }
    }

    async show(req, res) {
        const { id } = req.params

        const plateInformation = await knex('dishes').where({ id }).first()
        const ingredients = await knex('ingredients').where({ dish_id: id })
        const categories = await knex('categories').where({ dish_id: id })

        res.status(200).json({...plateInformation, ingredients, categories})
    }
        
}

module.exports = DishesControllers