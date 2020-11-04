import React, { Component } from 'react'
import './Lottery.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Autoplay } from 'swiper';
import { withStyles } from '@material-ui/core/styles';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Button, Collapse, List, ListItem, Typography, Paper, Tab, Tabs, TableBody, TableCell, TableRow, TableHead, Table, TableContainer, AccordionSummary as MuiAccordionSummary, Accordion, AccordionDetails } from '@material-ui/core';
import { faCloudUploadAlt, faDollarSign, faDownload, faFileExport, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import userName from './fintech_full.json'
import 'swiper/swiper.scss';
import Wheel from './Wheel';
const confetti = require('canvas-confetti')
const random = require('random')
const RandomOrg = require('random-org');
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
            womanMode: false,
            womenDayPrize: ['Pizzas', 'Sandwiches', 'Salads', 'Soup', 'Japanese food', 'Pastas'],
            listWomenPrize: [],
            currentIndexWomen: 0,
            typeOfRoll: 0,
            speedAutoPlay: 100,
            autoPlay: { delay: 0 },
            csvData: [
                ["Giải đậc biệt", "Giải nhất", "Giải nhì", "Giải ba", "Giải tư", "Giải 5"],
            ],
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
            classicRand: [],
            mordermRand: [],
            isClickedRoll: false,
            interval: "",
            intervalMultiple: "",
            currentPosition: 1,
            currentPrize: 3,
            listWinner: [[], [], [], [], [], []],
            listRandomNum: [],
            reward: [
                // {
                //     name: "Giải Đặc Biệt",
                //     prize: 5000000,
                //     isChoosen: false,
                //     numberOfPrize: 1,
                // }
                // ,
                {
                    name: "Giải Nhất",
                    prize: 3000000,
                    isChoosen: false,
                    numberOfPrize: 1
                }
                ,
                {
                    name: "Giải Nhì",
                    prize: 2000000,
                    isChoosen: false,
                    numberOfPrize: 1
                }
                ,
                {
                    name: "Giải Ba",
                    prize: 1000000,
                    isChoosen: false,
                    numberOfPrize: 1
                }
                ,
                {
                    name: "Giải Khuyến Khích",
                    prize: 500000,
                    isChoosen: true,
                    numberOfPrize: 8
                }
                // ,
                // {
                //     name: "Giải Năm",
                //     prize: 100000,
                //     isChoosen: false,
                //     numberOfPrize: 50
                // }
                // ,
            ]
        }
        this.listNameFileUpload = React.createRef()
    }
    handleChangeNumberOfRoll = () => {

    }
    componentWillMount = () => {
        // let { classicRand, mordermRand } = this.state
        // let intervalMap = setInterval(() => {
        //     let classicRanNumber = Math.floor(Math.random() * 100);
        //     let mordermRanNumber = random.int(0, 100)
        //     if (classicRand[classicRanNumber] == null)
        //         classicRand[classicRanNumber] = 0
        //     else classicRand[classicRanNumber]++
        //     if (mordermRand[mordermRanNumber] == null)
        //         mordermRand[mordermRanNumber] = 0
        //     else mordermRand[mordermRanNumber]++
        //     this.setState({ classicRand, mordermRand })
        // }, 100)
        // // setTimeout(() => {
        // //     clearInterval(intervalMap)
        // //     console.log(classicRand)
        // //     console.log(mordermRand)
        // // }, 10000)
        let { listUser, currentUser, listWinner, currentPrize } = this.state
        listUser = userName
        console.log(userName)
        this.setState({ listUser, listWinner })
    }
    componentDidMount = () => {
        // if(this.state.prizeBeginMutiple
        this.spliceArray(this.state.numberOfRoll)
        document.addEventListener("keydown", this.my_onkeydown_handler);
        // this.setMultipleRandom()
    }
    my_onkeydown_handler = (event) => {
        switch (event.keyCode) {
            case 116: // 'F5'
                event.preventDefault();
                // event.keyCode = 0;
                window.status = "F5 disabled";
                break;
            case 89: // 'Y'
                let { womanMode, listUser } = this.state
                for (let i = 1; i <= 9; i++) {
                    listUser.push({
                        id: i
                    })
                }
                this.setState({ womanMode: !womanMode, currentPrize: 0, listUser })
                break;
        }
    }
    spliceArray = (number) => {
        let { listUser, listUserDivine } = this.state
        let indexArr = 0
        for (let i = 0; i < number; i++)  listUserDivine.push([])
        let sizePerArr = (listUser.length / number).toFixed(0)

        for (let i = 0; i < listUser.length; i++) {
            console.log(listUserDivine)
            if (i + 1 == (indexArr + 1) * sizePerArr) indexArr++
            listUserDivine[indexArr].push(listUser[i])
        }
        this.setState({ listUserDivine })
    }

    setRandom = () => {
        let { listUser, listWinner, currentPrize, isClickedRoll, isShowListWinner } = this.state
        let randomNumber
        let trullyRandomNumber
        randomOrg.generateIntegers({ min: 0, max: listUser.length - 1, n: 1 })
            .then(function (result) {
                trullyRandomNumber = result.random.data[0]
            });
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
                    let time = 6000
                    if (currentPrize == 0) time = 7000
                    setTimeout(() => {
                        clearInterval(this.state.interval)
                        this.setState({ currentUser: listUser[trullyRandomNumber], currentPosition: trullyRandomNumber })
                        listWinner[currentPrize].push(listUser[trullyRandomNumber])
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
    setWomenRandom = () => {
        let { listUser, listWinner, currentPrize, isClickedRoll } = this.state
        let randomNumber
        let trullyRandomNumber
        randomOrg.generateIntegers({ min: 0, max: listUser.length - 1, n: 1 })
            .then(function (result) {
                trullyRandomNumber = result.random.data[0]
            });
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
                    let time = 6000
                    if (currentPrize == 0) time = 10000
                    setTimeout(() => {
                        clearInterval(this.state.interval)
                        this.setState({ currentUser: listUser[trullyRandomNumber], currentPosition: trullyRandomNumber })
                        listWinner[currentPrize].push(listUser[trullyRandomNumber])
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
    setMultipleRandom = () => {
        let { listUserDivine, listCurrentUser, listWinner, currentPrize, listRandomNum, isClickedRoll, csvData } = this.state
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
    handleChangeTypeOfRoll = (e, value) => {
        this.setState({ typeOfRoll: value })
    }
    handleSelectWomenPrize = (prize) => {
        let { currentIndexWomen, listWomenPrize, listWomen, womenDayPrize } = this.state
        let tmpWinner = {
            name: listWomen[currentIndexWomen],
            prize: womenDayPrize[prize[0]]
        }
        listWomenPrize.push(tmpWinner)
        currentIndexWomen++
        setTimeout(() => {

            this.setState({ listWomenPrize, currentIndexWomen })
        }, 5000)
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
    render() {
        const { speedAutoPlay, listUser, reward, autoPlay, currentUser, womenDayPrize, listWomenPrize, womanMode, prizeBeginMutiple,
            currentPrize, interval, listWinner, listCurrentUser, isClickedRoll, intervalMultiple, typeOfRoll, isShowListWinner } = this.state
        return (
            <div className="container-fluid" style={{ background: "url('/images/background.webp')", minHeight: "100vh" }}>
                <audio style={{ display: "none" }} src="/background.mp3" autoPlay={true}></audio>
                <div style={{ display: "none" }}>

                    {listUser.map(currentUser => (
                        <img key={currentUser.id} src={require("./QRFINTECH/" + currentUser.id + ".png")} alt="" />
                    ))}
                </div>
                <div className="row pt-5">

                    <div className={"col-md-3"} style={{ minHeight: "85vh" }}>
                        {!womanMode ?
                            <Paper style={{ height: "100%", position: "relative" }}>
                                <img src="/images/background-list.png" alt="" style={{ position: "absolute", width: " 100%", height: "100%" }} />
                                {typeOfRoll == 0 ?
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
                                    :
                                    <div className="position-relative mt-3">
                                        <TableContainer component={Paper}>
                                            <Table aria-label="simple table" className="table mb-0 table-striped">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell align="center" style={{ fontWeight: "bold", fontSize: "2em" }}>Họ Và Tên</TableCell>
                                                        <TableCell align="center" style={{ fontWeight: "bold", fontSize: "2em" }}>Giải Thưởng</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {listWomenPrize.map((itemWomenPrize, keyItemWomenPrize) => (
                                                        <TableRow key={keyItemWomenPrize}>
                                                            <TableCell component="th" scope="row" align="center">
                                                                {itemWomenPrize.name}
                                                            </TableCell>
                                                            <TableCell align="center">{itemWomenPrize.prize}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                }
                            </Paper> : null}
                    </div>
                    <div className={"col-md-6"} style={{ minHeight: "85vh" }}>
                        <Paper style={{ backgroundColor: "rgb(255,227,229)", height: "100%", backgroundImage: "url('/images/background-roll.png')", backgroundRepeat: "no-repeat", backgroundSize: "100% 100% " }}>
                            {womanMode ?
                                <Paper>
                                    <Tabs
                                        centered
                                        value={typeOfRoll}
                                        indicatorColor="secondary"
                                        textColor="secondary"
                                        onChange={this.handleChangeTypeOfRoll}
                                        aria-label="disabled tabs example"
                                    >
                                        <Tab label="Theo Giải" />
                                        <Tab label="Theo Người" />
                                    </Tabs>
                                </Paper>
                                : null}
                            <img src="/images/banner.png" alt="" style={{ width: "200px" }} align="right" />
                            <div className="row justify-content-md-center" style={typeOfRoll == 0 ? { width: "100%", textAlign: "center", margin: 0 } : { margin: 0, textAlign: "center", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                                {typeOfRoll == 0 ? currentPrize !== -1 ? currentPrize <= prizeBeginMutiple ?
                                    <div className="col-md-12">
                                        <TransitionGroup
                                            style={{ position: "relative" }}
                                        >
                                            <CSSTransition
                                                key={currentUser.id}
                                                timeout={100}
                                                classNames="lottery-avatar"
                                            >
                                                {!womanMode ? <img className="moveToList" style={{ width: "250px", height: "250px" }} src={require("./QRFINTECH/" + currentUser.id + ".png")} alt="" />
                                                    : <img className="moveToList" style={{ width: "250px", height: "250px" }} src={require("./WomenDay/" + currentUser.id + ".jpg")} alt="" />}
                                            </CSSTransition>
                                        </TransitionGroup>
                                        {interval == "" && currentPrize < 2 && listWinner[currentPrize].length > 0 ?
                                            <img className="moveToList" src={"/images/frame" + (currentPrize) + ".png"} alt="" style={{ width: "250px", height: "250px", transform: "scale(1.2)" }} />
                                            : null
                                        }
                                        <canvas id="fireWork"></canvas>
                                        {!womanMode ? <img style={{ width: "250px", height: "250px" }} src={require("./QRFINTECH/" + currentUser.id + ".png")} alt="" /> :
                                            <img className="moveToList" style={{ width: "250px", height: "250px" }} src={require("./WomenDay/" + currentUser.id + ".jpg")} alt="" />}
                                        {/* {!womanMode ? <div className="col-md-12 pt-4">
                                            <p className="font-weight-bold">{currentUser.rawName}</p>
                                        </div>
                                            : null} */}

                                    </div>
                                    :
                                    <div className="">
                                        {listCurrentUser.map((user, indexUser) => (
                                            <div className="prizeLow" key={indexUser}>
                                                <img style={{ width: "100px", height: "130px" }} src={require("./QRFINTECH/" + currentUser.id + ".png")} alt="" />
                                                {intervalMultiple == "" ? <p>{user.rawName}</p> : null}
                                            </div>
                                        ))}


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
                                        {listUser.map((user, indexUser) => (
                                            <SwiperSlide key={indexUser}> <img style={{ width: "100%", height: "150px" }} src={require("./QRFINTECH/" + currentUser.id + ".png")} alt="" /></SwiperSlide>
                                        ))}
                                    </Swiper>
                                    : <>
                                        <Wheel items={womenDayPrize} onSelectItem={(prize) => this.handleSelectWomenPrize(prize)} />
                                        <input type="file" onInput={this.handleInputListName} ref={this.listNameFileUpload} style={{ display: "none" }} />
                                        <FontAwesomeIcon icon={faCloudUploadAlt} style={{ bottom: 0, fontSize: "30px", cursor: "pointer" }} onClick={this.handleClickInputFile} />
                                    </>}
                            </div>
                            {typeOfRoll == 0 ?
                                <div className={"text-center mt-2"} style={currentPrize <= prizeBeginMutiple ? { bottom: "10em" } : { marginTop: "2em" }}>
                                    <Button style={{ padding: "1em 4em" }} disabled={isClickedRoll} variant="contained" color="secondary" onClick={!womanMode ? currentPrize <= prizeBeginMutiple ? this.setRandom : this.setMultipleRandom : this.setWomenRandom}>Roll</Button>
                                </div> : null}
                        </Paper>
                    </div>
                    {typeOfRoll == 0 ?
                        <div className="col-md-3">
                            {!womanMode ?
                                <Paper style={{ height: "100%", position: "relative" }}>
                                    <div style={{ backgroundImage: "url('/images/confetti.gif')" }}>

                                        {/* <img src="/images/confetti.gif" alt="" style={{ width: "100%", position: "absolute" }} />
                                <img src="/images/confetti-flag.png" alt="" style={{ width: "100%", position: "absolute" }} /> */}
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
                                                                                            <p>{user.name}</p>
                                                                                        </td>
                                                                                        <td className="pl-3" style={{ width: "50%", textAlign: "center" }}>
                                                                                            <p>{user.wnumber}</p>
                                                                                        </td>
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
                                            <div className="text-center">
                                                <Button variant="contained" color="primary" onClick={this.exportToJsonFile}>Export <FontAwesomeIcon className="ml-2" icon={faDownload} /></Button>
                                            </div>
                                        </div>
                                        :
                                        <div className="text-center">
                                            <Button variant="contained" color="secondary" onClick={() => { this.setState({ isShowListWinner: true }) }}>Kết thúc quay số</Button>
                                        </div>
                                    }
                                </Paper> : null}
                        </div> : null}
                </div>
            </div>
        )
    }
}
