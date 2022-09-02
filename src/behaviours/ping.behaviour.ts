import { CommandInteraction } from 'discord.js'
import { Bot } from '../common/bot.class'
import { Behaviour } from '../common/behaviour.class'
import { Command } from '../common/types'

const pingCommand = () =>
    Promise.resolve({
        name: 'ping',
        description: 'replies pong!',
        onCall: async (interaction: CommandInteraction): Promise<void> => {
            //await interaction.deferReply()
            await interaction.reply('pong!')
            return
        },
    } as Command)

export default async (bot: Bot): Promise<Behaviour> => {
    const ping = new Behaviour({
        name: 'ping',
        commands: [pingCommand],
        events: [],
    })

    return ping
}
