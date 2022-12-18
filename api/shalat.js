import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.API_TOKEN;

export async function waktuShalat(req, res) {
  try {
    const today = new Date();
    const month =
      today.getUTCMonth() !== 1 ? today.getUTCMonth() + 1 : today.getUTCMonth();
    const year = today.getUTCFullYear();
    const day =
      today.getDate() <= 10
        ? `0${today.getDate()}`
        : today.getDate().toString();

    const endpoint = `${process.env.API_PRAYER_ENDPOINT}?country=${req.params.country}&city=${req.params.city}&year=${year}&month=${month}`;
    const config = {
      headers: {
        "X-RapidAPI-Key": process.env.RapidAPI_Key,
        "X-RapidAPI-Host": process.env.RapidAPI_Host,
      },
    };
    await axios
      .get(endpoint, config)
      .then((response) => {
        if (!req.params.token) {
          res
            .json({
              message: "You dont have a token!!!",
            })
            .status(301);
        } else {
          if (req.params.token === token) {
            switch (parseInt(req.params.page)) {
              case 1:
                res
                  .json({
                    message: `Jadwal shalat ${req.params.country}`,
                    data: response.data.data.slice(0, 15),
                  })
                  .status(200);
                break;

              case 2:
                res
                  .json({
                    message: `Jadwal shalat ${req.params.country}`,
                    data: response.data.data.slice(
                      15,
                      response.data.data.length
                    ),
                  })
                  .status(200);
                break;

              default:
                if (req.params.page === "day") {
                  const allData = response.data.data.map((d) => d);
                  const baseOnDay = allData.filter(
                    (d) => d.date.gregorian.day === day
                  );
                  //   console.log(baseOnDay);
                  res
                    .json({
                      message: `Jadwa shalat ${req.params.country} - ${req.params.city}`,
                      data: baseOnDay,
                    })
                    .status(200);
                } else {
                  res
                    .json({
                      message: "Your request are blocked",
                    })
                    .status(404);
                }
                break;
            }
          } else {
            res
              .json({
                message: "Your token is not valid ??",
              })
              .status(404);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.error(error);
  }
}
