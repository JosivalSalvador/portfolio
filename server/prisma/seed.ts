import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, Role, TokenType } from '@prisma/client'
import { hash } from 'bcryptjs'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is required')

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.info('🔥 Iniciando Seed Base do Portfólio...')
  const start = Date.now()

  // Ordem correta por causa das FKs (filho primeiro, pai depois)
  await prisma.token.deleteMany()
  await prisma.user.deleteMany()

  console.info('🧹 Banco limpo.')

  const DEFAULT_PASSWORD = '@Js92434212'
  const passwordHash = await hash(DEFAULT_PASSWORD, 10)

  /*
   |--------------------------------------------------------------------------
   | USUÁRIOS
   |--------------------------------------------------------------------------
   */

  const admin = await prisma.user.create({
    data: {
      name: 'Admin Sistema',
      email: 'josivaladm@gmail.com',
      password_hash: passwordHash,
      role: Role.ADMIN,
    },
  })

  const supporter = await prisma.user.create({
    data: {
      name: 'Suporte Maria',
      email: 'josivalsup@gmail.com',
      password_hash: passwordHash,
      role: Role.SUPPORTER,
    },
  })

  const client = await prisma.user.create({
    data: {
      name: 'Cliente Exemplo',
      email: 'josivaluser@gmail.com',
      password_hash: passwordHash,
      role: Role.USER,
    },
  })

  const client2 = await prisma.user.create({
    data: {
      name: 'Cliente Exemplo2',
      email: 'josivaluser2@gmail.com',
      password_hash: passwordHash,
      role: Role.USER,
    },
  })

  /*
   |--------------------------------------------------------------------------
   | TOKENS
   |--------------------------------------------------------------------------
   */

  // Nota: Deixei apenas REFRESH_TOKEN pois é o único tipo definido no seu schema atual
  await prisma.token.createMany({
    data: [
      {
        type: TokenType.REFRESH_TOKEN,
        userId: admin.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        type: TokenType.REFRESH_TOKEN,
        userId: client.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
      {
        type: TokenType.REFRESH_TOKEN,
        userId: client2.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
      {
        type: TokenType.REFRESH_TOKEN,
        userId: supporter.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    ],
  })

  const end = Date.now()
  console.info(`✅ Seed finalizado em ${end - start}ms`)
  console.info('--------------------------------------------------')
  console.info('🧪 CREDENCIAIS PARA O E2E / CODEGEN:')
  console.info(`👤 Admin:   josivaladm@gmail.com   | Senha: ${DEFAULT_PASSWORD}`)
  console.info(`🎧 Suporte: josivalsup@gmail.com | Senha: ${DEFAULT_PASSWORD}`)
  console.info(`🛒 Cliente: josivaluser@gmail.com    | Senha: ${DEFAULT_PASSWORD}`)
  console.info(`🛒 Cliente: josivaluser2@gmail.com    | Senha: ${DEFAULT_PASSWORD}`)
  console.info('--------------------------------------------------')
}

main()
  .then(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
  .catch(async (e) => {
    console.error('Erro no Seed:', e)
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  })
