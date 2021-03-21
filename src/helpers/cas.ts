import axios from 'axios'

interface CASResponse {
  ok: boolean
  result?: {
    offenses: number
  }
}

export async function checkCAS(userId: number) {
  const data = (await axios(`https://api.cas.chat/check?user_id=${userId}`))
    .data as CASResponse
  return data.ok && data.result
    ? `The user with Telegram ID <code>${userId}</code> is banned at cas.chat with ${data.result.offenses} offenses. <a href="https://cas.chat/query?u=${userId}">Here's the link</a> if you want to know more.`
    : `The user with Telegram ID <code>${userId}</code> is not banned at cas.chat.`
}
