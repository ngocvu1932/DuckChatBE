import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API endpoints for the application',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' ? process.env.BASE_URL : 'http://localhost:4000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Đường dẫn tới các file chứa định nghĩa API
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);

export default swaggerSpecs;
