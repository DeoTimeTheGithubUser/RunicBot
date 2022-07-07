import fs from "fs"

export class Meta{
    private static fileName = "./config.json";
    static info = require(this.fileName);

    static setPrefix(value: string){
        this.info.prefix = value;
        fs.writeFile(this.fileName, JSON.stringify(this.info,null,2), () => {});
    }
}