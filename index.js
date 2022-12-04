import express from 'express'
import dotenv from 'dotenv'
import axios from 'axios'
import bodyParser from 'body-parser'
import cors from 'cors'
import fs from 'fs'
import path, {dirname} from 'path'
import {fileURLToPath} from 'url'
import {waktuShalat} from './api/shalat.js'

dotenv.config()

const server = express()
const allowOrigins = {origin: '*'}
const __dirname = dirname(fileURLToPath(import.meta.url))

server.use(express.static(path.join(__dirname, '/public')))
server.set(cors, allowOrigins)
server.set(bodyParser.json())
const urlEncodedParser = server.set(bodyParser.urlencoded({extended: true}))

server.get('/', (req, res) => {
	res.sendFile(path.join(`${__dirname}/public/index.html`))
})

server.use('/api/islamic/v1/:token/:country/:city/:page', cors(allowOrigins), waktuShalat)

server.listen(process.env.PORT, () => {
	console.log('Server is now running')
})