import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from 'src/app.module';
import { SigninDto, SignupDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';
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

      it('Should get a all trucks', () => {
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
  });
});
