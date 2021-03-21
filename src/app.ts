// Setup @/ aliases for modules
import 'module-alias/register'
// Get environment variables
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })
// Get the rest of dependencies
import { Extra, Context } from 'telegraf'
import { sendHelp } from '@/commands/help'
import { bot } from '@/helpers/bot'
import { handleId } from '@/helpers/handleId'
import { checkForwards } from '@/middlewares/checkForwards'
import { checkTime } from '@/middlewares/checkTime'
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'

// Check time
bot.use(checkTime)
// Check forwards
bot.use(checkForwards)
// Setup commands
bot.command(['help', 'start'], sendHelp)
// Telegram ID
bot.hears(/-?\d+/g, handleId)
// Errors
bot.catch((err, ctx: Context) => {
  return ctx.reply(
    `😅 Error:\n<code>${err.message || err}</code>`,
    Extra.HTML() as ExtraReplyMessage
  )
})
// Start bot
bot.launch().then(() => {
  console.info('Bot is up and running')
})
