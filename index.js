import express from 'express'
import dotenv from 'dotenv'
import axios from 'axios'
import bodyParser from 'body-parser'
import cors from 'cors'
import path from 'path'
import {waktuShalat} from './api/shalat.js'

dotenv.config()

const server = express()
const allowOrigins = {origin: '*'}

server.use(express.static('public'))
server.set(cors, allowOrigins)
server.set(bodyParser.json())
const urlEncodedParser = server.set(bodyParser.urlencoded({extended: true}))

server.get('/', (req, res) => {
	res.sendFile(path.join(`${__dirname}/public/index.html`))
})

server.get('/api', (req, res) => {
  const path = `/api/islamic/v1/`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

server.use('/api/islamic/v1/:token/:country/:city/:page', cors(allowOrigins), waktuShalat)

server.listen(process.env.PORT, () => {
	console.log('Server is now running')
})