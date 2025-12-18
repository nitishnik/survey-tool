import { Express } from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Survey & Workshop Planning API',
      version: '1.0.0',
      description:
        'REST API for surveys, workshops, responses, templates, and audit logs used by the internal Survey Workshop Planning Tool.',
    },
    servers: [
      {
        url: '/api',
        description: 'API base path',
      },
    ],
  },
  // Adjust glob patterns if you want to add JSDoc comments later
  apis: ['src/controllers/*.ts', 'src/routes/*.ts'],
}

const swaggerSpec = swaggerJSDoc(options)

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}


