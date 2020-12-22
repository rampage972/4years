import React, { Component } from 'react'
import './Lottery.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Autoplay } from 'swiper';
import { withStyles } from '@material-ui/core/styles';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Button, Collapse, List, ListItem, Typography, Paper, Tab, Tabs, TableBody, TableCell, TableRow, TableHead, Table, TableContainer, AccordionSummary as MuiAccordionSummary, Accordion, AccordionDetails, IconButton, Backdrop } from '@material-ui/core';
import { faCloudUploadAlt, faDollarSign, faDownload, faFileExport, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import QRCode from 'qrcode'
import { openGame, closeGame,addWinner } from './services'
import './button.css'
import 'swiper/swiper.scss';
import account from './Login/login.json'
import tmpReward from './reward.json'
const reward = tmpReward.reward
const confetti = require('canvas-confetti')
const random = require('random')
const RandomOrg = require('random-org');
const dayjs = require('dayjs')
const randomOrg = new RandomOrg({ apiKey: 'b558199b-0a92-43cb-991b-23551659a901' });
SwiperCore.use([Autoplay]);
const AccordionSummary = withStyles({
    root: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
    },

})(MuiAccordionSummary);
export default class Lottery extends Component {
    constructor() {
        super()
        this.state = {
            isShowListWinner: false,
            isShowGetListUser: true,
            isEndOfList: false,
            listWomenPrize: [],
            currentIndexWomen: 0,
            speedAutoPlay: 100,
            autoPlay: { delay: 0 },
            listUser: [
            ],
            currentUser: {
                id: 1,
            },
            numberOfRoll: 4,
            prizeBeginMutiple: 3,
            listUserDivine: [],
            listCurrentUser: [
                {
                    id: 1,
                },
                {
                    id: 1,
                },
                {
                    id: 1,
                },
                {
                    id: 1,
                },
                {
                    id: 1,
                }
            ],
            isClickedRoll: false,
            interval: "",
            intervalMultiple: "",
            currentPosition: 1,
            currentPrize: 3,
            listWinner: [[], [], [], [], [], []],
            listRandomNum: [],
            reward,
            listUserQR: [],
        }
        this.listNameFileUpload = React.createRef()
    }



    componentWillMount = () => {
        if (localStorage.getItem("username") && localStorage.getItem("password") && localStorage.getItem("username") == account.username && localStorage.getItem("password") == account.password) {
        }
        else {
            this.props.history.push("/login")
        }
    }
    componentDidMount = () => {
        document.addEventListener("keydown", this.my_onkeydown_handler);

    }
    my_onkeydown_handler = (event) => {
        switch (event.keyCode) {
            case 116: // 'F5'
                event.preventDefault();
                // event.keyCode = 0;
                window.status = "F5 disabled";
                break;
        }
    }

    handleGetListUser = () => {
        let data = {
            "requestDate": dayjs().format("YYYYMMDDHHmmss"),
            "requestId": "a0c2b554-4483-4d31-80a4-d4b5e9354ec9",
            "status": 0
        }
        closeGame(data).then(async res => {
            if (res.data.errorCode == "00") {
                let listUserQR = []
                await
                    res.data.data.map(async (item, key) => {
                        let strQr
                        QRCode.toDataURL("bank:VNPTPAY|receiver_id:" + item.phoneNumber + "|transfer_type:MYQRTRANSFER|amount:0").then(data => {
                            strQr = data
                            listUserQR.push({
                                id: key,
                                srcQR: strQr,
                                phoneNumber: item.phoneNumber
                            })
                        })

                    })
                this.setState({ listUser: listUserQR, isShowGetListUser: false, currentUser: listUserQR[0] })
            }
            else if (res.data.errorCode == "06") {
                let dataOpen = {
                    "requestDate": dayjs().format("YYYYMMDDHHmmss"),
                    "requestId": "a0c2b554-4483-4d31-80a4-d4b5e9354ec9",
                    "status": 1
                }
                openGame(dataOpen).then(res => {
                    if (res.data.errorCode == "00") {
                        this.handleGetListUser()
                    }
                })
            }
        }).catch(err => {
            console.log(err)
            this.setState({ isShowGetListUser: false })

        })
    }

    handleAddWinner = (phoneNumber, prizeDetail) => {
        let data = {
            "requestDate": dayjs().format("YYYYMMDDHHmmss"),
            "requestId": "a0c2b554-4483-4d31-80a4-d4b5e9354ec9",
            phoneNumber,
            prizeDetail: prizeDetail.name + ": " + prizeDetail.prize
        }
        addWinner(data).then(res => {
            if (res.data.errorCode == "00") {
               
            }
        })
    }

    handleCreateNewTurn = () => {
        let data = {
            "requestDate": dayjs().format("YYYYMMDDHHmmss"),
            "requestId": "a0c2b554-4483-4d31-80a4-d4b5e9354ec9",
            "status": 1
        }
        openGame(data).then(res => {
            if (res.data.errorCode == "00") {
                this.setState({ listUser: [], isShowGetListUser: true })
            }
        })
    }

    spliceArray = (number) => {
        let { listUser, listUserDivine } = this.state
        let indexArr = 0
        for (let i = 0; i < number; i++)  listUserDivine.push([])
        let sizePerArr = (listUser.length / number).toFixed(0)

        for (let i = 0; i < listUser.length; i++) {
            if (i + 1 == (indexArr + 1) * sizePerArr) indexArr++
            listUserDivine[indexArr].push(listUser[i])
        }
        this.setState({ listUserDivine })
    }



    setRandom = () => {
        let { listUser, listWinner, currentPrize, isClickedRoll, reward } = this.state
        if (listUser.length == 0) {
            this.setState({ isEndOfList: true })
        }
        else if (listUser.length == 1) {
            listWinner[currentPrize].push(listUser[0].phoneNumber)
            this.handleAddWinner(listUser[0].phoneNumber, reward[currentPrize])
            listUser.splice(0, 1)
            this.setState({ listWinner, listUser, interval: "", isClickedRoll: false })
            let myCanvas = document.getElementById('fireWork')
            let myConfetti = confetti.create(myCanvas, {
                resize: true,
                useWorker: true
            });
            myConfetti({
                particleCount: 300,
                spread: 60,
                origin: { y: 0.6 }
            });
        }
        else {
            let randomNumber
            let trullyRandomNumber
            // randomOrg.generateIntegers({ min: 0, max: listUser.length - 1, n: 1 })
            //     .then(function (result) {
            //         trullyRandomNumber = result.random.data[0]
            //     });
            trullyRandomNumber = [random.int(0, listUser.length - 1)]
            if (!isClickedRoll) {
                this.setState({ isClickedRoll: true })
                // if (currentPrize == 0) {
                //     setTimeout(() => {
                //       let intervalAutoPlay=  setInterval(() => {
                //             let { speedAutoPlay } = this.state
                //             speedAutoPlay += 10
                //             this.setState({ speedAutoPlay })

                //         },100)
                //         setTimeout
                //     }, 2000)
                // }
                // else 
                {

                    let interval = setInterval(() => {
                        randomNumber = [random.int(0, listUser.length - 1)]
                        this.setState({ currentUser: listUser[randomNumber], currentPosition: randomNumber })
                    }, 100)
                    this.setState({ interval }, () => {
                        let time = 5000
                        if (currentPrize == 3) time = 3000
                        setTimeout(() => {
                            clearInterval(this.state.interval)
                            this.setState({ currentUser: listUser[trullyRandomNumber], currentPosition: trullyRandomNumber })
                            listWinner[currentPrize].push(listUser[trullyRandomNumber].phoneNumber)
                            this.handleAddWinner(listUser[trullyRandomNumber].phoneNumber, reward[currentPrize])
                            listUser.splice(trullyRandomNumber, 1)
                            this.setState({ listWinner, listUser, interval: "", isClickedRoll: false })
                            let myCanvas = document.getElementById('fireWork')
                            let myConfetti = confetti.create(myCanvas, {
                                resize: true,
                                useWorker: true
                            });
                            myConfetti({
                                particleCount: 300,
                                spread: 60,
                                origin: { y: 0.6 }
                            });
                        }, time)
                    })
                }
            }
        }
    }



    setMultipleRandom = () => {
        let { listUserDivine, listCurrentUser, listWinner, currentPrize, listRandomNum, isClickedRoll } = this.state
        let listUser = []
        let listTrueRandom = []
        for (let i = 0; i < listUserDivine.length; i++) {
            randomOrg.generateIntegers({ min: 0, max: listUserDivine[i].length - 1, n: 1 })
                .then(function (result) {
                    listTrueRandom[i] = result.random.data[0]
                });
        }
        if (!isClickedRoll) {
            this.setState({ isClickedRoll: true })
            let intervalMultiple = setInterval(() => {
                for (let i = 0; i < listUserDivine.length; i++) {
                    let randomNum = random.int(0, listUserDivine[i].length - 1)
                    let tmpData = listUserDivine[i][randomNum]
                    listCurrentUser[i] = tmpData
                    listRandomNum[i] = randomNum
                }
                this.setState({ listCurrentUser, listRandomNum })
            }, 100)
            this.setState({ intervalMultiple })
            setTimeout(() => {
                clearInterval(intervalMultiple)
                for (let i = 0; i < listUserDivine.length; i++) {
                    listCurrentUser[i] = listUserDivine[i][listTrueRandom[i]]
                    listWinner[currentPrize].push(listCurrentUser[i])
                    listUserDivine[i].splice(listTrueRandom[i], 1)
                    listUser = listUser.concat(listUserDivine[i])
                }
                this.setState({ listCurrentUser, listWinner, intervalMultiple: "", listUserDivine, listUser, isClickedRoll: false })
                let myCanvas = document.getElementById('fireWork')
                let myConfetti = confetti.create(myCanvas, {
                    resize: true,
                    useWorker: true
                });
                myConfetti({
                    particleCount: 300,
                    spread: 60,
                    origin: { y: 0.6 }
                });
            }, 5000)
        }
    }



    handleClickPrize = (e) => {
        let { reward, interval } = this.state
        if (!reward[e].isChoosen && interval == "") {
            // this.setRandom()
            for (let i = 0; i < reward.length; i++) {
                if (i != e)
                    reward[i].isChoosen = false
                else
                    reward[i].isChoosen = true
            }
            this.setState({ reward, currentPrize: e })
        }
    }
    explanWinner = (index) => {
        let { listWinner } = this.state
        listWinner[index].isOpen = !listWinner[index].isOpen
        this.setState({ listWinner })
    }

    exportToJsonFile = () => {
        let jsonData = this.state.listWinner
        let dataStr = JSON.stringify(jsonData);
        let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        let exportFileDefaultName = 'data.json';

        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    handleInputListName = (e) => {
        const reader = new FileReader()
        reader.onload = event => {
            let womenDayPrize = event.target.result.split("\n")
            this.setState({ womenDayPrize })
        } // desired file content
        reader.onerror = error => console.log(error)
        reader.readAsText(e.target.files[0])
    }
    handleClickInputFile = () => {
        this.listNameFileUpload.current.click()
    }

    toggleShowListWinner = () => {
        let { isShowListWinner } = this.state
        isShowListWinner = !isShowListWinner
        this.setState({ isShowListWinner })
    }
    render() {
        const {
            speedAutoPlay, listUser, reward, autoPlay,
            currentUser, isShowGetListUser, prizeBeginMutiple,
            isEndOfList, currentPrize, interval, listWinner,
            listCurrentUser, isClickedRoll, intervalMultiple, isShowListWinner
        } = this.state
        return (
            <div className="container-fluid" style={{ background: "url('/images/background.png')", minHeight: "100vh", backgroundRepeat: "no-repeat", backgroundSize: "100% 100% " }}>
                {/* <audio style={{ display: "none" }} src="/background.mp3" autoPlay={true}></audio> */}
                <div style={{ display: "none" }}>
                </div>
                <div className="row pt-5">

                    <div className={"col-md-3"} style={{ minHeight: "85vh" }}>

                        <Paper style={{ height: "100%", position: "relative" }}>
                            <img src="/images/background-list.png" alt="" style={{ position: "absolute", width: " 100%", height: "100%" }} />
                            <div >

                                <h3 className="text-center position-relative" style={{ padding: "10px" }}>
                                    Danh sách giải thưởng
                            </h3>
                                <div className="sb sb-2">
                                    <small>section break 2</small>
                                    <hr className="section-break-2" />
                                </div>
                                <div style={{ padding: "10px" }}>
                                    {reward.map((item, key) => (
                                        <Paper key={key} className={item.isChoosen ? "mb-2 border-Paper" : "mb-2"} elevation={item.isChoosen ? 4 : 1} onClick={() => this.handleClickPrize(key)} style={{ cursor: "pointer" }}>
                                            <div className="row">
                                                <div className="col-md-3 content-middle">
                                                    <img style={{ width: "100%" }} src={"/rewardIcon/" + (key + 1) + ".png"} alt="" />
                                                </div>
                                                <div className="col-md-9">
                                                    <h2>{item.name}</h2>
                                                    <span style={{ color: "green" }}><FontAwesomeIcon icon={faMoneyBillWave} /> {item.prize.toLocaleString('ja-JP') + " VNĐ"}</span>
                                                    <span style={{ paddingLeft: "1em", color: "red", fontWeight: "bold" }}>{listWinner[key].length + "/" + item.numberOfPrize}</span>
                                                </div>
                                            </div>
                                        </Paper>
                                    ))}
                                </div>
                            </div>
                            <div className="text-center">
                                <button className="bttn-jelly bttn-md bttn-danger" onClick={this.handleCreateNewTurn}>Huỷ Chốt Danh Sách</button>
                            </div>
                        </Paper>
                    </div>
                    <div className={"col-md-6"} style={{ minHeight: "85vh" }}>
                        <Paper style={{ backgroundColor: "rgb(255,227,229)", height: "100%", backgroundImage: "url('/images/background-roll.jpg')", backgroundRepeat: "no-repeat", backgroundSize: "100% 100% " }}>

                            <div className="d-flex justify-content-between pt-4">

                                <img src="/images/left-banner.png" alt="" style={{ width: "18em" }} />
                                <img src="/images/banner.png" alt="" style={{ width: "200px" }} />
                            </div>
                            <div className="row justify-content-md-center" style={{ width: "100%", textAlign: "center", margin: 0, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                                {!isEndOfList ?
                                    currentPrize !== -1 ?
                                        currentPrize <= prizeBeginMutiple ? //Chọn lựa quay 1 ảnh 1 lúc
                                            <div className="col-md-12">
                                                <TransitionGroup
                                                    style={{ position: "relative" }}
                                                >
                                                    <CSSTransition
                                                        key={currentUser.id}
                                                        timeout={100}
                                                        classNames="lottery-avatar"
                                                    >
                                                        <>
                                                            <img className="moveToList" style={{ width: "250px", height: "250px" }} src={currentUser.srcQR} alt="" />
                                                        </>
                                                    </CSSTransition>
                                                </TransitionGroup>
                                                {interval == "" && currentPrize < 2 && listWinner[currentPrize].length > 0 ?
                                                    <img className="moveToList" src={"/images/frame" + (currentPrize) + ".png"} alt="" style={{ width: "250px", height: "250px", transform: "scale(1.2)" }} />
                                                    : null
                                                }
                                                <canvas id="fireWork"></canvas>

                                                <img style={{ width: "250px", height: "250px" }} src={currentUser.srcQR} alt="" />

                                            </div>
                                            : // Quay nhiều ảnh 1 lúc
                                            <div className="">
                                                {/* {listCurrentUser.map((user, indexUser) => (
                                                    <div className="prizeLow" key={indexUser}>
                                                        <img style={{ width: "100px", height: "130px" }} src={require("./QRFINTECH/" + currentUser.id + ".png")} alt="" />
                                                        {intervalMultiple == "" ? <p>{user.rawName}</p> : null}
                                                    </div>
                                                ))} */}


                                            </div>
                                        :
                                        <Swiper
                                            freeMode={true}
                                            loop={true}
                                            speed={speedAutoPlay}
                                            autoplay={autoPlay}
                                            spaceBetween={0}
                                            slidesPerView={4}
                                        // onSlideChange={() => console.log('slide change')}
                                        // onSwiper={(swiper) => console.log(swiper)}
                                        >
                                            {/* {listUser.map((user, indexUser) => (
                                                <SwiperSlide key={indexUser}> <img style={{ width: "100%", height: "150px" }} src={require("./QRFINTECH/" + currentUser.id + ".png")} alt="" /></SwiperSlide>
                                            ))} */}
                                        </Swiper>
                                    : <h3>
                                        Đã quay hết số người tham dự
                                    </h3>
                                }
                                {!isEndOfList ?
                                    <div className={"text-center mt-2"} style={currentPrize <= prizeBeginMutiple ? { bottom: "10em" } : { marginTop: "2em" }}>
                                        <Button style={{ padding: "1em 4em", backgroundColor: "#ec1c24", color: "white" }} disabled={isClickedRoll} variant="contained" onClick={currentPrize <= prizeBeginMutiple ? this.setRandom : this.setMultipleRandom}>Roll</Button>
                                    </div> : null}
                            </div>
                        </Paper>
                    </div>

                    <div className="col-md-3">
                        <Paper style={{ height: "100%", position: "relative" }}>
                            <div style={{ backgroundImage: "url('/images/confetti.gif')" }}>
                                <h3 className="text-center" style={{ padding: "10px" }}>
                                    Danh sách trúng giải
                            </h3>
                            </div>
                            <div className="sb sb-2">
                                <hr className="section-break-2" />
                            </div>
                            {isShowListWinner ?
                                <div>
                                    <List
                                        component="nav"
                                    >
                                        {listWinner.map((item, key) => {
                                            if (item.length > 0)
                                                return (
                                                    <div key={key} className="listWinner">
                                                        <Accordion square defaultExpanded={true} >
                                                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon />}>
                                                                <Typography className="font-weight-bold">
                                                                    {reward[key].name}</Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <table style={{ width: "100%" }} >
                                                                    <tbody>

                                                                        {/* <div className="col-md-3 pt-2" key={index}>
                                                                                    <img title={user.rawName} key={index} style={{ width: "100%" }} src={require("./QRFINTECH/" + user.id + ".jpg")} alt="" />
                                                                                </div> */}
                                                                        {item.map((user, index) => (
                                                                            <tr className="pt-2" key={index}>
                                                                                <td style={{ width: "50%", textAlign: "center" }}>
                                                                                    <p>{user}</p>
                                                                                </td>
                                                                                {/* <td className="pl-3" style={{ width: "50%", textAlign: "center" }}>
                                                                                    <p>{user.wnumber}</p>
                                                                                </td> */}
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    </div>)


                                        }
                                        )}
                                    </List>
                                </div>
                                : null
                            }
                            <div className="text-center">
                                <Button variant="contained" color="secondary" onClick={this.toggleShowListWinner}>{isShowListWinner ? "Ẩn danh sách" : "Hiện danh sách"}</Button>
                                {isShowListWinner ? <IconButton onClick={this.exportToJsonFile} >
                                    <FontAwesomeIcon className="ml-2" icon={faDownload} />
                                </IconButton> : null}
                            </div>
                        </Paper>
                    </div>
                </div>
                <Backdrop open={isShowGetListUser} style={{ backgroundColor: "white", zIndex: "100" }}>
                    <button className="bttn-unite bttn-md bttn-primary" onClick={this.handleGetListUser}> Chốt danh sách</button>
                </Backdrop>

            </div>
        )
    }
}
