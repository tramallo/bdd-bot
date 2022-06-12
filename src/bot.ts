import { Client, Intents, Message } from 'discord.js'
import config from './utils/config'
import ready from './listeners/ready'
import interactionCreate from './listeners/interactionCreate'
import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'prod') {
    dotenv.config()
}

console.log('Bot is starting...')

// TODO: read 'intents' page & configure the bot to use the needed ones only
const allIntents = new Intents(32767)

const client = new Client({
    intents: allIntents,
})

ready(client)
interactionCreate(client)

client.login(config.botToken())
