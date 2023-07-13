const { hash, compare } = require('bcryptjs')
const knex = require('../database/knex/connection')

class UserController {
    
    async create(req, res) {
        const { name, email, password, city  } = req.body
        
        const alreadyExists = await knex('users').where({ email }).first()
        if (alreadyExists) {
            return res.status(400).json({ message: 'Este email já está em uso' })
        }
        
        const hashed = await hash(password, 8)
        await knex('users').insert({ name, email, password: hashed, city })

        res.status(201).json({ message: 'Conta criada com sucesso' })
    }

    async delete(req, res) {
        const { id } = req.params
        
        await knex('users').where({ id }).delete()

        res.status(200).json({ message: 'Conta excluída com sucesso' })
    }

    async index(req, res) {
        const user = await knex('users').orderBy('name')

        return res.status(200).json(user)
    }

    async update(req, res) {
        const { name, email, password, oldPassword} = req.body
        const { id } = req.params

        const user = await knex('users').where({ id }).first()
        const matchPassword = await compare(oldPassword, user.password)

        if(!matchPassword) {
            return res.status(400).json({ message: 'A senha antiga não confere' })
        }

        const hashed = await hash(password, 8)

        await knex('users').where({ id }).update({ name, email, password: hashed })

        res.status(200).json({ message: 'Dados atualizados com sucesso' })

    }
}

module.exports = UserController