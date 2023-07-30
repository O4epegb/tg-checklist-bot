import dotenv from 'dotenv'

dotenv.config({
  path: `.env.local`,
})

const main = async () => {
  const bot = await import('./bot').then((m) => m.bot)

  bot.start()
}

main()
