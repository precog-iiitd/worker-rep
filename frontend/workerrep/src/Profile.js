import React, { Component } from 'react';
import web3 from './web3';
import storehash from './storehash';
import RegistrationForm from './RegistrationForm' ;
import Agreement from './Agreement' ;
import SubmitToEval from './SubmitToEval';
import EvaluLets from './EvaluLets';



class Profile extends Component {

	constructor (props) {
super(props);
	      this.state = {
	      	type:"",
			name:"",
			ipfs_hash:"",
			Reputation:0,
			public_address:"",
			encryption_address:"",
			TaskCount:0,
			user_id:0,
			agreementCounts:0

		}	    
	  }

getProfileData = async(this1)=>{
	
	const accounts = await web3.eth.getAccounts();
	     
	console.log('Sending from Metamask account: ' + accounts[0]);


	//improve to get user's count
	storehash.methods.getTasksCount().call()
	.then(function(result){
		this1.setState({TaskCount:result});
	})

	//improve to get user's agreements
	storehash.methods.getAgreementsCount().call()
	.then(function(result){
		this1.setState({agreementCounts:result});
	})

storehash.methods.addressToBalance(accounts[0]).call()
	.then(function(result){
		
		if(result >= 10**15){
		this1.setState({Balance:(result/10**18).toString()+" Ether"});
			}
		else if(result >= 10**6){
			this1.setState({Balance:(result/10**9).toString()+" GWei"});
		}
		else{
			this1.setState({Balance:(result).toString()+" Wei"});
		}	
	});	



	console.log("got usertype as: ",this1.props.type);
	if(this1.props.type == "Worker"){



	storehash.methods.addressToIdWorker(accounts[0]).call()
	.then(function(result_id){	
		console.log("the worker id is", result_id);
		this1.setState({user_id:result_id});

	storehash.methods.workers(result_id).call()
	.then(function(result){
		console.log(result);
		this1.setState({name:result.userName,ipfs_hash:result.fileHash,Reputation:result.repScore,public_address:result.publicAddress,
			encryption_address:result.encryptionkeyAddress});
	}
		);


/*
		storehash.methods.getAgreementsCount().call()
	.then(function(result){
		console.log(result);
		const agreementCount = result;
		var workerAgreementCount = 0;
		for(let i = 0;i<agreementCount;i++){
			storehash.methods.agreements(i).call()
				.then(function(agreement_obj){
					console.log("workerAgreementCount is ", this1.state.user_id, agreement_obj);
					if(agreement_obj.workerId == this1.state.user_id ){
						console.log("here");
						workerAgreementCount = workerAgreementCount + 1;
					}

				});
		}

		this1.setState({TaskCount:workerAgreementCount});

	}
		);*/


});
	

	}

	else {

storehash.methods.addressToIdTaskPoster(accounts[0]).call()
	.then(function(result){	
		console.log("the taskPoster id is", result);

		storehash.methods.taskPosters(result).call()
	.then(function(result){
		console.log("getting profile details of taskposter ",result);
				this1.setState({name:result.userName,ipfs_hash:result.fileHash,Reputation:result.repScore,public_address:result.publicAddress,
			encryption_address:result.encryptionkeyAddress});
	}
		);


});


	}
}


render(){


storehash.events.pleaseEvaluate()
.on("pleaseEvaluate", function(event) {
  let zombie = event.returnValues;
  // We can access this event's 3 return values on the `event.returnValues` object:
  console.log("xgfdffcfgcfcgfgcfc",zombie);
})


storehash.getPastEvents("pleaseEvaluate", { fromBlock: 0, toBlock: "latest" })
.then(function(events) {
  // `events` is an array of `event` objects that we can iterate, like we did above
  // This code will get us a list of every zombie that was ever created
  console.log(events[0]);
});

//this.encr();

/*if(this.props.type == "Worker"){*/
return (

<div className="box">




<div className="container">
<h1 className="title is-1">{this.state.name}</h1>


<div className="columns">
  <div className="column">
    <a className="button" href={"http://ipfs.io/ipfs/"+this.state.ipfs_hash} target="_blank"> View Profile</a><br />
    
  </div>

  <div className="column">
 <div className="is-pulled-right">
 Address

 <a class="" href={"https://etherscan.io/address/" + this.state.public_address} target="_blank">{"  "+this.state.public_address}</a><br />
</div>
</div>

<div className="column">
<span class="tag is-info is-large">{this.props.type}</span>
</div>

 </div>
</div>


<div className="section">
<nav className="level">
  <div className="level-item has-text-centered">
    <div>
      <p className="heading">Reputation</p>
      <p className="title">{this.state.Reputation}</p>
    </div>
  </div>
  <div className="level-item has-text-centered">
    <div>
      <p className="heading">Tasks</p>
      <p className="title">{this.state.TaskCount}</p>
    </div>
  </div>
  <div className="level-item has-text-centered">
    <div>
      <p className="heading">agreements</p>
      <p className="title">{this.state.agreementCounts}</p>
    </div>
  </div>
  <div className="level-item has-text-centered">
    <div>
      <p className="heading">Rewards Earned</p>
      <p className="title">{this.state.Balance}</p>
    </div>
  </div>
</nav>

</div>
</div>

);
/*}*/




}

componentDidMount(){
  console.log("componentDidmount");
  this.getProfileData(this);
}


}




 export default Profile;