const { Server, Transaction } = require("stellar-sdk");

exports.handler = async function(event) {
  try {
    const { xdr } = JSON.parse(event.body);

    if (!xdr) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing signed XDR" })
      };
    }

    // ✅ Use Pi Network's Horizon endpoint
    const server = new Server("https://api.mainnet.minepi.com");

    // ✅ Use Pi Network passphrase (NOT Stellar PUBLIC)
    const transaction = new Transaction(xdr, "Pi Mainnet");

    const response = await server.submitTransaction(transaction);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, result: response })
    };
  } catch (e) {
    console.error("🔥 submitTransaction error:", e);
    const reason = e.response?.data?.extras?.result_codes || "Unknown error";

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