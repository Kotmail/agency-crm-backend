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

> [!WARNING]  
> You need to rename the **.env.example** file in the root folder to **.env**, and then change the values according to your needs.

After completing the steps above, select the preferred installation option below:

### Manual installation

**Prerequisites**

1. [Node.js](https://nodejs.org) installed.
2. [Npm](https://www.npmjs.com) installed.
3. [PostgreSQL](https://www.postgresql.org) installed. A database has been created.

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

### Installation with Docker

**Prerequisites**

1. [Docker](https://www.docker.com) installed.
2. [Docker Compose](https://docs.docker.com/compose/install) installed.

```bash
# Launching services
# - in development mode with a file watcher
docker compose --profile dev up --watch
# - in production mode
docker compose --profile prod up -d
```

After installation using one of the above methods, the API endpoints will be available at the local address: [http://localhost:3000](http://localhost:3000).

## API specification

The API specification is implemented using Swagger and is available after starting the server at: [http://localhost:3000/swagger](http://localhost:3000/swagger).
