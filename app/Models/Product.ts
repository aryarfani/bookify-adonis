import { afterFetch, BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import Drive from '@ioc:Adonis/Core/Drive'
import { DateTime } from 'luxon'
import Vendor from './Vendor'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public vendorId: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public image: string

  @column()
  public stock: number

  @column()
  public price: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * ------------------------------------------------------
   * Relationships
   * ------------------------------------------------------
   */

  @belongsTo(() => Vendor)
  public vendor: BelongsTo<typeof Vendor>

  /**
   * ------------------------------------------------------
   * Hooks
   * ------------------------------------------------------
   */

  @computed()
  public image_url: String;

  @afterFetch()
  public static async getImageUrl(products: Product[]) {
    await Promise.all(products.map(async (product) => {
      product.image_url = await Drive.getUrl(product.image)
    }))
  }
}
