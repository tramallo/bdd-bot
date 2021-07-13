const { Client, Message } = require ("discord.js");
const client = new Client();


const no = "❌", yes = "⭕", prefix = "!";

client.login("ODYzMjYxMDg1OTIxMTgxNzM2.YOkUiQ.mNcmHYeWvx4GR_KTwwzXt_6VtN8");
//client.login("ODYzNTkwNDI0MDM1MTk2OTQ4.YOpHQQ.GqS0OOge4Z5pTHxZiZCZLOLRq3E");


client.once("ready", () => {

    console.log("bot ready");
})

let msgg = null;
client.on("message", msg => {
    if(!msg.content.startsWith(prefix) || msg.author.bot) return;
    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === "mute")
    {
        if(!msg.mentions.users.size)
        {
            return msg.reply("tienes que etiquetar al usuario");
        }
        const user = msg.mentions.users.first();

        msg.channel.send("Se abre votacion para mutear al usuario: <@"+ user.id +">\nReacciona para votar\n⭕ Para aprobar\n❌ para denegar").then( sent => {
            msgg = sent;
            sent.react(no)
            sent.react(yes)});

        return;
    }
    if(command === "ping")
    {
        msg.channel.send("pong!");
        return;
    }

});