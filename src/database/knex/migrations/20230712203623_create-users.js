exports.up = knex => knex.schema.createTable('users', table => {
    table.increments('id')
    table.string('name', 30).notNullable()   
    table.string('email', 30).notNullable()   
    table.string('password', 30).notNullable()   
    table.string('city', 30)
    table.varchar('avatar')
    table.boolean('isAdmin').default(false)
    
    table.timestamp('created_at').default(knex.fn.now())
    table.timestamp('updated_at').default(knex.fn.now())
})


exports.down = knex => knex.schema.dropTable('users') 
  
