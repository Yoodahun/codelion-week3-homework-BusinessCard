import {NFT_TOKEN_CONTRACT_ADDRESS, SEND_BUSINESS_CONTRACT_ADDRESS} from '../constants/index';
import {executeContract} from "../klip/UseKlip";




/**
 * 과거에 보낸 적이 있는 어드레스로, 자신이 가진 명함 NFT만큼 반복하여 재발송하는 Contract입니다.
 * 2020/06/20 현재 실행되지 않으며 개선하지 못하였습니다.
 * @param fromAddress
 * @param setQrvalue
 * @param callback
 * @returns {Promise<void>}
 */
export const sentBusinessCardAgain = async (fromAddress, setQrvalue, callback) => {

    const functionJSON = '{"constant":false,"inputs":[{"name":"NFTAddress","type":"address"},{"name":"from","type":"address"}],"name":"sentBusinessCardAgain","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}';
    executeContract(
        SEND_BUSINESS_CONTRACT_ADDRESS,
        functionJSON,
        "0",
        `[\"${NFT_TOKEN_CONTRACT_ADDRESS}\", \"${fromAddress}\"]`,
        setQrvalue,
        callback
    );
}








