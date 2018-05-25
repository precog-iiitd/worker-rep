pragma solidity ^0.4.19;

contract A {
    uint public a;
    
    function A(uint _a) public payable {a = _a;}
    
    function returnValue() public returns(uint256) {
        return this.balance ;
        
    }
    
    
    function D() payable returns(uint256) {
        return msg.value;
    }
    
}


contract B is A {
    uint public b;
    
    
    function B(uint _a,uint _b) A(_a) public {b = _b;}
}