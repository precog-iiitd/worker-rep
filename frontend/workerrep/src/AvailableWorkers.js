
import React, { Component } from 'react';
import web3 from './web3';
import storehash from './storehash';
import Tasklets from './Tasklets';


class AvailableWorkers extends Component {
	constructor (props) {
super(props);
 this.state = {
 	avail_workers_id: 0
 }

 this.load_Avail_Workers(this);

}


load_Avail_Workers = async (this1) => {
	console.log("loading available workers");

	const accounts = await web3.eth.getAccounts();
	     
	console.log('Sending from Metamask account: ' + accounts[0]);
	storehash.methods.getWorkersCount().call({from: accounts[0] })
.then(function(result){
    console.log(result);
    	this1.setState({avail_workers_id: result});
    });//function(result)
}

render()
{	

/*	var TaskletList = this.state.avail_workers_id.map(function(id){
                        return <Tasklets taskId={id}/>;
                      })*/


      var TaskletList = () => {
      	for(var i = 0;i<3;i++){
      		return <Tasklets taskId={i}/>;
      	}
      }
      console.log("tasklet list",TaskletList);
	return(<div>{TaskletList}</div>);
}
}

export default AvailableWorkers;