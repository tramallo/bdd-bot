import {
    ApplicationCommandData,
    BaseCommandInteraction,
    Client,
} from 'discord.js'

export type Command = ApplicationCommandData & {
    run: (client: Client, interaction: BaseCommandInteraction) => void
}
