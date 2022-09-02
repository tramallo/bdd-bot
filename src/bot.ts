import { Intents } from 'discord.js'
import readyBehaviour from './behaviours/ready.behaviour'
import { Bot } from './common/bot.class'

import * as dotenv from 'dotenv'
import pingBehaviour from './behaviours/ping.behaviour'
import channelFilterBehaviour from './behaviours/channel-filter.behaviour'
dotenv.config()

const main = async () => {
    const allIntents = new Intents(32767)

    const bot: Bot = new Bot({ intents: allIntents })

    await bot.addBehaviour(readyBehaviour)
    await bot.addBehaviour(pingBehaviour)
    await bot.addBehaviour(channelFilterBehaviour)

    bot.start(process.env.BOT_TOKEN as string)
}
main()
