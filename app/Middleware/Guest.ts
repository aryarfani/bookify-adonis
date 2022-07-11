import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Guest {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {

    if (auth.isLoggedIn) {
      response.redirect('/')
      return
    }

    await next()
  }
}
