import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const users = [
    {
      email: 'master@cevaroli.com',
      password: await bcrypt.hash('Master123!', 10),
      name: 'Master Admin',
      role: 'admin',
      status: 'ACTIVE',
    },
    {
      email: 'admin@cevaroli.com',
      password: await bcrypt.hash('cevaroli', 10),
      name: 'Administrador',
      role: 'admin',
      status: 'ACTIVE',
    },
    {
      email: 'ana.carolina@cevaroli.com',
      password: await bcrypt.hash('marketing123', 10),
      name: 'Ana Carolina',
      role: 'marketing',
      status: 'ACTIVE',
    },
    {
      email: 'comprador@cevaroli.com',
      password: await bcrypt.hash('cevaroli', 10),
      name: 'Comprador Teste',
      role: 'buyer',
      status: 'ACTIVE',
    },
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    })
  }

  console.log('✅ Seed concluído: usuários criados')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
