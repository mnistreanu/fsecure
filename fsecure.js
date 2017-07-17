const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const cryptoAlgorithm = 'aes-256-ctr';

let fileName = 'data.txt';
let operation = encrypt;

if (process.argv.length > 1) {
	if (process.argv[2] == '--help') {
		console.log('Commands:');
		
		console.log(`--f \t Next parameter set file name, default is ${fileName}`);
		console.log('--d \t Decrypt file, by default file will be encrypted');

		process.exit();
	}
	else if (process.argv[2] == '--f') {
		if (!process.argv[3]) {
			console.log('Bad command format');
			process.stdin.pause();
		}
		fileName = process.argv[3];
	}
	else if (process.argv[2] == '--d' || process.argv[4] == '--d') {
		operation = decrypt;
	}
}

let filePath = path.join(__dirname, fileName);

console.log('Enter the secret key:');
process.stdin.on('data', text => {
	key = text.toString();
	
	fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) console.log(err);
		
		data = operation(data, key);

		fs.writeFile(filePath, data, err => {
			if (err) console.log(err);

			process.exit();
		});
	});
});

function encrypt(text, key) {
	let cipher = crypto.createCipher(cryptoAlgorithm, key);
	let crypted = cipher.update(text, 'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
}

function decrypt(text, key) {
	var decipher = crypto.createDecipher(cryptoAlgorithm, key);
	var decryped = decipher.update(text, 'hex', 'utf8');
	decryped += decipher.final('utf8');
	return decryped;
}
