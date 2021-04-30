import { Context, Extra } from 'telegraf'
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'
import { checkCAS } from '@/helpers/cas'

export async function handleId(ctx: Context) {
  if (ctx.chat?.type !== 'private') {
    return
  }
  const userId = +ctx.message.text.match(/-?\d+/g)[0]
  return ctx.reply(
    await checkCAS(userId),
    Extra.webPreview(false)
      .HTML()
      .inReplyTo(ctx.message.message_id) as ExtraReplyMessage
  )
}
