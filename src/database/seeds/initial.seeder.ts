import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { DataSource } from 'typeorm'
import { User, UserRole } from 'src/users/user.entity'
import { Order } from 'src/orders/order.entity'
import { faker } from '@faker-js/faker'

export default class InitialSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    // Creating specific base users.

    const usersRepository = dataSource.getRepository(User)

    const baseUsersData: Partial<User>[] = [
      {
        login: 'admin-login',
        email: 'admin@example.com',
        fullName: 'Сомов Кирилл Михайлович',
        role: UserRole.ADMIN,
        password: 'adminDemoPassword',
      },
      {
        login: 'manager-login',
        email: 'manager@example.com',
        fullName: 'Белякова Ксения Данииловна',
        role: UserRole.MANAGER,
        password: 'managerDemoPassword',
      },
      {
        login: 'executor-login',
        email: 'executor@example.com',
        fullName: 'Максимов Глеб Павлович',
        password: 'executorDemoPassword',
      },
    ]

    const users = await usersRepository.save(baseUsersData)

    // Bulk generation of random orders and user data.

    const userFactory = factoryManager.get(User)
    const orderFactory = factoryManager.get(Order)

    users.concat(...(await userFactory.saveMany(17)))

    const managers = users.filter((user) => user.role === UserRole.MANAGER)
    const executors = users.filter((user) => user.role === UserRole.EXECUTOR)

    const orders = await Promise.all(
      Array(50)
        .fill('')
        .map(
          async () =>
            await orderFactory.make({
              creator: faker.helpers.arrayElement(managers),
              executor: faker.helpers.arrayElement(executors),
            }),
        ),
    )

    const ordersRepository = dataSource.getRepository(Order)

    await ordersRepository.save(orders)
  }
}
