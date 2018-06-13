pragma solidity ^0.4.18;

import './evaluation.sol';
import "github.com/Arachnid/solidity-stringutils/strings.sol";

contract  EvaluationHelper is EvaluationContract { 
    using strings for *; 


event pleaseEvaluate(
       string _solutionHash,
       uint _agreementId,
       address indexed _evaluatorAddress
    );



function submitToEvaluators(string _solutions_mergerd,address[] _evaluatorAddresses,uint _agreementId) onlyWorker(_agreementId) {
    
    var s = _solutions_mergerd.toSlice();
    var delim = ",".toSlice();
    var parts = new string[](s.count(delim) + 1);
    for(uint i = 0; i < parts.length; i++) {
            parts[i] = s.split(delim).toString();
}
    /*
    var delim = ",".toSlice();
    //uint count_solns = _solutions_mergerd.count(delim) + 1;
    var _solutions = new string[](_solutions_mergerd.count(delim) + 1);
    
    uint i ;
    for( i = 0; i < _solutions.length; i++) {
        _solutions[i] = _solutions_mergerd.split(delim).toString();
        }*/
        
    require( parts.length == agreementToEvaluators[_agreementId].length );
    
    

	
	for(i = 0;i<parts.length;i++){
		pleaseEvaluate(parts[i],_agreementId,_evaluatorAddresses[i]);
	}

 }

 mapping (uint => uint[]) public agreementToRatings;
 mapping (uint => uint) public agreementToRecievedEvaluationsCount;


 function simpleRecieveFromEvaluators(uint _rating,uint _agreementId)  public {

 	//added modifier body
    uint[] evalArray = agreementToEvaluators[_agreementId];
    bool present = false;
    uint i;
    for (i = 0; i < evalArray.length; i++){
      if (msg.sender == workers[evalArray[i]].publicAddress){
        present = true;
        break;
      }
    }
    require(present);

 	agreementToRatings[_agreementId].push(_rating);
 	agreementToEvaluators_recievedStatus[_agreementId][i] = true;
 	agreementToRecievedEvaluationsCount[_agreementId]+=1;
 }


function recieveOrchestrator(uint _rating,uint _agreementId) external {

 simpleRecieveFromEvaluators(_rating,_agreementId);

	if(agreementToRecievedEvaluationsCount[_agreementId] == agreementToEvaluators[_agreementId].length ){
		//bool concencus = _RepCal(_agreementId); 
		//if (concencus ){terminate and reward} else {add time and worker resubmits}

	}


}


function _RepCal(uint _agreementId) private returns (bool) {

	bool concensus = false;

	//calculating reputation

	//test
	concensus = true;

	return concensus;

}






}