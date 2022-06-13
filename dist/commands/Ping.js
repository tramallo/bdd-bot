"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ping = void 0;
const tslib_1 = require("tslib");
exports.Ping = {
    name: 'ping',
    nameLocalizations: undefined,
    description: 'Replies pong!',
    descriptionLocalizations: undefined,
    type: 1,
    options: [],
    defaultPermission: true,
    run: (client, interaction) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield interaction.followUp({ content: 'pong!' });
    }),
};
