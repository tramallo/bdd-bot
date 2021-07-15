const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json')

const client = new Discord.Client();
client.commands = new Discord.Collection();

//const dirPath = path.resolve('./commands')
fs.readdir('./src/commands/', (err, files) => 
{
    if(err) { return console.error(err) }

    files.forEach(file => 
    {
        if(!file.endsWith(".js")) return;

        let command = require(`./commands/${file}`)

        client.commands.set(command.name, command)
    })
})

client.on("ready", () => 
{
    console.log(config.prefix)
    console.log(`Bot logged at: ${Date.now()}`);
})

client.on("message", msg =>
{
    if(msg.author.bot) return;
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName)

    if(!command) return

    if(command.args && !args.length)
    {
        let reply = 'No has especificado ningun parametro'

        if(command.usage)
        {
            reply += `\nEjemplo de uso: \'${command.usage}\'`
        }

        return msg.channel.send(reply)
    }

    if(msg.channel.type !== 'text')
    {
        msg.channel.send("no respondo por privado papu");
    }

    try
    {
        command.execute(client, config, msg, args)
    }
    catch (error)
    {
        console.error(error)
        msg.reply("hubo un error al ejecutar el comando")
    }

});

client.login(config.token);

    /*if(command === "mute")
    {
        if(!msg.mentions.users.size)
        {
            return msg.reply("tienes que etiquetar al usuario");
        }
        const user = msg.mentions.members.first();
        
        if(msg.member.voice.channel || true)
        {
            if(msg.member.voice.channel.id === user.voice.channel.id)
            {
                if(msg.member.voice.channel.members !== 0)
                {
                    //nueva poll de muteo
                    newPoll(command, null, msg.channel, user);
                }
                else {
                    return msg.reply("Si solo estan los dos, puedes silenciarlo para ti")
                }
            }else {
                return msg.reply("No te molesta si no estan en la misma sala -_-");
            }
        }else {
            return msg.reply("No te molesta si no estas conectado");
        }
        return;
    }
    if(command === "ping")
    {
        msg.channel.send("pong!");
        return;
    }*/