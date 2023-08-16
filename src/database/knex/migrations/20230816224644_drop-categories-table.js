exports.up = (knex) => knex.schema.dropTable('categories')

exports.down = (knex) => knex.schema.createTable('categories', (table) => {
    table.increments('id')
    table.text('name')

    table.integer('dish_id').references('id').inTable('dishes').onDelete('CASCADE')
})
