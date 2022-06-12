"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const secrets_json_1 = require("./secrets.json");
const ready_1 = tslib_1.__importDefault(require("./listeners/ready"));
const interactionCreate_1 = tslib_1.__importDefault(require("./listeners/interactionCreate"));
console.log('Bot is starting...');
const allIntents = new discord_js_1.Intents(32767);
const client = new discord_js_1.Client({
    intents: allIntents,
});
(0, ready_1.default)(client);
(0, interactionCreate_1.default)(client);
client.login(secrets_json_1.BOT_TOKEN);
