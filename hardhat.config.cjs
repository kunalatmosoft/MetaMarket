require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20", // ✅ sets compiler version
  networks: {
    ganache: { 
      url: "http://127.0.0.1:8545", // ✅ default Ganache RPC URL
      chainId: 1337,                // ✅ default Ganache chain ID
      accounts: [
        "0xb4345b3b6aa9f3e95393bbeb90419315b8e9d3364629c9b3bf788f00df4d68d4"
        // ⚠️ Must be a valid Ganache private key (remove 0x if you face signing issues)
      ]
    },
    hardhat: {
      chainId: 31337 // ✅ Hardhat’s in-memory network (default)
    }
  }
};




/* require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig 
module.exports = {
  solidity: "0.8.28",
};
 */