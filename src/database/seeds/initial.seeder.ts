import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { DataSource } from 'typeorm'
import { User, UserRole } from 'src/users/user.entity'
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

    // Bulk generation of random user data.

    const userFactory = factoryManager.get(User)

    users.concat(await userFactory.saveMany(17))
  }
}
