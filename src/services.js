import axios from 'axios'
const ip = "10.144.13.151"
// const ip = "10.144.14.130"
const port = "1368"
// const link = "http://" + ip + ":" + port + "/"
const link = "https://sandboxpay.vnptmedia.vn/admin-api/"
export const openGame = (data) => {
    return axios({
        method: "POST",
        url: link + "lucky-draw/openGame",
        data: data
    })
}
export const closeGame = (data) => {
    return axios({
        method: "POST",
        url: link + "lucky-draw/closeGame",
        data: data
    })
}
export const addWinner = (data) => {
    return axios({
        method: "POST",
        url: link + "lucky-draw/addNumberWinPrize",
        data: data
    })
}