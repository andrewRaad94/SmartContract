var DappToken = artifacts.require("./DappToken.sol");

contract('DappToken', function(accounts)  {
	it('checks the initial parameters of the contract', async() => {
		const dappToken = await DappToken.deployed();
		const name = await dappToken.name();
		assert.equal(name,'Dapp Token', 'checks the name of the token');
		const ticker = await dappToken.ticker();
		assert.equal(ticker,'DAPP', 'checks the name of the token');
		const versao = await dappToken.standard();
		assert.equal(versao,'Dapp Token v1.0', 'checks the name of the token');
		});

	it('checks balance of adm and token supply', async() => {
		const dappToken = await DappToken.deployed();
		const totalSupply = await dappToken.totalSupply();
		assert.equal(totalSupply.toString(),'10000', 'checks totalSupply');		
		const balance = await dappToken.balanceOf(accounts[0]);
		assert.equal(balance.toString(),'10000', 'checks the balance of adm');
	});
	it('transfers token ownership', async() => {
		const dappToken = await DappToken.deployed();
		const transfer = await dappToken.transfer.call(accounts[1], 20000);
		assert.equal(transfer,false,'error message must contain revert');
		await dappToken.transfer(accounts[1], 10);
		const balance_2 = await dappToken.balanceOf(accounts[1]);
		console.log(balance_2.toNumber())
		assert.equal(balance_2.toNumber(), 10, 'this checks if the transfer went through' );

		const transfer_test = await dappToken.transfer.call(accounts[1], 1);
		assert.equal(transfer_test,true,'checking if transfer returns true');
	});
	it ('approves address to spend tokens', async() => {
		const dappToken = await DappToken.deployed();
		let sendingAccount = accounts[1];
		let fromAccount = accounts[0];
		let toAccount = accounts[2];
		const result = await dappToken.approve.call(fromAccount,100, {from: sendingAccount});
		assert.equal(result,true, "this checks if the operation returns a success");
		await dappToken.approve(fromAccount,100, {from: sendingAccount}); 
		const approved_value = await dappToken.allowance(sendingAccount,fromAccount);
		assert.equal(approved_value.toNumber(),100,"this checks if the limit was approved");
		const result_overBalance = await dappToken.transferFrom.call(fromAccount,toAccount,20000, {from: sendingAccount});
		assert.equal(result_overBalance,false, "this checks if the operation returns a false if the transfer is over the balance");
		const result_overLimit = await dappToken.transferFrom.call(fromAccount,toAccount,5000, {from: sendingAccount});
		assert.equal(result_overBalance,false, "this checks if the operation returns a false if the transfer is over the limit");
		await dappToken.transferFrom(fromAccount,toAccount,100, {from: sendingAccount});
		const newBalance = await dappToken.balanceOf(toAccount);
		assert.equal(newBalance.toNumber(),100, "this checks if the transfer went through");
	})
});



