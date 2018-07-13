
import React, { Component } from 'react';
import web3 from './web3';
import storehash from './storehash';
import Agreement from './Agreement';

class AvailableAgreements extends Component {
	constructor (props) {
super(props);
 this.state = {
 	avail_agreement_id: []
 }

 this.load_Avail_agreements(this);

}


load_Avail_Tasks = async (this1) => {
	console.log("loading available tasks");

	const accounts = await web3.eth.getAccounts();
	     
	console.log('Sending from Metamask account: ' + accounts[0]);
	storehash.methods.showAvailableAgreements().call({from: accounts[0] })
.then(function(result){
    console.log(result);
    	this1.setState({avail_tasks_id: result});
    });//function(result)
}

render()
{	

	var TaskletList = this.state.avail_tasks_id.map(function(id){
                        return <Tasklets taskId={id}/>;
                      })

	
	return(<div>{TaskletList}</div>

		


			

		);
}
}

export default AvailableAgreements;