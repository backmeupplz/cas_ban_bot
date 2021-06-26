import { checkCAS } from '@/helpers/cas'
import { Context, Extra } from 'telegraf'
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'

export async function checkForwards(ctx: Context, next: Function) {
  if (
    (!ctx.message?.forward_from &&
      !(ctx.message as any)?.forward_sender_name) ||
    ctx.chat.type !== 'private'
  ) {
    return next()
  }
  if (!ctx.message.forward_from?.id) {
    return ctx.reply(
      "Could not get this user's Telegram ID. Probably they have forward privacy on. You can still send their Telegram ID to me and I will check them.",
      Extra.inReplyTo(ctx.message.message_id) as ExtraReplyMessage
    )
  }
  return ctx.reply(
    await checkCAS(ctx.message.forward_from.id),
    Extra.webPreview(false)
      .HTML()
      .inReplyTo(ctx.message.message_id) as ExtraReplyMessage
  )
}
