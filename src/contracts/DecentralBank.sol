pragma solidity ^0.5.0;

import "./RWD.sol";
import "./Tether.sol";

contract DecentralBank {
    string public name = "DecentralBank";
    address public owner;
    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(RWD _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender ;
    }

    // staking function
    function depositeTokens(uint _amount) public {
        require(_amount > 0, "amount cannot be 0");

        // transfer tether token to this contract for staking
        tether.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update staking status
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    // umstake token
    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender] ;
        require(balance > 0 , 'staking balnce can not be zero');

        // transtfer the tokens to the  specified contract address from the bank
        tether.transfer(msg.sender, balance);

        stakingBalance[msg.sender] = 0 ;
        isStaking[msg.sender] = false ;    
    }




    // issue Rewards 
    function issueTokens() public {
        // requiring only owner to issue tokens
        require(msg.sender == owner , 'caller must be owner');
        for (uint i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient] / 9 ; // incentive 1/9 of the stake
            if(balance > 0) {
            rwd.transfer(recipient , balance);
            }
        }
    }
}
