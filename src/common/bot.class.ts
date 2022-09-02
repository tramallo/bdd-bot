import { Client, ClientOptions, Collection, CommandInteraction, Interaction } from 'discord.js'
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

        if (!behaviour.commands.length && !behaviour.events.length) {
            console.warn(`behaviour '${behaviour.name}' is empty`)
            return
        }

        if (this.behaviours.has(behaviour.name)) {
            console.warn(`behaviour '${behaviour.name}' is already registered, skipping this one`)
            return
        }

        this.behaviours.set(behaviour.name, behaviour)
    }

    private async setupBehaviour(behaviour: Behaviour): Promise<void> {
        console.info(`\nregistering '${behaviour.name}' behaviour`)

        if (behaviour.events.length) {
            for (const event of behaviour.events) {
                this[event.type](event.name, event.onCall)
                console.info(`- ${event.type} '${event.name}' event`)
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

    private async setupCommandHandler() {
        // register commands when bot is ready
        this.once('ready', async (client: Client) => {
            if (!client.user || !client.application) {
                throw new Error('user or application not found.')
            }

            console.info(`creating command list`)
            const list: Array<Command> = []

            for (const [commandName, command] of this.commands) {
                list.push(command)
                console.info(`- '${command.name}' added to list`)
            }

            // TODO: think an intuitive way to stablish to which gilds set the commands (meanwhile a configurable one should be enough)
            this.application.commands.set(list, process.env.TEST_GUILD_ID as string)
            console.info(`command list registered to guild '${process.env.TEST_GUILD_ID}'`)
        })

        // execute command function when command is called
        this.on('interactionCreate', async (interaction: Interaction) => {
            if (!interaction.isCommand()) {
                return
            }

            const command = this.commands.get(interaction.commandName)

            if (!command) {
                throw new Error(`Command '${interaction.commandName}' not found`)
            }

            try {
                // TODO: improve the logging on this file (ex: execution timestamp? options? guild? caller?)
                console.info(`Executing '${interaction.commandName}' command`)
                await command.onCall(interaction)
            } catch (error) {
                console.error(`Unhandled error when executing '${interaction.commandName}' command`)
                throw error as Error
            }
        })
    }

    private async init(): Promise<void> {
        //setup command handler
        await this.setupCommandHandler()

        // setup behaviours
        for (const [behaviourName, behaviour] of this.behaviours) {
            await this.setupBehaviour(behaviour)
        }
    }

    // TODO: this should return void or the result of client.login() ???
    public async start(botToken: string): Promise<void> {
        if (!botToken) {
            throw new Error('a token must be specified to start the bot')
        }

        console.info(`initial configuration`)
        await this.init()

        console.info(`starting bot`)
        this.login(botToken)
    }
}
