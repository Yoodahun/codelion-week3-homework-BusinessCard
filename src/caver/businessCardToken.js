import Caver from 'caver-js';
import BusinessCardABI from '../abi/BusinessCardABI.json';
import {caver} from './requestHeader';
import {BUSINESS_CONTRACT_ADDRESS} from '../constants/constant.bobbab';

/**
businessCardToken.js
    BusinessCard Token 을 생성합니다.
    아직 토큰을 생성하는 SmartContract에 부족한 사항들이 많아, 일단 임시적으로 Private key를 입력받아 생성하는 방법입니다.
    TESTNET에서만 동작합니다.
**/


/**
 * BusinessCard Token을 생성하고 관리하는 SmartContract의 객체를 생성합니다.
 * @type {Contract}
 */
const contract_BusinessCard = new caver.contract(BusinessCardABI, BUSINESS_CONTRACT_ADDRESS);


/**
 * 토큰을 생성합니다.
 * tokenURI로는 사용자로부터 입력받은 이름, 회사명, 연락처를 json형태의 String 타입으로 넘겨받아 생성합니다.
 * mint대상은 이 BusinessCard Token smart contract를 실행하는 자기 자신에게 mint합니다.
 *
 * @param privateKey
 * @param tokenURI
 * @returns {Promise<void>}
 */
export const mintWithTokenURI = async (privateKey, tokenURI) => {
    try {
        //사용할 account 설정
        const deployer = caver.wallet.keyring.createFromPrivateKey(privateKey)
        caver.wallet.add(deployer);
        // 스마트컨트랙트 실행 트랜잭션 날리기.
        // mint대상은 실행하는 자기 자신.
        const response = await contract_BusinessCard.methods.mintWithTokenURI(deployer.address, tokenURI).send({
            from: deployer.address,
            gas: "0x4bfd200"
        });

        console.log(response);
        caver.wallet.remove(deployer.address) //caver에 저장된 어드레스 정보를 삭제하여 중복발생하는 문제를 대응합니다.
    } catch (e) {
		console.log(e);
    }

}


/**
 * 다른 주소로 토큰을 보냅니다.
 * @param privateKey
 * @param to
 * @returns {Promise<void>}
 */
export const safeTransferFrom = async (privateKey, to) => {
    try {
        const deployer = caver.wallet.keyring.createFromPrivateKey(privateKey)
        caver.wallet.add(deployer);

        //Smart contract를 실행하는 사람이 소유한 토큰을 확인하여 가져옵니다.
        const ownedToken = await contract_BusinessCard.methods.ownedTokens(deployer.address).call();

        // to address로 명함토큰 1개를 보냅니다.
        // from은 smart contract를 실행하는 자기 자신입니다.
        const response = await contract_BusinessCard.methods.safeTransferFrom(deployer.address, to, ownedToken[0], '0x00').send({
            from: deployer.address,
            gas: "0x4bfd200"
        });

        console.log(response);
        caver.wallet.remove(deployer.address) //caver에 저장된 어드레스 정보를 삭제.
    } catch (e) {
		console.log(e);
    }

}



