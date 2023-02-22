# Koibanx Backend Challenge

This is a challenge made by Ignacio Velasco for Koibanx.

## Requirements

To run this project, you will need the following:

- Node.js version: v19.0.1
- NPM version: 8.19.2
- Docker (20.10 was used on the development)

## Getting Started

To get started, follow the steps below:

1. Install project dependencies by running the following command:

```bash
npm install
```

2. Set up environment variables
```bash
cp .env.example .env
```

## Running Locally

Run database:
```bash
docker-compose up -d
```

Install dependencies:
```bash
npm install
```

To run the project locally, run the following command:


```bash
npm run dev
```

Once the project is running, you can check the Swagger documentation at localhost:3000/api-docs.

## Running in Production
To run the project in production mode, run the following command:

```bash
npm run start
```


## Linting
To lint your code, you can use the following commands:

- `npm run lint` - lints the code with ESLint
- `npm run lint:fix` - attempts to fix ESLint errors
- `npm run lint:watch` - lints the code and watches for changes


## Testing
Note that only some unit tests have been implemented.

To test your code, you can use the following commands:

- npm run test:unit - runs unit tests
- npm run test:integration - runs integration tests
- npm run test:watch - runs all tests and watches for changes

## Validation

To validate your code, you can use the following command:

```bash
npm run validate
```

This command will run both linting and testing.

