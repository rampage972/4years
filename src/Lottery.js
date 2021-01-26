import React, { Component } from 'react'
import './Lottery.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Autoplay } from 'swiper';
import { withStyles } from '@material-ui/core/styles';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Button, Collapse, List, ListItem, Typography, Paper, Tab, Tabs, TableBody, TableCell, TableRow, TableHead, Table, TableContainer, AccordionSummary as MuiAccordionSummary, Accordion, AccordionDetails, IconButton, Backdrop, Snackbar } from '@material-ui/core';
import { faCloudUploadAlt, faDollarSign, faDownload, faFileExport, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import QRCode from 'qrcode'
import './button.css'
import 'swiper/swiper.scss';
import account from './Login/login.json'
import tmpReward from './reward.json'
import Alert from '@material-ui/lab/Alert';
const { createCanvas, loadImage } = require("canvas");
const reward = tmpReward.reward
const confetti = require('canvas-confetti')
const random = require('random')
const RandomOrg = require('random-org');
const dayjs = require('dayjs')
const center_image = require('./QR-logo.png')
const randomOrg = new RandomOrg({ apiKey: 'b558199b-0a92-43cb-991b-23551659a901' });
const rawListUser = require("./user.json")
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
            isEndOfList: false,
            isOpenMessageDelete: false,
            listWomenPrize: [],
            currentIndexWomen: 0,
            listWinnerWithoutPrize: [],
            speedAutoPlay: 100,
            autoPlay: { delay: 0 },
            listUserIMG: [
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
            currentPosition: 2,
            currentPrize: 2,
            listWinner: [[], [], []],
            listRandomNum: [],
            reward,
            listUserIMG: [],
        }
        this.listNameFileUpload = React.createRef()
    }



    componentWillMount = () => {
        if (localStorage.getItem("username") && localStorage.getItem("password") && localStorage.getItem("username") == account.username && localStorage.getItem("password") == account.password) {
            if (localStorage.getItem("listWinner")) {
                this.setState({ listWinner: JSON.parse(localStorage.getItem("listWinner")) })
            }
        }
        else {
            this.props.history.push("/login")
        }

    }
    componentDidMount = () => {
        document.addEventListener("keydown", this.my_onkeydown_handler);
        let canvasListWinner = document.getElementById('confetti')
        let confettiListWinner = canvasListWinner.confetti || confetti.create(canvasListWinner, { resize: true });

        var duration = 600 * 1000;
        var animationEnd = Date.now() + duration;
        var skew = 1;

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        (function frame() {
            var timeLeft = animationEnd - Date.now();
            var ticks = Math.max(200, 500 * (timeLeft / duration));
            skew = Math.max(0.8, skew - 0.001);

            confettiListWinner({
                particleCount: 1,
                startVelocity: 0,
                ticks: ticks,
                gravity: 0.5,
                origin: {
                    x: Math.random(),
                    // since particles fall down, skew start toward the top
                    y: (Math.random() * skew) - 0.2
                },
                colors: ['#ffffff'],
                shapes: ['circle'],
                scalar: randomInRange(0.4, 1)
            });

            if (true) {
                requestAnimationFrame(frame);
            }
        }());
        this.handleGetListUser()
    }
    my_onkeydown_handler = (event) => {
        if (event.ctrlKey && event.keyCode == 77) {
            localStorage.removeItem("listWinner")
            this.setState({ isOpenMessageDelete: true })
        }
        switch (event.keyCode) {
            case 116: // 'F5'
                event.preventDefault();
                // event.keyCode = 0;
                window.status = "F5 disabled";
                break;

        }
    }

    createQRWithLogo = async (dataForQRcode) => {

        let width = 150
        const canvas = createCanvas(width, width);
        await
            QRCode.toCanvas(canvas, dataForQRcode, {
                errorCorrectionLevel: "H",
                margin: 1,
                color: {
                    dark: "#000000",
                    light: "#ffffff",
                },
            });

        const ctx = canvas.getContext("2d");
        const img = await loadImage(center_image);
        const center = 75
        ctx.drawImage(img, center, center, 50, 50)
        return canvas.toDataURL("image/png");
    }

    handleGetListUser = () => {
        let data = {
            "requestDate": dayjs().format("YYYYMMDDHHmmss"),
            "requestId": "a0c2b554-4483-4d31-80a4-d4b5e9354ec9",
            "status": 0
        }

        let listUserIMG = []
        this.setState({ listUserIMG: [] }, async () => {

            const promisess = rawListUser.map(async (item, key) => {
                if (this.state.listWinnerWithoutPrize.indexOf(item["SĐT"]) == -1) {
                    let strQr
                    strQr = await this.createQRWithLogo("bank:VNPTPAY|receiver_id:" + item["SĐT"] + "|transfer_type:MYQRTRANSFER|amount:0")
                    listUserIMG.push({
                        id: key,
                        srcQR: strQr,
                        phoneNumber: item["SĐT"],
                        name: item["TÊN"]
                    })
                    return Promise.resolve()
                }

            })
            Promise.all(promisess).then(() => {

                this.setState({ listUserIMG: listUserIMG, currentUser: listUserIMG[0], isOpenNotiMessage: true })
            })
        })

    }



    spliceArray = (number) => {
        let { listUserIMG, listUserDivine } = this.state
        let indexArr = 0
        for (let i = 0; i < number; i++)  listUserDivine.push([])
        let sizePerArr = (listUserIMG.length / number).toFixed(0)

        for (let i = 0; i < listUserIMG.length; i++) {
            if (i + 1 == (indexArr + 1) * sizePerArr) indexArr++
            listUserDivine[indexArr].push(listUserIMG[i])
        }
        this.setState({ listUserDivine })
    }



    setRandom = () => {
        let { listUserIMG, listWinner, currentPrize, isClickedRoll, reward, listWinnerWithoutPrize } = this.state
        if (listUserIMG.length == 0) {
            this.setState({ isEndOfList: true })
        }
        else if (listUserIMG.length == 1) {
            listWinner[currentPrize].push(listUserIMG[0].name)
            listUserIMG.splice(0, 1)
            localStorage.setItem("listWinner", JSON.stringify(listWinner))
            this.setState({ listWinner, listUserIMG, interval: "", isClickedRoll: false })
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
            // randomOrg.generateIntegers({ min: 0, max: listUserIMG.length - 1, n: 1 })
            //     .then(function (result) {
            //         trullyRandomNumber = result.random.data[0]
            //     });
            trullyRandomNumber = [random.int(0, listUserIMG.length - 1)]
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
                        randomNumber = [random.int(0, listUserIMG.length - 1)]
                        this.setState({ currentUser: listUserIMG[randomNumber], currentPosition: randomNumber })
                    }, 100)
                    this.setState({ interval }, () => {
                        let time = 5000
                        if (currentPrize == 4) time = 3000
                        setTimeout(() => {
                            clearInterval(this.state.interval)
                            this.setState({ currentUser: listUserIMG[trullyRandomNumber], currentPosition: trullyRandomNumber })
                            listWinner[currentPrize].push(listUserIMG[trullyRandomNumber].name)
                            listWinnerWithoutPrize.push(listUserIMG[trullyRandomNumber].name)
                            localStorage.setItem("listWinner", JSON.stringify(listWinner))
                            listUserIMG.splice(trullyRandomNumber, 1)
                            this.setState({ listWinner, listUserIMG, interval: "", isClickedRoll: false })
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
        let listUserIMG = []
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
                    listUserIMG = listUserIMG.concat(listUserDivine[i])
                }
                this.setState({ listCurrentUser, listWinner, intervalMultiple: "", listUserDivine, listUserIMG, isClickedRoll: false })
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
            this.handleGetListUser()
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
            speedAutoPlay, listUserIMG, reward, autoPlay,
            currentUser, prizeBeginMutiple, isOpenMessageDelete,
            isEndOfList, currentPrize, interval, listWinner, isOpenNotiMessage,
            listCurrentUser, isClickedRoll, intervalMultiple, isShowListWinner
        } = this.state
        return (
            <div className="container-fluid" style={{ backgroundColor: "#002151", minHeight: "100vh", backgroundRepeat: "no-repeat", backgroundSize: "100% 100% " }}>
                {/* <audio style={{ display: "none" }} src="/background.mp3" autoPlay={true}></audio> */}
                <div style={{ display: "none" }}>
                </div>
                <div className="row pt-5">

                    <div className={"col-md-3"} style={{ minHeight: "85vh" }}>

                        <Paper className="side-col" >
                            {/* <img src="/images/background-list.png" alt="" style={{ position: "absolute", width: " 100%", height: "100%" }} /> */}
                            <div >

                                <h3 className="text-center position-relative pt-4 side-col-title">
                                    Danh sách giải thưởng
                            </h3>
                                <div className="sb sb-2">
                                    <small>section break 2</small>
                                    <hr className="section-break-2" />
                                </div>
                                <div style={{ padding: "10px" }}>
                                    {reward.map((item, key) => (
                                        <Paper key={key} className={item.isChoosen ? "mb-2 border-Paper prize-container" : "mb-2 prize-container"} elevation={item.isChoosen ? 5 : 1} onClick={() => this.handleClickPrize(key)} style={{ cursor: "pointer" }}>
                                            <div className="row pt-2 pb-2">
                                                <div className="col-md-3 content-middle">
                                                    <img style={{ width: "100%" }} src={"/rewardIcon/" + (key + 1) + ".png"} alt="" />
                                                </div>
                                                <div className="col-md-9">
                                                    <h5>{item.name}</h5>
                                                    <span style={{ color: "green" }}><FontAwesomeIcon icon={faMoneyBillWave} /> {item.prize.toLocaleString('ja-JP') + " VNĐ"}</span>
                                                    <span style={{ paddingLeft: "1em", color: "red", fontWeight: "bold" }}>{listWinner[key].length + "/" + item.numberOfPrize}</span>
                                                </div>
                                            </div>
                                        </Paper>
                                    ))}
                                </div>
                            </div>
                        </Paper>
                    </div>


                    <div className={"col-md-6"} style={{ minHeight: "85vh" }}>
                        {/* <img src="/images/QR-Game-Roll.png" alt="" className="phoneQR-roll-img" /> */}
                        <Paper style={{ backgroundColor: "transparent", height: "100%", backgroundImage: "url('/images/background-roll.png')", backgroundRepeat: "no-repeat", backgroundSize: "100% 100% " }}>

                            <div className="d-flex pt-4 align-items-center ">

                                <img src="/images/banner.png" alt="" className="banner-left" />
                            </div>
                            <div className="row justify-content-md-center" style={{ width: "100%", textAlign: "center", margin: 0, position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)" }}>
                                <img src="/images/logo.png" alt="" className="pb-4" style={{ height: "24vh" }} />
                                {!isEndOfList ?
                                    currentPrize !== -1 ?
                                        currentPrize <= prizeBeginMutiple && listUserIMG.length > 0 ? //Chọn lựa quay 1 ảnh 1 lúc
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
                                                            <img className="moveToList mainRoll-img" src={currentUser.srcQR} alt="" />
                                                        </>
                                                    </CSSTransition>
                                                </TransitionGroup>

                                                <img className="moveToList mainRoll-img" src={"/images/frame" + (0) + ".png"} alt="" style={{ transform: "scale(1.2)" }} />


                                                {/* {interval == "" && currentPrize < 2 && listWinner[currentPrize].length > 0 ?
                                                    <img className="moveToList mainRoll-img" src={"/images/frame" + (currentPrize) + ".png"} alt="" style={{ transform: "scale(1.2)" }} />
                                                    : null
                                                } */}
                                                <canvas id="fireWork"></canvas>
                                                <img className="mainRoll-img" src={currentUser.srcQR} alt="" />

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
                                            {/* {listUserIMG.map((user, indexUser) => (
                                                <SwiperSlide key={indexUser}> <img style={{ width: "100%", height: "150px" }} src={require("./QRFINTECH/" + currentUser.id + ".png")} alt="" /></SwiperSlide>
                                            ))} */}
                                        </Swiper>
                                    : <h3>
                                        Đã quay hết số người tham dự
                                    </h3>
                                }
                                {!isEndOfList ?
                                    <div className={"text-center mt-4 rollBtn-container"} style={currentPrize <= prizeBeginMutiple ? { bottom: "10em" } : { marginTop: "2em" }}>


                                        <div >
                                            <Button className="roll-btn" style={{ padding: "1em 4em", backgroundColor: "#ec1c24", color: "white" }} disabled={isClickedRoll} variant="contained" onClick={currentPrize <= prizeBeginMutiple ? this.setRandom : this.setMultipleRandom}>QUAY</Button>
                                            <div className="roll-btn-gradient"></div>
                                        </div>
                                    </div> : null}
                            </div>
                        </Paper>
                    </div>

                    <div className="col-md-3">
                        <Paper className="side-col" >
                            <div >
                                <canvas id="confetti" className="position-absolute" style={{ width: "100%", height: "5em" }}></canvas>
                                <h3 className="text-center pt-4 side-col-title">
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
                                                                    {console.log(key)}
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
                <Snackbar style={{ paddingTop: "1em" }} anchorOrigin={{ vertical: "top", horizontal: "right" }} open={isOpenNotiMessage} autoHideDuration={2000} onClose={() => this.setState({ isOpenNotiMessage: false })}>
                    <Alert elevation={6} onClose={() => this.setState({ isOpenNotiMessage: false })} severity={"success"}>
                        Đã cập nhật danh sách khách mời.
                    </Alert>
                </Snackbar>
                <Snackbar style={{ paddingTop: "1em" }} anchorOrigin={{ vertical: "top", horizontal: "right" }} open={isOpenMessageDelete} autoHideDuration={2000} onClose={() => this.setState({ isOpenMessageDelete: false })}>
                    <Alert elevation={6} onClose={() => this.setState({ isOpenMessageDelete: false })} severity={"success"}>
                        Đã xoá danh sách trúng thưởng.
                    </Alert>
                </Snackbar>
            </div>
        )
    }
}
