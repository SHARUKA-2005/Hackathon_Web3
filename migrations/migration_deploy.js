const ClothingStore = artifacts.require("ClothingStore");

module.exports = function(deployer) {
  deployer.deploy(ClothingStore);
};
