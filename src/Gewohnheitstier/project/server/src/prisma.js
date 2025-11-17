const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

console.log(prisma);

module.exports = prisma;
