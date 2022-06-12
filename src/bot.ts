import { Client, Intents, Message } from 'discord.js'
import { BOT_TOKEN } from './secrets.json'
import ready from './listeners/ready'
import interactionCreate from './listeners/interactionCreate'

// TODO: dig into TODO Tree plugin docs to figure out a configuration to use in it

// TODO: investigate a proper way to deal with secret values, move secrets.json somewhere else

// TODO: investigate license types

// TODO: fill up the package.json file

// TODO: fill up the README.md file

console.log('Bot is starting...')

// TODO: read intents page & configure the bot to use the needed ones only
const allIntents = new Intents(32767)

const client = new Client({
    intents: allIntents,
})

ready(client)
interactionCreate(client)

client.login(BOT_TOKEN)
