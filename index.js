import express from 'express'
import dotenv from 'dotenv'
import axios from 'axios'
import bodyParser from 'body-parser'
import cors from 'cors'

dotenv.config()

const server = express()
const allowOrigins = {origin: '*'}
const token = process.env.API_TOKEN

server.set(cors, allowOrigins)
server.set(bodyParser.json())
const urlEncodedParser = server.set(bodyParser.urlencoded({extended: true}))

// server.get('/test', (req, res) => {
// 	res.json({
// 		message: 'Hallo World'
// 	})
// })

server.get('/api', (req, res) => {
  const path = `/api/islamic/v1/`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

server.get('/api/islamic/v1/:token/:country/:city/:page', cors(allowOrigins), async(req, res) => {
	try{
		const today = new Date()
		const month = today.getUTCMonth() !== 1 ? today.getUTCMonth() + 1 : today.getUTCMonth()
		const year = today.getUTCFullYear()
		const day = today.getDate() <= 10 ? `0${today.getDate()}` : toString(today.getDate())
		const endpoint = `${process.env.API_PRAYER_ENDPOINT}?country=${req.params.country}&city=${req.params.city}&year=${year}&month=${month}`
		const config = {
			headers: {
				'X-RapidAPI-Key': process.env.RapidAPI_Key,
				'X-RapidAPI-Host': process.env.RapidAPI_Host
			}
		}
		await axios.get(endpoint, config)
		.then((response) => {
			if(!req.params.token) {
				res.json({
					status: 301,
					message: 'You dont have a token!!!'
				})
			} else {
				if(req.params.token === token) {
					switch(parseInt(req.params.page)) {
						case 1:
						res.json({
							message: `Jadwal shalat ${req.params.country}`,
							data: response.data.data.slice(0, 15)
						})
						break;

						case 2:
						res.json({
							message: `Jadwal shalat ${req.params.country}`,
							data: response.data.data.slice(15, response.data.data.length)
						})
						break;

						default:
						if(req.params.page === 'day') {					
							const allData = response.data.data.map(d => d)
							const baseOnDay = allData.filter(d => d.date.gregorian.day === day)
							res.json({
								message: `Jadwa shalat ${req.params.country} - ${req.params.city}`,
								data: baseOnDay
							})
						} else {
							res.json({
								message: 'Your request are blocked'
							})
						}
						break;
					}
				} else {
					res.json({
						status: 404,
						message: 'Your token is not valid ??'
					})
				}
			}
		})
		.catch((err) => {
			console.log(err)
		})
	}catch(error) {
		console.error(error)
	}
})

server.listen(process.env.PORT, () => {
	console.log('Server is now running')
})