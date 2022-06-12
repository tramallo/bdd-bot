import {
    ApplicationCommandOptionData,
    BaseCommandInteraction,
    Client,
} from 'discord.js'
import { ApplicationCommandTypes } from 'discord.js/typings/enums'
import { Command } from '../command.type'

export const Ping: Command = {
    name: 'ping',
    nameLocalizations: undefined,
    description: 'Replies pong!',
    descriptionLocalizations: undefined,
    type: ApplicationCommandTypes.CHAT_INPUT,
    options: [] as Array<ApplicationCommandOptionData>,
    defaultPermission: true,
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        // TODO: ping command shold be more useful than just replying pong!
        await interaction.followUp({ content: 'pong!' })
    },
}
