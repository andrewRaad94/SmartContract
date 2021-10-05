var DappTokenSale = artifacts.require("./DappTokenSale.sol");
var DappToken = artifacts.require("./DappToken.sol");



contract('DappTokenSale', function(accounts)  {
	var admin = accounts[0];
	var buyer = accounts[1];
	var tokensAvailable = 7500;
	var tokenInstance;
	var tokenInstanceSale;
	var numberOfTokens;
	var tokenPrice = 1000000000000


	it('initializes the contract with the correct values', async() => {
		const dappTokenSale = await DappTokenSale.deployed();
		const dappToken = await DappToken.deployed();
		const address = await dappTokenSale.address;
		assert.notEqual(address,0x0,'has token contract address');
		const tokenPrice = await dappTokenSale.tokenPrice();
		assert.equal(tokenPrice, 1000000000000,'this chekcs the price of the initial token');
		await dappToken.transfer(address, tokensAvailable, {from: admin});


		const result = await dappTokenSale.buyTokens.call(9000, {from: buyer, value: 9000*tokenPrice});
		assert.equal(result, false,"this will be an error because this tries to buy more tokens than available");
		const result_2 = await dappTokenSale.buyTokens.call(5, {from: buyer, value: 8*tokenPrice});
		assert.equal(result_2, false,"we want this not to go through because it tried to pay more eth for the dapptoken");
		});

	it ('ends the token sale', function() {
		return DappToken.deployed().then(function(instance) {
			tokenInstance = instance;
			return	DappTokenSale.deployed();
	}).then(function(instance) {
			tokenSaleInstance = instance;
			return tokenSaleInstance.endSale({from: buyer});
	}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert' >= 0, 'must be admin to end sale'));
			//end sale as admin
		return	tokenSaleInstance.endSale({from:admin});	
	}).then(function(receipt){
		return tokenInstance.balanceOf(admin);
	}).then(function(balance) {
		assert.equal(balance.toNumber(),10000, 'returns all unsold dapp tokens to admin');
	}).then(function(receipt) {
		return tokenSaleInstance.tokenPrice();
	}).then(assert.fail).catch(function(error) {
		assert(error.message.indexOf('exist' >= 0 , "this checks if the token price was destroyed"));
	});	
	});
}); 

	



