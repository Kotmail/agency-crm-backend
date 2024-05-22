# AgencyCRM [Backend]

AgencyCRM is a management system for a company that allows you to create orders and monitor their implementation.

This is a server-side REST API application for AgencyCRM.

## Tools used

- [NestJS](https://nestjs.com) as a server framework.
- [TypeORM](https://typeorm.io) - ORM for working with the database.
- [PostgreSQL](https://www.postgresql.org) as a database.
- [Faker](https://fakerjs.dev) - generation fake data to fill the database.
- [Passport.js](https://www.passportjs.org) for authentication.
- [Swagger](https://swagger.io) for API specification.
- [Docker](https://www.docker.com) - for local development and deployment.

## Installation

### Preparing for installation

```bash
# Clone the repository
git clone https://github.com/Kotmail/agency-crm-backend.git

# Go to the folder
cd agency-crm-backend
```

After executing the commands above, select your preferred installation option below:

### Manual installation

**Prerequisites**

1. [Node.js](https://nodejs.org) installed.
2. [Npm](https://www.npmjs.com) installed.
3. [PostgreSQL](https://www.postgresql.org) installed. A database has been created.

> The **.env.example** file in the root folder
> Copy over the content to **.env** and change the values to your needs.

```bash
# Installing dependencies in the project folder
npm i

# Building a project
npm run build

# Running migrations to create a database structure.
npm run migration:run

# Filling the database with initial data (if necessary).
npm run db:seed

# Starting a server
# - for development
npm run start:dev
# - or for production
npm run start:prod
```
