import { setSeederFactory } from 'typeorm-extension'
import { Order, OrderPriority, OrderStatus } from 'src/orders/order.entity'
import { fakerRU as faker } from '@faker-js/faker'

export default setSeederFactory(Order, () => {
  const order = new Order()

  const currentPriorityIdx = faker.number.int(2)
  const currentStatusIdx = faker.number.int(2)
  const orderPriorities: OrderPriority[] = Object.values(OrderPriority)
  const orderStatuses: OrderStatus[] = Object.values(OrderStatus)
  const orderBrand = faker.word.sample({
    length: {
      min: 5,
      max: 10,
    },
  })

  order.description = faker.lorem.paragraph(1)
  order.objectAddress = faker.location.streetAddress()
  order.brand = orderBrand[0].toLocaleUpperCase() + orderBrand.substring(1)
  order.cost = Number(faker.commerce.price({ min: 12550, max: 200000, dec: 0 }))
  order.priority = orderPriorities[currentPriorityIdx]
  order.status = orderStatuses[currentStatusIdx]
  order.deadline = faker.date.future()
  order.createdAt = faker.date.past()

  return order
})
