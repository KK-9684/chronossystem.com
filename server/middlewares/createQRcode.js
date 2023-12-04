const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const createQRcode = async (url) => {
    const qrcode = await QRCode.toDataURL(url);
    const image_name = Date.now() + '.png'
    const filePath = path.join(process.env.BASE_QR_PATH, image_name);
    // Remove the data URL prefix from the Base64 string
    const base64Data = qrcode.replace(/^data:image\/png;base64,/, '');
    // Decode the Base64 string into a buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');
    // Save the image buffer to a file
    fs.writeFileSync(filePath, imageBuffer);

    return "https://chronossystem.com/qrs/" + image_name;
}

module.exports = createQRcode;