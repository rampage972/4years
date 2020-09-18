import React, { Component } from 'react'
import './Lottery.css'
import { CSSTransition, TransitionGroup } from "react-transition-group";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Button, Collapse, List, ListItem, ListItemText, Paper } from '@material-ui/core';
import { faDollarSign, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import userName from './nameMapping.json'
import { CSVLink, CSVDownload } from "react-csv";
const confetti = require('canvas-confetti');
export default class Lottery extends Component {
    constructor() {
        super()
        this.state = {
            csvData: [
                ["Giải đậc biệt", "Giải nhất", "Giải nhì", "Giải ba", "Giải tư", "Giải 5"],
            ],
            listUser: [
            ],
            currentUser: {
                id: 1,
            },
            numberOfRoll: 5,
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
            currentPrize: 5,
            listWinner: [[], [], [], [], [], []],
            listRandomNum: [],
            reward: [
                {
                    name: "Giải Đặc Biệt",
                    prize: 4000000,
                    isChoosen: false,
                    numberOfPrize: 1,
                }
                ,
                {
                    name: "Giải Nhất",
                    prize: 2000000,
                    isChoosen: false,
                    numberOfPrize: 3
                }
                ,
                {
                    name: "Giải Nhì",
                    prize: 1000000,
                    isChoosen: false,
                    numberOfPrize: 5
                }
                ,
                {
                    name: "Giải Ba",
                    prize: 500000,
                    isChoosen: false,
                    numberOfPrize: 10
                }
                ,
                {
                    name: "Giải Tư",
                    prize: 200000,
                    isChoosen: false,
                    numberOfPrize: 20
                }
                ,
                {
                    name: "Giải Năm",
                    prize: 100000,
                    isChoosen: true,
                    numberOfPrize: 50
                }
                ,
            ]
        }
    }
    handleChangeNumberOfRoll = () => {

    }
    componentWillMount = () => {
        let { listUser, currentUser, listWinner, currentPrize } = this.state
        listUser = userName
        this.setState({ listUser, listWinner })
    }
    componentDidMount = () => {
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
        }
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
        let { listUser, listWinner, currentPrize, isClickedRoll } = this.state
        let randomNumber
        if (!isClickedRoll) {
            this.setState({ isClickedRoll: true })
            let interval = setInterval(() => {
                randomNumber = [Math.floor(Math.random() * listUser.length)]
                this.setState({ currentUser: listUser[randomNumber], currentPosition: randomNumber })
            }, 100)
            this.setState({ interval }, () => {
                let time = 3000
                if (currentPrize == 0) time = 10000
                setTimeout(() => {
                    clearInterval(this.state.interval)
                    listWinner[currentPrize].push(listUser[randomNumber])
                    listUser.splice(randomNumber, 1)
                    console.log(listWinner)
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
    setMultipleRandom = () => {
        let { listUserDivine, listCurrentUser, listWinner, currentPrize, listRandomNum, isClickedRoll, csvData } = this.state
        let listUser = []
        if (!isClickedRoll) {
            this.setState({ isClickedRoll: true })
            let intervalMultiple = setInterval(() => {
                for (let i = 0; i < listUserDivine.length; i++) {
                    let randomNum = Math.floor(Math.random() * listUserDivine[i].length)
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
                    listWinner[currentPrize].push(listCurrentUser[i])
                    listUserDivine[i].splice(listRandomNum[i], 1)
                    listUser = listUser.concat(listUserDivine[i])
                }
                console.log(listWinner)
                this.setState({ listWinner, intervalMultiple: "", listUserDivine, listUser, isClickedRoll: false })
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
            }, 3000)
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
    render() {
        const { reward, currentUser, currentPrize, interval, listWinner, listCurrentUser, isClickedRoll, intervalMultiple, csvData } = this.state
        return (
            <div className="container-fluid" style={{ background: "url('/images/background.webp')", minHeight: "100vh" }}>
                <audio style={{ display: "none" }} src="/background.mp3" autoPlay={true}></audio>
                <div className="row pt-5">
                    <div className="col-md-3">
                        <Paper style={{ height: "100%", position: "relative" }}>
                            <img src="/images/background-list.png" alt="" style={{ position: "absolute", width: " 100%", height: "100%" }} />
                            <h3 className="text-center" style={{ padding: "10px" }}>
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
                        </Paper>
                    </div>
                    <div className="col-md-6" >
                        <Paper style={{ backgroundColor: "rgb(255,227,229)", height: "100%", backgroundImage: "url('/images/background-roll.png')", backgroundRepeat: "no-repeat", backgroundSize: "100% 100% " }}>
                            <img src="/images/background2.webp" alt="" style={{ width: "200px", position: "absolute" }} />
                            <div style={{ width: "100%", paddingTop: "200px", textAlign: "center" }}>
                                {currentPrize < 3 ?
                                    <>
                                        <TransitionGroup>
                                            <CSSTransition
                                                key={currentUser.id}
                                                timeout={100}
                                                classNames="lottery-avatar"
                                            >
                                                <img className="moveToList" style={{ width: "200px", height: "260px" }} src={"/images/SOFT_Ảnh thẻ 2020_order/" + currentUser.id + ".JPG"} alt="" />
                                            </CSSTransition>
                                        </TransitionGroup>
                                        <canvas id="fireWork"></canvas>
                                        <img className="moveToList" title="Hello" style={{ width: "200px", height: "260px" }} src={"/images/SOFT_Ảnh thẻ 2020_order/" + currentUser.id + ".JPG"} alt="" />
                                        <p className="winnerName absoluteMiddle">{currentUser.rawName}</p>
                                        {interval == "" && currentPrize < 2 && listWinner[currentPrize].length > 0 ?
                                            <img className="moveToList" src={"/images/frame" + (currentPrize) + ".png"} alt="" style={{ width: "200px", height: "260px", transform: "scale(1.2)" }} />
                                            : null
                                        }

                                    </>
                                    :
                                    <div className="">
                                        {listCurrentUser.map((user, indexUser) => (
                                            <div className="prizeLow" key={indexUser}>
                                                <img style={{ width: "100px", height: "130px" }} src={"/images/SOFT_Ảnh thẻ 2020_order/" + user.id + ".JPG"} alt="" />
                                                {intervalMultiple == "" ? <p>{user.rawName}</p> : null}
                                            </div>
                                        ))}


                                    </div>}
                            </div>
                            <div className={currentPrize < 3 ? "text-center absoluteMiddle" : "text-center"} style={currentPrize < 3 ? { bottom: "10em" } : { paddingBottom: "10em", paddingTop: "1em" }}>
                                <Button style={{ padding: "1em 4em" }} disabled={isClickedRoll} variant="contained" color="secondary" onClick={currentPrize < 3 ? this.setRandom : this.setMultipleRandom}>Roll</Button>
                            </div>
                        </Paper>
                    </div>
                    <div className="col-md-3">
                        <Paper style={{ height: "100%", position: "relative" }}>
                            <div style={{ backgroundImage: "url('/images/confetti.gif')" }}>

                                {/* <img src="/images/confetti.gif" alt="" style={{ width: "100%", position: "absolute" }} />
                                <img src="/images/confetti-flag.png" alt="" style={{ width: "100%", position: "absolute" }} /> */}
                                <h3 className="text-center" style={{ padding: "10px" }}>
                                    Danh sách trúng giải
                            </h3>
                            </div>
                            <div className="sb sb-2">
                                <small>section break 2</small>
                                <hr className="section-break-2" />
                            </div>
                            <div>

                                <List
                                    component="nav"
                                >
                                    {listWinner.map((item, key) => {
                                        if (item.length > 0)
                                            return (
                                                <div key={key}>
                                                    <ListItem button key={key} onClick={() => this.explanWinner(key)}>
                                                        <ListItemText className="listPrizeName" primary={reward[key].name} />
                                                        {item.isOpen ? <ExpandLess /> : <ExpandMore />}
                                                    </ListItem>
                                                    <Collapse in={item.isOpen} timeout="auto" unmountOnExit>
                                                        <List component="div" disablePadding>
                                                            <ListItem style={{ flexWrap: "wrap", width: "100%" }}>
                                                                {item.map((user, index) => (
                                                                    <div key={index}>
                                                                        <img title={user.rawName} key={index} style={{ width: "60px", height: "75px" }} src={"/images/SOFT_Ảnh thẻ 2020_order/" + user.id + ".JPG"} alt="" />
                                                                    </div>
                                                                ))}
                                                            </ListItem>
                                                        </List>
                                                    </Collapse>
                                                </div>)


                                    }
                                    )}
                                </List>
                                <div className="text-center">
                                    <Button variant="contained" color="primary" onClick={this.exportToJsonFile}>Export dữ liệu trúng thưởng</Button>
                                </div>
                            </div>
                        </Paper>
                    </div>
                </div>
            </div>
        )
    }
}
