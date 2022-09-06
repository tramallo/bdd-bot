import { Bot } from './common/bot.class'

import * as dotenv from 'dotenv'
import pingBehaviour from './behaviours/ping.behaviour'
import channelFilterBehaviour from './behaviours/channel-filter.behaviour'
dotenv.config()

const bot: Bot = new Bot()

bot.addBehaviour(pingBehaviour)
bot.addBehaviour(channelFilterBehaviour)

bot.start(process.env.BOT_TOKEN as string)
