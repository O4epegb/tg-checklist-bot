import { Bot, InlineKeyboard } from 'grammy'

const token = process.env['BOT_TOKEN']
const webAppUrl = process.env['WEB_APP_URL']

if (!token || !webAppUrl) {
  throw new Error('Missing token or webAppUrl')
}

export const bot = new Bot(token)

bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'))

bot.on('message', (ctx) => {
  void ctx.reply('Here is a link to your list:', {
    reply_markup: new InlineKeyboard().webApp(
      'Click me!',
      `${webAppUrl}?q=${encodeURIComponent(ctx.message.text ?? '')}`,
    ),
  })
})
