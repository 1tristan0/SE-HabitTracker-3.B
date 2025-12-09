//const { PrismaClient } = require('./generated/prisma');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

//console.log(prisma);

module.exports = prisma;
