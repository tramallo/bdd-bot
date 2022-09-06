import { CommandInteraction, GuildBasedChannel, Intents, Message } from 'discord.js'
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums'
import { Behaviour } from '../common/behaviour.class'
import { BotEventTypes } from '../common/types'

const channelFilter = new Behaviour('channel-filter')

// TODO: in-memory configuration ???
const currentFilters = new Map<string, RegExp>()

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

        // TODO: do not hardcode the option name
        const rawRegExp = interaction.options.get('filter', true).value as string

        const regExp = new RegExp(rawRegExp.replace('\\', '\\\\'), '')

        const channel = interaction.options.get('channel', true).channel as GuildBasedChannel

        currentFilters.set(channel.id, regExp)

        await interaction.followUp(`filter '${regExp}' set up for channel '${channel.toString()}'`)
    },
})

channelFilter.addCommand({
    name: 'clear-filter',
    description: 'removes a configured filter from a channel',
    options: [{ name: 'channel', description: 'channel to which remove filter', required: true, type: ApplicationCommandOptionTypes.CHANNEL }],
    onCall: async (interaction: CommandInteraction) => {
        await interaction.deferReply()

        const channel = interaction.options.get('channel', true).channel as GuildBasedChannel

        if (!currentFilters.has(channel.id)) {
            await interaction.followUp(`channel '${channel.toString()}' didn't had any filter configured`)
            return
        }

        currentFilters.delete(channel.id)

        await interaction.followUp(`filter for channel '${channel.toString()}' cleared`)
    },
})

channelFilter.addEvent({
    name: 'messageCreate',
    type: BotEventTypes.ON,
    onCall: (message: Message) => {
        if (messageIsAllowed(message)) {
            return
        }

        message.delete()
    },
})

/**
 * this checks if the received message is allowed by checking if there's a filter on the channel where the message was sent in,
 * & if there's a configured filter, if the message is compliant with that filter
 */
const messageIsAllowed = (message: Message): boolean => {
    const channelId = message.channelId

    if (!currentFilters.has(channelId)) {
        return true
    }

    const regExp = currentFilters.get(channelId) as RegExp

    return regExp.test(message.content)
}

export default channelFilter
