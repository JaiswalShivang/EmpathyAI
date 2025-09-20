const crypto = require('crypto-js');

// ZegoCloud token generation utility
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  try {
    const appID = parseInt(appId);
    const serverSecretBytes = crypto.enc.Utf8.parse(serverSecret);

    const timestamp = Math.floor(Date.now() / 1000);
    const expire = timestamp + effectiveTimeInSeconds;

    // Create the payload
    const payloadObj = {
      app_id: appID,
      user_id: userId,
      nonce: crypto.lib.WordArray.random(16).toString(),
      ctime: timestamp,
      expire: expire,
      payload: payload
    };

    // Convert payload to base64
    const payloadBase64 = crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(JSON.stringify(payloadObj)));

    // Create signature
    const signature = crypto.HmacSHA256(payloadBase64, serverSecretBytes);
    const signatureBase64 = crypto.enc.Base64.stringify(signature);

    // Combine version, signature, and payload
    const token = `04${signatureBase64}${payloadBase64}`;

    return token;
  } catch (error) {
    console.error('Error generating Zego token:', error);
    throw new Error('Failed to generate Zego token');
  }
}

module.exports = { generateZegoToken };