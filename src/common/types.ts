import { ChatInputApplicationCommandData, Client, ClientEvents, CommandInteraction } from 'discord.js'

// TODO: now it only works with ChatInput commands
export interface Command extends ChatInputApplicationCommandData {
    onCall: CommandFunction
}

export type CommandFunction = (interaction: CommandInteraction) => Promise<void>

export enum BotEventTypes {
    ONCE = 'once',
    ON = 'on',
}

export interface BotEvent<K extends keyof ClientEvents> {
    name: K
    onCall: (...args: ClientEvents[K]) => Promise<void> | void
    type: BotEventTypes
}
