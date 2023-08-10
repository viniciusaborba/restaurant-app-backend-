exports.up = knex => knex.schema.createTable('favorites', table => {
    table.increments('id')
    table.string('name', 30)
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.integer('dish_id').references('id').inTable('dishes').onDelete('CASCADE')
    table.text('imageUrl')
})

exports.down = knex => knex.schema.dropTable('favorites')
