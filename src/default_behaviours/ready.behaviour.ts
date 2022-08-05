import { Client } from 'discord.js'
import { Bot } from '../bot.class'
import { Behaviour } from '../behaviour.class'
import { Command } from '../types'

export default async (bot: Bot): Promise<Behaviour> => {
    const ready = new Behaviour('ready')

    ready.onceEvent('ready', async (client: Client<true>) => {
        if (!client.user || !client.application) {
            throw new Error('user or application not found.')
        }

        console.info(`Creating command list`)
        const list: Array<Command> = []

        for (const [commandName, command] of bot.getCommands()) {
            list.push(command)
            console.info(`- '${command.name}' added to list`)
        }

        // TODO: think an intuitive way to stablish to which gilds set the commands (meanwhile a configurable onw should be enough)
        bot.application.commands.set(list, process.env.TEST_GUILD_ID as string)
        console.info(`Command list registered to guild '${process.env.TEST_GUILD_ID}'`)

        console.info(`${client.user.username} is online.`)
    })
    return ready
}
