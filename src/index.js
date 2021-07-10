const { Client } = require ("discord.js");
const client = new Client();

client.login("ODYzMjYxMDg1OTIxMTgxNzM2.YOkUiQ.mNcmHYeWvx4GR_KTwwzXt_6VtN8");

//este evento se ejecuta cuando el bot ya esta funcionando al iniciar
client.on("ready", () => {

    //imprime este mensaje por consola
    console.log("bot ready");
})

//al llegar un mensaje a un canal de chat se ejecuta este evento
client.on("message", msg => {

    //si el mensaje es "!ping", el bot respondera @usuario, pong
    //al parecer msg.reply etiqueta al usuario, pone una coma y el mensaje especificado
    var mensaje = msg.content

    if(mensaje === "!ping")
    {
        msg.reply("pong");
    }

    if(mensaje === "!andres")
    {
        msg.channel.send("es el bufanda de la banda");
    }
});