import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import { string } from '@ioc:Adonis/Core/Helpers'
import Product from 'App/Models/Product';

export default class ProductsController {
  public async index({ request, response, auth }: HttpContextContract) {
    const page = request.input('page') || 1
    const products = await auth.user!.related('products').query().paginate(page);

    response.json(products.serialize())
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const payload = await request.validate({
      schema: schema.create({
        name: schema.string(),
        description: schema.string(),
        image: schema.file({
          size: '2mb',
          extnames: ['jpg', 'jpeg', 'png'],
        }) as any,
        stock: schema.number(),
        price: schema.number(),
      })
    })

    // Store image file and generate new image name
    const newFilename = `${Date.now()}-${string.generateRandom(5)}-${payload.image.clientName}`
    await payload.image.moveToDisk('./', { name: newFilename })

    payload.image = newFilename
    const product = await auth.user!.related('products').create(payload);

    response.status(201).send({
      'message': 'Product created',
      'product': product.serialize()
    })
  }

  public async show({ request, response }: HttpContextContract) {
    const product = await Product.query().where('id', request.param('id'));

    response.json(product)
  }

  public async update({ request, response }: HttpContextContract) {
    const payload = await request.validate({
      schema: schema.create({
        name: schema.string(),
        description: schema.string(),
        image: schema.file.nullableAndOptional({
          size: '2mb',
          extnames: ['jpg', 'jpeg', 'png'],
        }) as any,
        stock: schema.number(),
        price: schema.number(),
      })
    })

    let newFilename;
    if (request.file('image')) {
      // Store image file and generate new image name
      newFilename = `${Date.now()}-${string.generateRandom(5)}-${payload.image.clientName}`
      await payload.image.moveToDisk('./', { name: newFilename })
    }

    let product = await Product.findOrFail(request.param('id'))
    product = await product.merge({ ...payload, image: newFilename }).save()

    response.json({
      'message': 'Product updated',
      'product': product.serialize()
    })
  }

  public async destroy({ request, response }: HttpContextContract) {
    const product = await Product.findOrFail(request.param('id'))
    await product.delete()

    response.json({
      'message': 'Product deleted'
    })
  }
}
