// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ClothingStore {
    struct Item {
        uint id;
        string name;
        uint price;
        uint quantity;
    }

    mapping(uint => Item) public items;
    uint public itemCount;

    event ItemAdded(uint id, string name, uint price, uint quantity);

    function addItem(string memory _name, uint _price, uint _quantity) public {
        itemCount++;
        items[itemCount] = Item(itemCount, _name, _price, _quantity);
        emit ItemAdded(itemCount, _name, _price, _quantity);
    }
}
