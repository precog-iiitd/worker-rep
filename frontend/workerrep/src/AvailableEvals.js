
import React, { Component } from 'react';
import web3 from './web3';
import storehash from './storehash';
import EvaluLets from './EvaluLets';

class AvailableEvals extends Component {
	constructor (props) {
super(props);
 this.state = {
 	agreementIds: [],
    solutionHashes:[],
    ethAddress:""//add by props??

 }

 //this.load_Avail_Evals(this);

}


load_Avail_Evals = async (this1) => {
	console.log("loading available EVALS");

	const accounts = await web3.eth.getAccounts();
	     
	console.log('Sending from Metamask account: ' + accounts[0]);


/*storehash.events.Transfer({ filter: { _evaluatorAddress: this1.state.ethAddress } })
.on("pleaseEvaluate", function(event) {
  let data = event.returnValues;
    console.log(data);
}).on("error", console.error);
*/
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
	console.log("available EVALS are : ",this.state.agreementIds);
	var EvaluLetsList = this.state.agreementIds.map(function(id){
						console.log("rendering task");
                        return <EvaluLets agreementId={id}/>;
                      })

	
	return(<div>{EvaluLetsList}</div>

		


			

		);
}

componentDidMount(){
    console.log("componentDidmount");
    //this.loadTasklet(this.props,this);
    this.setState({ethAddress:this.props.ethAddress});
    console.log(this.state.ethAddress);
    this.load_Avail_Evals(this);
}


}

export default AvailableEvals;