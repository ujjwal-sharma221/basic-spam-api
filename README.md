# Phone Number Spam Detection API

This project is a REST API built with Node.js, TypeScript, Express, and Prisma. It provides functionality for user registration, contact management, spam marking, and searching for users and contacts.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Seeding the Database](#seeding-the-database)
- [API Endpoints](#api-endpoints)

## Features

- User registration and authentication.
- Add and manage personal contacts.
- Mark phone numbers as spam.
- Search for users and contacts by name or phone number.
- Display spam likelihood for phone numbers.

## Tech Stack

- **Backend Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **TypeScript**: For type safety and modern JavaScript features
- **Faker**: For generating random data in the seed script

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add values according to the .copy.env

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
   PORT="30000"
   JWT_SECRET = "Secret"
   ```

   Adjust the values according to your PostgreSQL setup.

## Configuration

1. **Database Schema:**

   Ensure your `prisma/schema.prisma` file is properly set up with your models. Example:

   ```prisma
   generator client {
     provider = "prisma-client-js"
   }

   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }

   model User {
     id          Int       @id @default(autoincrement())
     name        String
     phoneNumber String    @unique
     email       String?   @unique
     password    String
     contacts    Contact[]
     createdAt   DateTime  @default(now())
     updatedAt   DateTime  @updatedAt
     Spam        Spam[]
   }

   model Contact {
     id          Int     @id @default(autoincrement())
     name        String
     phoneNumber String
     userId      Int
     user        User    @relation(fields: [userId], references: [id])
     isSpam      Boolean @default(false)
     spamReports Spam[]
   }

   model Spam {
     id             Int      @id @default(autoincrement())
     phoneNumber    String   @unique
     markedCount    Int      @default(0)
     markedByUser   User     @relation(fields: [markedByUserId], references: [id])
     markedByUserId Int
     createdAt      DateTime @default(now())
     Contact        Contact? @relation(fields: [contactId], references: [id])
     contactId      Int?
   }
   ```

2. **Migrate the database:**

   ```bash
   npx prisma migrate dev --name init
   ```

## Running the Project

**Start the development server:**

```bash
npm run dev
```

## Seeding the Database

To populate your database with random data:

1. **Create or update the seed script:**

   Edit `prisma/seed.ts`:

2. **Run the seed script:**

   ```bash
   npm run prisma:seed
   ```

## API Endpoints

### User Registration

- **POST** `/api/register`
  - Request Body: `{ name: string, phoneNumber: string, email?: string, password: string }`
  - Response: `{ id: number, name: string, phoneNumber: string, email?: string, createdAt: Date }`

### User Login

- **POST** `/api/login`
  - Request Body: `{ phoneNumber: string, password: string }`
  - Response: `{ token: string }`

### Add Contact

- **POST** `/api/contacts`
  - Request Body: `{ name: string, phoneNumber: string, isSpam?: boolean }`
  - Response: `{ id: number, name: string, phoneNumber: string, isSpam: boolean }`

### Mark Spam

- **POST** `/api/spam`
  - Request Body: `{ phoneNumber: string }`
  - Response: `{ phoneNumber: string, markedCount: number }`

### Search by Name

- **GET** `/api/search/name?query=string`
  - Response: `{ name: string, phoneNumber: string, spamLikelihood: string }[]`

### Search by Phone Number

- **GET** `/api/search/phone?query=string`
  - Response: `{ name: string, phoneNumber: string, email?: string, spamLikelihood: string }[]`
