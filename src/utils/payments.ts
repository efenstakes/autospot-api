var fetch = require('node-fetch')

const serverUrl = "https://48fe-105-163-156-57.ngrok-free.app"


export const getDarajaToken = async ()=> {
    const secret = "0iZbIee5QbS3MTqf";
    const consumer = "q3jAXG12QS9dPe4ZfEF2GEPsKdDb2DFE";
    // const auth = new Buffer(`${consumer}:${secret}`).toString("base64");

    // @ts-ignore
    const auth = new Buffer.from(`${consumer}:${secret}`).toString("base64");
  
    const requuestResult = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        method: "GET",
        headers: {
          authorization: `Basic ${auth}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
  
    const data = await requuestResult.json()
    const token = data?.access_token
  
    return token
}

  
export const initiatePayment = async ({ amount, phone, })=> {
  const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

  // till no or paybill
  const shortCode = 174379
  const passKey = "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjMwODIwMTkwNTAz"

  const date = new Date();
  const timestamp =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);

    // @ts-ignore
  const password = new Buffer.from(shortCode.toString() + passKey + timestamp).toString(
    "base64"
  );

  const data = {
    "BusinessShortCode": shortCode,
    "Password": passKey,
    // "Password": password,
    "Timestamp": "20230820190503",

    // CustomerPayBillOnline for paybill
    // CustomerBuyGoodsOnline for till
    "TransactionType": "CustomerPayBillOnline",
    "Amount": amount,
    "PartyA": phone,
    "PartyB": shortCode,
    "PhoneNumber": phone,
    "CallBackURL": `${serverUrl}/payment-confirmation`,
    "AccountReference": "PayIt LTD",
    "TransactionDesc": "Payment of Items" 
  }


  try {
    const token = await getDarajaToken()
    const requestResult = await fetch(
        url,
        {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Authorization": `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        }
    )

    const resultData = await requestResult.json()

    console.log('====================================');
    console.log("initiatePayment resultData ", resultData);
    console.log('====================================');

    if( Object.keys(resultData).includes("errorMessage") || Object.keys(resultData).includes("errorCode") ) {
      throw new Error("Payment Response has errorMessage and errorCode")
    }

  } catch(e) {

    
    console.log('====================================');
    console.log("initiatePayment error ", e);
    console.log('====================================');
    throw new Error(e)
  }

}


// module.exports = {
//     getDarajaToken,
//     initiatePayment,
// }
