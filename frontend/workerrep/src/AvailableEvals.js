
import React, { Component } from 'react';
import web3 from './web3';
import storehash from './storehash';
import EvaluLets from './EvaluLets';

class AvailableEvals extends Component {
	constructor (props) {
super(props);
 this.state = {
 	agreementIds: [],
    eventId:[],
    solutionHashes:[],
    ethAddress:""

 }

 //this.load_Avail_Evals(this);

}


load_Avail_Evals = async (this1) => {
	console.log("loading available EVALS");
    var myAddress = this1.state.ethAddress;

storehash.getPastEvents("pleaseEvaluate", { fromBlock: 0, toBlock: "latest" })
//.on("data",
 .then(function(events) {
   let numEvents = events.length;
   console.log("the number of events are ",numEvents); 
  
  let tempAgreementIds = [],tempSolutionHashes = [],tempEventsId=[],count = 0;

for(let i = 0;i<numEvents;i++){

  if(events[i].returnValues._evaluatorAddress == myAddress){
    
    tempSolutionHashes.push(events[i].returnValues._solutionHash);
    tempAgreementIds.push(events[i].returnValues._agreementId);
    tempEventsId.push(count);
    count++;
  }
}
  
  this1.setState({agreementIds:tempAgreementIds,solutionHashes:tempSolutionHashes,eventId:tempEventsId});
  console.log("---------",this1.state);
//console.log("-----",evals);
});//.on("error", console.error);

}


render()
{	
/*	console.log("available EVALS are : ",this.state.agreementIds);
	var EvaluLetsList = this.state.agreementIds.map(function(id){

						console.log("rendering task");
                        let solnHash = "jhbk";// this.state.solutionHashes[id];

                        return <EvaluLets agreementId={id} submissionHash={solnHash} />;
                      })
return(<div>{/*EvaluLetsList</div> }		

		); */

      
var  hashesToRender= this.state.solutionHashes;
var  agreementIdsToRender= this.state.agreementIds;
var EvaluationList = this.state.eventId.map(function(id){
                        console.log("rendering Eval box");

                        return <EvaluLets agreementId={agreementIdsToRender[id]} submissionHash={hashesToRender[id]} />;
                      });

    
    return(<div>{EvaluationList}</div>);




}

componentDidMount(){
    console.log("componentDidmount in AvailableEvals");


    async function getAddress(this1){
        const accounts = await web3.eth.getAccounts();
        this1.setState({ethAddress:accounts[0]});
    
        //call loading here
        this1.load_Avail_Evals(this1);
    }

    getAddress(this);

    //this.loadTasklet(this.props,this);
/*    this.setState({ethAddress:this.props.ethAddress});
    console.log("got your address",this.state.ethAddress);
    this.load_Avail_Evals(this);
*/
}


}

export default AvailableEvals;