import { getModelForClass, mongoose } from '@typegoose/typegoose'
import { CommandInteraction, GuildBasedChannel, Message } from 'discord.js'
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums'
import { Behaviour } from '../common/behaviour.class'
import { BotEventTypes } from '../common/types'
import { ChannelFilter } from '../utils/channel-filter.db-model'

const channelFilter = new Behaviour('channel-filter')

const FilterStorage = getModelForClass(ChannelFilter)

channelFilter.addIntent('GUILDS')
channelFilter.addIntent('GUILD_MESSAGES')

channelFilter.addCommand({
    name: 'add-filter',
    description: 'sets up a filter on a channel',
    options: [
        { name: 'filter', description: 'filter to apply to the messages', required: true, type: ApplicationCommandOptionTypes.STRING },
        { name: 'channel', description: 'channel on which to apply the filter', required: true, type: ApplicationCommandOptionTypes.CHANNEL },
    ],
    onCall: async (interaction: CommandInteraction) => {
        await interaction.deferReply()

        await connectDB()

        // TODO: do not hardcode the option name
        const rawRegExp = interaction.options.get('filter', true).value as string
        const regExp = new RegExp(rawRegExp.replace('\\', '\\\\'), '')

        const channel = interaction.options.get('channel', true).channel as GuildBasedChannel

        const filter = await FilterStorage.findOne({ channel_id: channel.id })

        if (!filter) {
            await FilterStorage.create({ channel_id: channel.id, regexp: regExp })

            await interaction.followUp(`filter '${regExp}' set up for channel '${channel.toString()}'`)

            return
        }

        console.log(`found already existing filter for channel '${channel.toString()}', replacing filter`)

        await FilterStorage.findByIdAndUpdate(filter.id, { regexp: regExp })

        await interaction.followUp(`filter for channel '${channel.toString()}' updated to '${regExp}'`)
    },
})

channelFilter.addCommand({
    name: 'clear-filter',
    description: 'removes a configured filter from a channel',
    options: [{ name: 'channel', description: 'channel to which remove filter', required: true, type: ApplicationCommandOptionTypes.CHANNEL }],
    onCall: async (interaction: CommandInteraction) => {
        await interaction.deferReply()

        await connectDB()

        const channel = interaction.options.get('channel', true).channel as GuildBasedChannel

        await FilterStorage.findOneAndDelete({ channel_id: channel.id })

        await interaction.followUp(`filter for channel '${channel.toString()}' cleared`)
    },
})

channelFilter.addEvent({
    name: 'messageCreate',
    type: BotEventTypes.ON,
    onCall: async (message: Message) => {
        // TODO: hardcoded APPLICATION_COMMAND is ugly
        if ((await messageIsAllowed(message)) || message.type == 'APPLICATION_COMMAND') {
            return
        }

        await message.delete()
    },
})

/**
 * this checks if the received message is allowed by checking if there's a filter on the channel where the message was sent in,
 * & if there's a configured filter, if the message is compliant with that filter
 */
const messageIsAllowed = async (message: Message): Promise<boolean> => {
    const channelId = message.channelId

    await connectDB()

    const filter = await FilterStorage.findOne({ channel_id: channelId })

    if (!filter) {
        return true
    }

    const regExp = new RegExp(filter.regexp, '')

    return regExp.test(message.content)
}

const connectDB = async (): Promise<void> => {
    if (mongoose.connection.readyState != mongoose.ConnectionStates.connected) {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
    }
}

export default channelFilter
