
import React, { Component } from 'react';
import web3 from './web3';
import storehash from './storehash';
import SubmitSolution from './SubmitSolution';
import SubmitToEval from './SubmitToEval';

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
			toEvalluateTaskCount:0,// removed extra taskTitle
			workerName:"",
			TaskPosterName:"",
			modal_state:"modal",
			modal_state_2:"modal",
			already_submitted:false	
			

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

getEvaluators = async(event)=>{
	console.log("get Evaluators called");
	event.preventDefault();
	const accounts = await web3.eth.getAccounts();
	     
	console.log('Sending from Metamask account: ' + accounts[0]);

	storehash.methods.getEvaluators(this.props.agreementId).send({from: accounts[0]})
	.then(function(result){
		console.log("get Evaluators called");
    console.log(result);
    //this.setState({isTerminated:true,agreementClass:"message is-danger",agreementStatus:"Terminated"});
	});


}

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

let agId = this.props.agreementId;

	storehash.methods.acceptAgreement(parseInt(agId)).send({from: accounts[0], value: this.state.fee * (10**18)})
	.then(function(result){
    console.log(result);
    //this.setState({isAccepted:true,agreementClass:"message is-success",agreementStatus:"Accepted by worker"});
	});



}

open_modal = ()=>{
  this.setState({modal_state:"modal is-active"});
}

close_modal = ()=>{
  this.setState({modal_state:"modal"});

}

open_modal_2 = ()=>{
  this.setState({modal_state_2:"modal is-active"});
}

close_modal_2 = ()=>{
  this.setState({modal_state_2:"modal"});

}

submitSolutionFunc = async(event)=>{
	console.log("in submit solution");
	event.preventDefault();
	
	//open modal
	this.open_modal();

}


submitSolutionToEval = async(event)=>{
	console.log("in submit solution to eval");
	event.preventDefault();
	
	//open modal
	this.open_modal_2();

}


loadAgreement = async (props1,this1) => {
	
	console.log("loading Agreement");

	const accounts = await web3.eth.getAccounts();
	     
			storehash.methods.agreements(props1.agreementId).call({from: accounts[0] })
.then(function(result){
    console.log("result obtained from agreement ",props1.agreementId," is ",result);
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


    storehash.methods.tasks(this1.state.taskId).call({from: accounts[0] })
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
    console.log("gettiing taskposter username for agreement",result);
    this1.setState({TaskPosterName:result.userName});

    /*storehash.methods.workers(this1.state.workerId).call({from: accounts[0] })
.then(function(result1){
    console.log("worker is ",result1);
    this1.setState({already_submitted:result1.availableForEvaluation});//checks if already submitted for evaluation
	
	});*/

	console.log("checking length of solution hash !=0 ?",this1.state.solutionHash);
	if(this1.state.solutionHash != ""){

		this1.setState({already_submitted:true});
	}




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
<div className={this.state.modal_state}>
  <div className="modal-background" onClick={this.close_modal} ></div>
    <div className="modal-content">
  
    <SubmitSolution agreementId={this.props.agreementId}  />
    
    </div>
<button className="modal-close is-large" onClick={this.close_modal} aria-label="close"></button>
  </div>


<div className={this.state.modal_state_2}>
  <div className="modal-background" onClick={this.close_modal_2} ></div>
    <div className="modal-content">
  {this.props.agreementId}
   <SubmitToEval agreementId={this.props.agreementId} />
    
    </div>
<button className="modal-close is-large" onClick={this.close_modal_2} aria-label="close"></button>
  </div>




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
  	
  	<strong>Fee to Accept : {this.state.fee} ETH</strong><br />
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
   <button className={this.state.agreementStatus == "Proposed"?"button is-success":"is-invisible"} onClick={this.agreementAccept} >Accept Agreement</button><br />
   <button className={(this.state.agreementStatus == "Accepted by worker" && !this.state.already_submitted)?"button is-success":"is-invisible"} onClick={this.submitSolutionFunc } >Submit Solution Hash</button><br />
   
<button className={(this.state.already_submitted)?"button is-success":"is-invisible"} onClick={this.getEvaluators } >Get Evaluators</button><br />
 <br />
   <button className={(this.state.already_submitted)?"button is-success":"is-invisible"} onClick={this.submitSolutionToEval } >Submit Solution To Evaluators</button><br />
  
  
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
	console.log("The props I got are ",this.props);
}


}

 export default Agreement;