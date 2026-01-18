const swaggerJSDoc = require('swagger-jsdoc');

const port = process.env.PORT || 5000;
const serverUrl = process.env.SWAGGER_SERVER_URL || `http://localhost:${port}`;

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Gewohnheitstier API',
      version: '1.0.0',
      description: 'REST-API für Authentifizierung und Gewohnheiten',
    },
    servers: [{ url: serverUrl, description: 'Lokale Entwicklung' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Habit: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '123' },
            habit_name: { type: 'string', example: 'Joggen' },
            description: { type: 'string', example: '30 Minuten laufen' },
            start_date: { type: 'string', format: 'date', example: '2025-01-01' },
            streak: { type: 'integer', example: 5 },
            last_checked: { type: 'string', format: 'date-time', nullable: true },
            prev_last_checked: {
              type: 'array',
              items: { type: 'string', format: 'date-time' },
            },
            userId: { type: 'string', example: 'uuid' },
          },
          required: ['id', 'habit_name', 'userId'],
        },
        AuthUser: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid' },
            email: { type: 'string', format: 'email' },
          },
        },
        AuthSession: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
            expiresIn: { type: 'integer' },
            tokenType: { type: 'string' },
            user: { $ref: '#/components/schemas/AuthUser' },
          },
        },
        UserAnimal: {
          type: 'object',
          properties: {
            animal_type: {
              type: 'string',
              enum: ['hund', 'katze', 'hamster', 'wurm'],
            },
            animal_mood: {
              type: 'string',
              enum: ['gluecklich', 'traurig'],
            },
          },
          required: ['animal_type', 'animal_mood'],
        },
        UserAnimalUpdate: {
          type: 'object',
          properties: {
            animal_type: {
              type: 'string',
              enum: ['hund', 'katze', 'hamster', 'wurm'],
            },
            animal_mood: {
              type: 'string',
              enum: ['gluecklich', 'traurig'],
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            detail: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJSDoc(options);

module.exports = { specs };
