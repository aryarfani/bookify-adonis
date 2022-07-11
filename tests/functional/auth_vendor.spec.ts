import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import VendorFactory from 'Database/factories/VendorFactory'
import Vendor from 'App/Models/Vendor'


test.group('Auth vendor', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })


  test('vendor can register account', async ({ client, assert }) => {
    const vendorForm = {
      name: 'Vendor',
      email: 'vendor@gmail.com',
      password: 'secret123',
    };

    const response = await client.post('api/vendors/register').form(vendorForm)
    response.assertStatus(201)

    const user = await Vendor.findBy('email', vendorForm.email)
    assert.isNotNull(user)
  })

  test('vendor can login account', async ({ client, assert }) => {
    const vendor = await VendorFactory.create();

    const response = await client.post('api/vendors/login').form({
      email: vendor.email,
      password: 'secret123',
    })

    response.assertStatus(200)
    assert.anyProperties(response.body(), ['token'])
  })

  test('vendor can update account', async ({ client, assert }) => {
    const vendor = await VendorFactory.create();

    const response = await client.put('api/vendors/update').form({
      name: 'Vendor',
      email: 'vendor@gmail.com',
    }).header('Accept', 'application/json')
      .guard('api')
      .loginAs(vendor as never) // need the right way to do this

    response.assertStatus(200)

    const newVendor = await Vendor.findOrFail(vendor.id)
    assert.equal(newVendor.name, 'Vendor')
    assert.equal(newVendor.email, 'vendor@gmail.com')
  })

  test('vendor can not get current user without token', async ({ client }) => {
    const response = await client.get('api/vendors/me')
      .header('Accept', 'application/json')

    response.assertStatus(401)
  })

  test('vendor can get current user', async ({ client, assert }) => {
    const vendor = await VendorFactory.create();

    const response = await client.get('api/vendors/me')
      .header('Accept', 'application/json')
      .guard('api')
      .loginAs(vendor as never) // need the right way to do this

    response.assertStatus(200)
    assert.anyProperties(response.body(), ['message', 'vendor'])
  })
})
