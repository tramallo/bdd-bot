import { CommandInteraction, Interaction } from 'discord.js'
import { Bot } from '../common/bot.class'
import { Behaviour } from '../common/behaviour.class'

export default async (bot: Bot): Promise<Behaviour> => {
    const ping = new Behaviour('ping')

    ping.addCommand((bot) =>
        Promise.resolve({
            name: 'ping',
            description: 'replies pong!',
            onCall: async (interaction: CommandInteraction): Promise<void> => {
                //await interaction.deferReply()
                await interaction.reply('pong!')
                return
            },
        }),
    )

    return ping
}
