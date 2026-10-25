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
import { checkCas } from '@/commands/checkCas'
import { pollWithHandover } from '@/helpers/handover'

// The newest update fetched and the handlers still running, for handing polling over on deploys
let lastUpdate = 0
let handling = 0
let stopping = false
bot.use(async (ctx, next) => {
  lastUpdate = Math.max(lastUpdate, ctx.update.update_id)
  handling++
  try {
    await next()
  } finally {
    handling--
  }
})
// Check time
bot.use(checkTime)
// Check forwards
bot.use(checkForwards)
// Setup commands
bot.command(['help', 'start'], sendHelp)
bot.command('checkCas', checkCas)
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
function launch(): Promise<void> {
  return bot
    .launch({
      polling: {
        // Telegraf 3 stops polling for good on 401/409 from getUpdates and the process
        // then idles. Exit 1 instead, so the bot gets restarted
        stopCallback: () => {
          if (stopping) return
          console.error('Polling stopped, exiting so the bot gets restarted')
          process.exit(1)
        },
      },
    })
    .then(() => {
      if (stopping) return
      // launch() only logs a failed getMe (e.g. a network blip at boot) and never polls: retry
      if (!(bot as any).polling.started) {
        return new Promise((resolve) => setTimeout(resolve, 1000)).then(launch)
      }
      console.info('Bot is up and running')
    })
}
pollWithHandover(
  launch,
  async () => {
    stopping = true
    bot.stop()
    // Telegraf 3 cannot abort its long poll: a zero-timeout getUpdates ends it
    // and confirms every update fetched, so the next poller does not get them again
    await (bot.telegram as any).getUpdates(0, 1, lastUpdate + 1, undefined)
  },
  async () => {
    while (handling) await new Promise((resolve) => setTimeout(resolve, 100))
  }
)
