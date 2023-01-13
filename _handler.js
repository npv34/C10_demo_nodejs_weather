const axios = require("axios");
const fs = require("fs");
const getWeather = async (nameCity) => {
    let response = await axios.get('https://api.openweathermap.org/data/2.5/weather',{
        params: {
            q: nameCity,
            appid: '02e3323f29bc461c2346db2fe3989729'
        }
    })

    return Math.floor(response.data.main.temp - 273);
}

const getTemplate = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err.message)
            }
            resolve(data);
        })
    })
}
module.exports = {
    getWeather,
    getTemplate
}
