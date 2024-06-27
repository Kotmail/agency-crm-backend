import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { DataSource } from 'typeorm'
import { User, UserRole } from 'src/users/user.entity'
import { Order } from 'src/orders/order.entity'
import { fakerRU as faker } from '@faker-js/faker'

export default class InitialSeeder implements Seeder {
  public groupUsersByRole(users: User[]): Partial<Record<UserRole, User[]>> {
    return users.reduce((acc, user) => {
      const role = user.role

      if (acc[role]) {
        acc[role].push(user)
      } else {
        acc[role] = [user]
      }

      return acc
    }, {})
  }

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    // Cleaning tables before seeding.

    dataSource.query('TRUNCATE "orders", "users" RESTART IDENTITY CASCADE;')

    // Creating specific base users.

    const usersRepository = dataSource.getRepository(User)
    const ordersRepository = dataSource.getRepository(Order)

    const baseUsersData: Partial<User>[] = [
      {
        login: 'admin-login',
        email: 'admin@example.com',
        firstName: faker.person.firstName('male'),
        lastName: faker.person.lastName('male'),
        role: UserRole.ADMIN,
        password: 'adminDemoPassword',
      },
      {
        login: 'manager-login',
        email: 'manager@example.com',
        firstName: faker.person.firstName('female'),
        lastName: faker.person.lastName('female'),
        role: UserRole.MANAGER,
        password: 'managerDemoPassword',
      },
      {
        login: 'executor-login',
        email: 'executor@example.com',
        firstName: faker.person.firstName('male'),
        lastName: faker.person.lastName('male'),
        password: 'executorDemoPassword',
      },
    ]

    const users = await usersRepository.save(baseUsersData)

    // Bulk generation of random orders and user data.

    const userFactory = factoryManager.get(User)
    const orderFactory = factoryManager.get(Order)

    const mergedUsers = users.concat(await userFactory.saveMany(17))
    const groupedUsersByRole = this.groupUsersByRole(mergedUsers)

    const orders = await Promise.all(
      Array(50)
        .fill('')
        .map(
          async () =>
            await orderFactory.make({
              creator: faker.helpers.arrayElement(groupedUsersByRole.manager),
              executor: faker.helpers.arrayElement(groupedUsersByRole.executor),
            }),
        ),
    )

    await ordersRepository.save(orders)
  }
}
