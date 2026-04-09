import process from 'node:process'

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { completionRoutes } from './routes/chat-completions/route'
import { embeddingRoutes } from './routes/embeddings/route'
import { messageRoutes } from './routes/messages/route'
import { modelRoutes } from './routes/models/route'
import { responsesRoutes } from './routes/responses/route'
import { tokenRoute } from './routes/token/route'
import { usageRoute } from './routes/usage/route'

export const server = new Hono()

server.use(logger())
server.use(cors())

// API key authentication middleware
server.use(async (c, next) => {
  const apiKey = process.env.API_KEY
  if (!apiKey)
    return next() // no API_KEY configured, skip auth

  if (c.req.path === '/')
    return next() // health check is public

  const key = c.req.header('x-api-key') || c.req.header('api-key') || c.req.header('authorization')?.replace(/^Bearer\s+/i, '')
  if (key !== apiKey) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  return next()
})

server.get('/', c => c.text('Server running'))

server.route('/chat/completions', completionRoutes)
server.route('/models', modelRoutes)
server.route('/embeddings', embeddingRoutes)
server.route('/responses', responsesRoutes)
server.route('/usage', usageRoute)
server.route('/token', tokenRoute)

// Compatibility with tools that expect v1/ prefix
server.route('/v1/chat/completions', completionRoutes)
server.route('/v1/models', modelRoutes)
server.route('/v1/embeddings', embeddingRoutes)
server.route('/v1/responses', responsesRoutes)

// Anthropic compatible endpoints
server.route('/v1/messages', messageRoutes)
