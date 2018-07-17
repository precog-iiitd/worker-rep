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
			encryption_address:""
		}	    
	  }

getProfileData = async(this1)=>{
	
	const accounts = await web3.eth.getAccounts();
	     
	console.log('Sending from Metamask account: ' + accounts[0]);



	console.log("got usertype as: ",this1.props.type);
	if(this1.props.type == "Worker"){

	storehash.methods.addressToIdWorker(accounts[0]).call()
	.then(function(result){	
		console.log("the worker id is", result);

	storehash.methods.workers(result).call()
	.then(function(result){
		console.log(result);
		this1.setState({name:result.userName,ipfs_hash:result.fileHash,Reputation:result.repScore,public_address:result.publicAddress,
			encryption_address:result.encryptionkeyAddress});
	}
		);

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

encr = async()=>{
/*	const EthCrypto = require('eth-crypto');
const secretMessage = 'My name is Satoshi Buterin';
const payload = {message: secretMessage};


const encrypted = await EthCrypto.encryptWithPublicKey(
    '16ab49361b03d89ee49890ed0eabb3e55b7157408a29da9f9bf915d742d5c864f52ef88e3e63eb3557160a5e923173908863602c6a77166165b7585b433b8b92', // by encryping with bobs publicKey, only bob can decrypt the payload with his privateKey
    JSON.stringify(payload) // we have to stringify the payload before we can encrypt it
);

console.log("encrypted string ooo... ",encrypted);
const encryptedString = EthCrypto.cipher.stringify(encrypted);
console.log("encrypted string PPP ... ",encryptedString);*/


}

render(){


storehash.events.pleaseEvaluate()
.on("pleaseEvaluate", function(event) {
  let zombie = event.returnValues;
  // We can access this event's 3 return values on the `event.returnValues` object:
  console.log("xgfdffcfgcfcgfgcfc",zombie);
}).on("error", console.error);


storehash.getPastEvents("pleaseEvaluate", { fromBlock: 0, toBlock: "latest" })
.then(function(events) {
  // `events` is an array of `event` objects that we can iterate, like we did above
  // This code will get us a list of every zombie that was ever created
  console.log(events[0]);
});

//this.encr();

/*if(this.props.type == "Worker"){*/
return (

<div>

< EvaluLets taskId={1} agreementId={1} submissionHash={"QmZVcbc9sd8dHfKQFEa8GQbnraPSaERhTo7XtNvf6SQNTZ"} />
{/*<SubmitToEval agreementId={1} />*/}

<div className="box">
<h1 className="title is-3">{this.state.name}</h1><h1 className="title is-2">{this.state.Reputation}</h1>
Profile Link: {this.state.ipfs_hash}<br />
Address : {this.state.public_address}<br />
public key : {this.state.encryption_address}<br />


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