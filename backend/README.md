# SumItUp Backend

SumItUp is a platform that allows users to generate summaries from various types of content, including audio, images, videos, GIFs, URLs, and books. It provides users with quick and concise summaries to help them understand the content more efficiently.

## Overview

The SumItUp backend is responsible for handling user authentication, token management, ad management, PDF generation, content summary generation, error handling, and API documentation.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/m-a-y-a-n-k/SumItUp.git
   ```

2. Navigate to the backend directory:

   ```bash
   cd backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory and define the following variables:

   ```
   PORT=3000
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   ```

5. Start the server:
   ```bash
   npm start
   ```

## Project Structure

The backend project follows a modular structure to organize the codebase effectively:

SumItUp/backend/
├── src/
│ ├── controllers/
│ ├── documentation/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── services/
│ ├── summaryGenerator/
│ └── utils/
├── tests/
│ ├── e2e/
│ ├── integration/
│ ├── unit/
├── index.js
├── db.js
├── .gitignore
├── config.js
├── package.json
└── .env

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- Mocha, Chai, Sinon for testing
- Swagger for API documentation

## API Documentation

The API documentation can be found at `http://localhost:3000/api-docs` after starting the server.

## Contributing

Contributions are welcome! Please fork the repository, make your changes, and submit a pull request.
