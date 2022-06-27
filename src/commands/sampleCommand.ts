import { ApplicationCommandOptionData, BaseCommandInteraction, Client, GuildMember, TextChannel } from 'discord.js'
import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from 'discord.js/typings/enums'
import { Command } from '../command.type'
import { getOrCreate } from '../utils/store'

// This type refers to an entry of user/channel
interface UserChannelEntry {
    user: GuildMember
    channel: TextChannel
}

// TODO: update descriptions / names.
const commandOptions: Array<ApplicationCommandOptionData> = [
    { type: ApplicationCommandOptionTypes.USER, name: 'user/bot', description: 'User to interact with.', required: true },
    { type: ApplicationCommandOptionTypes.CHANNEL, name: 'channel', description: 'Channel on which make the changes.', required: true },
]

export const Sample: Command = {
    name: 'sample',
    nameLocalizations: undefined,
    description: 'does things',
    descriptionLocalizations: undefined,
    type: ApplicationCommandTypes.CHAT_INPUT,
    options: commandOptions,
    defaultPermission: true,
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        await interaction.deferReply()
        
        const storeName = 'MutedUsers'
        
        const store = getOrCreate<GuildMember>(storeName)
        
        const user = interaction.options.get('user/bot')?.value

        console.log('////////////////////')
        console.log(user)
    },
}
