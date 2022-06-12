import { BaseCommandInteraction, Client, Interaction } from 'discord.js'
import commands from '../commands'

export default (client: Client): void => {
    const onInteractionCreate = async (interaction: Interaction) => {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            await handleSlashCommand(client, interaction)
        }
    }

    client.on('interactionCreate', onInteractionCreate)
}

const handleSlashCommand = async (client: Client, interaction: BaseCommandInteraction): Promise<void> => {
    const slashCommand = commands.find((command) => command.name === interaction.commandName)

    if (!slashCommand) {
        interaction.followUp({ content: 'Command not found' })
        return
    }

    await interaction.deferReply()

    slashCommand.run(client, interaction)
}
