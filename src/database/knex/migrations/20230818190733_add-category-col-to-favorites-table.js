exports.up = (knex) =>
  knex.schema.alterTable("favorites", (table) => {
    table.text("category");
  });

exports.down = (knex) =>
  knex.schema.alterTable("favorites", (table) => {
    table.dropColumn("category");
  });
