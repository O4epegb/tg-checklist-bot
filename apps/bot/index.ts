import { Bot } from 'grammy'

const token = process.env['BOT_TOKEN']
const webHookUrl = process.env['WEBHOOK']

if (token && webHookUrl) {
  const bot = new Bot(token)

  void bot.api.setWebhook(webHookUrl)
} else {
  throw new Error('Missing token or webhook url')
}
