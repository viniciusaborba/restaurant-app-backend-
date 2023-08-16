exports.up = (knex) => knex.schema.alterTable('dishes', (table) => {
    table.text('category')
})

exports.down = (knex) => knex.schema.alterTable('dishes', (table) => {
  table.dropColumn('category')
})
