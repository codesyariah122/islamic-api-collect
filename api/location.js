import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

let baseUrl = process.env.GEO_API,
  token = process.env.API_TOKEN,
  geoKey = process.env.GEO_KEY;
const configHeaders = {
  headers: {
    "Accept-Encoding": "application/json",
  },
};

const recallSuccessfuly = async (res, endpoint, config) => {
  await axios
    .get(endpoint, config)
    .then((response) => {
      if (response.data.ip) {
        res
          .json({
            message: "Your location is detected",
            data: response.data,
          })
          .status(200);
      }
    })
    .catch((err) => {
      res.json({
        message: "Your location detected error request",
        data: err,
      });
    });
};

function checkValidRequest(params) {
  return params.token === token && params.key === geoKey;
}

function returnResponse(res, status) {
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
