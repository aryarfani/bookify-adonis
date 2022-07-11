import vendor from 'App/Models/vendor'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(vendor, ({ faker }) => {
  return {
    name: faker.name.firstName() + ' ' + faker.name.lastName(),
    email: faker.internet.email(),
    password: 'secret123',
  };
}).build()
