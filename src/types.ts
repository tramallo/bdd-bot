import { ChatInputApplicationCommandData, ClientEvents, Collection, CommandInteraction } from 'discord.js'
import { Behaviour } from './behaviour.class'
import { Bot } from './bot.class'

// TODO: now it only works with ChatInput commands
export interface Command extends ChatInputApplicationCommandData {
    onCall: CommandFunction
}

export type CommandFunction = (interaction: CommandInteraction) => Promise<void>

export type BehaviourFactory = (bot: Bot) => Promise<Behaviour>

export type CommandFactory = (bot?: Bot, behaviour?: Behaviour) => Promise<Command>
