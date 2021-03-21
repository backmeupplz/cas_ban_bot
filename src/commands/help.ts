import { Context, Extra } from 'telegraf'
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'

export function sendHelp(ctx: Context) {
  return ctx.reply(
    'Forward message from any user or send their Telegram ID to this bot and it will check if the user is banned at cas.chat. Sources: bit.ly/390HvpF.',
    Extra.webPreview(false) as ExtraReplyMessage
  )
}
