const AppError = require('../utils/AppError')
const DiskStorage = require('../providers/DiskStorage') 
const knex = require('../database/knex/connection')

class DishImageControllers {
    async update(req, res) {
        const { id } = req.params
        const dishFileName = req.file.filename
        const diskStorage = new DiskStorage()

        const dish = await knex('dishes').where({ id }).first()

        if (!dish) {
            throw new AppError('Prato não encontrado', 404)
        }

        if (dish.image) {
            await diskStorage.deleteFile(dish.image)
        }

        const filename = await diskStorage.saveFile(dishFileName)
        dish.image = filename
        
        await knex('dishes').where({ id }).update(dish)

        return res.json(dish)
    }
}

module.exports = DishImageControllers