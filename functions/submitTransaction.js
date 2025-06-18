const { Server, Networks, Transaction } = require("stellar-sdk");

exports.handler = async function(event) {
  try {
    const { xdr } = JSON.parse(event.body);
    if (!xdr) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing XDR data" })
      };
    }

    const server = new Server("https://horizon.stellar.org");
    const tx = new Transaction(xdr, Networks.PUBLIC);

    const res = await server.submitTransaction(tx);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, result: res })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: err.message,
        stack: err.stack
      })
    };
  }
};
