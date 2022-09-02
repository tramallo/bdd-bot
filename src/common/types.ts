import { ChatInputApplicationCommandData, ClientEvents, Collection, CommandInteraction } from 'discord.js'
import { Behaviour } from './behaviour.class'
import { Bot } from './bot.class'

// TODO: now it only works with ChatInput commands
export interface Command extends ChatInputApplicationCommandData {
    onCall: CommandFunction
}

export enum BotEventTypes {
    ONCE = 'once',
    ON = 'on',
}

export interface BotEvent<K extends keyof ClientEvents> {
    name: K
    onCall: (...args: ClientEvents[K]) => Promise<void>
    type: BotEventTypes
}

// TODO: this type definition may be is unnecessary
export type CommandFunction = (interaction: CommandInteraction) => Promise<void>

export type BehaviourFactory = (bot: Bot) => Promise<Behaviour>

export type CommandFactory = (bot: Bot, behaviour: Behaviour) => Promise<Command>
