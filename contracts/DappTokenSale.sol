pragma solidity >=0.7.0 <0.9.0;

import "./DappToken.sol";



contract DappTokenSale {
	address admin;
	DappToken public tokenContract;
	uint256 public tokenPrice;
	uint256 public tokensSold;

	event Sell(address _buyer, uint256 _amount);
	//Constructor
	//Set the total number of tokens 
	//Read the total number of tokens
	//Name
	constructor(DappToken _tokenContract,uint256 _tokenPrice ) {
		admin = msg.sender;
		tokenContract = _tokenContract;
		tokenPrice = _tokenPrice;
		tokensSold = 0;
		
		//Assign an admin
		//Token Contract
		//Token Price
	}

	function multiply(uint256 x , uint256 y) internal pure returns (uint256 z) {
		require(y == 0 || (z = x*y)/y==x);
	}

	function buyTokens(uint256 _numberofTokens) public payable returns (bool success) {
		//require that the value is equal to the token price
		if (msg.value != multiply(_numberofTokens,tokenPrice)) return false; 

		//enough tokens left
		if (tokenContract.balanceOf(address(this)) <= _numberofTokens) return false;


		require(tokenContract.transfer(msg.sender,_numberofTokens));
		//keep track of tokens sold
		tokensSold += _numberofTokens;
		address _buyer = msg.sender;
		
		//emit sell event
		emit Sell(_buyer, _numberofTokens);
		
		//require succesful transfer
		// return success; 
	}

	function endSale() public {
		//require only admin to do this
		require(msg.sender == admin);
		//transfer the amount of tokens back to the admin
		require(tokenContract.transfer(admin,tokenContract.balanceOf(address(this))));
		//destroy conctract
		// selfdestruct()
		selfdestruct(payable(admin));
	}
}
