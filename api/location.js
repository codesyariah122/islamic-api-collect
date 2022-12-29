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

function checkValidRequest(params) {
  return params.token === token && params.key === geoKey;
}

export async function yourLocation(req, res) {
  try {
    const params = {
      token: req.params.token,
      key: req.params.key,
    };

    if (!checkValidRequest(params)) {
      return res.status(404).json({
        message: "Please field valid key or token",
      });
    }

    const endPoint = `${baseUrl}?apiKey=${geoKey}`;

    await axios
      .get(endPoint, configHeaders)
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
  } catch (err) {
    res.status(404).json({
      message: "Error fetch data",
      data: err.message,
    });
  }
}
