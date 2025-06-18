
const { Server, Networks, Transaction } = require("stellar-sdk");

exports.handler = async function(event) {
  try {
    const { xdr } = JSON.parse(event.body);

    if (!xdr) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing signed XDR" })
      };
    }

    const server = new Server("https://horizon.stellar.org");

    // Parse the transaction from XDR for public (mainnet) network
    const transaction = new Transaction(xdr, Networks.PUBLIC);

    // Submit the transaction to the Stellar network
    const response = await server.submitTransaction(transaction);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, result: response })
    };
  } catch (e) {
    console.error("ðŸ”¥ submitTransaction error:", e);
    let reason = e.response?.data?.extras?.result_codes || "Unknown error";
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: e.message,
        reason
      })
    };
  }
};
