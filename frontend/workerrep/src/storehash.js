import web3 from './web3';

//access our local copy to contract deployed on rinkeby testnet
//use your own contract address
const address = '0x3485527148d74e5d46312760b33b3b06980ef5dd';
//use the ABI from your contract
const abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_numberOfEvalutor",
        "type": "uint256"
      },
      {
        "name": "_agreementId",
        "type": "uint256"
      }
    ],
    "name": "_findingEvaluator",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_no1",
        "type": "uint256"
      },
      {
        "name": "_no2",
        "type": "uint256"
      },
      {
        "name": "_no3",
        "type": "uint256"
      }
    ],
    "name": "_maths",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "value",
        "type": "int256"
      }
    ],
    "name": "abso",
    "outputs": [
      {
        "name": "retValue",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_agreementId",
        "type": "uint256"
      }
    ],
    "name": "acceptAgreement",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_agreementId",
        "type": "uint256"
      }
    ],
    "name": "AgreementTerminate",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "avgRep",
    "outputs": [
      {
        "name": "avgRepScore",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "becomeEvaluator",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "meanCompletness",
        "type": "uint256"
      },
      {
        "name": "meanQuality",
        "type": "uint256"
      },
      {
        "name": "complStandDev",
        "type": "uint256"
      },
      {
        "name": "qualtStandDev",
        "type": "uint256"
      },
      {
        "name": "agreementId",
        "type": "uint256"
      }
    ],
    "name": "consensus",
    "outputs": [
      {
        "name": "noNodesConsensus",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_taskId",
        "type": "uint256"
      },
      {
        "name": "_workerId",
        "type": "uint256"
      },
      {
        "name": "time_in_hours",
        "type": "uint256"
      }
    ],
    "name": "createAgreement",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_completeness",
        "type": "uint256"
      },
      {
        "name": "_quality",
        "type": "uint256"
      },
      {
        "name": "_agreementId",
        "type": "uint256"
      }
    ],
    "name": "evaluationCompleted",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "workerID",
        "type": "uint256"
      },
      {
        "name": "rep",
        "type": "uint256"
      }
    ],
    "name": "extraRepUpdate",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "agreementId",
        "type": "uint256"
      }
    ],
    "name": "finalScore",
    "outputs": [
      {
        "name": "finalCompletness",
        "type": "uint256"
      },
      {
        "name": "finalQuality",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "agreementID",
        "type": "uint256"
      }
    ],
    "name": "getEvaluators",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "kill",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_num",
        "type": "uint256"
      }
    ],
    "name": "makeNTaskposters_t",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_num",
        "type": "uint256"
      }
    ],
    "name": "makeNWorkers_t",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_userName",
        "type": "string"
      },
      {
        "name": "_fileHash",
        "type": "string"
      },
      {
        "name": "_key",
        "type": "string"
      }
    ],
    "name": "makeTaskPoster",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_userName",
        "type": "string"
      },
      {
        "name": "_fileHash",
        "type": "string"
      },
      {
        "name": "_key",
        "type": "string"
      }
    ],
    "name": "makeWorker",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "workerID",
        "type": "uint256"
      }
    ],
    "name": "makingAvailableForEvaluation",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "markTaskAssigned",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "markTaskComplete",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "agreementId",
        "type": "uint256"
      }
    ],
    "name": "meanCal",
    "outputs": [
      {
        "name": "meanCompletness",
        "type": "uint256"
      },
      {
        "name": "meanQuality",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "agreementID",
        "type": "uint256"
      }
    ],
    "name": "notSubmitted",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_taskTitle",
        "type": "string"
      },
      {
        "name": "_taskHash",
        "type": "string"
      },
      {
        "name": "_taskReward",
        "type": "uint256"
      }
    ],
    "name": "postTask",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_modulus",
        "type": "uint256"
      }
    ],
    "name": "randomNumberGen",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_rating",
        "type": "uint256"
      },
      {
        "name": "_agreementId",
        "type": "uint256"
      }
    ],
    "name": "recieveOrchestrator",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_taskId",
        "type": "uint256"
      }
    ],
    "name": "registerForTask",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_joiningFee",
        "type": "uint256"
      }
    ],
    "name": "setjoiningFee",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "x",
        "type": "uint256"
      }
    ],
    "name": "sqrt",
    "outputs": [
      {
        "name": "y",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_solutionHash",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "_agreementId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "_evaluatorAddress",
        "type": "address"
      }
    ],
    "name": "pleaseEvaluate",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_solutionHash",
        "type": "string"
      },
      {
        "name": "_agreementId",
        "type": "uint256"
      }
    ],
    "name": "submitHash",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_solutions_mergerd",
        "type": "string"
      },
      {
        "name": "_evaluatorAddresses",
        "type": "address[]"
      },
      {
        "name": "_agreementId",
        "type": "uint256"
      }
    ],
    "name": "submitToEvaluators",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "finalCompletnessU",
        "type": "uint256"
      },
      {
        "name": "finalQualityU",
        "type": "uint256"
      },
      {
        "name": "agreementId",
        "type": "uint256"
      }
    ],
    "name": "updateRepEvaluators",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "finalCompletnessW",
        "type": "uint256"
      },
      {
        "name": "finalQualityW",
        "type": "uint256"
      },
      {
        "name": "agreementIdW",
        "type": "uint256"
      }
    ],
    "name": "updateRepWorkers",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "agreementId",
        "type": "uint256"
      },
      {
        "name": "meanCompletnessVar",
        "type": "uint256"
      },
      {
        "name": "meanQualityVar",
        "type": "uint256"
      }
    ],
    "name": "varianceCal",
    "outputs": [
      {
        "name": "compStandDev",
        "type": "uint256"
      },
      {
        "name": "qualStandDev",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "withdrawDarkBalance",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "addressToBalance",
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
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "addressToIdTaskPoster",
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
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "addressToIdWorker",
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
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "agreements",
    "outputs": [
      {
        "name": "fee",
        "type": "uint256"
      },
      {
        "name": "taskId",
        "type": "uint256"
      },
      {
        "name": "workerId",
        "type": "uint256"
      },
      {
        "name": "taskPosterId",
        "type": "uint256"
      },
      {
        "name": "creation_time",
        "type": "uint256"
      },
      {
        "name": "taskEnd_time",
        "type": "uint256"
      },
      {
        "name": "reward",
        "type": "uint256"
      },
      {
        "name": "isAccepted",
        "type": "bool"
      },
      {
        "name": "isTerminated",
        "type": "bool"
      },
      {
        "name": "solutionHash",
        "type": "string"
      },
      {
        "name": "toEvalluateTaskCount",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "agreementToEvaluators",
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
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "agreementToEvaluators_recievedStatus",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "agreementToRatings",
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
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "agreementToRecievedEvaluationsCount",
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
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "agreementToRecievedEvaluatorCount",
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
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "agreementToRecievedEvaluatorID",
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
    "name": "darkBalance",
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
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "evaluationScoreMapping",
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
    "name": "getAgreementsCount",
    "outputs": [
      {
        "name": "count",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_agreementId",
        "type": "uint256"
      }
    ],
    "name": "getEvaluatorAddresses",
    "outputs": [
      {
        "name": "",
        "type": "address[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_agreementId",
        "type": "uint256"
      },
      {
        "name": "_evalNumber",
        "type": "uint256"
      }
    ],
    "name": "getEvaluatorPublicKeys",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getTaskPostersCount",
    "outputs": [
      {
        "name": "count",
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
    "name": "getTasksCount",
    "outputs": [
      {
        "name": "count",
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
    "name": "getWorkersCount",
    "outputs": [
      {
        "name": "count",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "isRegistered",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "isTaskPoster",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "showAgreement",
    "outputs": [
      {
        "name": "",
        "type": "uint256[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "showAvailableTasks",
    "outputs": [
      {
        "name": "",
        "type": "uint256[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "stdDev",
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
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "taskIdToRegisteredWorkersId",
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
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "taskPosters",
    "outputs": [
      {
        "name": "userName",
        "type": "string"
      },
      {
        "name": "repScore",
        "type": "uint256"
      },
      {
        "name": "fileHash",
        "type": "string"
      },
      {
        "name": "publicAddress",
        "type": "address"
      },
      {
        "name": "encryptionkeyAddress",
        "type": "string"
      },
      {
        "name": "availableForEvaluation",
        "type": "bool"
      },
      {
        "name": "becomeEvaluator",
        "type": "bool"
      },
      {
        "name": "assignedEvaluation",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "tasks",
    "outputs": [
      {
        "name": "taskTitle",
        "type": "string"
      },
      {
        "name": "taskMaterialsHash",
        "type": "string"
      },
      {
        "name": "isTaskComplete",
        "type": "bool"
      },
      {
        "name": "isTaskAssigned",
        "type": "bool"
      },
      {
        "name": "taskReward",
        "type": "uint256"
      },
      {
        "name": "TP_creator_id",
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
    "name": "tasksCount",
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
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "workers",
    "outputs": [
      {
        "name": "userName",
        "type": "string"
      },
      {
        "name": "repScore",
        "type": "uint256"
      },
      {
        "name": "fileHash",
        "type": "string"
      },
      {
        "name": "publicAddress",
        "type": "address"
      },
      {
        "name": "encryptionkeyAddress",
        "type": "string"
      },
      {
        "name": "availableForEvaluation",
        "type": "bool"
      },
      {
        "name": "becomeEvaluator",
        "type": "bool"
      },
      {
        "name": "assignedEvaluation",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]


export default new web3.eth.Contract(abi, address);