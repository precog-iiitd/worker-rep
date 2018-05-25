# Log of Changes in the Code

* Added crowdSourcing.sol and Ownable.sol (provided by Open Zeppelin)
* Split the main crowdSourcing contract into multiple contract .sol files
* Removed the onlyOwner modifier definitions from Worker and TaskPoster contracts since this functionality is now provided by the Ownable contract.
* Removed address owner from worker and TaskPoster.
* Moved kill() to Ownable from Worker, TaskPoster contract.
*  Changed default repScore to Zero (in User's constructor)
* corrected missing semicolons from import statements & commited
* Added joiningfee parameter in User, does not allow contract to be deployed if joiningfees are not Payed.
* User contract is now upto spec1 (spec1 means 1 User 1 Contract!!! )
*
