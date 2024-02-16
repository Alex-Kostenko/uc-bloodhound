import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '@/app.module';

import { testToken } from './utils/token';

describe('brand.crud', () => {
  let app: INestApplication;

  const brandId = 'b1ead333-0fb8-483c-bea3-61a0ad11ae0b';
  const brandForDel = 'b2ead333-4fb5-483c-bea3-61a0ad11ae0b';

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

  it('/brand/:id (GET) - should return a brand by ID', async () => {
    const result = await request(app.getHttpServer()).get(`/brand/${brandId}`);

    expect(200);
    expect(result.body).toEqual({
      id: result.body.id,
      name: result.body.name,
      popular: result.body.popular,
      logo: result.body.logo,
    });
  });

  it('/brand (GET) - should return all brand ', async () => {
    const result = await request(app.getHttpServer()).get('/brand');

    expect(200);
    expect(result.body).toContainEqual({
      id: result.body[1].id,
      name: result.body[1].name,
      popular: result.body[1].popular,
      logo: result.body[1].logo,
    });
  });

  it('/brand (POST) - brand should be created', async () => {
    const credential = {
      name: 'Toyota',
      popular: 2,
      logo: 'formatData64',
    };

    const result = await request(app.getHttpServer())
      .post('/brand')
      .set('Authorization', testToken)
      .send(credential)
      .expect(201);
    expect(result.body).toEqual({
      id: result.body.id,
      name: result.body.name,
      popular: result.body.popular,
      logo: result.body.logo,
    });
  });

  it('/brand/update/:id (PATCH) - should update a brand', async () => {
    const updatedBrandData = {
      popular: 1,
    };

    const response = await request(app.getHttpServer())
      .patch(`/brand/update/${brandId}`)
      .set('Authorization', testToken)
      .send(updatedBrandData)
      .expect(200);

    expect(response.body.popular).toBe(updatedBrandData.popular);
  });

  it('/brand/:id (DELETE) - should delete a brand', async () => {
    const result = await request(app.getHttpServer())
      .delete(`/brand/${brandForDel}`)
      .set('Authorization', testToken)
      .expect(200);
    expect(result.body).toEqual({
      id: result.body.id,
      name: result.body.name,
      popular: result.body.popular,
      logo: result.body.logo,
    });
  });
});
