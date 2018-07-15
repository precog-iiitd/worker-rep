
import React, { Component } from 'react';
import web3 from './web3';
import storehash from './storehash';

class Agreement extends Component {

	constructor (props) {
super(props);
	      this.state = {
			taskTitle:"",
			taskHash:"",
			taskReward:0,
			type:'',
			agreementClass:"message is-info",
			agreementStatus:"Proposed",
			AgreementReward:0,
			fee:0,
		    taskId:0,
		    workerId:0,
		    taskPosterId:0,
		    creation_time:0, 
		    taskEnd_time:0,
		    isAccepted:false,
		    isTerminated:false, 
			solutionHash:"",
			toEvalluateTaskCount:0,
			taskTitle:"",
			workerName:"",
			TaskPosterName:""
			

		}

	    
	  }


/*applyTask = async (event)=>{
	event.preventDefault();
	const accounts = await web3.eth.getAccounts();
	     
	console.log('Sending from Metamask account: ' + accounts[0]);


	storehash.methods.registerForTask(this.props.taskId).send({from: accounts[0]})
	.then(function(result){
    console.log(result);
	});

}*/



agreementDelete = async(event)=>{
	console.log("in delete");
	event.preventDefault();
	const accounts = await web3.eth.getAccounts();
	     
	console.log('Sending from Metamask account: ' + accounts[0]);

	storehash.methods.AgreementTerminate(this.props.agreementId).send({from: accounts[0]})
	.then(function(result){
    console.log(result);
    //this.setState({isTerminated:true,agreementClass:"message is-danger",agreementStatus:"Terminated"});
	});

}


agreementAccept = async(event)=>{
	console.log("in accept");
	event.preventDefault();
	const accounts = await web3.eth.getAccounts();
	     
	console.log('Sending from Metamask account: ' + accounts[0]);

	storehash.methods.acceptAgreement(this.props.agreementId).send({from: accounts[0]})
	.then(function(result){
    console.log(result);
    //this.setState({isAccepted:true,agreementClass:"message is-success",agreementStatus:"Accepted by worker"});
	});

}

loadAgreement = async (props1,this1) => {
	
	console.log("loading Agreement");

	const accounts = await web3.eth.getAccounts();
	     
			storehash.methods.agreements(props1.agreementId).call({from: accounts[0] })
.then(function(result){
    console.log("result obtained from agreement is ",result);
    this1.setState({
    	AgreementReward: (result.reward/Math.pow(10,18)),
			fee:(result.fee/Math.pow(10,18)),
		    taskId:result.taskId,
		    workerId:result.workerId,
		    taskPosterId:result.taskPosterId,
		    creation_time:result.creation_time, 
		    taskEnd_time:result.taskEnd_time,
		    isAccepted:result.isAccepted,
		    isTerminated:result.isTerminated, 
			solutionHash:result.solutionHash,
			toEvalluateTaskCount:result.toEvalluateTaskCount
    });//setState

    
    if(result.isTerminated){
    	this1.setState({agreementClass:"message is-danger",agreementStatus:"Terminated"});	
    }
    else if(result.isAccepted){
    	this1.setState({agreementClass:"message is-success",agreementStatus:"Accepted by worker"});
    }
    else {
    	this1.setState({agreementClass:"message is-info",agreementStatus:"Proposed"});		
    }


    storehash.methods.tasks(result.taskId).call({from: accounts[0] })
.then(function(result){
    console.log(result);
    this1.setState({taskTitle: result.taskTitle})});

if(this1.props.type == "TaskPoster")

    {
    	storehash.methods.workers(result.workerId).call({from: accounts[0] })
.then(function(result){
    console.log("!1111",result);
    this1.setState({workerName: result.userName});
    
});
}

else{


    	storehash.methods.taskPosters(result.taskPosterId).call({from: accounts[0] })
.then(function(result){
    console.log("22222",result);
    this1.setState({TaskPosterName:result.userName});
});

}

});//function(result)





}

render(){


if(this.state.type == "TaskPoster")
{



	return(
    //JSX for agreement Task Poster
<div className="box">

<article className={this.state.agreementClass}>
  <div className="message-header">
    <p>Agreement: {this.state.agreementStatus}</p>
   {/* <button className="delete" aria-label="delete" onClick={this.agreementDelete} ></button> */}
  </div>
  <div className="message-body">
  <div className="container">
	<h1 className="title is-2">{this.state.taskTitle}</h1>
  <div className="columns">

  <div className="column">
  	
  	Worker's Guarantee: {this.state.fee} ETH<br />
  	Start Time : {this.state.creation_time}<br />

</div>

  <div className="column">
  	<strong>Reward Amount : {this.state.AgreementReward} ETH</strong><br />
</div>

  <div className="column">
Worker username: {this.state.workerName}<br />  	
End Time : {this.state.taskEnd_time}<br />
</div>



</div>
     </div>
     </div>
<br />
<div className="container">
   <button className={this.state.agreementStatus == "Proposed"?"button is-danger":"is-invisible"} onClick={this.agreementDelete} >Terminate Agreement</button>
</div>
<br />  

</article>

</div>


		);

	}

else{

		return(
         //JSX for agreement worker
<div className="box">

<article className={this.state.agreementClass}>
  <div className="message-header">
    <p>Agreement: {this.state.agreementStatus}</p>
   {/* <button className="delete" aria-label="delete" onClick={this.agreementDelete} ></button> */}
  </div>
  <div className="message-body">
  <div className="container">
	<h1 className="title is-2">{this.state.taskTitle}</h1>
  <div className="columns">

  <div className="column">
  	
  	<strong>Fee to Accept : {(this.state.AgreementReward * 0.25)} ETH</strong><br />
  	Start Time : {this.state.creation_time}<br />

</div>

  <div className="column">
  	<strong>Reward Amount : {this.state.AgreementReward} ETH</strong><br />
</div>

  <div className="column">
TaskPoster username: {this.state.TaskPosterName}<br />  	
End Time : {this.state.taskEnd_time}<br />
</div>



</div>
     </div>

     </div>
<br />

{this.state.agreementStatus == "Proposed"?<div className="is-info">By accepting you agree to pay the acceptance fees. These will be refunded based on level of completion of the task.</div>:""}
<br />
<div className="container">
   <button className={this.state.agreementStatus == "Proposed"?"button is-success":"is-invisible"} onClick={this.agreementAccept} >Accept Agreement</button>
  
</div>
<br />

</article>

</div>
		);
}


}

componentDidMount(){
	console.log("agreement componentDidmount");
	this.setState({type:this.props.type});
	this.loadAgreement(this.props,this);
}


}

 export default Agreement;