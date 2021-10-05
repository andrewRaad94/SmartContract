App = {
	web3Provider: null,
	contracts: {},
	account: '0x0',
	loading: false,
	tokenPrice: 1000000000000,
	tokensSold:0,
	tokensAvailable: 7500,



	init: function(){
		console.log("App initialized...")
		return App.initWeb3();
	},

	initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initcontracts();
  },

  initcontracts: function(){
  	$.getJSON("DappTokenSale.json", function(dappTokenSale){
  		App.contracts.DappTokenSale = TruffleContract(dappTokenSale);
  		App.contracts.DappTokenSale.setProvider(App.web3Provider);
  		App.contracts.DappTokenSale.deployed().then(function(dappTokenSale){
				console.log("Dapp Token Sale Address:" , dappTokenSale.address);
			});
  	}).done(function() {
				$.getJSON("DappToken.json", function(dappToken){
	  		App.contracts.DappToken = TruffleContract(dappToken);
	  		App.contracts.DappToken.setProvider(App.web3Provider);
	  		App.contracts.DappToken.deployed().then(function(dappToken){
					console.log("Dapp Token Address:" , dappToken.address);
				});

				App.listenForEvents();
	  		return App.render();
			});
		})
  },


  buyTokens:function() {
  	$('#content').hide();
  	$('#loader').show();
  	var numberOfTokens = $('#numberOfTokens').val();
  	App.contracts.DappTokenSale.deployed().then(function(instance){
  		return instance.buyTokens(numberOfTokens, {
  			from: App.account,
  			value: numberOfTokens*App.tokenPrice,
  			gas: 500000
  		});
  	}).then(function(result){
  		console.log("Tokens Bought...")


  	});
  },


  //listen for events emitted from contracts
  listenForEvents: function() {
  	App.contracts.DappTokenSale.deployed().then(function(instance){
  		instance.Sell({},{
  			fromBlock:0,
  			toBlock:'latest',
  		}).watch(function(error,event){
  			console.log("event triggered",event);
  			App.render();
  		})
  	})
  },

  render: function() {
  	if(App.loading){
  		return;
  	}
  	
  	App.loading = true;
  	var loader = $('#loader');
  	var content = $('#content');

  	loader.show();
  	content.hide();

  	//trying to return the acounts
  	if (window.ethereum){
  		ethereum.request({method: 'eth_requestAccounts'})
  		.then(function(acc){
  			App.account = acc[0];	
  			$('#accountAddress').html("Your Account: " + App.account);
  		})
  		.catch((error) => {
  			if(error.code === 4001) {
  				//EIP-1193 userRejectedRequest erro
  				console.log("Please connect to MetaMask.");
  			} else {
  				console.error(error);
  			}
  		})
  	};


  	//Loading token sale contract
  	App.contracts.DappTokenSale.deployed().then(function(instance) {
  		dappTokenSaleInstance = instance;
  		return dappTokenSaleInstance.tokenPrice()
  	}).then(function(tokenPrice) {
  		App.tokenPrice = tokenPrice;
  		$('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
  		return dappTokenSaleInstance.tokensSold();
  		}).then(function(tokensSold) {
  		App.tokensSold = tokensSold.toNumber();
  		$('.tokens-sold').html(App.tokensSold);
  		$('.tokens-available').html(App.tokensAvailable)

  		var progressPercent = (Math.ceil(App.tokensSold)/App.tokensAvailable)*100;
  		$('#progress').css('width',progressPercent+'%')


  		//Load token Contract
  		App.contracts.DappToken.deployed().then(function(instance){
  			dappTokenInstance = instance;
  			return dappTokenInstance.balanceOf(App.account);
  		}).then(function(balance){
  			$('.dapp-balance').html(balance.toNumber());

	    	App.loading = false;
	  		loader.hide();
	  		content.show();
  	 });
  	});
  }
}


$(function(){
	$(window).load(function(){
		App.init();
	})
});

