import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, computed, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Product from './Product'

export default class Vendor extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public balance: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * ------------------------------------------------------
   * Hooks
   * ------------------------------------------------------
   */

  @beforeSave()
  public static async hashPassword(vendor: Vendor) {
    if (vendor.$dirty.password) {
      vendor.password = await Hash.make(vendor.password)
    }
  }

  /**
   * ------------------------------------------------------
   * Computed
   * ------------------------------------------------------
   */

  @computed({ serializeAs: 'avatar_url' })
  public get avatarUrl(): string {
    return `https://ui-avatars.com/api/?name=${this.name}`;
  }

  /**
   * ------------------------------------------------------
   * Relationships
   * ------------------------------------------------------
   */

  @hasMany(() => Product)
  public products: HasMany<typeof Product>
}
