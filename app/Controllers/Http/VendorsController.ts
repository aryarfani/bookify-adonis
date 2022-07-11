import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Vendor from 'App/Models/Vendor';

export default class VendorsController {
  public async index({ response }: HttpContextContract) {
    const vendors = await Vendor.all();
    const vendorsJson = vendors.map(e => e.serialize());
    response.json(vendorsJson)
  }

  public async register({ request, response }: HttpContextContract) {
    const payload = await request.validate({
      schema: schema.create({
        name: schema.string(),
        email: schema.string([
          rules.email(),
          rules.unique({ table: 'vendors', column: 'email' }),
        ]),
        password: schema.string([
          rules.minLength(6),
        ]),
      })
    });

    const vendor = await Vendor.create(payload)

    response.status(201).send(vendor)
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const payload = await request.validate({
      schema: schema.create({
        email: schema.string([rules.required()]),
        password: schema.string([rules.required()]),
      })
    });

    const token = await auth.use('api').attempt(payload.email, payload.password)

    response.json({
      'message': 'Login successful',
      'token': token.token
    })
  }

  public async update({ request, response, auth }: HttpContextContract) {
    const payload = await request.validate({
      schema: schema.create({
        name: schema.string.nullableAndOptional(),
        email: schema.string.nullableAndOptional([
          rules.email(),
          rules.unique({ table: 'vendors', column: 'email', whereNot: { id: auth.user!.id } }),
        ]),
        password: schema.string.nullableAndOptional([rules.minLength(6)]),
      })
    })

    await Vendor.query().where('id', auth.user!.id).update(payload);

    response.json({
      'message': 'Update successful'
    })
  }

  public async me({ response, auth }: HttpContextContract) {
    response.json({
      'message': 'Get me successful',
      'vendor': auth.user!.serialize()
    })
  }
}
