import Discord, { GuildMember, Intents, User } from 'discord.js';
import { ActivityTypes } from 'discord.js/typings/enums';
import { Command } from './Command';
import { Commands } from "./Commands";
import { Meta } from './Meta';
import { GeneralAPI } from './GeneralAPI';

export const client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS, 
        Intents.FLAGS.GUILD_MESSAGES, 
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING]
});

// login
client.once("ready", () => {
    console.log("Client has logged in!");
    client.user?.setStatus("dnd");
    client.user?.setActivity("play.runicsky.net", {
        type: "PLAYING"
    })
});

// register commands
Command.startListening();
Command.registerCommand(new Commands.CommandHelp());
Command.registerCommand(new Commands.CommandUUID());
Command.registerCommand(new Commands.CommandName());
Command.registerCommand(new Commands.CommandDescription());
Command.registerCommand(new Commands.CommandSBStats());
Command.registerCommand(new Commands.CommandIsland());
Command.registerCommand(new Commands.CommandCoins());
Command.registerCommand(new Commands.CommandInventory());

GeneralAPI.loadCache();

client.login(Meta.info.token);