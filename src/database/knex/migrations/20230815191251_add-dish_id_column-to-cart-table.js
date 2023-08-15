exports.up = (knex) =>
  knex.schema.alterTable("cart", (table) => {
    table.integer("dish_id").references("id").inTable("dishes");
  });

exports.down = (knex) =>
  knex.schema.alterTable("cart", (table) => {
    table.dropColumn("dish_id");
  });
