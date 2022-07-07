import Discord, { ClientUser, GuildMember, Intents, MessageEmbed, User } from 'discord.js';
import { client } from '.';
// import { Commands } from './Commands';
import { Meta } from "./Meta"; // kill yourself?
import { Utils } from './Utils';

export module Command {

    export const UNKNOWN_COMMAND = Utils.getBasicEmbed("Unknown Command", `The command you entered does not exist. Type ${Meta.info.prefix}help for help.`, "BLUE");
    export let API_COOLDOWNS = new Map<string, number>();

    export abstract class AbstractCommand {
        abstract name: string; // name the command is executed by
        description: string = "No description provided." // description of the command
        usage?: string = "No usage provided." // paramaters of command
        api: boolean = false; // used if command involves api, and will add a cooldown on using it
        args: number = 0; // amount of arguments needed to run the command
        aliases: string[] = [];
        abstract execute(event: Discord.Message, args: string[]): void; // action for when an user runs a command
        getInformation(): string[] { // gets information about the command in a readable format
            var info = [
                `**${this.name}**`,
                "~~------------------------~~",
                `Description: ${this.description}`,
                `Usage: ${this.usage}`,
                "~~------------------------~~"
            ]
            if(this.aliases.length > 0) info.push(`Aliases: ${this.aliases}`);
            return info;
        }
        getInvalidUsageMessage(): string{ // the message used when an user uses the command improperly
            return `Invalid usage! Usage: ${Meta.info.prefix}${this.usage}`;
        }
    }
    
    export const allCommands: AbstractCommand[] = [];

    export function registerCommand (cmd: AbstractCommand): void{
        allCommands.push(cmd);
    }

    export function getApiCooldownEmbed(id: string): MessageEmbed{
        const remaningTime = (Meta.info.api_cooldown - (Date.now() - API_COOLDOWNS.get(id)!)) / 1000;
        const embed = new MessageEmbed();
        embed.setTitle("Cooldown");
        embed.setColor("RED");
        embed.setDescription(`Please wait ${remaningTime} seconds before using an API command again!`);
        return embed;
    }

    export function startListening(): void{
        client.on("messageCreate", (event) => {
            try {
                var message = event.content;
                if(event.mentions.has(client.user as ClientUser)){
                    event.reply(`My prefix is "${Meta.info.prefix}"!`);
                    return;
                }
                if(message.charAt(0) != Meta.info.prefix) return;
                Utils.log(`${event.author.username} ran command "${message}".`);
                if(message.length <= 1) {
                    Utils.replyEmbed(event, UNKNOWN_COMMAND)
                    return;
                }
                var attemptedCmd = message.substring(1).split(" ")[0];
                var args = message.split(" ").slice(1);
                var command = getCommand(attemptedCmd);
                if(command != null){
                    command = command!;
                    if(command.api && API_COOLDOWNS.get(event.author.id) != undefined){
                        if((Date.now() - API_COOLDOWNS.get(event.author.id)!) < Meta.info.api_cooldown){
                            console.log("On cooldown");
                            event.reply({
                                embeds: [getApiCooldownEmbed(event.author.id)]
                            })
                            return;
                        }
                    }
                    if(args.length < command.args){
                        event.reply({
                            embeds: [getInvalidArgumentsEmbed(command)]
                        })
                        return;
                    }
                    API_COOLDOWNS.set(event.author.id, Date.now());
                    command.execute(event, args);
                } else Utils.replyEmbed(event, UNKNOWN_COMMAND);
            } catch (error) {
                event.reply("An error occurred while processing this command.");
                console.log(error);
            }
            
        });
    }

    export function getCommand(name: string): AbstractCommand | null{
        for(var cmd of allCommands){
            if(cmd.name.toLowerCase() == name.toLowerCase()) return cmd;
            for(var alias of cmd.aliases) if(alias.toLowerCase() == name.toLowerCase()) return cmd;
        }
        return null;
    }

    export function getInvalidArgumentsEmbed(cmd: AbstractCommand): MessageEmbed{
        return Utils.getBasicEmbed("Not enougn arguments!", `This command requires ${cmd.args} argument${cmd.args == 1 ? "" : "s"}!`, "RED");
    }
}