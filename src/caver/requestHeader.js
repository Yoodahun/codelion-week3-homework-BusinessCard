import {ACCESS_KEY_ID, SECRET_KEY_ID, CHAIN_ID} from '../constants/constant.bobbab';
import Caver from "caver-js";

/**
 *
 * @type {{headers: [{name: string, value: string}, {name: string, value: string}]}}
 */


// Header
const header = {
    headers: [{
        name: "Authorization",
        value: "Basic " + Buffer.from(ACCESS_KEY_ID + ":" + SECRET_KEY_ID).toString("base64")
    },
        {
            name: "x-chain-id", value: CHAIN_ID

        }
    ]
}

/**
 *
 * @type {Caver}
 */
export const caver = new Caver(
    new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", header)
) // 해당 api를 이용한 request생성