import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

import z from 'zod'
import ShortUniqueId from 'short-unique-id'
import { poolRoutes } from './routes/pool'
import { usersRoutes } from './routes/users'
import { guessRoutes } from './routes/guess'
import { gameRoutes } from './routes/game'



async function bootstrap () {
  const fastify = Fastify({
    logger: true,
  })

  await fastify.register(cors, {
    origin: true,
  })

  await fastify.register(jwt, {
    secret: 'nlwcopa123',
  })

  fastify.register(poolRoutes)

  fastify.register(usersRoutes)

  fastify.register(guessRoutes)

  fastify.register(gameRoutes)

  await fastify.listen({ port: 3333, host: '0.0.0.0' })
}

bootstrap()