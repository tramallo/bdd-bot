import { Client, ClientOptions, Collection } from 'discord.js'
import { Behaviour } from './behaviour.class'
import { BehaviourFactory, Command } from './types'

export class Bot extends Client<true> {
    private readonly behaviours: Collection<string, Behaviour> = new Collection()
    private readonly commands: Collection<string, Command> = new Collection()
    // TODO: commands collection should be public?

    constructor(options: ClientOptions) {
        // TODO: read 'intents' page & configure the bot to use the needed ones only
        super(options)
    }

    public getCommands(): Map<string, Command> {
        // TODO: investigate if it is secure to expose the map this way
        return this.commands
    }

    /** Instantiates the behaviour & adds it to the collection
     *
     * @param behaviourFactory. function that generates a behaviour (it receives the bot instance to interact with)
     */
    public async addBehaviour(behaviourFactory: BehaviourFactory): Promise<void> {
        const behaviour = await behaviourFactory(this)

        if (!behaviour.commands.length && !behaviour.onEvents.size && !behaviour.onceEvents.size) {
            console.warn(`Behaviour '${behaviour.name}' is empty`)
            return
        }

        if (this.behaviours.has(behaviour.name)) {
            console.warn(`Behaviour '${behaviour.name}' is already registered, skipping this one`)
            return
        }

        this.behaviours.set(behaviour.name, behaviour)
    }

    private async registerEvents(behaviour: Behaviour): Promise<void> {
        console.info(`\nRegistering '${behaviour.name}' behaviour`)

        if (behaviour.onceEvents.size) {
            for (const [eventName, eventFunc] of behaviour.onceEvents) {
                this.once(eventName, eventFunc as any)
                console.info(`- once '${eventName}' event`)
            }
        }

        if (behaviour.onEvents.size) {
            for (const [eventName, eventFunc] of behaviour.onEvents) {
                this.on(eventName, eventFunc as any)
                console.info(`- on '${eventName}' event`)
            }
        }

        if (behaviour.commands.length) {
            for (const commandFactory of behaviour.commands) {
                const command = await commandFactory(this, behaviour)

                if (this.commands.some((alreadyRegistered: Command) => command.name == alreadyRegistered.name)) {
                    console.warn(`- command '${command.name}' already registered, skipping this one`)
                    continue
                }

                this.commands.set(command.name, command)
                console.info(`- '${command.name}' command`)
            }
        }
    }

    private async registerBehaviourEvents(): Promise<void> {
        for (const [behaviourName, behaviour] of this.behaviours) {
            await this.registerEvents(behaviour)
        }
    }

    private async init(): Promise<void> {
        await this.registerBehaviourEvents()
    }

    // TODO: this should return void or the result of client.login() ???
    public async start(botToken: string): Promise<void> {
        if (!botToken) {
            throw new Error('A token must be specified to start the bot')
        }

        console.info(`Initial configuration`)
        await this.init()

        console.info(`Starting bot`)
        this.login(botToken)
    }
}
