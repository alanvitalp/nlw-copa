import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.get("/me", {
    onRequest: [authenticate]
  },async (request) => {

    return { user: request.user }
  })

  fastify.post("/users", async (request, reply) => {
    const createUserBody = z.object({
      access_token: z.string(),
    })

    const { access_token } = createUserBody.parse(request.body)

    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      method: 'GET',
    })

    const user = await userResponse.json()
    
    const userInfoSchema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      picture: z.string().url(),
    })

    const userInfo = userInfoSchema.parse(user)

    let dbUser = await prisma.user.findUnique({
      where: {
        googleId: userInfo.id,
      }
    })

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          googleId: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          avatarUrl: userInfo.picture,
        }
      })
    }
    
    const token = fastify.jwt.sign({
      name: dbUser.name,
      avatarUrl: dbUser.avatarUrl,
    }, {
      expiresIn: '1h',
      sub: dbUser.id,
    })

    return { token }
  });
}