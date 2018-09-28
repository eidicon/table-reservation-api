
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('reservations', function (t) {
      t.varchar('orderUri').nullable()
    }),
    knex.schema.createTable('orders', function (t) {
      t.increments('id').primary()
      t.varchar('meals').notNull()
      t.dateTime('createdAt').notNull()
      t.dateTime('updatedAt').notNull()
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('reservations', function (t) {
      t.dropColumn('orderUri')
    }),
    knex.schema.dropTable('orders')
  ])
}
