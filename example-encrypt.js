var crypto = require('crypto-js');

var secretMsg = {
	name: 'Vishu',
	secretName: '007'
}
var secretKey = '123abc'
var encryptedMsg = crypto.AES.encrypt(JSON.stringify(secretMsg), secretKey);
console.log('Encrypted message: '+encryptedMsg);

var dectypeMsg = crypto.AES.decrypt(encryptedMsg,secretKey);
var plainText = JSON.parse(dectypeMsg.toString(crypto.enc.Utf8));
console.log("Decrypted message: "+plainText.secretName);