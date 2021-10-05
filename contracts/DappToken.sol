pragma solidity >=0.7.0 <0.9.0;

contract DappToken {
	//Constructor
	//Set the total number of tokens 
	//Read the total number of tokens
	//Name
	string public name = "Dapp Token";
	string public ticker = "DAPP";
	string public standard = "Dapp Token v1.0"; 
	uint256 public totalSupply = 10000;


	event Transfer(
		address indexed _from,
		address indexed _to,
		uint256 _value
	);

	event Approval (
		
		address indexed	_ownner,
		address indexed _spender,
		uint256 _value
		);

	mapping (address => uint256) public balanceOf;
	mapping (address => mapping(address => uint256)) public allowance;

	constructor(uint256 _initialSupply) {
		balanceOf[msg.sender] = _initialSupply;
		 //state variable writes to the blockchain
		// allocate the initial supply	
	}

	//Transfer 
	function transfer(address _to, uint256 _value) public returns (bool success) {
		if (balanceOf[msg.sender] < _value) return false;
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;
		emit Transfer(msg.sender, _to,_value);
		return	true;
	}

	function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
		// Rquire _from has enough tokens
		if (_value > balanceOf[_from]) return false;
		//Require alowance is big enough
		if (_value > allowance[msg.sender][_from]) return false;
		//Change the balance 
		balanceOf[_from] -= _value;
		balanceOf[_to] += _value;
		//Transfer event
		emit Transfer(_from, _to, _value);
		//return a boolean
		 return true;
	}

	function approve(address _spender, uint256 _value) public returns (bool success) {
		allowance[msg.sender][_spender] = _value;
		address _owner = msg.sender;
		emit Approval(_owner, _spender, _value);
		return true;
	} 
	
}