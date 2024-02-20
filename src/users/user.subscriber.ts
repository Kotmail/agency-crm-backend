import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm'
import { User } from './user.entity'
import { hash } from 'bcrypt'

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User
  }

  beforeInsert(event: InsertEvent<User>): Promise<void> {
    return this.hashPassword(event.entity)
  }

  beforeUpdate(event: UpdateEvent<User>): Promise<void> {
    return this.hashPassword(event.entity)
  }

  async hashPassword(entity: Partial<User>) {
    if (entity.password) {
      entity.password = await hash(entity.password, 5)
    }
  }
}
