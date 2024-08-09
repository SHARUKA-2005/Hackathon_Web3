document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Web3
    let web3;

    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('MetaMask is connected!');
        } catch (error) {
            console.error('User denied access to MetaMask');
        }
    } else {
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545")); // Replace with your Ganache RPC URL
        console.error('MetaMask is not installed!');
    }

    const contractAddress = '0x1C7892AA9c0C43b2d8d7e34d6A7f5f40A663C21E'; // Replace with your deployed contract address
    const contractABI = [
        {
            "anonymous": false,
            "inputs": [
                {"indexed": false, "internalType": "uint256", "name": "id", "type": "uint256"},
                {"indexed": false, "internalType": "string", "name": "name", "type": "string"},
                {"indexed": false, "internalType": "uint256", "name": "price", "type": "uint256"},
                {"indexed": false, "internalType": "uint256", "name": "quantity", "type": "uint256"}
            ],
            "name": "ItemAdded",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "itemCount",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "name": "items",
            "outputs": [
                {"internalType": "uint256", "name": "id", "type": "uint256"},
                {"internalType": "string", "name": "name", "type": "string"},
                {"internalType": "uint256", "name": "price", "type": "uint256"},
                {"internalType": "uint256", "name": "quantity", "type": "uint256"}
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
        },
        {
            "inputs": [
                {"internalType": "string", "name": "_name", "type": "string"},
                {"internalType": "uint256", "name": "_price", "type": "uint256"},
                {"internalType": "uint256", "name": "_quantity", "type": "uint256"}
            ],
            "name": "addItem",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const addItemForm = document.getElementById('addItemForm');
    const itemNameInput = document.getElementById('itemName');
    const itemPriceInput = document.getElementById('itemPrice');
    const itemQuantityInput = document.getElementById('itemQuantity');
    const itemList = document.getElementById('itemList');
    const buyButton = document.getElementById('buyButton');

    addItemForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const itemName = itemNameInput.value;
        const itemPrice = web3.utils.toWei(itemPriceInput.value.toString(), 'ether');
        const itemQuantity = itemQuantityInput.value;

        try {
            const accounts = await web3.eth.getAccounts();
            await contract.methods.addItem(itemName, itemPrice, itemQuantity).send({ from: accounts[0] });
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

        const itemCount = await contract.methods.itemCount().call();
        for (let i = 1; i <= itemCount; i++) {
            const item = await contract.methods.items(i).call();
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

    buyButton.addEventListener('click', async () => {
        const itemId = 1; // Example item ID, you can get this dynamically based on the item being bought
        const priceInWei = web3.utils.toWei('0.1', 'ether'); // Example price in Wei, adjust as per your contract

        try {
            const accounts = await web3.eth.getAccounts();
            const result = await contract.methods.buyItem(itemId).send({
                from: accounts[0],
                value: priceInWei
            });

            console.log('Transaction successful:', result);
            alert('Purchase successful!');
        } catch (error) {
            console.error('Transaction failed:', error);
            alert('Transaction failed. Please try again.');
        }
    });
});
