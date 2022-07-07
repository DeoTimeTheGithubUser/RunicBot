import { GeneralAPI } from "./GeneralAPI";
import { Utils } from "./Utils";

export module SkyblockAPI {
    
    export async function getPlayerData(name: string): Promise<any> {
        var uuid = await GeneralAPI.getUUID(name)
        uuid = Utils.formatUUID(uuid)
        return GeneralAPI.getData(`${Skyblock.SKYBLOCK_API_URL}/player/${uuid}`)
    }

    // TODO make formatted item objects
    export async function getPlayerInventory(name: string): Promise<any> {
        var uuid = await GeneralAPI.getUUID(name)
        uuid = Utils.formatUUID(uuid)
        return GeneralAPI.getData(`${Skyblock.SKYBLOCK_API_URL}/player/inventory/${uuid}`)
    }

}

export module Skyblock {
    export const SKYBLOCK_API_URL = "http://localhost:8080/api/skyblock";
}