import { Client, Intents, Message } from 'discord.js'
import { BOT_TOKEN } from './secrets.json'
import ready from './listeners/ready'
import interactionCreate from './listeners/interactionCreate'

console.log('Bot is starting...')

// TODO: read 'intents' page & configure the bot to use the needed ones only
const allIntents = new Intents(32767)

const client = new Client({
    intents: allIntents,
})

ready(client)
interactionCreate(client)

client.login(BOT_TOKEN)
