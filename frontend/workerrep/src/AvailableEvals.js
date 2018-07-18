
import React, { Component } from 'react';
import web3 from './web3';
import storehash from './storehash';
import Tasklets from './Tasklets';

class AvailableEvals extends Component {
	constructor (props) {
super(props);
 this.state = {
 	agreementIds: [],
    solutionHashes:[],
    ethAddress:props.ethAddress;

 }

 this.load_Avail_Evals(this);

}


load_Avail_Tasks = async (this1) => {
	console.log("loading available tasks");

	const accounts = await web3.eth.getAccounts();
	     
	console.log('Sending from Metamask account: ' + accounts[0]);


    cryptoZombies.events.Transfer({ filter: { _evaluatorAddress: this1.state.ethAddress } })
.on("pleaseEvaluate", function(event) {
  let data = event.returnValues;
    console.log(data);
}).on("error", console.error);

        }
/*	storehash.methods.showAvailableTasks().call({from: accounts[0] })
.then(function(result){
    console.log(result);
    	//this1.setState({avail_tasks_id: result});

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
    	
*/
    	/*this1.setState({avail_tasks_id: result});
    	if(this1.state.avail_tasks_id.length == 0){
    		console.log("No tasks !!!");


    });//function(result)*/
//}

render()
{	
	console.log("available tasks are : ",this.state.avail_tasks_id);
	var TaskletList = this.state.avail_tasks_id.map(function(id){
						console.log("rendering task");
                        return <Tasklets taskId={id}/>;
                      })

	
	return(<div>{TaskletList}</div>

		


			

		);
}
}

export default AvailableEvals;