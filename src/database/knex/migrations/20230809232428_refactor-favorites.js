exports.up = knex => knex.schema.alterTable('favorites', table => {
    table.integer('dish_id').references('id').inTable('dishes').onDelete('CASCADE')
})

exports.down = knex => knex.schema.dropTable('favorites')
