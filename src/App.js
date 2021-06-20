import React, {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Alert, Container, Card, Nav, Form, Button, Modal, Row, Col} from "react-bootstrap"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWallet, faPlus} from "@fortawesome/free-solid-svg-icons"
import QRCode from 'qrcode.react';
import './App.css';
import './market.css';
import * as KlipAPI from "./klip/UseKlip";
import * as SendBusinessCard from "./caver/send_BusinessCardTokenAgain"
import {fetchCardsOf, approvalAllToken} from "./caver/businessCardToken";

const DEFAULT_QR_CODE = 'DEFAULT';
const DEFAULT_ADDRESS = '0x0000000000000000000000000000000000000000';

function App() {
    //State Data
    //address
    //NFT
    const [nfts, setNfts] = useState([]); //{tokenId, tokenURI}
    const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);
    const [toAddress, setToAddress] = useState('DEFAULT');
    const [checkWalletTab, setCheckWalletTab] = useState(false);


    // UI
    const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
    // tab
    const [tab, setTab] = useState('MINT'); //MARKET, MINT, WALLET
    // mint input
    const [mintImageUrl, setMintImageUrl] = useState("");
    // mint input
    const [mintName, setMintName] = useState("");
    // mint input
    const [mintPhoneNumber, setMintPhoneNumber] = useState("");
    // mint input
    const [mintCompanyName, setMintCompany] = useState("");

    // modal
    const [showModal, setShowModal] = useState(false);
    const [modalProps, setModalProps] = useState({
        title: "MODAL",
        onConfirm: () => {
        }
    });

    const rows = nfts.slice(nfts.length / 2);

    // fetchMyNFTs
    /**
     * 나의 명함NFT들을 가져오기
     * @returns {Promise<void>}
     */
    const fetchMyNFTs = async () => {
        if (myAddress === DEFAULT_ADDRESS) {
            alert("NO ADDRESS");
            // getUserData();
            return;
        }
        console.log(myAddress);
        const _nfts = await fetchCardsOf(myAddress);
        setNfts(_nfts);
    }

    /**
     * 명함NFT를 생성하기. 각각의 항목이 비어있을 수 있기 때문에, 무조건 입력하도록 alert처
     * @param uri
     * @param name
     * @param phoneNumber
     * @param companyName
     * @returns {Promise<void>}
     */
        // onClickMint
    const onClickMint = async (uri, name, phoneNumber, companyName) => {
            console.log(mintName);
            if (myAddress === DEFAULT_ADDRESS) {
                alert("NO ADDRESS");
                return;
            }
            if (mintImageUrl === null || mintImageUrl === "") {
                alert("No Image URL")
                return;
            }
            if (mintName === null || mintName === "") {
                alert("There is no name. You should be fiil the name.")
                return;
            }
            if (mintPhoneNumber === null || mintPhoneNumber === "") {
                alert("There is no phone number. You should be fill the contact.")
                return;
            }
            if (mintCompanyName === null || mintCompanyName === "") {
                alert("There is no company name. You should be fiil the company name")
                return;
            }

            const businessCardInfo = JSON.stringify({
                uri: uri,
                name: name,
                phoneNumber: phoneNumber,
                companyName: companyName
            });

            var encodedValue = Buffer.from(JSON.stringify(businessCardInfo)).toString("base64")

            console.log(encodedValue);
            const randomTokenID = parseInt(Math.random() * 10000000);
            await KlipAPI.mintCardWithURI(
                myAddress,
                randomTokenID,
                encodedValue,
                setQrvalue,
                (result) => {
                    alert(JSON.stringify(result))
                }
            );
        }

    /**
     * 원하는 상대에게 NFT 명함 보내기.
     * @param tokenId
     */
        // onClickMyCard
    const onClickCard = (tokenId) => {
            if (tab === 'WALLET') {
                setModalProps({
                    title: "NFT를 상대에게 보내시겠습니까?",
                    onConfirm: () => {

                        console.log("onclickSentMyBusinessCard")
                        KlipAPI.safeTransferFrom(
                            myAddress,
                            toAddress.replace(/ /g, ''),
                            tokenId,
                            setQrvalue,
                            (result) => {
                                alert(JSON.stringify(result));
                                setToAddress("");
                            }
                        );

                    }
                })
                setShowModal(true);
            }
        }

    /**
     * 내 NFT 명함 을 Contract가 알아서 보낼 수 있게 허가하는 메소드 호출.
     * code 1034201으로 인하여 구현 실패.
     */
    const onClickApprovalTokenResend = () => {
        approvalAllToken(
            myAddress,
            setQrvalue,
            (result) => {
                alert(JSON.stringify(result))
            }
        );
    }

    /**
     * 내 NFT 명함을 이전에 보냈던 기록이 있는 주소들로 NFT갯수가 있는 만큼 재발송하는 contract 호출.
     * approvalAllToken의 issue 미해결로 인하여 구현 실
     */
    const onClickSentMyBusinessCardAgain = () => {
        SendBusinessCard.sentBusinessCardAgain(
            myAddress,
            setQrvalue,
            (result) => {
                alert(JSON.stringify(result))
            }
        );

    }

    /**
     * Get Wallet address
     */
    // getUserdata klaybalance
    const getUserData = () => {
        setModalProps({
            title: "Kilp 지갑을 연동하시겠습니까?",
            onConfirm: () => {
                KlipAPI.getAddress(setQrvalue, async (address) => {
                    setMyAddress(address)
                });

            }
        })
        setShowModal(true)
        // fetchMyNFTs();
    }

    useEffect(() => {
        getUserData();
    }, [])
    return (
        <div className="App">
            {/*주소 잔고 표시*/}
            <div style={{backgroundColor: "antiquewhite", padding: 10}}>
                <div style={{
                    fontSize: 30, fontWeight: "bold",
                    paddingLeft: 5,
                    marginTop: 10
                }}>
                    My Business Card
                </div>
                <Alert onClick={getUserData} variant={"balance"} style={{backgroundColor: "#f40075"}}>
                    {myAddress !== DEFAULT_ADDRESS ? `${myAddress}` : "지갑 연동하기"
                    }
                </Alert>
                <br/>
                {qrvalue !== 'DEFAULT' ?

                    <Container style={{
                        backgroundColor: 'white',
                        width: 300,
                        height: 300,
                        padding: 20
                    }}>
                        <QRCode value={qrvalue} size={256} style={{margin: "auto"}}/>

                    </Container>
                    : null}
                <br/>
                {/*갤러리(마켓, 내지갑) */}
                {tab === 'MARKET' || tab === 'WALLET' ? (
                    <div className="container" style={{padding: 0, width: "100%"}}>
                        {rows.map((o, rowIndex) => (
                            <Row>
                                <Col style={{marginRight: 0, paddingRight: 0}}>
                                    <Card onClick={() => {
                                        setCheckWalletTab(true);
                                        onClickCard(nfts[rowIndex * 2].id);
                                    }}>
                                        <Card.Img src={nfts[rowIndex * 2].uri}/>
                                    </Card>
                                    {nfts[rowIndex * 2].companyName}
                                    <br/>
                                    {nfts[rowIndex * 2].phoneNumber}
                                    <br/>
                                    {nfts[rowIndex * 2].name} 님
                                </Col>
                                <Col style={{marginRight: 0, paddingRight: 0}}>
                                    {
                                        nfts.length > rowIndex * 2 + 1 ? (
                                            <Card onClick={() => {
                                                setCheckWalletTab(true);
                                                onClickCard(nfts[rowIndex * 2 + 1].id);
                                            }}>
                                                <Card.Img src={nfts[rowIndex * 2 + 1].uri}/>
                                            </Card>
                                        ) : null
                                    }
                                    {nfts.length > rowIndex * 2 + 1 ? (
                                        <>{nfts[rowIndex * 2 + 1].companyName}
                                            <br/>
                                            {nfts[rowIndex * 2 + 1].phoneNumber}
                                            <br/>
                                            {nfts[rowIndex * 2 + 1].name} 님</>
                                    ) : null}
                                </Col>
                            </Row>
                        ))}

                    </div>) : null
                }
                <br/>
                <br/>
                {/*발행페이지*/}
                {tab === 'MINT' ?
                    <div className="container" style={{padding: 0, width: "100%"}}>
                        <Card className="text-center" style={{color: "black", height: "50%", borderColor: "#C5B358"}}>
                            <Card.Body style={{opacity: 0.9, backgroundColor: "black"}}>
                                <h2 className="text-start" style={{color: "white"}}>Send my Business Card Again</h2>
                                <br/>
                                <Form validated={true}>
                                    <br/>
                                    <Button variant="primary"
                                            style={{
                                                backgroundColor: "#810034",
                                                borderColor: "#810034",
                                                marginRight: "10px"
                                            }}
                                            onClick={() => onClickApprovalTokenResend()}>
                                        명함 다시 보내기 허가하기
                                    </Button>
                                    <Button variant="primary"
                                            style={{backgroundColor: "#810034", borderColor: "#810034"}}
                                            onClick={() => onClickSentMyBusinessCardAgain()}>
                                        명함 다시보내기
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                        <br/>
                        <Card className="text-center" style={{color: "black", height: "50%", borderColor: "#C5B358"}}>
                            <Card.Body style={{opacity: 0.9, backgroundColor: "black"}}>
                                <h2 className="text-start" style={{color: "white"}}>Create My Business Card</h2>
                                {mintImageUrl !== "" ? <Card.Img src={mintImageUrl} height={"50%"}/> : null}
                                <br/>
                                <Form validated={true}>
                                    <Form.Group>
                                        <Form.Control
                                            /*{text input}*/
                                            required="true"
                                            value={mintImageUrl}
                                            onChange={(e) => {
                                                setMintImageUrl(e.target.value);
                                            }}
                                            type={"text"}

                                            placeholder="명함이미지를 입력해주세요."

                                        />
                                        <br/>
                                        <Form.Control
                                            /*{text input}*/
                                            required="true"
                                            value={mintName}
                                            onChange={(e) => {
                                                setMintName(e.target.value);
                                            }}
                                            type={"text"}
                                            placeholder="이름 입력해주세요."

                                        />
                                        <br/>
                                        <Form.Control
                                            /*{text input}*/
                                            required="true"
                                            value={mintPhoneNumber}
                                            onChange={(e) => {
                                                setMintPhoneNumber(e.target.value);
                                            }}
                                            type={"number"}
                                            placeholder="연락처를 입력해주세요."

                                        />
                                        <br/>
                                        <Form.Control
                                            /*{text input}*/
                                            required="true"
                                            value={mintCompanyName}
                                            onChange={(e) => {
                                                setMintCompany(e.target.value);
                                            }}
                                            type={"text"}
                                            placeholder="회사명을 입력해주세요."

                                        />
                                        <br/>
                                    </Form.Group>
                                    <br/>
                                    <Button variant="primary"
                                            style={{backgroundColor: "#810034", borderColor: "#810034"}}
                                            onClick={() => onClickMint(mintImageUrl, mintName, mintPhoneNumber, mintCompanyName)}>
                                        발행하기
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                    : null}

            </div>


            {/*모달*/}
            <Modal
                centered
                size="sm"
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                }}
            >
                <Modal.Header
                    style={{
                        border: 0,
                        backgroundColor: "black",
                        color: "white",
                        opacity: 0.8
                    }}>
                    <Modal.Title>
                        {modalProps.title}
                    </Modal.Title>
                </Modal.Header>
                {
                    tab === 'WALLET' && checkWalletTab === true ? (
                        <Modal.Body>
                            <Form>
                                <Form.Group>
                                    <Form.Control
                                        value={toAddress}
                                        onChange={(e) => {
                                            setToAddress(e.target.value);
                                        }}
                                        type={"text"}
                                        placeholder="보내고자하는 Address를 입력해주세요."
                                    >
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                    ) : <div></div>
                }
                <Modal.Footer style={{
                    border: 0,
                    backgroundColor: "black",
                    opacity: 0.8
                }}>
                    <Button variant="secondary" onClick={() => {
                        setShowModal(false)
                    }}>닫기</Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            modalProps.onConfirm();
                            setShowModal(false);

                        }}
                        style={{backgroundColor: "#810034", borderColor: "#810034"}}
                    >진행</Button>

                </Modal.Footer>
            </Modal>


            {/*탭*/}
            <nav style={{backgroundColor: "#1b1717", height: 45}}
                 className="navbar fixed-bottom navbar-light"
                 role="navigation">
                <Nav className="w-100">
                    <div className="d-flex flex-row justify-content-around w-100">
                        <div onClick={() => {
                            setTab("MINT");
                            setCheckWalletTab(false);
                        }} className="row d-flex flex-column justify-content-center align-items-center">
                            <div><FontAwesomeIcon color="white" size="lg" icon={faPlus}/></div>
                        </div>
                        <div onClick={() => {
                            setTab("WALLET");
                            fetchMyNFTs();
                        }} className="row d-flex flex-column justify-content-center align-items-center">
                            <div><FontAwesomeIcon color="white" size="lg" icon={faWallet}/></div>
                        </div>
                    </div>
                </Nav>
            </nav>

        </div>
    );
}

export default App;
