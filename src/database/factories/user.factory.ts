import { setSeederFactory } from 'typeorm-extension'
import { User, UserRole } from 'src/users/user.entity'
import { fakerRU as faker } from '@faker-js/faker'

export default setSeederFactory(User, () => {
  const user = new User()

  const sex = faker.number.int(1) ? 'male' : 'female'
  const currentRoleIdx = faker.number.int(2)
  const userRoles: UserRole[] = Object.values(UserRole)

  user.login = faker.internet.userName()
  user.email = faker.internet.email()
  user.fullName = faker.person.fullName({ sex })
  user.role = userRoles[currentRoleIdx]
  user.password = faker.internet.password()

  return user
})
