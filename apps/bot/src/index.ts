import dotenv from 'dotenv'

dotenv.config({
  path: `.env.local`,
})

const bot = await import('./bot').then((m) => m.bot)

bot.start()
