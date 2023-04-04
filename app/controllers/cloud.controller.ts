import fs from "fs";
import path from "path";
import { Readable } from "stream";

// Constants
import { CONSTANTS } from "../utils/constants.js";

// Third party
import { google } from "googleapis";
import type * as Express from "express";
import { multerUploadPath } from "../configs/multer.config.js";


// Constants
const KEY_FILE = path.resolve("./", 'app/data/chatzee-2e011da4a858.json');
const SCOPES = CONSTANTS.GOOGLE_CLOUD_CONSOLE.SCOPES;
const FOLDER_ID = CONSTANTS.GOOGLE_CLOUD_CONSOLE.FOLDER_ID;


async function uploadDocument(fileName: string, fileContent: Buffer): Promise<void> {

    try {

        const auth = await google.auth.getClient({
            scopes: SCOPES,
            keyFile: KEY_FILE
        });

        const drive = google.drive({ version: 'v3', auth });

        const fileMetadata = {
            name: fileName,
            parents: [FOLDER_ID]
        };

        const res = await drive.files.create(
            {
                media: {
                    body: Readable.from(fileContent),
                },
                fields: 'webContentLink',
                requestBody: {
                    ...fileMetadata
                }
            }
        );

        if (res && res.data.webContentLink) {
            let fileLink = res
                .data
                .webContentLink
                .replace("export=download", "")
                .concat("&export=media");
            console.log({ fileLink })
        }

    } catch (error) {
        console.log(error)
    }
}


const uploadFile = async (
    req: Express.Request,
    res: Express.Response
) => {

    const FILE_PATH = multerUploadPath + "/Screenshot (2).png";

    try {

        let fileContents = fs.readFileSync(FILE_PATH);
        await uploadDocument("file.png", fileContents);
        res.json({
            message: "Ok"
        })

    } catch (error: any) {
        console.log(error)
        res.json({
            message: CONSTANTS.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG
        })
    }

}

export const cloudController = {
    uploadFile
}