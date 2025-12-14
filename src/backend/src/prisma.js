// Rückfall auf Standard Location für den generierten Client, siehe Prisma Doku
//const { PrismaClient } = require('./generated/prisma');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

//console.log(prisma);

module.exports = prisma;
