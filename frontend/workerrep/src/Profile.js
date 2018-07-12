import React, { Component } from 'react';
import web3 from './web3';
import storehash from './storehash';
import RegistrationForm from './RegistrationForm' ;

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

render(){


/*if(this.props.type == "Worker"){*/
return (

<div>
<h1 className="title is-3">{this.state.name}</h1><h1 className="title is-2">{this.state.Reputation}</h1>
Profile Link: {this.state.ipfs_hash}<br />
Address : {this.state.public_address}<br />
public key : {this.state.encryption_address}<br />



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