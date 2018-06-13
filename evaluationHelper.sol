pragma solidity ^0.4.18;

import './evaluation.sol';

contract  EvaluationHelper is EvaluationContract { 


event pleaseEvaluate(
       string _solutionHash,
       uint _agreementId,
       address indexed _evaluatorAddress
    );

function submitToEvaluators(string[] _solutions,address[] _evaluatorAddresses,uint _agreementId) onlyworker(_agreementId) {

	require(_solutions.length == _numberOfEvalutor());

	for(uint i =0;i<_solutions.length;i++){
		event(_solutions[i],_agreementId,_evaluatorAddresses[i]);
	}

 }

 mapping (uint => uint[]) public agreementToRatings;
 mapping (uint => uint) public agreementToRecievedEvaluationsCount;

function recieveOrchestrator(uint _rating,uint _agreementId) external {

simpleRecieveFromEvaluators(_rating,_agreementId);

	if(agreementToRecievedEvaluationsCount[_agreementId] == agreementToEvaluators[_agreementId].length ){
		//bool concencus = _RepCal(_agreementId); 
		//if (concencus ){terminate and reward} else {add time and worker resubmits}

	}


}


function _RepCal(uint _agreementId) returns (bool) private{

	bool concensus = false;

	//calculating reputation

	//test
	concensus = true;

	return concensus;

}

 function simpleRecieveFromEvaluators(uint _rating,uint _agreementId)  {

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





}