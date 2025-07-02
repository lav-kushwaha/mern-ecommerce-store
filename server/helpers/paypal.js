const axios = require('axios');

const PAYPAL_API = process.env.PAYPAL_API;
const CLIENT = process.env.PAYPAL_CLIENT_ID;
const SECRET = process.env.PAYPAL_CLIENT_SECRET;

// Get access token
const getAccessToken = async () => {
  const response = await axios({
    url: `${PAYPAL_API}/v1/oauth2/token`,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: CLIENT,
      password: SECRET,
    },
    data: 'grant_type=client_credentials',
  });

  return response.data.access_token;
};

// Create PayPal order
const createPaypalOrder = async (amount) => {
  const accessToken = await getAccessToken();

  const response = await axios.post(
    `${PAYPAL_API}/v2/checkout/orders`,
    {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount.toFixed(2),
          },
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

// Capture PayPal payment
const capturePaypalOrder = async (orderID) => {
  const accessToken = await getAccessToken();

  const response = await axios.post(
    `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

module.exports = {
  createPaypalOrder,
  capturePaypalOrder,
};
