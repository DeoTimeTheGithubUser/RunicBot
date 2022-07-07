import { ColorResolvable, DiscordAPIError, Message, MessageEmbed } from "discord.js";

export module Utils{
    export function getPlayerAvatarURL(player: string): string{
        return `https://mc-heads.net/avatar/${player}`
    }

    export function getBasicEmbed(name: string, description: string, color: ColorResolvable): MessageEmbed{
        return new MessageEmbed()
        .setTitle(`**${name}**`)
        .setColor(color)
        .setDescription(description);
    }

    export function formatUUID(uuid: string): string {
        var characters = [...uuid]
        characters.splice(20, 0, '-')
        characters.splice(16, 0, '-')
        characters.splice(12, 0, '-')
        characters.splice(8, 0, '-')
        var formatted = characters.join('')
        return formatted
    }

    export function log(log: string) {
        console.log(`[LOG] ${log}`)
    }

    export function replyEmbed(event: Message, embed: MessageEmbed){{
        event.reply({embeds: [embed]});
    }}
}