import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { testToken } from './utils/token';

describe('users.crud', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users/:idOrEmail (GET) - should return a user by ID or Email', async () => {
    const result = await request(app.getHttpServer())
      .get('/user/b7ead333-0fb8-483c-bea3-61a0ad47ae0b')
      .set('Authorization', testToken);

    expect(200);
    expect(result.body).toEqual({
      id: result.body.id,
      email: result.body.email,
      provider: result.body.provider,
      name: result.body.name,
      lastName: result.body.lastName,
      city: result.body.city,
      nickName: result.body.nickName,
      lastOnlineAt: result.body.lastOnlineAt,
      isBlocked: result.body.isBlocked,
    });
  });

  it('/user (POST) - user should be created', async () => {
    const credential = {
      email: 'tesrt@gmail.com',
      provider: 'GOOGLE',
      password: '12345678',
      name: 'Car',
      lastName: 'Model',
      city: 'Che',
      nickName: 'Tachka',
    };

    const result = await request(app.getHttpServer())
      .post('/user')
      .set('Authorization', testToken)
      .send(credential)
      .expect(201);
    expect(result.body).toEqual({
      id: result.body.id,
      email: result.body.email,
      provider: result.body.provider,
      name: result.body.name,
      lastName: result.body.lastName,
      city: result.body.city,
      nickName: result.body.nickName,
      lastOnlineAt: result.body.lastOnlineAt,
      isBlocked: result.body.isBlocked,
    });
  });

  it('/user/update/:id (PATCH) - should update a user', async () => {
    const updatedUserData = {
      email: 'te@gmail.com',
    };

    const response = await request(app.getHttpServer())
      .patch('/user/updateb7ead333-0fb8-483c-bea3-61a0ad47ae0b')
      .set('Authorization', testToken)
      .send(updatedUserData)
      .expect(200);

    expect(response.body.email).toBe(updatedUserData.email);
  });

  it('/user/update/:id (PATCH) - check validation for wrong email', async () => {
    const updatedUserData = {
      email: 'tedecom',
    };

    await request(app.getHttpServer())
      .patch('/user/updateb7ead333-0fb8-483c-bea3-61a0ad47ae0b')
      .set('Authorization', testToken)
      .send(updatedUserData)
      .expect(400);
  });

  // test this case separately after user.spec and auth.spec
  it('/user/:id (DELETE) - should delete a user', async () => {
    const result = await request(app.getHttpServer())
      .delete('/user/b8ead333-0fb8-483c-bea3-61a0ad47ae0b')
      .set('Authorization', testToken)
      .expect(200);
    expect(result.body).toEqual({
      id: result.body.id,
      email: result.body.email,
      provider: result.body.provider,
      name: result.body.name,
      lastName: result.body.lastName,
      city: result.body.city,
      nickName: result.body.nickName,
      lastOnlineAt: result.body.lastOnlineAt,
      isBlocked: result.body.isBlocked,
    });
  });
});
