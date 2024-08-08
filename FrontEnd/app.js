document.addEventListener('DOMContentLoaded', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
            console.log('MetaMask is connected!');
        } catch (error) {
            console.error('User denied access to MetaMask');
        }
    } else {
        console.error('MetaMask is not installed!');
    }

    const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your deployed contract address
    const abi = [ // Replace with your smart contract ABI
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_name",
                    "type": "string"
                },
                {
                    "name": "_price",
                    "type": "uint256"
                },
                {
                    "name": "_quantity",
                    "type": "uint256"
                }
            ],
            "name": "addItem",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    const clothingContract = new web3.eth.Contract(abi, contractAddress);

    const addItemForm = document.getElementById('addItemForm');
    const itemNameInput = document.getElementById('itemName');
    const itemPriceInput = document.getElementById('itemPrice');
    const itemQuantityInput = document.getElementById('itemQuantity');
    const itemList = document.getElementById('itemList');

    addItemForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const itemName = itemNameInput.value;
        const itemPrice = web3.utils.toWei(itemPriceInput.value.toString(), 'ether');
        const itemQuantity = itemQuantityInput.value;

        try {
            await clothingContract.methods.addItem(itemName, itemPrice, itemQuantity).send({ from: web3.eth.defaultAccount });
            console.log('Item added successfully!');
            itemNameInput.value = '';
            itemPriceInput.value = '';
            itemQuantityInput.value = '';
            fetchItems();
        } catch (error) {
            console.error('Error adding item:', error);
        }
    });

    async function fetchItems() {
        itemList.innerHTML = ''; // Clear previous items

        const itemCount = await clothingContract.methods.itemCount().call();
        for (let i = 1; i <= itemCount; i++) {
            const item = await clothingContract.methods.items(i).call();
            const itemElement = document.createElement('div');
            itemElement.classList.add('item');
            itemElement.innerHTML = `
                <strong>Name:</strong> ${item.name}<br>
                <strong>Price:</strong> ${web3.utils.fromWei(item.price, 'ether')} ETH<br>
                <strong>Quantity:</strong> ${item.quantity}<br>
            `;
            itemList.appendChild(itemElement);
        }
    }

    fetchItems();

    // Import Web3.js library
    const Web3 = require('web3');

    // Initialize Web3 with Ganache RPC URL
let web3;

if (typeof window.ethereum !== 'undefined') {
    // Use MetaMask's provider
    web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // Prompt user to enable Metamask
} else {
    // Fallback to Ganache provider
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545")); // Replace with your Ganache RPC URL
}

// Example usage: Get current Ethereum network
web3.eth.net.getId().then(console.log);

// Example usage: Get current account address
web3.eth.getAccounts().then(accounts => console.log(accounts[0]));

// Example usage: Interact with a deployed contract
const contractABI = [
    // ABI definition
];
const contractAddress = "0x123abc..."; // Replace with your deployed contract address
const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

// Example: Call a method on the smart contract
contractInstance.methods.myMethod().call()
    .then(result => console.log(result));

// Example: Send a transaction to the smart contract
contractInstance.methods.myMethod().send({ from: accounts[0], value: web3.utils.toWei("1", "ether") })
    .on('transactionHash', hash => console.log(hash))
    .on('receipt', receipt => console.log(receipt));


});
