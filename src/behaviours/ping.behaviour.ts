import { Interaction } from 'discord.js'
import { Behaviour } from '../common/behaviour.class'

const ping = new Behaviour('ping')

ping.addCommand({
    name: 'ping',
    description: 'replies pong!',
    onCall: async (interaction: Interaction) => {
        if (!interaction.isCommand()) {
            return
        }

        await interaction.reply(`pong!`)
    },
})

export default ping
