import { Bot, InlineKeyboard } from 'grammy'

export const bot = new Bot(process.env['BOT_TOKEN'] ?? '')

const webAppUrl = process.env['WEB_APP_URL'] ?? ''

bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'))

bot.on('message', async (ctx) => {
  ctx.reply('Here is a link to your list:', {
    reply_markup: new InlineKeyboard().webApp(
      'Click me!',
      `${webAppUrl}?q=${encodeURIComponent(ctx.message.text ?? '')}`,
    ),
  })
})
