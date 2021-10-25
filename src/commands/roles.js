module.exports = 
{
    name: 'roles',
    description: '',
    execute(client, config, message, args)
    {
        if(!message.mentions.users.size)
        {
            return message.reply('Debes etiqutar a un usuario para saber su rol')
        }
        else
        {
            const tagged = message.mentions.members.first();
            
            let reply = `Los roles de ${tagged.user.username} son: \n\n`

            const roles = tagged.roles.cache.each(role =>
            {
                if(role.name === '@everyone') return
                reply += `${role.name}\n`
            })

            console.log("replying")
            message.channel.send(reply)
        }
    }
}