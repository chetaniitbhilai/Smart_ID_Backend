// swagger.js
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Auth API',
      version: '1.0.0',
      description: 'API for user signup, login, logout, OTP verification, and profile access',
    },
    servers: [
      {
        url: 'http://localhost:5000/', // replace with your actual base URL
      },
    ],
  },
  apis: ['./routes/*.js'], // path to your route files with Swagger comments
};

export default swaggerJsdoc(options);
