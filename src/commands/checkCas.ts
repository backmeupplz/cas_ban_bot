import { Context, Extra } from 'telegraf'
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'
import { checkCAS } from '@/helpers/cas'

export async function checkCas(ctx: Context) {
  if (!ctx.message?.reply_to_message?.from?.id) {
    return
  }
  return ctx.reply(
    await checkCAS(ctx.message.reply_to_message.from.id),
    Extra.webPreview(false)
      .HTML()
      .inReplyTo(ctx.message.message_id) as ExtraReplyMessage
  )
}
