import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('vendor_id').unsigned().references('vendors.id').onDelete('CASCADE')
      table.string('name')
      table.text('description')
      table.string('image')
      table.bigInteger('stock')
      table.bigInteger('price')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
