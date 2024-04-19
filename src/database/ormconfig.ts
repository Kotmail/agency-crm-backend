import { DataSource, DataSourceOptions } from 'typeorm'
import { config } from 'dotenv'

config()

export const dataSourceOptions: DataSourceOptions = {
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
}

export default new DataSource(dataSourceOptions)
