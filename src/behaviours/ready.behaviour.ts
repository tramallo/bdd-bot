import { Client } from 'discord.js'
import { Bot } from '../common/bot.class'
import { Behaviour } from '../common/behaviour.class'

export default async (bot: Bot): Promise<Behaviour> => {
    // TODO: refactor behaviours class to accept the initialization values at the constructor
    const ready = new Behaviour('ready')

    ready.onceEvent('ready', async (client: Client<true>) => {
        console.info(`${client.user.username} is online.`)
    })
    return ready
}
