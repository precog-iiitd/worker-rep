import {Table, Grid, Button, Form } from 'react-bootstrap';
import React, { Component } from 'react';
import './App.css';

import web3 from './web3';
import ipfs from './ipfs';
import storehash from './storehash';

import RegistrationForm from './RegistrationForm';

import TaskPost from './taskPost';
import Tasklets from './Tasklets';
import AvailableTasks from './AvailableTasks';
import NavTabs from './NavTabs';
import Agreement from './Agreement';
import Profile from './Profile';
import AgreementRegister from './AgreementRegister';
import AvailableWorkers from './AvailableWorkers';
import AvailableAgreements from './AvailableAgreements';
import AvailableEvals from './AvailableEvals';



    const App1 = () => (
    <Button variant="contained" color="primary">
      Submit
    </Button>
  );

class App extends Component {

   state = {
      CurrentactiveTab:1,
      defaultUserType:'',
      name:null,
      ipfsHash:null,
      buffer:'',
      ethAddress:'',
      blockNumber:'',
      transactionHash:'',
      gasUsed:'',
      txReceipt: '',
      workers:[] 
    };
   
    captureFile = (event) => {
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)    
      };

    convertToBuffer = async(reader) => {
      //file is converted to a buffer to prepare for uploading to IPFS
        const buffer = await Buffer.from(reader.result);
      //set this buffer -using es6 syntax
        this.setState({buffer});
    };


captureName = (event) =>{
  this.setState({name:event.target.value});
};


loadWorkers = (c) => {
  storehash.methods.workers(c).call()
    .then((r,e) =>{console.log(r,e);
      let workers = this.state.workers;
      workers.push(r);
  this.setState({workers});
    })
    ;
};


setUserType = async(this1) => {
  var defaultUserType = '';
  var isTaskPoster,isWorker;
  const accounts = await web3.eth.getAccounts();
  
  storehash.methods.isTaskPoster(accounts[0]).call()
    .then(function(result) {
      console.log("isTaskPoster is ");
      console.log(result);
      isTaskPoster = result;
  //this.setState({workers});


    if (isTaskPoster == true){
      defaultUserType = 'TaskPoster';
    
      this1.setState({defaultUserType});
    }
    else {

  storehash.methods.isRegistered(accounts[0]).call()
    .then(function(result) {
      console.log("is worker is ",result);
      isWorker = result;
      console.log(isWorker);
  //this.setState({workers});

    if (isWorker == true){
        defaultUserType = "Worker";
        console.log("isWorker is true");
      }
      else{
        defaultUserType = "unregistered"
      }

      this1.setState({defaultUserType});
    });

      

    }
console.log("defaultUserType is ", defaultUserType);    

//this.setState({defaultUserType});

    });




    
};




setCurrentTab = (tabvalue) =>{
  this.setState({CurrentactiveTab: tabvalue});
};




        onClick = async () => {

    try{
        this.setState({blockNumber:"waiting.."});
        this.setState({gasUsed:"waiting..."});

        // get Transaction Receipt in console on click
        // See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
        await web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt)=>{
          console.log(err,txReceipt);
          this.setState({txReceipt});
        }); //await for getTransactionReceipt

        await this.setState({blockNumber: this.state.txReceipt.blockNumber});
        await this.setState({gasUsed: this.state.txReceipt.gasUsed});    
      } //try
    catch(error){
        console.log(error);
      } //catch
  } //onClick

    onSubmit = async (event) => {
      event.preventDefault();

      //bring in user's metamask account address
      const accounts = await web3.eth.getAccounts();
     
      console.log('Sending from Metamask account: ' + accounts[0]);

      //obtain contract address from storehash.js
      const ethAddress= await storehash.options.address;
      this.setState({ethAddress});

      //save document to IPFS,return its hash#, and set hash# to state
      //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
      await ipfs.add(this.state.buffer, (err, ipfsHash) => {
        console.log(err,ipfsHash);
        //setState by setting ipfsHash to ipfsHash[0].hash 
        this.setState({ ipfsHash:ipfsHash[0].hash });
        console.log(this.state.ipfsHash);

        // call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract 
        //return the transaction hash from the ethereum contract
        //see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
        
        storehash.methods.makeWorker(this.state.name,this.state.ipfsHash).send({
          from: accounts[0],
          value: 1000000000
        }, (error, transactionHash) => {
          console.log(transactionHash);
          this.setState({transactionHash});
        }); //storehash 
      }) //await ipfs.add 
    } //onSubmit 

getWorkers = async (event) => {

const accounts = await web3.eth.getAccounts();

console.log("inside getW");

for(var i =0;i<7;i++){
  storehash.methods
  .workers(i)
  .call({from: accounts[0]}, function(error, result){
    console.log(result);
    });
}

}



getTasks = async (event) => {

const accounts = await web3.eth.getAccounts();

console.log("inside getW");

for(var i =0;i<7;i++){
  storehash.methods
  .tasks(i)
  .call({from: accounts[0]}, function(error, result){
    console.log(result);
    });
}

}

//myfunction
getAccAddress = async() => {
  const accounts = await web3.eth.getAccounts();
  console.log(accounts[0]);
  return accounts[0];
}






  render() {

    return (



      <div className="App">



      
  <section className="hero is-primary">
  <div className="hero-body">
    <div className="container">
      <h1 className="title is-1">
        WorkerRep
      </h1>
      <h2 className="subtitle">
        Crowd Sourcing Re-imagined
      </h2>
    </div>
  </div>
</section>


{this.state.defaultUserType != '' ? <NavTabs type={this.state.defaultUserType} activeTab={this.state.CurrentactiveTab} setCurrentTab={this.setCurrentTab} /> : null}


<br />

<AvailableWorkers />
{ /*(this.state.CurrentactiveTab==2 && this.state.defaultUserType=="TaskPoster") ? <AvailableWorkers /> : null*/ }

{ (this.state.CurrentactiveTab==2 && this.state.defaultUserType=="Worker") ? <AvailableTasks /> : null }

{ (this.state.CurrentactiveTab==3 && this.state.defaultUserType=="TaskPoster") ? <div><TaskPost /><AvailableTasks /></div> : null }



{ (this.state.CurrentactiveTab == 4) ? <AvailableAgreements type={this.state.defaultUserType} />: null }
{ (this.state.CurrentactiveTab==3 && this.state.defaultUserType=="Worker") ? <AvailableEvals /> : null }

{/*
  <section className={(this.state.CurrentactiveTab==3 && this.state.defaultUserType=="TaskPoster")?"is-medium":"is-invisible"}><TaskPost /><AvailableTasks /></section>
*/
}
<section type={this.state.defaultUserType} className={this.state.CurrentactiveTab==1?"is-medium":"is-invisible"}>

{(this.state.defaultUserType != '' && this.state.defaultUserType != 'unregistered')? <Profile type={this.state.defaultUserType}/> : "" }





</section>

<br />




{/*
User Registration Form
<RegistrationForm />
<br />
Post Task
<TaskPost />    


AvailableTasks




       Agreement
       <Agreement />


*/}

      </div>
    );
  }


  f=async()=>{

  const accounts = await web3.eth.getAccounts();
     
      
      //obtain contract address from storehash.js
      const ethAddress= await storehash.options.address;
      this.setState({ethAddress});
    }


componentDidMount(){
  console.log("componentDidmount");
  this.setUserType(this);
  this.f;

}


}




export default App;
