
import React, { Component } from 'react';
import web3 from './web3';
import storehash from './storehash';
import AgreementRegister from './AgreementRegister';
import Profile from './Profile';

class Tasklets extends Component {

	constructor (props) {
super(props);
	      this.state = {
			taskTitle:"",
			taskHash:"",
			taskReward:"",
			isTaskPoster:false,
      taskId:0,
      modal_state:"modal",
      modal_state_2:"modal",
      appliedWorkers:[],
      //viewProfileId:0		

		}

	    
	  }


applyTask = async (event)=>{
	event.preventDefault();
	const accounts = await web3.eth.getAccounts();
	     
	console.log('Sending from Metamask account: ' + accounts[0]);


	storehash.methods.registerForTask(this.props.taskId).send({from: accounts[0]})
	.then(function(result){
    console.log(result);
	});

}


makeAgreement = async (event) => {
	event.preventDefault();
  this.open_modal()

}


View_profile = async(ViewWorkerID)=>{
  //event.preventDefault();

function setId(this1,callback){
  this1.setState({viewProfileId:ViewWorkerID});
  console.log("HERE",ViewWorkerID)
  callback(this1);
  //this1.setState({modal_state_2:"modal is-active"});
  }

  function openModal(this1){
    console.log("MODAL Opened");
    this1.setState({modal_state_2:"modal is-active"});
  }

  setId(this,openModal);

  /*
  this.setState({viewProfileId:ViewWorkerID});
  console.log(" the worker view id passed is ",ViewWorkerID);
  */
  


}

open_modal = ()=>{
  this.setState({modal_state:"modal is-active"});
}

close_modal = ()=>{
  this.setState({modal_state:"modal", modal_state_2:"modal"});

}


loadTasklet = async (props1,this1) => {
	console.log("loading tasklet");

	const accounts = await web3.eth.getAccounts();
	     
	console.log('Sending from Metamask account: ' + accounts[0]);


	storehash.methods.tasks(props1.taskId).call({from: accounts[0] })
.then(function(result){
    console.log(result);

if(result.taskReward >= 10**15){
    this1.setState({taskReward:(result.taskReward/10**18).toString()+" Ether"});
      }
    else if(result.taskReward >= 10**6){
      this1.setState({taskReward:(result.taskReward/10**9).toString()+" GWei"});
    }
    else{
      this1.setState({taskReward:(result.taskReward).toString()+" Wei"});
    }


    this1.setState({
    	taskTitle: result.taskTitle,
    	taskHash: result.taskMaterialsHash,
      taskId: props1.taskId
    });//setState
});//function(result)




	storehash.methods.isTaskPoster(accounts[0]).call({from: accounts[0] })
.then(function(result){
    console.log(result);
    	this1.setState({isTaskPoster: result});

      if(result){
            storehash.methods.showRegisteredWorkers(props1.taskId).call({from: accounts[0] })
            .then(function(result){
            console.log(result);
            if(result.length == 0){
              this1.setState({appliedWorkers: "None"});
            }
            else{
              let renderWorkerList = result.map(function(workerId){
                return(<a onClick={()=>this1.View_profile(workerId)} target="_blank"><b> {workerId} </b></a>);
              });
            this1.setState({appliedWorkers: renderWorkerList});
          }
            console.log("   applied by  ")

            });

      }

    });//function(result)


}

render(){

console.log("this.state.viewProfileId",this.state.viewProfileId);

if(this.state.isTaskPoster)
{



	return(




<div className="box">


<div className={this.state.modal_state}>
  <div className="modal-background" onClick={this.close_modal} >
  </div>
    <div className="modal-content">
      <AgreementRegister taskId={this.state.taskId} taskTitle={this.state.taskTitle} />
    </div>
  <button className="modal-close is-large" onClick={this.close_modal} aria-label="close"></button>
</div>



<div className={this.state.modal_state_2}>
  <div className="modal-background" onClick={this.close_modal} >
  </div>
    <div className="modal-content">
      <Profile type={"Worker"} workerId={this.state.viewProfileId} />
    </div>
  <button className="modal-close is-large" onClick={this.close_modal} aria-label="close"></button>
</div>



<div className="card">
  <div className="card-content">
    <p className="title is-2">
      {this.state.taskTitle}
    </p>
    <p className="title is-3">
      {this.state.taskReward} 
    </p>
  </div>
  <footer className="card-footer">
    <p className="card-footer-item">
      <span>
        View on <a href={"https://ipfs.io/ipfs/"+this.state.taskHash} target="_blank">View Task Details</a>
      </span>
    </p>


  <p className="card-footer-item">
      <span>
        Applied By Workers:  {this.state.appliedWorkers} 
      </span>
    </p>
  
     <p className="card-footer-item">
      <span>
        Create  <a href="#" onClick={this.makeAgreement}>Agreement</a> 
      </span>
    </p>


  
  </footer>
</div>
</div>
		);

	}

else{

		return(
<div className="box">
<div className="card">
  <div className="card-content">
    <p className="title is-2">
      {this.state.taskTitle}
    </p>
    <p className="title is-3">
      {this.state.taskReward} 
    </p>
  </div>
  <footer className="card-footer">
    <p className="card-footer-item">
      <span>
        View on <a href={"https://ipfs.io/ipfs/"+this.state.taskHash}>View Task Details</a>
      </span>
    </p>



    <p className="card-footer-item">
      <span>
        Apply For  <a href="#" onClick={this.applyTask}>Task</a>
      </span>
    </p>
  
  
  
  </footer>
</div>
</div>
		);
}


}

componentDidMount(){
	console.log("componentDidmount");
	this.loadTasklet(this.props,this);
}


}

 export default Tasklets;