import { Client } from 'discord.js'
import { Bot } from '../common/bot.class'
import { Behaviour } from '../common/behaviour.class'
import { BotEvent, BotEventTypes } from '../common/types'

const readyEvent: BotEvent<'ready'> = {
    name: 'ready',
    type: BotEventTypes.ONCE,
    onCall: async (client: Client<true>) => {
        console.info(`${client.user.username} is online.`)
    },
}

export default async (bot: Bot): Promise<Behaviour> => {
    // TODO: refactor behaviours class to accept the initialization values at the constructor
    const ready = new Behaviour({
        name: 'ready',
        commands: [],
        events: [readyEvent],
    })

    return ready
}
