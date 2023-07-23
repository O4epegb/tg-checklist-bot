import dotenv from 'dotenv'

dotenv.config({
  path: `.env.local`,
})

import { bot } from './bot'

bot.start()
