console.log('starting password manager');

var crypto = require('crypto-js')
var storage = require('node-persist');
storage.initSync();

var argv = require('yargs')
	.command('create', 'Create a new account', function (yargs) {
		yargs.options({
			name: {
				demand: true,
				alias: 'n',
				description: 'Enter the Account name (eg: Twitter, Facebook)',
				type: 'string'
			},
			username: {
				demand: true,
				alias: 'u',
				description: 'Enter the Account username or email',
				type: 'string'
			},
			password: {
				demand: true,
				alias: 'p',
				description: 'Enter the Account password',
				type: 'string'
			},
			masterPassword: {
				demand: true,
				alias: 'm',
				description: 'Enter the Master password',
				type: 'string'
			}
		}).help('help');
	})
	.command('get', 'Get an existing account', function (yargs) {
		yargs.options({
			name: {
				demand: true,
				alias: 'n',
				description: 'Enter the Account name (eg: Twitter, Facebook)',
				type: 'string'
			},
			masterPassword: {
				demand: true,
				alias: 'm',
				description: 'Enter the Master password',
				type: 'string'
			}
		}).help('help');
	})
	.help('help')
	.argv;
var command = argv._[0];

//function to get accounts
function getAccounts (masterPassword) {
	// use getItemSync to fetch accounts
	var encryptedAccount = storage.getItemSync('accounts'); //get accounts
	var accounts = []; //if accounts doesn't exists

	// decrypt
	if (typeof encryptedAccount !== 'undefined') { //if encrypted accoutns has some value
		var bytes = crypto.AES.decrypt(encryptedAccount, masterPassword); //converted into byter through decrypt funcition
		accounts = JSON.parse(bytes.toString(crypto.enc.Utf8)); //this will convert bytes to readbal string format.
	}

	// return accounts array
	return accounts;
}

function saveAccounts (accounts, masterPassword) {
	// encrypt accounts
	var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword); //encrypt the accounts using AES
	
	// setItemSync
	storage.setItemSync('accounts', encryptedAccounts.toString()); //store the encrypted accounts
	
	// return accounts
	return accounts; 
}

//function to create a new account
function createAccount (account, masterPassword) {
	var accounts = getAccounts(masterPassword); //get the accounts array to save the new account

	accounts.push(account); //add the new account to the end of accounts

	saveAccounts(accounts, masterPassword); //save those accounts

	return account;
}

//function to retrieve accounts with username and masterpwd
function getAccount (accountName, masterPassword) {
	var accounts = getAccounts(masterPassword) //get the accounts array
	var matchedAccount; //variable to store matched account

	for(var i=0; i<accounts.length; i++) //looop through the accounts array to find accountName
	{
		if (accounts[i].name === accountName) 
		{
			matchedAccount = accounts[i]; //assign the account found to our new variable 
		}
	});

	return matchedAccount; //return the found account
}

//if command is create, call the create account and pass the values
if (command === 'create') 
{
	try
	{
		var createdAccount = createAccount({ //create a new account
			name: argv.name,
			username: argv.username,
			password: argv.password
		}, argv.masterPassword);
		console.log('Account created!');
		console.log(createdAccount);
	} 
	catch(e) //exception like wroong master pwd
	{
		console.log("Unable to create account!");
	}
}

//if user wants to get account
else if (command === 'get') 
{
	try
	{	
		var fetchedAccount = getAccount(argv.name, argv.masterPassword); //store account in temp variable
		if (typeof fetchedAccount === 'undefined') 
		{ //if account not found
			console.log('Account not found');
		} 
		else 
		{
			console.log('Account found!');
			console.log(fetchedAccount);
		}
	}
	catch(e)
	{
		console.log('Error. Could not get account!');
	}
}
