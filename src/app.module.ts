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
import { FacilityController } from './facility/facility.controller';
import { FacilityService } from './facility/facility.service';
import { FacilityModule } from './facility/facility.module';
import { TicketModule } from './ticket/ticket.module';

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
    FacilityModule,
    TicketModule,
  ],
  controllers: [TruckController, OrganizationController, FacilityController],
  providers: [TruckService, OrganizationService, FacilityService],
})
export class AppModule {}
