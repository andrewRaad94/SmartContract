const DappToken = artifacts.require("./DappToken.sol");
const DappTokenSale = artifacts.require("./DappTokenSale.sol");


module.exports = function (deployer) {
  deployer.then(async () => {
  await deployer.deploy(DappToken,10000);
  var tokenPrice = 1000000000000;
  await deployer.deploy(DappTokenSale, DappToken.address,  tokenPrice);
});
};
