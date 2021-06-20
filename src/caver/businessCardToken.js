import BusinessCardABI from '../abi/BusinessCardABI.json';
import {caver} from './requestHeader';
import {NFT_TOKEN_CONTRACT_ADDRESS, SEND_BUSINESS_CONTRACT_ADDRESS} from '../constants/index';

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
const contract_BusinessCard = new caver.contract(BusinessCardABI, NFT_TOKEN_CONTRACT_ADDRESS);


/**
 * 소지한 토큰들을 승인하게 해주는 API.
 * 현재 code 1034210 리턴되어 존재하지 않는 메소드라고 출력됨.
 * 직접 Private key를 사용하여 keyring object를 얻어야할 것 같은데, 개개인의 privatekey를 얻어서 진행할 수가 없음
 * @param myAddress
 * @returns {Promise<void>}
 */
export const approvalAllToken = async (myAddress) => {

    try {
        const result = await contract_BusinessCard.methods.setApprovalForAll(
        SEND_BUSINESS_CONTRACT_ADDRESS,
        true
    ).send({from: NFT_TOKEN_CONTRACT_ADDRESS, gas: 300000}).then(console.log);
        console.log(result.data)
        const checkresult = await contract_BusinessCard.methods.isApprovedForAll(
            myAddress,
            SEND_BUSINESS_CONTRACT_ADDRESS
        ).call();
        console.log(checkresult);
    } catch (e) {
        console.log(e)
    }

}

/**
 * 생성한 NFT를 가져옵니다.
 * 생성할 때 이미지 URI, 이름, 연락처, 회사정보를 base64 encoding하여 생성하기에
 * 정보를 가저올때 decoding하는 로직이 필요하여 추가하였습니다.
 * @param address
 * @returns nfts info
 */

export const fetchCardsOf = async (address) => {
    // Fetch balacne
    const balance = await contract_BusinessCard.methods.balanceOf(address).call(); //해당 객체의 메소드 호출. 이것은 계속해서 request를 보내고 있는 것과 같다.
    console.log(`[NFT Balance]${balance}`)

    // Fetch Token IDs
    const tokenIds = [];
    for (let i = 0; i < balance; i++) {
        const id = await contract_BusinessCard.methods.tokenOfOwnerByIndex(address, i).call();
        tokenIds.push(id);
    }

    // Fetch TokenURIs
    const tokenURIs = [];
    const tokenName = [];
    const tokenPhoneNumber = [];
    const tokenCompanyName = [];
    for (let i = 0; i < balance; i++) {
        const encodedToken = await contract_BusinessCard.methods.tokenURI(tokenIds[i]).call();
            // console.log(JSON.parse(tokenURI));
        if (encodedToken === '[object Object]') {
            continue;
        }
        var decodedData = JSON.parse(atob(encodedToken));
        var parsedData = JSON.parse(decodedData)
        tokenURIs.push(parsedData.uri);
        tokenName.push(parsedData.name);
        tokenPhoneNumber.push(parsedData.phoneNumber);
        tokenCompanyName.push(parsedData.companyName);
    }
    const nfts = [];
    for (let i = 0; i<balance; i++) {
        nfts.push({
            id: tokenIds[i],
            uri: tokenURIs[i],
            name: tokenName[i],
            phoneNumber: tokenPhoneNumber[i],
            companyName: tokenCompanyName[i]
        });
    }
    console.log(nfts)
    return nfts;
}



