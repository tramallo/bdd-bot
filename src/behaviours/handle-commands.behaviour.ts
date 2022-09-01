import { Interaction } from 'discord.js'
import { Bot } from '../common/bot.class'
import { Behaviour } from '../common/behaviour.class'

export default async (bot: Bot): Promise<Behaviour> => {
    const handleCommands = new Behaviour('handle-commands')

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
