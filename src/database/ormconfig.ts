import { config } from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm'
import { SeederOptions } from 'typeorm-extension'

config()

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/*.entity.js'],
  subscribers: ['dist/**/*.subscriber.js'],
  synchronize: false,
  migrations: ['dist/database/migrations/*.js'],
  factories: ['dist/database/factories/*.js'],
  seeds: ['dist/database/seeds/*.js'],
}

export default new DataSource(dataSourceOptions)
