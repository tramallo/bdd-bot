import { getModelForClass } from '@typegoose/typegoose'
import { CommandInteraction } from 'discord.js'
import mongoose from 'mongoose'
import { Behaviour } from '../common/behaviour.class'
import { ChannelFilter } from '../utils/channel-filter.db-model'

const ping = new Behaviour('ping')

ping.addCommand({
    name: 'ping',
    description: 'replies pong!',
    onCall: async (interaction: CommandInteraction) => {
        await interaction.deferReply()

        const model = getModelForClass(ChannelFilter)

        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)

        const document = await model.findOne({ channel_id: 'some channel id' })

        const document2 = await model.create({ channel_id: 'second channel id', regexp: 'second regexp' })

        console.log(`found channel id: '${document2?.channel_id}'`)

        interaction.followUp('pong!')
    },
})

export default ping
