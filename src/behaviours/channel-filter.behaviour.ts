import { ApplicationCommandOptionData, ClientEvents, CommandInteraction, GuildBasedChannel, Message } from 'discord.js'
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums'
import { Behaviour } from '../common/behaviour.class'
import { Bot } from '../common/bot.class'
import { BotEvent, BotEventTypes, Command, CommandFactory } from '../common/types'

// TODO: in-memory configuration ???
const currentFilters = new Map<string, RegExp>()

const setFilterCommandOptions: Array<ApplicationCommandOptionData> = [
    { name: 'filter', description: 'filter to apply to the messages', required: true, type: ApplicationCommandOptionTypes.STRING },
    { name: 'channel', description: 'channel on which to apply the filter', required: true, type: ApplicationCommandOptionTypes.CHANNEL },
]
const setFilter = () =>
    Promise.resolve({
        name: 'add-filter',
        options: setFilterCommandOptions,
        description: 'sets up a filter on a channel',
        onCall: async (interaction: CommandInteraction) => {
            await interaction.deferReply()

            // TODO: do not hardcode the option name
            const rawRegExp = interaction.options.get('filter', true).value as string

            // TODO: is 'g' flag the right one?
            const regExp = new RegExp(rawRegExp.replace('\\', '\\\\'), 'g')

            const channel = interaction.options.get('channel', true).channel as GuildBasedChannel

            currentFilters.set(channel.id, regExp)

            await interaction.followUp(`filter '${regExp}' set up for channel '${channel.toString()}'`)
        },
    } as Command)

const clearChannelFilterOptions: Array<ApplicationCommandOptionData> = [
    { name: 'channel', description: 'channel to which remove filter', required: true, type: ApplicationCommandOptionTypes.CHANNEL },
]
const clearChannelFilter = () =>
    Promise.resolve({
        name: 'clear-filter',
        options: clearChannelFilterOptions,
        description: 'removes a configured filter from a channel',
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

// TODO: double definition on event name
const messageCreate: BotEvent<'messageCreate'> = {
    name: 'messageCreate',
    type: BotEventTypes.ON,
    onCall: async (message: Message) => {
        if (messageIsAllowed(message)) {
            return
        }

        await message.delete()
    },
}

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

    return regExp.test(message.cleanContent)
}

export default async (bot: Bot): Promise<Behaviour> => {
    const channelFilter = new Behaviour({
        name: 'channel-filter',
        commands: [setFilter, clearChannelFilter],
        events: [messageCreate],
    })

    return channelFilter
}
