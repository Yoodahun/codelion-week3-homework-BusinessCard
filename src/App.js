import logo from './logo.svg';
import React from "react";
import './App.css';
import * as BusinessToken from './caver/businessCardToken';
import * as SendBusinessCardTokenAgain from './caver/send_BusinessCardTokenAgain';


function App() {

    /**
     * 입력값들을 받아 json형태의 string객체로 만든 다음, 토큰 생성을 실행합니다.
     */
    const mintWithTokenURI = () => {
        var privateKey = document.getElementById("privateKey");
        var name = document.getElementById("name");
        var company = document.getElementById("company");
        var contact = document.getElementById("contact");

        var businessCardContents = {};
        businessCardContents.name = name.value;
        businessCardContents.company = company.value;
        businessCardContents.contact = contact.value;

        BusinessToken.mintWithTokenURI(privateKey.value, JSON.stringify(businessCardContents));
    }

    /**
     * 생성한 토큰들을 하나씩 보냅니다.
     */
    const safeTransferFrom = () => {
        var privateKey = document.getElementById("privateKey");
        var sendToAddress = document.getElementById("sendToAddress");
        BusinessToken.safeTransferFrom(privateKey.value, sendToAddress.value);
    }

    /**
     * 기존에 보낸 이력이 있는 어드레스로 재차 발송합니다.
     */
    const sendBCTokenAgain = () => {
        SendBusinessCardTokenAgain.sentBusinessCardAgain(
            document.getElementById("privateKey").value
        );
    }


    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <div>
                    <label htmlFor="">privateKey</label><input type="text" id="privateKey"/><br/>
                    <label htmlFor="">이름</label><input type="text" id="name"/><br/>
                    <label htmlFor="">회사</label><input type="text" id="company"/><br/>
                    <label htmlFor="">연락처</label><input type="text" id="contact"/><br/>
                </div>

                <button onClick={() => {
                    mintWithTokenURI()
                }}>Create BusinessCard Token
                </button>

                <hr/>
                <br/>
                <div>
                    <label htmlFor="">send to address</label><input type="text" id="sendToAddress"/><br/>
                </div>
                <button onClick={() => {
                    safeTransferFrom()
                }}>send to Address
                </button>
                <br/>
                 <button onClick={() => {
                    sendBCTokenAgain()
                }}>send BusinessCard Again
                </button>

            </header>
        </div>
    );
}

export default App;
