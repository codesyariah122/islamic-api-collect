import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
let baseUrl = process.env.GEO_API;
const token = process.env.API_TOKEN;
const geoKey = process.env.GEO_KEY;
const configHeaders = {
  headers: {
    "Accept-Encoding": "application/json",
  },
};

function checkValidRequest(params) {
  return params.token === token && params.key === geoKey;
}

async function returnResponse(res, status) {
  switch (status) {
    case 304:
      res
        .json({
          message: "Please field valid key or token",
        })
        .status(status);
      break;

    case 200:
      const endPoint = `${baseUrl}?apiKey=${geoKey}`;
      recallSuccessfuly(res, endPoint, configHeaders);
      break;
  }
}

export function yourLocation(req, res) {
  try {
    const params = {
      token: req.params.token,
      key: req.params.key,
    };

    if (!checkValidRequest(params)) returnResponse(res, 304);

    returnResponse(res, 200);
  } catch (err) {
    res
      .json({
        message: "Error fetch data",
        data: err,
      })
      .status(404);
  }
}

const recallSuccessfuly = async (res, endpoint, config) => {
  await axios
    .get(endpoint, config)
    .then((response) => {
      if (response.data.ip) {
        res.json({
          message: "Your location is detected",
          data: response.data,
        });
      }
    })
    .catch((err) => console.error(err));
};
