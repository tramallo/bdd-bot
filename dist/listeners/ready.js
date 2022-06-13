"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const commands_1 = tslib_1.__importDefault(require("../commands"));
exports.default = (client) => {
    client.on('ready', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        if (!client.user || !client.application) {
            return;
        }
        yield client.application.commands.set(commands_1.default, '863492307071533065');
        console.log(`${client.user.username} is online`);
    }));
};
