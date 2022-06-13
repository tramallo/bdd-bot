"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const commands_1 = tslib_1.__importDefault(require("../commands"));
exports.default = (client) => {
    const onInteractionCreate = (interaction) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            yield handleSlashCommand(client, interaction);
        }
    });
    client.on('interactionCreate', onInteractionCreate);
};
const handleSlashCommand = (client, interaction) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const slashCommand = commands_1.default.find((command) => command.name === interaction.commandName);
    if (!slashCommand) {
        interaction.followUp({ content: 'Command not found' });
        return;
    }
    yield interaction.deferReply();
    slashCommand.run(client, interaction);
});
