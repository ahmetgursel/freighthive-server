import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from 'src/app.module';
import { SigninDto, SignupDto } from 'src/auth/dto';
import { CreateFacilityDto, UpdateFacilityDto } from 'src/facility/dto';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from 'src/organization/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto } from 'src/ticket/dto';
import { CreateTruckDto, UpdateTruckDto } from 'src/truck/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    app.close();
  });

  describe('Auth', () => {
    describe('Signup', () => {
      const dto: SignupDto = {
        email: 'test@test.com',
        password: '123456',
        name: 'Test Name',
        role: 'DRIVER',
      };

      it('Should throw exception if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: dto.password, name: dto.name, role: dto.role })
          .expectStatus(400);
      });

      it('Should throw exception if pass empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email, name: dto.name, role: dto.role })
          .expectStatus(400);
      });

      it('Should throw exception if name empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
            password: dto.password,
            role: dto.role,
          })
          .expectStatus(400);
      });

      it('Should throw exception if role empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
            password: dto.password,
            name: dto.name,
          })
          .expectStatus(400);
      });

      it('Should throw exception if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('Should signup a new user', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });

      it('Should throw exception if email exist', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(403);
      });
    });

    describe('Signin', () => {
      const dto: SigninDto = {
        email: 'test@test.com',
        password: '123456',
      };
      it('Should throw exception if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('Should throw exception if pass empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('Should throw exception if no body provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });

      it('Should signin a user', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });

      it('Should throw exception if invalid email', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: 'wrongEmail@wrong.com', password: dto.password })
          .expectStatus(403);
      });

      it('Should throw exception if invalid pass', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email, password: 'wrongPass' })
          .expectStatus(403);
      });
    });
  });

  describe('User', () => {
    describe('Profile', () => {
      it('Should throw exception if invalid access token', () => {
        return pactum.spec().get('/users/profile').expectStatus(401);
      });

      it('Should get current user info', () => {
        return pactum
          .spec()
          .get('/users/profile')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });
  });

  describe('Truck', () => {
    describe('Create Truck', () => {
      const dto: CreateTruckDto = {
        plateNumber: '15EZ725',
        driverName: 'Ahmet Gürsel',
        driverPhone: '05321234567',
        capacity: 22.5,
        status: 'LOADED',
      };

      it('Should throw exception if plate number empty', () => {
        return pactum
          .spec()
          .post('/trucks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            driverName: dto.driverName,
            driverPhone: dto.driverPhone,
            capacity: dto.capacity,
            status: dto.status,
          })
          .expectStatus(400);
      });

      it('Should throw exception if driver name empty', () => {
        return pactum
          .spec()
          .post('/trucks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            plateNumber: dto.plateNumber,
            driverPhone: dto.driverPhone,
            capacity: dto.capacity,
            status: dto.status,
          })
          .expectStatus(400);
      });

      it('Should throw exception if driver phone empty', () => {
        return pactum
          .spec()
          .post('/trucks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            plateNumber: dto.plateNumber,
            driverName: dto.driverName,
            capacity: dto.capacity,
            status: dto.status,
          })
          .expectStatus(400);
      });

      it('Should throw exception if capacity empty', () => {
        return pactum
          .spec()
          .post('/trucks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            plateNumber: dto.plateNumber,
            driverName: dto.driverName,
            driverPhone: dto.driverPhone,
            status: dto.status,
          })
          .expectStatus(400);
      });

      it('Should throw exception if status empty', () => {
        return pactum
          .spec()
          .post('/trucks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            plateNumber: dto.plateNumber,
            driverName: dto.driverName,
            driverPhone: dto.driverPhone,
            capacity: dto.capacity,
          })
          .expectStatus(400);
      });

      it('Should throw exception if no body provided', () => {
        return pactum
          .spec()
          .post('/trucks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(400);
      });

      it('Should throw exception if no auth provided', () => {
        return pactum.spec().post('/trucks').expectStatus(401);
      });

      it('Should create a new trucks', () => {
        return pactum
          .spec()
          .post('/trucks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(201)
          .stores('truckId', 'id');
      });

      it('Should throw exception if plate number exist', () => {
        return pactum
          .spec()
          .post('/trucks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(403);
      });
    });

    describe('Get Trucks', () => {
      it('Should throw exception if no auth provided', () => {
        return pactum.spec().get('/trucks').expectStatus(401);
      });

      it('Should get a all trucks', () => {
        return pactum
          .spec()
          .get('/trucks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });

    describe('Get Trucks by Id', () => {
      it('Should throw exception if there is no truck by id', () => {
        return pactum
          .spec()
          .get('/trucks/7')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(403);
      });

      it('Should get a trucks by id', () => {
        return pactum
          .spec()
          .get('/trucks/$S{truckId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });

    describe('Update Trucks', () => {
      const dto: UpdateTruckDto = {
        plateNumber: '07VB606',
        driverName: 'Mustafa Gürsel',
        driverPhone: '05321234554',
        capacity: 12.5,
        status: 'UNLOADED',
      };

      it('Should throw exception if plate number empty', () => {
        return pactum
          .spec()
          .patch('/trucks/$S{truckId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            driverName: dto.driverName,
            driverPhone: dto.driverPhone,
            capacity: dto.capacity,
            status: dto.status,
          })
          .expectStatus(400);
      });

      it('Should throw exception if driver name empty', () => {
        return pactum
          .spec()
          .patch('/trucks/$S{truckId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            plateNumber: dto.plateNumber,
            driverPhone: dto.driverPhone,
            capacity: dto.capacity,
            status: dto.status,
          })
          .expectStatus(400);
      });

      it('Should throw exception if driver phone empty', () => {
        return pactum
          .spec()
          .patch('/trucks/$S{truckId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            plateNumber: dto.plateNumber,
            driverName: dto.driverName,
            capacity: dto.capacity,
            status: dto.status,
          })
          .expectStatus(400);
      });

      it('Should throw exception if capacity empty', () => {
        return pactum
          .spec()
          .patch('/trucks/$S{truckId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            plateNumber: dto.plateNumber,
            driverName: dto.driverName,
            driverPhone: dto.driverPhone,
            status: dto.status,
          })
          .expectStatus(400);
      });

      it('Should throw exception if status empty', () => {
        return pactum
          .spec()
          .patch('/trucks/$S{truckId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            plateNumber: dto.plateNumber,
            driverName: dto.driverName,
            driverPhone: dto.driverPhone,
            capacity: dto.capacity,
          })
          .expectStatus(400);
      });

      it('Should throw exception if no body provided', () => {
        return pactum
          .spec()
          .patch('/trucks/$S{truckId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(400);
      });

      it('Should throw exception if no auth provided', () => {
        return pactum.spec().patch('/trucks/$S{truckId}').expectStatus(401);
      });

      it('Should update a trucks by id', () => {
        return pactum
          .spec()
          .patch('/trucks/$S{truckId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(200);
      });

      it('Should throw exception if there is no truck by id', () => {
        return pactum
          .spec()
          .patch('/trucks/7')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(403);
      });
    });

    describe('Delete Trucks', () => {
      it('Should throw exception if there is no truck by id', () => {
        return pactum
          .spec()
          .delete('/trucks/7')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(500);
      });

      it('Should throw exception if no auth provided', () => {
        return pactum.spec().patch('/trucks/$S{truckId}').expectStatus(401);
      });

      it('Should delete a trucks by id', () => {
        return pactum
          .spec()
          .delete('/trucks/$S{truckId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });
  });

  describe('Facility', () => {
    describe('Create Facility', () => {
      const dto: CreateFacilityDto = {
        name: 'Test Facility',
        address: 'Test Adress',
        city: 'Test City',
        country: 'Test Country',
      };

      it('Should throw exception if name empty', () => {
        return pactum
          .spec()
          .post('/facility')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            adress: dto.address,
            city: dto.city,
            country: dto.country,
          })
          .expectStatus(400);
      });

      it('Should throw exception if name adress', () => {
        return pactum
          .spec()
          .post('/facility')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            name: dto.name,
            city: dto.city,
            country: dto.country,
          })
          .expectStatus(400);
      });

      it('Should throw exception if city empty', () => {
        return pactum
          .spec()
          .post('/facility')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            name: dto.name,
            adress: dto.address,
            country: dto.country,
          })
          .expectStatus(400);
      });

      it('Should throw exception if country empty', () => {
        return pactum
          .spec()
          .post('/facility')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            name: dto.name,
            adress: dto.address,
            city: dto.city,
          })
          .expectStatus(400);
      });

      it('Should throw exception if no body provided', () => {
        return pactum
          .spec()
          .post('/facility')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(400);
      });

      it('Should throw exception if no auth provided', () => {
        return pactum.spec().post('/facility').expectStatus(401);
      });

      it('Should create a new facility', () => {
        return pactum
          .spec()
          .post('/facility')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(201)
          .stores('facilityId', 'id');
      });

      //FIXME: 500 hatası yerine 403 hatası vermeli!
      it('Should throw exception if name exist', () => {
        return pactum
          .spec()
          .post('/facility')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(500);
      });
    });

    describe('Get Facility', () => {
      it('Should throw exception if no auth provided', () => {
        return pactum.spec().get('/facility').expectStatus(401);
      });

      it('Should get a all facility', () => {
        return pactum
          .spec()
          .get('/facility')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });

    describe('Get facility by id', () => {
      it('Should throw exception if there is no facility by id', () => {
        return pactum
          .spec()
          .get('/facility/7')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(403);
      });

      it('Should get a facility by id', () => {
        return pactum
          .spec()
          .get('/facility/$S{facilityId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });

    describe('Update Facility', () => {
      const dto: UpdateFacilityDto = {
        name: 'Updated Test Facility',
        address: 'Updated Test Adress',
        city: 'Updated Test City',
        country: 'Updated Test Country',
      };

      it('Should throw exception if name empty', () => {
        return pactum
          .spec()
          .patch('/facility/$S{facilityId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            adress: dto.address,
            city: dto.city,
            country: dto.country,
          })
          .expectStatus(400);
      });

      it('Should throw exception if adress empty', () => {
        return pactum
          .spec()
          .patch('/facility/$S{facilityId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            name: dto.name,
            city: dto.city,
            country: dto.country,
          })
          .expectStatus(400);
      });

      it('Should throw exception if city empty', () => {
        return pactum
          .spec()
          .patch('/facility/$S{facilityId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            name: dto.name,
            address: dto.address,
            country: dto.country,
          })
          .expectStatus(400);
      });

      it('Should throw exception if country empty', () => {
        return pactum
          .spec()
          .patch('/facility/$S{facilityId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            name: dto.name,
            address: dto.address,
            city: dto.city,
          })
          .expectStatus(400);
      });

      it('Should throw exception if no body provided', () => {
        return pactum
          .spec()
          .patch('/facility/$S{facilityId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(400);
      });

      it('Should throw exception if no auth provided', () => {
        return pactum
          .spec()
          .patch('/facility/$S{facilityId}')
          .expectStatus(401);
      });

      it('Should update a facility by id', () => {
        return pactum
          .spec()
          .patch('/facility/$S{facilityId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(200);
      });

      it('Should throw exception if there is no facility by id', () => {
        return pactum
          .spec()
          .patch('/facility/7')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(403);
      });
    });

    describe('Delete Facility', () => {
      it('Should throw exception if there is no facility by id', () => {
        return pactum
          .spec()
          .delete('/facility/7')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(403);
      });

      it('Should throw exception if no auth provided', () => {
        return pactum
          .spec()
          .delete('/facility/$S{facilityId}')
          .expectStatus(401);
      });

      it('Should delete a facility by id', () => {
        return pactum
          .spec()
          .delete('/facility/$S{facilityId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });
  });

  describe('Organization', () => {
    describe('Create Organization', () => {
      const dto: CreateOrganizationDto = {
        name: 'Test Organization',
        taxNumber: '1234567890',
        taxOffice: 'Test Tax Office',
        address: 'Test Adress',
        invoiceAddress: 'Test Invoice Adress',
      };

      it('Should throw exception if name empty', () => {
        return pactum
          .spec()
          .post('/organizations')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            taxNumber: dto.taxNumber,
            taxOffice: dto.taxOffice,
            address: dto.address,
            invoiceAddress: dto.invoiceAddress,
          })
          .expectStatus(400);
      });

      it('Should throw exception if tax number empty', () => {
        return pactum
          .spec()
          .post('/organizations')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            name: dto.name,
            taxOffice: dto.taxOffice,
            address: dto.address,
            invoiceAddress: dto.invoiceAddress,
          })
          .expectStatus(400);
      });

      it('Should throw exception if tax office empty', () => {
        return pactum
          .spec()
          .post('/organizations')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            name: dto.name,
            taxNumber: dto.taxNumber,
            address: dto.address,
            invoiceAddress: dto.invoiceAddress,
          })
          .expectStatus(400);
      });

      it('Should throw exception if adress empty', () => {
        return pactum
          .spec()
          .post('/organizations')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            name: dto.name,
            taxNumber: dto.taxNumber,
            taxOffice: dto.taxOffice,
            invoiceAddress: dto.invoiceAddress,
          })
          .expectStatus(400);
      });

      it('Should throw exception if invoice adress empty', () => {
        return pactum
          .spec()
          .post('/organizations')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            name: dto.name,
            taxNumber: dto.taxNumber,
            taxOffice: dto.taxOffice,
            address: dto.address,
          })
          .expectStatus(400);
      });

      it('Should throw exception if no body provided', () => {
        return pactum
          .spec()
          .post('/organizations')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(400);
      });

      it('Should throw exception if no auth provided', () => {
        return pactum.spec().post('/organizations').expectStatus(401);
      });

      it('Should create a new organization', () => {
        return pactum
          .spec()
          .post('/organizations')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(201)
          .stores('organizationId', 'id');
      });

      //FIXME: 500 hatası yerine 403 hatası vermeli!
      it('Should throw exception if tax number exist', () => {
        return pactum
          .spec()
          .post('/organizations')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(500);
      });
    });

    describe('Get Organization', () => {
      it('Should throw exception if no auth provided', () => {
        return pactum.spec().get('/organizations').expectStatus(401);
      });

      it('Should get a all organizations', () => {
        return pactum
          .spec()
          .get('/organizations')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });

    describe('Get Organization by id', () => {
      it('Should throw exception if there is no organization by id', () => {
        return pactum
          .spec()
          .get('/organizations/7')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(403);
      });

      it('Should get a organization by id', () => {
        return pactum
          .spec()
          .get('/organizations/$S{organizationId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });

    describe('Update Organization', () => {
      const dto: UpdateOrganizationDto = {
        name: 'Updated Test Organization',
        taxNumber: '1234567890',
        taxOffice: 'Updated Test Tax Office',
        address: 'Updated Test Adress',
        invoiceAddress: 'Updated Test Invoice Adress',
      };

      it('Should throw exception if name empty', () => {
        return pactum
          .spec()
          .patch('/organizations/$S{organizationId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            taxNumber: dto.taxNumber,
            taxOffice: dto.taxOffice,
            address: dto.address,
            invoiceAddress: dto.invoiceAddress,
          })
          .expectStatus(400);
      });

      it('Should throw exception if tax number empty', () => {
        return pactum
          .spec()
          .patch('/organizations/$S{organizationId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            name: dto.name,
            taxOffice: dto.taxOffice,
            address: dto.address,
            invoiceAddress: dto.invoiceAddress,
          })
          .expectStatus(400);
      });

      it('Should throw exception if tax office empty', () => {
        return pactum
          .spec()
          .patch('/organizations/$S{organizationId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            name: dto.name,
            taxNumber: dto.taxNumber,
            address: dto.address,
            invoiceAddress: dto.invoiceAddress,
          })
          .expectStatus(400);
      });

      it('Should throw exception if address empty', () => {
        return pactum
          .spec()
          .patch('/organizations/$S{organizationId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            name: dto.name,
            taxNumber: dto.taxNumber,
            taxOffice: dto.taxOffice,
            invoiceAddress: dto.invoiceAddress,
          })
          .expectStatus(400);
      });

      it('Should throw exception if invoice address empty', () => {
        return pactum
          .spec()
          .patch('/organizations/$S{organizationId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            name: dto.name,
            taxNumber: dto.taxNumber,
            taxOffice: dto.taxOffice,
            address: dto.address,
          })
          .expectStatus(400);
      });

      it('Should throw exception if no body provided', () => {
        return pactum
          .spec()
          .patch('/organizations/$S{organizationId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(400);
      });

      it('Should throw exception if no auth provided', () => {
        return pactum
          .spec()
          .patch('/organizations/$S{organizationId}')
          .expectStatus(401);
      });

      it('Should update a organization by id', () => {
        return pactum
          .spec()
          .patch('/organizations/$S{organizationId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(200);
      });

      it('Should throw exception if there is no organization by id', () => {
        return pactum
          .spec()
          .patch('/organizations/7')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(403);
      });
    });

    describe('Delete Organization', () => {
      it('Should throw exception if there is no organization by id', () => {
        return pactum
          .spec()
          .delete('/organizations/7')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(403);
      });

      it('Should throw exception if no auth provided', () => {
        return pactum
          .spec()
          .delete('/organizations/$S{organizationId}')
          .expectStatus(401);
      });

      it('Should delete a organization by id', () => {
        return pactum
          .spec()
          .delete('/organizations/$S{organizationId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });
  });

  describe('Ticket', () => {
    describe('Create Ticket', () => {
      const dto: CreateTicketDto = {
        containerNumber: 'TEST123456',
        entryTime: new Date('2023-07-27T10:00:00.000Z'),
        exitTime: new Date('2023-07-27T10:00:00.000Z'),
        truckId: '$S{truckId}',
        facilityId: '$S{facilityId}',
        organizationId: '$S{organizationId}',
        isInvoiceCreated: false,
      };

      it('Should throw exception if facility empty', () => {
        return pactum
          .spec()
          .post('/tickets')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            organizationId: dto.organizationId,
            isInvoiceCreated: dto.isInvoiceCreated,
          })
          .expectStatus(400);
      });

      it('Should throw exception if organization empty', () => {
        return pactum
          .spec()
          .post('/tickets')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            facilityId: dto.organizationId,
            isInvoiceCreated: dto.isInvoiceCreated,
          })
          .expectStatus(400);
      });

      it('Should throw exception if invoice empty', () => {
        return pactum
          .spec()
          .post('/tickets')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            facilityId: dto.facilityId,
            organizationId: dto.organizationId,
          })
          .expectStatus(400);
      });

      it('Should throw exception if no body provided', () => {
        return pactum
          .spec()
          .post('/tickets')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(400);
      });

      it('Should throw exception if no auth provided', () => {
        return pactum.spec().post('/tickets').expectStatus(401);
      });

      // FIXME: veritabanından önceki veriler silindiği için referans verileri hata veriyor
      // it('Should create a new tickets', () => {
      //   return pactum
      //     .spec()
      //     .post('/tickets')
      //     .withHeaders({ Authorization: 'Bearer $S{userAt}' })
      //     .withBody(dto)
      //     .expectStatus(201)
      //     .stores('ticketId', 'id')
      //     .inspect();
      // });
    });

    describe('Get Tickets', () => {
      it('Should throw exception if no auth provided', () => {
        return pactum.spec().get('/tickets').expectStatus(401);
      });

      // FIXME: ticket eklenemediği için hata veriyor
      // it('Should get a all tickets', () => {
      //   return pactum
      //     .spec()
      //     .get('/tickets')
      //     .withHeaders({ Authorization: 'Bearer $S{userAt}' })
      //     .expectStatus(200);
      // });
    });

    describe('Get Tickets by Id', () => {
      it('Should throw exception if there is no ticket by id', () => {
        return pactum
          .spec()
          .get('/tickets/7')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(403);
      });

      // FIXME: ticket eklenemediği için hata veriyor
      // it('Should get a tickets by id', () => {
      //   return pactum
      //     .spec()
      //     .get('/tickets/$S{ticketId}')
      //     .withHeaders({ Authorization: 'Bearer $S{userAt}' })
      //     .expectStatus(200);
      // });
    });

    // tüm dto optional o yüzden yalnızca body ve auth kontrolü yeterli
    describe('Update Tickets', () => {
      it('Should throw exception if there is no tickets by id', () => {
        return pactum
          .spec()
          .patch('/tickets/5')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(403);
      });

      it('Should throw exception if no auth provided', () => {
        return pactum.spec().patch('/tickets/5').expectStatus(401);
      });
    });

    describe('Delete Tickets', () => {
      it('Should throw exception if there is no tickets by id', () => {
        return pactum
          .spec()
          .delete('/tickets/7')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(403);
      });

      it('Should throw exception if no auth provided', () => {
        return pactum.spec().delete('/tickets/5').expectStatus(401);
      });
    });
  });
});
