import { randomInt } from "crypto";
import { Message, MessageEmbed, Util } from "discord.js";
import { Command } from "./Command";
import { Meta } from "./Meta";
import { GeneralAPI } from "./GeneralAPI";
import { SkyblockAPI } from "./RunicAPI";
import { Utils } from "./Utils";

export module Commands{

    export class CommandHelp extends Command.AbstractCommand{
        name = "help";
        description = "Gives a list of commands, along with how to use them.";
        usage = "help"
        execute(event: Message<boolean>, args: string[]): void {
            var helpMessage = "All commands:\n";
            Command.allCommands.forEach(cmd => {
                helpMessage = helpMessage.concat(this.getFormatted(cmd));
            })
            var embed = Utils.getBasicEmbed("Help", helpMessage, "BLUE");
            event.reply({embeds: [embed]});
        }

        private getFormatted(cmd: Command.AbstractCommand): string{
            var str = "";
            str = str.concat("\n");
            str = str.concat(cmd.getInformation().join("\n"));
            str = str.concat("\n ");
            return str;
        }
    }

    export class CommandUUID extends Command.AbstractCommand{
        name = "uuid";
        description = "Gets the UUID of a player.";
        usage = "uuid <player>";
        args = 1;
        api = true;
        execute(event: Message<boolean>, args: string[]): void {
            var sentMessage = event.reply(`Getting UUID for ${args[0]}...`);
            GeneralAPI.getUUID(args[0]).then(id => {
                sentMessage.then(msg => {
                    if(id == null || id == undefined) msg.edit({
                        embeds: [GeneralAPI.INVALID_PLAYER]
                    });
                    else msg.edit(`UUID for player ${args[0]} is: ${Utils.formatUUID(id)}`);
                })
            });
        }
    }

    export class CommandName extends Command.AbstractCommand{
        name = "name";
        description = "Gets the name of a player's uuid.";
        usage = "name <uuid>";
        args = 1;
        api = true;
        execute(event: Message<boolean>, args: string[]): void {
            var sentMessage = event.reply(`Getting name for ${args[0]}...`);
            GeneralAPI.getName(args[0]).then(name => {
                sentMessage.then(msg => {
                    msg.edit(`Name for uuid ${args[0]} is: ${name}`);
                })
            });
        }
    }

    export class CommandSBStats extends Command.AbstractCommand{
        name = "sbstats";
        description = "Get the skyblock stats of a runic player";
        usage = "sbstats <name>";
        args = 1;
        api = true;
        execute(event: Message<boolean>, args: string[]): void {
            var pendingEmbed = new MessageEmbed();
            pendingEmbed.setTitle("Getting Skyblock stats...")
            var sentMessage = event.reply({
                embeds: [pendingEmbed]
            });
            GeneralAPI.isValidPlayer(args[0]).then(valid => {
                if(!valid){
                    sentMessage.then(msg => msg.edit({
                        embeds: [GeneralAPI.INVALID_PLAYER]
                    }));
                    return;
                }
                else SkyblockAPI.getPlayerData(args[0]).then(data => {
                    sentMessage.then(msg => {
                        if(data.error != undefined){
                            var errorEmbed = Utils.getBasicEmbed("Error", data.error, "RED");
                            msg.edit({embeds: [errorEmbed]})
                            return;
                        }
                        const kills = data.mobKills as number
                        const deaths = data.deaths as number
                        const talkedToBanker = data.talkedToBanker as boolean
                        var formattedName = GeneralAPI.formatName(args[0]);
                        var embed = new MessageEmbed();
                        embed.setThumbnail(Utils.getPlayerAvatarURL(formattedName));
                        embed.setColor("GREEN")
                        embed.setTitle(`**${formattedName}**`);
                        const description = `Kills: ${kills}\nDeaths: ${deaths}\nTalked to banker: ${talkedToBanker}`
                        embed.setDescription(description)
                        msg.edit({
                            embeds: [embed]
                        })
                    })
                })
            })
        }
    }

    export class CommandIsland extends Command.AbstractCommand{
        name = "island";
        description = "Gets information about a player's island";
        usage = "island <name>";
        args = 1;
        api = true;
        execute(event: Message<boolean>, args: string[]): void {
            var pendingEmbed = new MessageEmbed();
            pendingEmbed.setTitle("Getting Skyblock island...")
            var sentMessage = event.reply({
                embeds: [pendingEmbed]
            });
            GeneralAPI.isValidPlayer(args[0]).then(valid => {
                if(!valid){
                    sentMessage.then(msg => msg.edit({
                        embeds: [GeneralAPI.INVALID_PLAYER]
                    }));
                    return;
                }
                else SkyblockAPI.getPlayerData(args[0]).then(data => {
                    sentMessage.then(msg => {
                        if(data.error != undefined){
                            var errorEmbed = Utils.getBasicEmbed("Error", data.error, "RED");
                            msg.edit({embeds: [errorEmbed]})
                            return;
                        }
                        const dateCreated = data.profileCreated;
                        var formattedName = GeneralAPI.formatName(args[0]);
                        var embed = new MessageEmbed();
                        embed.setThumbnail(Utils.getPlayerAvatarURL(formattedName));
                        embed.setColor("GREEN");
                        embed.setTitle(`**${formattedName}'s Island**`);
                        const description = `Date created: ${dateCreated}`;
                        embed.setDescription(description);
                        msg.edit({
                            embeds: [embed]
                        })
                    })
                })
            })
        }
    }

    export class CommandCoins extends Command.AbstractCommand{
        name = "coins";
        description = "Gets information about a player's coins";
        usage = "coins <name>";
        args = 1;
        api = true;
        execute(event: Message<boolean>, args: string[]): void {
            var pendingEmbed = new MessageEmbed();
            pendingEmbed.setTitle("Getting coins...")
            var sentMessage = event.reply({
                embeds: [pendingEmbed]
            });
            GeneralAPI.isValidPlayer(args[0]).then(valid => {
                if(!valid){
                    sentMessage.then(msg => msg.edit({
                        embeds: [GeneralAPI.INVALID_PLAYER]
                    }));
                    return;
                }
                else SkyblockAPI.getPlayerData(args[0]).then(data => {
                    sentMessage.then(msg => {
                        if(data.error != undefined){
                            var errorEmbed = Utils.getBasicEmbed("Error", data.error, "RED");
                            msg.edit({embeds: [errorEmbed]})
                            return;
                        }
                        const coins = data.coins;
                        const bank = data.bankCoins;
                        var formattedName = GeneralAPI.formatName(args[0]);
                        var embed = new MessageEmbed();
                        embed.setThumbnail(Utils.getPlayerAvatarURL(formattedName));
                        embed.setColor("GREEN");
                        embed.setTitle(`**${formattedName}'s Coins**`);
                        const description = `Coins: ${coins}\nBank: ${bank}`;
                        embed.setDescription(description);
                        msg.edit({
                            embeds: [embed]
                        })
                    })
                })
            })
        }
    }

    export class CommandInventory extends Command.AbstractCommand{
        name = "inventory";
        description = "Gets a player's inventory";
        usage = "inventory <name>";
        args = 1;
        api = true;
        execute(event: Message<boolean>, args: string[]): void {
            var pendingEmbed = new MessageEmbed();
            pendingEmbed.setTitle("Getting inventory...")
            var sentMessage = event.reply({
                embeds: [pendingEmbed]
            });
            GeneralAPI.isValidPlayer(args[0]).then(valid => {
                if(!valid){
                    sentMessage.then(msg => msg.edit({
                        embeds: [GeneralAPI.INVALID_PLAYER]
                    }));
                    return;
                }
                else SkyblockAPI.getPlayerInventory(args[0]).then(data => {
                    sentMessage.then(msg => {
                        if(data.error != undefined){
                            var errorEmbed = Utils.getBasicEmbed("Error", data.error, "RED");
                            msg.edit({embeds: [errorEmbed]})
                            return;
                        }
                        var formattedName = GeneralAPI.formatName(args[0]);
                        var embed = new MessageEmbed();
                        embed.setThumbnail(Utils.getPlayerAvatarURL(formattedName));
                        embed.setColor("GREEN");
                        embed.setTitle(`**${formattedName}'s Inventory**`);
                        embed.setDescription(data);
                        msg.edit({
                            embeds: [embed]
                        })
                    })
                })
            })
        }
    }

    export class CommandDescription extends Command.AbstractCommand{
        name = "description";
        description = "Gets the description of a command.";
        usage = "description <command>";
        args = 1;
        aliases = ["info"];
        execute(event: Message<boolean>, args: string[]): void {
            var command = Command.getCommand(args[0]);
            if(command == null){
                event.reply({
                    embeds: [Utils.getBasicEmbed("Invalid command", "This command does not exist!", "RED")]
                })
                return;
            }
            var stringed = command.getInformation().join("\n");
            event.reply({
                embeds: [Utils.getBasicEmbed(`**Description of ${command.name}**`, stringed, "BLUE")]
            })
        }
    }
}