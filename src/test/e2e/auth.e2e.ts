import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '@/app.module';

describe('users.auth', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Req without token', async () => {
    await request(app.getHttpServer())
      .get('/user/b7ead333-0fb8-483c-bea3-61a0ad47ae0b')
      .expect(401);
  });

  it('/auth/register (POST) - register user', async () => {
    const credential = {
      email: 'register@gmail.com',
      provider: 'GOOGLE',
      password: '12345678',
      name: 'Car',
      lastName: 'Model',
      city: 'Che',
      nickName: 'User Register',
    };

    const result = await request(app.getHttpServer())
      .post('/auth/register')
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

  it('/auth/login (POST) - login user', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'alice@prisma.io',
        password: '12345678',
      })
      .set('User-Agent', 'Your User Agent String')
      .expect(201);
  });

  it('/auth/refresh-tokens/:refreshToken (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/refresh-tokens/refresh_token_test')
      .set('User-Agent', 'Agent String')
      .expect(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
  });
});
