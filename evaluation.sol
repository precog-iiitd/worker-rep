pragma solidity ^0.4.18;

import './submission.sol';

contract EvaluationContract is SubmissionContract {
  
  function notSubmitted(uint agreementID) returns(bool){
      for(uint n = 0; n< agreementToRecievedEvaluatorID[agreementID].length;n++ ){
          if (addressToIdWorker[msg.sender] == agreementToRecievedEvaluatorID[agreementID][n]){
              return false;
          }
      }
      return true;
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
  
  mapping (uint => uint[]) public evaluationScoreMapping;
  mapping (uint => uint[]) public agreementToRecievedEvaluatorID;
  mapping (uint => uint) public agreementToRecievedEvaluatorCount;


  function evaluationCompleted(uint _completeness, uint _quality, uint _agreementId) onlyEvaluator(_agreementId){
    uint[4] memory meanStandardCompQual = [uint(0),0,0,0];

// uint  meanCompletness;
//   uint  meanQuality;
//   uint  complStandDev ;
//   uint  qualtStandDev;
  uint  noConsensus;
  uint  finalCompletness;
  uint  finalQuality;
        require(notSubmitted(_agreementId));
        agreements[_agreementId].evaluatorToQuality[addressToIdWorker[msg.sender]] = _quality;
        agreements[_agreementId].evaluatorToCompletness[addressToIdWorker[msg.sender]] = _completeness;
//      evaluationScoreMapping[_agreementId].push(evaluationScore) ;
        
       
        agreementToRecievedEvaluatorID[_agreementId].push(addressToIdWorker[msg.sender]);
         agreements[_agreementId].outlier[addressToIdWorker[msg.sender]] = false ;
         agreementToRecievedEvaluatorCount[_agreementId]++;

      if (agreementToRecievedEvaluatorID[_agreementId].length == agreementToEvaluators[_agreementId].length){
        
        
        (meanStandardCompQual[0], meanStandardCompQual[1]) = meanCal(_agreementId);
       
        (meanStandardCompQual[2], meanStandardCompQual[3]) = varianceCal(_agreementId, meanStandardCompQual[0], meanStandardCompQual[1]);
        
        noConsensus = consensus(meanStandardCompQual[0], meanStandardCompQual[1],meanStandardCompQual[2], meanStandardCompQual[3] , _agreementId);
        
        (finalCompletness,finalQuality) = finalScore(_agreementId);
         
         updateRepWorkers(finalCompletness,finalQuality,_agreementId);
         //update reputation of the evaluators
         updateRepEvaluators(finalCompletness,finalQuality,_agreementId);
         
        // add an event that the worker reputation has been updated
        
      }
  }
  

  
  function _sendRewardAndTerminateAgreement(uint _agreementId, uint completnessR, uint qualityR) internal { //can test by making it public if required
    //sends reward
    uint  rewardToSend;
  uint  feeToSend;

    uint finalScoreR = (completnessR + qualityR )/2;
     rewardToSend = (finalScoreR*agreements[_agreementId].reward)/100;
    feeToSend = (completnessR * agreements[_agreementId].fee)/100;
  
    workers[agreements[_agreementId].workerId].publicAddress.transfer(rewardToSend + feeToSend);
  //  workers[agreements[_agreementId].workerId].publicAddress.transfer(feeToSend);
    taskPosters[agreements[_agreementId].taskPosterId].publicAddress.transfer(agreements[_agreementId].fee - feeToSend + agreements[_agreementId].reward - rewardToSend );
   

        //terminates agreement
    agreements[_agreementId].isTerminated  = true;
  }
  
 
  function updateRepWorkers(uint finalCompletnessW,uint finalQualityW,uint agreementIdW){
       uint totalRepScore = 0;
  uint existingRepScoreOfWorker = 0 ;
      totalRepScore = ((finalCompletnessW + finalQualityW) *3)/8 ; 
      uint idWorker = agreements[agreementIdW].workerId;
      existingRepScoreOfWorker = workers[idWorker].repScore;
      workers[idWorker].repScore = existingRepScoreOfWorker + (totalRepScore);
      _sendRewardAndTerminateAgreement(agreementIdW,finalCompletnessW, finalQualityW);
  }
  
  
  
  function updateRepEvaluators(uint finalCompletnessU, uint finalQualityU, uint agreementId ){
      uint  updateRep;
      uint  toUpdateComp;
      uint  toUpdateQual;
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
          else {
              if(workers[agreementToRecievedEvaluatorID[agreementId][m]].becomeEvaluator == true){
                  toUpdateComp = (100 - (abso (int (finalCompletnessU - agreements[agreementId].evaluatorToCompletness[agreementToRecievedEvaluatorID[agreementId][m]] )))) ; 
                    toUpdateQual = (100 - (abso(int(finalQualityU - agreements[agreementId].evaluatorToQuality[agreementToRecievedEvaluatorID[agreementId][m]] )))) ;
                  workers[agreementToRecievedEvaluatorID[agreementId][m]].assignedEvaluation = false;
                    workers[agreementToRecievedEvaluatorID[agreementId][m]].becomeEvaluator = false;
                    updateRep = (toUpdateQual + toUpdateComp)/8;
                    if (updateRep <= workers[agreementToRecievedEvaluatorID[agreementId][m]].repScore ){
                        workers[agreementToRecievedEvaluatorID[agreementId][m]].repScore -= updateRep;
                    }
                    else{
                        workers[agreementToRecievedEvaluatorID[agreementId][m]].repScore = 0 ;
        
                    }
                  
              }
              
          }
      }
      
  }
  
  function abso(int value) returns(uint retValue){
      if (value <0){
          retValue = uint(-1 * value);
          return (retValue); 
      }
  }
  

  

  function finalScore(uint agreementId) returns(uint finalCompletness,uint finalQuality){
      uint repScoreTotal = 0;
      finalCompletness = 0;
      finalQuality = 0 ; 
      
      for (uint m =0 ; m< agreementToRecievedEvaluatorCount[agreementId] ; m++){
          if (agreements[agreementId].outlier[m] == false){
             uint evalRep =  workers[agreementToRecievedEvaluatorID[agreementId][m]].repScore;
                finalCompletness += agreements[agreementId].evaluatorToCompletness[agreementToRecievedEvaluatorID[agreementId][m]] * evalRep;
              finalQuality += agreements[agreementId].evaluatorToQuality[agreementToRecievedEvaluatorID[agreementId][m]] * evalRep; 
              repScoreTotal += evalRep;
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
             else {
                   agreements[agreementId].outlier[k] = true;
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
     
    // return varianceCal(agreementId, meanCompletness, meanQuality);

   return (meanCompletness, meanQuality);
  }
 
  
  function varianceCal(uint agreementId, uint meanCompletnessVar, uint meanQualityVar) returns (uint compStandDev,uint qualStandDev){
    //   uint meanCompletness ;
    //   uint meanQuality ;
     uint countInsideVar = 0;
     uint  varianceC = 0;
      uint  varianceQ = 0;

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


