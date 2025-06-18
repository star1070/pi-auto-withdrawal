const StellarSdk = require("stellar-sdk");

exports.handler = async function(event) {
  try {
    const { xdr } = JSON.parse(event.body);
    if (!xdr) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing XDR" })
      };
    }

    const server = new StellarSdk.Server("https://horizon.stellar.org");
    const tx = new StellarSdk.Transaction(xdr, StellarSdk.Networks.PUBLIC);
    const response = await server.submitTransaction(tx);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, response })
    };

  } catch (e) {
    let reason = "Unknown";
    if (
      e.response &&
      e.response.data &&
      e.response.data.extras &&
      e.response.data.extras.result_codes
    ) {
      reason = e.response.data.extras.result_codes;
    }

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
      
