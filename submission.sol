pragma solidity ^0.4.18;

import './agreement.sol';

contract SubmissionContract is AgreementContract {
    
    //submitting hash of the solution to the platform
     function submitHash(string _solutionHash, uint _agreementId) onlyWorker(_agreementId){
            uint numberOfEvalutor = _numberOfEvalutor();
            agreements[_agreementId].solutionHash = _solutionHash;
            workers[addressToIdWorker[msg.sender]].availableForEvaluation = true;
            agreements[_agreementId].toEvalluateTaskCount = 0;
     } 


     uint randNonce = 2;

     function _numberOfEvalutor() private returns (uint){
            return 3;
    }

  
     function randomNumberGen(uint _modulus) public returns(uint) {
          randNonce++;
          uint waste;
          waste = uint(keccak256((now+randNonce), msg.sender, randNonce)) % _modulus;
          return waste;
    }
 

    function _findingEvaluator(uint _numberOfEvalutor, uint _agreementId) {
      // should not be an evaluator himself
            uint MaxRep = 100;
            uint Inlength;
            uint[3] memory rangeCount = [uint(0),0,0]; 
            uint RepInterval = MaxRep / _numberOfEvalutor;
            uint[1000][3] workerInRepRange;
            for (uint i = 0 ; i< workers.length; i++){// traverses all workers
                uint upperRep = RepInterval;
                uint count = 0 ;
        
                while (upperRep<= MaxRep){//adds to interval
            
                    if (uint256(workers[i].repScore) >= uint256((count)*RepInterval)  && uint256(workers[i].repScore) < uint256(upperRep) ){
                        if (((workers[i].availableForEvaluation == true) || (workers[i].becomeEvaluator == true)) && (workers[i].assignedEvaluation == false) && (agreements[_agreementId].workerId != i)){
                        Inlength =  rangeCount[count];
                        workerInRepRange[count][Inlength] = i; //i is id of worker
                        rangeCount[count]++;
                        break;
                        }
                     }
                    count++;
                    upperRep = ((count+1)*RepInterval);
          
                 }
            }
      

            uint jValue = _numberOfEvalutor;
            for(uint j = 0; j < jValue; j++){
                uint randNum = randomNumberGen(rangeCount[j]);
                agreementToEvaluators[_agreementId].push(workerInRepRange[j][randNum]);
                workers[workerInRepRange[j][randNum]].assignedEvaluation = true;
            }
      
  }
  
      // assigns evaluator to a submission upon request by worker. 
    function getEvaluators(uint agreementID){
        require(agreements[agreementID].toEvalluateTaskCount == 0 && bytes(agreements[agreementID].solutionHash).length != 0);
        _findingEvaluator(3, agreementID);
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

    function becomeEvaluator(){
        require(workers[addressToIdWorker[msg.sender]].repScore > avgRep());
        workers[addressToIdWorker[msg.sender]].becomeEvaluator = true;
     }
  
  
    function makingAvailableForEvaluation(uint workerID){
        workers[workerID].availableForEvaluation = true;
    }
  
    function avgRep() returns(uint avgRepScore){
        avgRepScore = 0;
      
        for (uint i = 0 ; i< workers.length; i++){
            avgRepScore += workers[i].repScore ; 
        }
        return (avgRepScore/workers.length);
      
    }
  
    function extraRepUpdate(uint workerID, uint rep){
        workers[workerID].repScore = rep;
    }
}

