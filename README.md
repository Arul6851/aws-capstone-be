### LICET Fee Portal Backend

### Introduction

LICET's Fee Portal is an online fees payment platform for the students of LICET that has been developed using NextJS and ExpressJS. This repository contains the source code of the project's backend developed using Typescript and ExpressJS.

### Prerequisites

What things you need to install the software and how to install them:

- Node.js
- npm
- SQL Server

### Installation

#### Backend Setup

1. Set up a SQL Server.

2. Create a copy of the `.env.example` file and rename it to `.env`:

   ```
   cp .env.example .env
   ```

3. Add your database server details to the `.env` file.

4. Install dependencies:

   ```
   npm i
   ```

5. Initialize the database (only needed for the first time):

   ```
   npx prisma db push
   ```

6. Start the development server:

   ```
   npm run dev
   ```

#### Frontend Setup

1. Create a copy of the `.env.example` file and rename it to `.env`:

   ```
   cp .env.example .env
   ```

2. Add the necessary environment variables to the `.env` file.

3. Install dependencies:

   ```
   npm i
   ```

4. Start the development server:

   ```
   npm run dev
   ```
