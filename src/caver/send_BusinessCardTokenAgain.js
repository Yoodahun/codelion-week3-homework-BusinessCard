import SendBusinessCard from '../abi/SendBusinessCard.json';
import {caver} from './requestHeader';
import {BUSINESS_CONTRACT_ADDRESS, SEND_BUSINESS_CONTRACT_ADDRESS} from '../constants/constant.bobbab';



/**
send_BusinessCardTokenAgain.js
    명함을 새로 생성했을 때, 기존에 보냈던 어드레스들로 재발송해주는 Smart contract 입니다.
    명함이 아무리 많아도, 자신이 이전에 보낸적이 있는 사람들에게만 보냅니다.
    단, 명함이 부족한 경우는 아직 체킹하는 로직이 없습니다.
    TESTNET에서만 동작합니다.
**/

/**
 * Business card를 기존에 보낸 Address들로 다시 보내는 Smart Contract의 객체.
 * @type {Contract}
 */
const contract_SendBusinessCardTokenAgain = new caver.contract(SendBusinessCard, SEND_BUSINESS_CONTRACT_ADDRESS);


/**
 * 과거에 보낸 적이 있는 어드레스들로 자신의 명함을 다시 재발송합니다.
 * 아직 명함이 부족한 경우의 handling은 추가되지 않았습니다.
 * @param privateKey
 * @returns {Promise<void>}
 */
export const sentBusinessCardAgain = async (privateKey) => {
    try {
        const deployer = caver.wallet.keyring.createFromPrivateKey(privateKey);
        caver.wallet.add(deployer);
        const response = await contract_SendBusinessCardTokenAgain
                                .methods.sentBusinessCardAgain(BUSINESS_CONTRACT_ADDRESS, deployer.address)
                                .send({
                                    from: deployer.address,
                                    gas: "0x4bfd200"
                                })
        console.log(response)
        caver.wallet.remove(deployer.address) //caver에 저장된 어드레스 정보를 삭제.
    } catch (e) {
        console.log(e)
    }
}