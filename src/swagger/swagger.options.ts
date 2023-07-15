import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Freighthive')
  .setDescription('API documentation for Freighthive App')
  .setVersion('1.0')
  .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    'Authorization',
  )
  .build();
