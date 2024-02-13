import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.create({
    data: {
      id: 'b7ead333-0fb8-483c-bea3-61a0ad47ae0b',
      email: 'alice@prisma.io',
      provider: 'GOOGLE',
      password: '$2b$10$5tBDbKQNH3oAO2ZGo0KvWu/VJ0aNTADBr8HkAldsXuQk2rIqkVbqG',
      name: 'Alice',
      lastName: 'Model',
      city: 'Che',
      nickName: 'Tachka',
    },
  });

  await prisma.user.create({
    data: {
      id: 'b8ead333-0fb8-483c-bea3-61a0ad47ae0b',
      email: 'Nipel@prisma.io',
      provider: 'GOOGLE',
      password: '$2b$10$5tBDbKQNH3oAO2ZGo0KvWu/VJ0aNTADBr8HkAldsXuQk2rIqkVbqG',
      name: 'Nipel',
      lastName: 'Model',
      city: 'Kyiv',
      nickName: 'Tachka',
    },
  });

  await prisma.token.create({
    data: {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFmNjM3MGFiLWJlY2QtNDNjNC1iNWE1LWQ1MTA3OTA4NTY4OCIsImVtYWlsIjoiYWxpY2VAcHJpc21hLmlvIiwidGltZSI6IjIwMjQtMDItMDhUMTI6MDk6MTQuMTg1WiIsImlhdCI6MTcwNzM5NDE1NCwiZXhwIjoxNzA3Mzk0NDU0fQ.xSm_jTrcvS6wN-7z4BUrVPrq5JXV6qQzXDBO8wFuyWI',
      exp: new Date('December 17, 2150 03:24:00'),
      userId: 'b7ead333-0fb8-483c-bea3-61a0ad47ae0b',
      refresh: 'refresh_token_test',
      userAgent: 'user_agent_test',
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
