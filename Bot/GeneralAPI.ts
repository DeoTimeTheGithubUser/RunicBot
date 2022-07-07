import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { Meta } from './Meta';

export module GeneralAPI{

    const fs = require("fs");
    const fileName = "./usercache.json";
    const USER_CACHE_JSON = require(fileName);

    const NAME_CACHE = new Map<string, string>();

    export const API_KEY = Meta.info.api_key;

    export const INVALID_PLAYER = new MessageEmbed()
        .setColor("DARK_RED")
        .setTitle("Invalid player!")
        .setDescription("This player does not exist!");
        
    export const INVALID_API_KEY = "Invalid API key!";

    export async function getData(url: string): Promise<any>{
        const respose = await fetch(url);
        if(respose.status == 204) return null; // response.ok is bad
        return respose.ok ? respose.json() : null;
    }
    
    export async function getUUID(player: string): Promise<string>{
        for(var [key, value] of NAME_CACHE){
            if(key.toLowerCase() == player.toLowerCase()) return value;
        }
        const info = getData(`https://api.mojang.com/users/profiles/minecraft/${player}`);
        return info.then(data => {
            if(data == null || data == undefined) return null;
            cacheUser(data.id, data.name);
            return data.id
        }) as Promise<string>;
    }

    export async function getName(uuid: string): Promise<string>{
        for(var [key, value] of NAME_CACHE){
            if(value.toLowerCase() == uuid.toLowerCase()) return key;
        }
        const info = getData(`https://api.mojang.com/user/profiles/${uuid}/names`);
        return info.then(data => {
            if(data == null || data == undefined) return null;
            var latestName = data[data.length - 1].name;
            cacheUser(uuid, latestName);
            return latestName;
        }) as Promise<string>;
    }

    export async function isValidPlayer(player: string): Promise<boolean>{
        var valid = await getUUID(player);
        return valid != null && valid != undefined;
    }

    export function formatName(player: string): string {
        for(var key of NAME_CACHE.keys()){
            if(key.toLowerCase() == player.toLowerCase()) return key;
        }
        return player;
    }

    export function loadCache(){
        USER_CACHE_JSON["users"].forEach((user: any) => {
            NAME_CACHE.set(user.name, user.uuid);
        });
    }

    function cacheUser(uuid: string, name: string){
        if(uuid == undefined || uuid == null || name == undefined || name == null) return;
        USER_CACHE_JSON["users"].push({"uuid":uuid, "name":name});
        fs.writeFile(fileName, JSON.stringify(USER_CACHE_JSON,null,2), function writeJSON(err: any){
            
        });
        NAME_CACHE.set(name, uuid);
    }
}