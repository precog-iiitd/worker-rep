
import React, { Component } from 'react';
import web3 from './web3';
import storehash from './storehash';
import Agreement from './Agreement';

class AvailableAgreements extends Component {
	constructor (props) {
super(props);
 this.state = {
 	avail_agreement_id: [],
 	userType:this.props.type
 }

}


load_avail_agreements = async (this1) => {
	console.log("loading available tasks");

	const accounts = await web3.eth.getAccounts();
	     
	console.log('Sending from Metamask account: ' + accounts[0]);
	storehash.methods.showAgreement().call({from: accounts[0] })
.then(function(result){

    console.log("Show agreements :",result);

    	var i=0,not_zero=0,not_zero_r = result.length;
    	for(;i<=result.length;i++){
    		if(result[i]==0){
    			not_zero = i+1;
    		}
    		else{
    			break;
    		}

    	}


    	for(var j = not_zero;j<result.length;j++){
    		if(result[j]==0){
    			not_zero_r =j;
    			break;
    		}
    	}
    		result = result.slice(not_zero,not_zero_r);
    		console.log("result slice is ",not_zero,result)
    	

    	this1.setState({avail_agreement_id: result});
    	if(this1.state.avail_agreement_id.length == 0){
    		console.log("No agreements !!!");
    	}


    });//function(result)
}

render()
{	var typeOfUser = this.state.userType;

	console.log(typeOfUser);
	
	var TaskletList = this.state.avail_agreement_id.map(function(id){
                        return <Agreement type={typeOfUser} agreementId={id} />;
                      })

	
	return(<div>{TaskletList}</div>

		


			

		);
}

componentDidMount(){
	console.log("componentDidmount, task id is ",this.props.taskId);
this.load_avail_agreements(this);
}



}

export default AvailableAgreements;