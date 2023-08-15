exports.up = (knex) =>
  knex.schema.createTable("cart", (table) => {
    table.increments("id").primary();
    table.text("title").notNullable();
    table.integer("price").notNullable();
    table.integer("quantity").notNullable();
    table.text("image");
    table.integer("user_id").references("id").inTable("users");
  });

exports.down = (knex) => knex.schema.dropTable("cart");
