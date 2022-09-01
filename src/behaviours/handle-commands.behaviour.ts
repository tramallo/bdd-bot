import { Client, Interaction } from 'discord.js'
import { Bot } from '../common/bot.class'
import { Behaviour } from '../common/behaviour.class'
import { Command } from '../common/types'

export default async (bot: Bot): Promise<Behaviour> => {
    const handleCommands = new Behaviour('handle-commands')

    handleCommands.onceEvent('ready', async (client: Client<true>) => {
        if (!client.user || !client.application) {
            throw new Error('user or application not found.')
        }

        console.info(`creating command list`)
        const list: Array<Command> = []

        for (const [commandName, command] of bot.getCommands()) {
            list.push(command)
            console.info(`- '${command.name}' added to list`)
        }

        // TODO: think an intuitive way to stablish to which gilds set the commands (meanwhile a configurable one should be enough)
        bot.application.commands.set(list, process.env.TEST_GUILD_ID as string)
        console.info(`command list registered to guild '${process.env.TEST_GUILD_ID}'`)
    })

    handleCommands.onEvent('interactionCreate', async (interaction: Interaction) => {
        if (!interaction.isCommand()) {
            return
        }

        const command = bot.getCommands().get(interaction.commandName)

        if (!command) {
            throw new Error(`Command '${interaction.commandName}' not found`)
        }

        try {
            // TODO: improve the logging on this file (ex: execution timestamp? options? guild? caller?)
            console.info(`Executing '${interaction.commandName}' command`)
            await command.onCall(interaction)
        } catch (error) {
            console.error(`Unhandled error when executing '${interaction.commandName}' command`)
            throw error as Error
        }
    })

    return handleCommands
}
