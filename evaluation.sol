pragma solidity ^0.4.18;

import './agreement.sol';

contract EvaluationContract is AgreementContract {

  uint randNonce = 2;

  function _numberOfEvalutor() private returns (uint){
    return 3;
  }


//   function getEvaluatorAddress(uint _agreementId) onlyWorker(_agreementId) returns (address) {
//     require(bytes(agreements[_agreementId].solutionHash).length != 0);
//   }

  
  function randomNumberGen(uint _modulus) internal returns(uint) {
      randNonce++;
      return uint(keccak256((now+randNonce), msg.sender, randNonce)) % _modulus;
    }
    
  function _findingEvaluator(uint _numberOfEvalutor, uint _agreementId) {
      // should not be an evaluator himself
      uint MaxRep = 100;
  
      uint RepInterval = MaxRep / _numberOfEvalutor;
      
    uint[][3] workerInRepRange;
      for (uint i = 0 ; i< workers.length; i++){
          uint upperRep = RepInterval;
        uint count = 0 ;
         while (upperRep<= MaxRep){
      
            
          if (uint(workers[i].repScore) >= uint256(count*RepInterval)  && uint256(workers[i].repScore) < uint256(upperRep) ){
            if (((workers[i].availableForEvaluation == true) || (workers[i].becomeEvaluator == true)) && (workers[i].assignedEvaluation == false)){
            workerInRepRange[count].push(i); //i is id of worker
            break;
            }
          }
          count++;
          upperRep = ((count+1)*RepInterval);
          
           }
      }
      for(uint j = 0 ; j < _numberOfEvalutor; j++){
          uint randNum = randomNumberGen(workerInRepRange[j].length);
          agreementToEvaluators[_agreementId].push(workerInRepRange[j][randNum]);
          workers[workerInRepRange[j][randNum]].assignedEvaluation = true;
      }
      
  }
  
  

  function submitHash(string _solutionHash, uint _agreementId) onlyWorker(_agreementId){
    uint numberOfEvalutor = _numberOfEvalutor();
    agreements[_agreementId].solutionHash = _solutionHash;

  //  _findingEvaluator(numberOfEvalutor, _agreementId);
    workers[addressToIdWorker[msg.sender]].availableForEvaluation = true;
    agreements[_agreementId].toEvalluateTaskCount = 0;
    
  } 
  
  function getEvaluators(uint agreementID){
      require(agreements[agreementID].toEvalluateTaskCount == 0 && bytes(agreements[agreementID].solutionHash).length != 0);
       _findingEvaluator(3, agreementID);
        // (finalCompletness,finalQuality) = finalScore(agreementID);
        //  updateRepWorkers(finalCompletness,finalQuality,agreementID);
  }

  function getEvaluatorAddresses(uint _agreementId) view onlyWorker(_agreementId) returns(address[]) {


  uint  numberOfEvalutor = 3;
  address[] memory eval_adresses = new address[](numberOfEvalutor);
  
  for(uint8 i=0;i<numberOfEvalutor;i++){
   uint eval_id = agreementToEvaluators[_agreementId][i];
   eval_adresses[i] = workers[eval_id].publicAddress;
  }
  return eval_adresses;
}

function getEvaluatorPublicKeys(uint _agreementId,uint _evalNumber) view onlyWorker(_agreementId) returns(string) {


  uint8 numberOfEvalutor = 3;
 string[] memory eval_adresses = new string[](numberOfEvalutor);
  
  for(uint8 i=0;i<numberOfEvalutor;i++){
   uint eval_id = agreementToEvaluators[_agreementId][i];
   eval_adresses[i] = workers[eval_id].encryptionkeyAddress;
  }
  return eval_adresses[_evalNumber];
}

/*
  function sendToEvaluator(uint _agreementId, string submissionHash) onlyWorker(_agreementId){
    //send the hashes to evaluators 
    // function called by worker and a transaction is sent to the evaluators with the hash 
    uint[] evalWorker = agreementToEvaluators[_agreementId];
    for (uint i = 0 ; i < evalWorker.length; i++){
      workers[evalWorker[i]].push(submissionHash);

    }

  }
*/  
  modifier onlyEvaluator(uint _agreementId){
    uint[] evalArray = agreementToEvaluators[_agreementId];
    bool present = false;
    for (uint i = 0; i < evalArray.length; i++){
      if (msg.sender == workers[evalArray[i]].publicAddress){
        present = true;
        break;
      }
    }

    require(present);
    _;
  }
  uint public meanCompletness;
  uint public meanQuality;
  uint public complStandDev ;
  uint public qualtStandDev;
  uint public noConsensus;
  uint public finalCompletness;
  uint public finalQuality;
  mapping (uint => uint[]) public evaluationScoreMapping;
  mapping (uint => uint[]) public agreementToRecievedEvaluatorID;
  mapping (uint => uint) public agreementToRecievedEvaluatorCount;


  function evaluationCompleted(uint _completeness, uint _quality, uint _agreementId) onlyEvaluator(_agreementId){
        agreements[_agreementId].evaluatorToQuality[addressToIdWorker[msg.sender]] = _quality;
        agreements[_agreementId].evaluatorToCompletness[addressToIdWorker[msg.sender]] = _completeness;
//      evaluationScoreMapping[_agreementId].push(evaluationScore) ;
        
       
        agreementToRecievedEvaluatorID[_agreementId].push(addressToIdWorker[msg.sender]);
         agreements[_agreementId].outlier[addressToIdWorker[msg.sender]] = false ;
         agreementToRecievedEvaluatorCount[_agreementId]++;

      if (agreementToRecievedEvaluatorID[_agreementId].length == agreementToEvaluators[_agreementId].length){
        
        
        (meanCompletness, meanQuality) = meanCal(_agreementId);
       
        (complStandDev, qualtStandDev) = varianceCal(_agreementId, meanCompletness, meanQuality);
        
        noConsensus = consensus(meanCompletness, meanQuality,complStandDev, qualtStandDev , _agreementId);
        
        (finalCompletness,finalQuality) = finalScore(_agreementId);
         
         updateRepWorkers(finalCompletness,finalQuality,_agreementId);
         //update reputation of the evaluators
         updateRepEvaluators(finalCompletness,finalQuality,_agreementId);
         
        // add an event that the worker reputation has been updated
        
      }
      // check if the evaluator is one that has been assigned 

      // check if all evaluators have submitted their evaluation score 

      // if all have send their evalutation compute the reputation score of the the worker for this task 

      //update  reputation of the worker , add function to worker and call that 

  }
  uint public totalRepScore = 0;
  uint public existingRepScoreOfWorker = 0 ;
  function updateRepWorkers(uint finalCompletnessW,uint finalQualityW,uint agreementIdW){
      totalRepScore = ((finalCompletnessW + finalQualityW) *3)/8 ; 
      uint idWorker = agreements[agreementIdW].workerId;
      existingRepScoreOfWorker = workers[idWorker].repScore;
      workers[idWorker].repScore = existingRepScoreOfWorker + (totalRepScore);
  }
  
  uint public updateRep;
      uint public toUpdateComp;
      uint public toUpdateQual;
  function updateRepEvaluators(uint finalCompletnessU, uint finalQualityU, uint agreementId ){
      
      for (uint m =0 ; m< agreementToRecievedEvaluatorCount[agreementId] ; m++){
          if (agreements[agreementId].outlier[m] == false){
               
                toUpdateComp = (100 - (abso (int (finalCompletnessU - agreements[agreementId].evaluatorToCompletness[agreementToRecievedEvaluatorID[agreementId][m]] )))) ; 
               toUpdateQual = (100 - (abso(int(finalQualityU - agreements[agreementId].evaluatorToQuality[agreementToRecievedEvaluatorID[agreementId][m]] )))) ;
             
                if (workers[agreementToRecievedEvaluatorID[agreementId][m]].availableForEvaluation == true){
                    workers[agreementToRecievedEvaluatorID[agreementId][m]].assignedEvaluation = false;
                    agreements[agreementId].toEvalluateTaskCount -= 1;
                    if (agreements[agreementId].toEvalluateTaskCount == 0){
                          workers[agreementToRecievedEvaluatorID[agreementId][m]].availableForEvaluation == false;
                        //   _findingEvaluator(3, agreementId);
                      }
                     updateRep = (toUpdateQual + toUpdateComp)/(6*4);
 
                    
                }
                else {
                    workers[agreementToRecievedEvaluatorID[agreementId][m]].assignedEvaluation = false;
                    workers[agreementToRecievedEvaluatorID[agreementId][m]].becomeEvaluator = false;
                     updateRep = (toUpdateQual + toUpdateComp)/8;
                }
                
                workers[agreementToRecievedEvaluatorID[agreementId][m]].repScore += updateRep;
              
               
                    
          }
      }
      
  }
  
  function abso(int value) returns(uint retValue){
      if (value <0){
          retValue = uint(-1 * value);
          return (retValue); 
      }
  }
  
  function avgRep() returns(uint avgRepScore){
      avgRepScore = 0;
      
      for (uint i = 0 ; i< workers.length; i++){
          avgRepScore += workers[i].repScore ; 
      }
      return (avgRepScore/workers.length);
      
  }
  
  function becomeEvaluator(){
      require(workers[addressToIdWorker[msg.sender]].repScore > avgRep());
      workers[addressToIdWorker[msg.sender]].becomeEvaluator = true;
  }
  
  function extraRepUpdate(uint workerID, uint rep){
      workers[workerID].repScore = rep;
  }
  
  function makingAvailableForEvaluation(uint workerID){
      workers[workerID].availableForEvaluation = true;
  }
  
  
  uint[] public testArray;
  uint[] public testArrayRep;
  uint[] public testRep;
  function finalScore(uint agreementId) returns(uint finalCompletness,uint finalQuality){
      uint repScoreTotal = 0;
      finalCompletness = 0;
      finalQuality = 0 ; 
      
      for (uint m =0 ; m< agreementToRecievedEvaluatorCount[agreementId] ; m++){
          if (agreements[agreementId].outlier[m] == false){
              testRep.push(workers[agreementToRecievedEvaluatorID[agreementId][m]].repScore);
              testArrayRep.push(agreements[agreementId].evaluatorToCompletness[agreementToRecievedEvaluatorID[agreementId][m]] * workers[agreementToRecievedEvaluatorID[agreementId][m]].repScore);
              testArray.push(agreements[agreementId].evaluatorToCompletness[agreementToRecievedEvaluatorID[agreementId][m]]);
              finalCompletness += agreements[agreementId].evaluatorToCompletness[agreementToRecievedEvaluatorID[agreementId][m]] * workers[agreementToRecievedEvaluatorID[agreementId][m]].repScore;
              finalQuality += agreements[agreementId].evaluatorToQuality[agreementToRecievedEvaluatorID[agreementId][m]] * workers[agreementToRecievedEvaluatorID[agreementId][m]].repScore; 
              repScoreTotal += workers[agreementToRecievedEvaluatorID[agreementId][m]].repScore;
              
          }
        }
        finalQuality = finalQuality/repScoreTotal;
      finalCompletness = finalCompletness/repScoreTotal;
      return (finalCompletness,finalQuality);
  }
  
  function consensus(uint meanCompletness,uint meanQuality,uint complStandDev,uint qualtStandDev ,uint agreementId) returns(uint noNodesConsensus){
      uint count = 0;
      noNodesConsensus =0;
      for (uint k =0; k< agreementToRecievedEvaluatorCount[agreementId]; k++){
         if (agreements[agreementId].outlier[k] == false){
            uint evalComp = agreements[agreementId].evaluatorToQuality[agreementToRecievedEvaluatorID[agreementId][k]];
            uint evalqual = agreements[agreementId].evaluatorToQuality[agreementToRecievedEvaluatorID[agreementId][k]];
           
             if ((evalComp >= (meanCompletness - (5 * complStandDev)/4)) && (evalComp <= (meanCompletness + (5 * complStandDev)/4))){
                 if ((evalqual >= (meanQuality - (5 * qualtStandDev)/4)) && (evalqual <= (meanQuality + (5 * qualtStandDev)/4))){
                 noNodesConsensus++;
                 }
                 else {
                   agreements[agreementId].outlier[k] = true;
                 }
            }
             
                    
        }
      }
    
    return noNodesConsensus;
  
  }
  
  function meanCal(uint agreementId) returns (uint meanCompletness, uint meanQuality){
     uint meanCompletnessI = 0 ;
     uint meanQualityI = 0  ;
      uint count = 0;
      for (uint k =0; k< agreementToRecievedEvaluatorCount[agreementId]; k++){
         if (agreements[agreementId].outlier[k] == false){
             count++;
         meanQualityI = meanQualityI+ agreements[agreementId].evaluatorToQuality[agreementToRecievedEvaluatorID[agreementId][k]]; 
          meanCompletnessI = meanCompletnessI + agreements[agreementId].evaluatorToCompletness[agreementToRecievedEvaluatorID[agreementId][k]];
        }
      }
      meanQuality = meanQualityI/count;
      meanCompletness = meanCompletnessI/count;

    return (meanCompletness, meanQuality);
  }
  uint public countInsideVar = 0;
  uint public varianceC = 0;
      uint public varianceQ = 0;
  function varianceCal(uint agreementId, uint meanCompletnessVar, uint meanQualityVar) returns (uint compStandDev,uint qualStandDev){
    //   uint meanCompletness ;
    //   uint meanQuality ;

      compStandDev = 0 ;
      qualStandDev = 0 ; 
      for (uint k =0; k< agreementToRecievedEvaluatorCount[agreementId]; k++){
         if (agreements[agreementId].outlier[k] == false){
             countInsideVar++;
         varianceQ += ((meanQualityVar -  agreements[agreementId].evaluatorToQuality[agreementToRecievedEvaluatorID[agreementId][k]])*(meanQualityVar -  agreements[agreementId].evaluatorToQuality[agreementToRecievedEvaluatorID[agreementId][k]]) );
          varianceC += ((meanCompletnessVar - agreements[agreementId].evaluatorToCompletness[agreementToRecievedEvaluatorID[agreementId][k]])**2);
        }
      }
      varianceQ = varianceQ/countInsideVar;
      varianceC = varianceC/countInsideVar;
      compStandDev = sqrt(varianceC); 
      qualStandDev = sqrt(varianceQ) ;

    return (compStandDev, qualStandDev);
  }
  
  function sqrt(uint x) returns (uint y) {
    uint z = (x + 1) / 2;
    y = x;
    while (z < y) {
        y = z;
        z = (x / z + z) / 2;
        }
      
  }


}


