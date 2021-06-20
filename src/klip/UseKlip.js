import axios from "axios";
import {
    COUNT_CONTRACT_ADDRESS,
    MARKET_CONTRACT_ADDRESS,
    NFT_TOKEN_CONTRACT_ADDRESS,
    SEND_BUSINESS_CONTRACT_ADDRESS
} from "../constants/index";
// import CounterABI from "../abi/CounterABI.json";


const PREPARE = 'https://a2a-api.klipwallet.com/v2/a2a/prepare';
const APP_NAME = 'LIONBusinessCard';
const isMobile = window.screen.width >= 1280 ? false : true


const getKlipAccessUrl = (method, request_key) => {
    if (method === 'QR') {
        return `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
    }
    if (method === 'iOS') {
        return `kakaotalk://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
    }
    if (method === 'android') {
        return `intent://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${request_key}#Intent;scheme=kakaotalk;package=com.kakao.talk;end`
    }
    return
    return `kakaotalk://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
}



export const safeTransferFrom = async (fromAddress, toAddress, tokenID, setQrvalue, callback) => {
    const functionJSON = '{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}';
    console.log(`[\"${fromAddress}\", \"${toAddress}\", \"${tokenID}\"]`)
    executeContract(
        NFT_TOKEN_CONTRACT_ADDRESS,
        functionJSON,
        "0",
        `[\"${fromAddress}\", \"${toAddress}\", \"${tokenID}\"]`,
        setQrvalue,
        callback
    );

}

export const mintCardWithURI = async (toAddress, tokenId, uri, setQrvalue, callback) => {
    const functionJSON = ' { "constant": false, "inputs": [ { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" }, { "name": "tokenURI", "type": "string" } ], "name": "mintWithTokenURI", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }'
    executeContract(
        NFT_TOKEN_CONTRACT_ADDRESS,
        functionJSON,
        "0",
        `[\"${toAddress}\", \"${tokenId}\", \"${uri}\"]`,
        setQrvalue,
        callback
    );
}



export const executeContract = (txTo, functionJSON, value, params, setQrvalue, callback) => {
    axios.post(
        PREPARE, {
            bapp: {
                name: APP_NAME
            },
            type: "execute_contract",
            transaction: {
                abi: functionJSON,
                to: txTo,
                value: value,
                params: params
            }
        }
    ).then((response) => {
        const request_key = response.data.request_key;
        if (isMobile) {
            window.location.href = getKlipAccessUrl("iOS", request_key);
        } else {
            setQrvalue(getKlipAccessUrl("QR", request_key));
        }
        // 1초마다 결과값을 가져오다
        let timerId = setInterval(() => {
            axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`)
                .then((res) => {
                    // 결과값이 확인되면 인터벌을 해제함.
                    if (res.data.result) {
                        console.log(`[Result] ${JSON.stringify(res.data.result)}`);
                        callback(res.data.result);
                        clearInterval(timerId);
                        setQrvalue("DEFAULT");
                    }
                })
        }, 2000);
    });
}

//Klip API 사용
export const getAddress = (setQrvalue, callback) => {
    axios.post(
        PREPARE, {
            bapp: {
                name: APP_NAME
            },
            type: "auth"
        }
    ).then((response) => {
        const request_key = response.data.request_key;
        if (isMobile) {
            window.location.href = getKlipAccessUrl("iOS", request_key);
        } else {
            setQrvalue(getKlipAccessUrl("QR", request_key));
        }  // 1초마다 결과값을 가져오다
        let timerId = setInterval(() => {
            axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`)
                .then((res) => {
                    // 결과값이 확인되면 인터벌을 해제함.
                    if (res.data.result) {
                        console.log(`[Result] ${JSON.stringify(res.data.result)}`);
                        callback(res.data.result.klaytn_address);
                        clearInterval(timerId);
                        setQrvalue("DEFAULT");
                    }
                })
        }, 500);
    });
}
