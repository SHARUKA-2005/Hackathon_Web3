module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "5777",       // Any network (default: none)
      gas: 6721975,          // Gas limit (you can try increasing this)
      gasPrice: 20000000000, // Gas price (in wei)
    },
  },
  
  compilers: {
    solc: {
      version: "0.8.0",    // Specify the exact Solidity version
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
        evmVersion: "istanbul"
      }
    }
  },
};
