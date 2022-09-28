import { prop } from '@typegoose/typegoose'

export class ChannelFilter {
    @prop({ type: String, required: true })
    channel_id!: string

    @prop({ type: String, required: true })
    regexp!: string
}
