$(document).ready(function() {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3js = new Web3(web3.currentProvider);
    } else {
        console.log('No web3? You should consider trying MetaMask!')
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        //web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    // Now you can start your app & access web3 freely:
    $('#txAddress').val(web3.eth.defaultAccount);
})

var abi = [
    {
        "constant": true,
        "inputs": [],
        "name": "birdsSince",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "donorsCounter",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_uid",
                "type": "bytes32"
            },
            {
                "name": "_address",
                "type": "address"
            }
        ],
        "name": "registerUID",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
var contract = web3.eth.contract(abi).at("0xa92fc9BcBF2F87C36F0654619751a3AcC88a1b57");

$('#UIDReg').off().click(function(){
    $('#UIDReg').prop('disabled', true);
    var myUID = $('#txUID').val();
    var myAdd = $('#txAddress').val();

    if (myUID != "" && myAdd != "") {
        contract.registerUID(
            myUID,
            myAdd,
            function(r) {
                console.log("TxHash: " + r);
                $('#UIDReg').prop('disabled', false);
            })
    }
})
