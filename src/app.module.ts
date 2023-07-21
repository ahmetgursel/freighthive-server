import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HealtcheckModule } from './healthcheck/healthcheck.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { TruckController } from './truck/truck.controller';
import { TruckService } from './truck/truck.service';
import { TruckModule } from './truck/truck.module';
import { OrganizationController } from './organization/organization.controller';
import { OrganizationService } from './organization/organization.service';
import { OrganizationModule } from './organization/organization.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    HealtcheckModule,
    TruckModule,
    OrganizationModule,
  ],
  controllers: [TruckController, OrganizationController],
  providers: [TruckService, OrganizationService],
})
export class AppModule {}
