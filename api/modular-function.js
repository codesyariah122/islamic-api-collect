const recallSuccessfuly = async (res, endpoint) => {
  await axios
    .get(endpoint, configHeaders)
    .then((response) => {
      if (response.data.ip) {
        return res
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
      return res.status(status).json({
        message: "Please field valid key or token",
      });
      break;

    case 200:
      const endPoint = `${baseUrl}?apiKey=${geoKey}`;
      recallSuccessfuly(res, endPoint);
      break;
  }
}
