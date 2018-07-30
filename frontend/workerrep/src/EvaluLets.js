
import React, { Component } from 'react';
import web3 from './web3';
import storehash from './storehash';
import AgreementRegister from './AgreementRegister';

class EvaluLets extends Component {

	constructor (props) {
super(props);
	      this.state = {
			taskTitle:"",
			taskHash:"",
      taskId:0,
      modal_state:"modal",
      submissionHash:"",
      buttonClass:"button is-success",
      buttonScore:"button is-success",
      buttonDnD:"button is-success",
      qualityScore:0,
      completenessScore:0,
      agreementId:0,
      modal_state_2:"modal",
      privateKey:""			

		}

	    
	   
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {

      const target = event.target;
      const value = target.type === "checkbox" ? target.checked : target.value;
      const name = target.name;

      this.setState({
        [name]: value
      });
    }



    handleSubmit(event) {


      event.preventDefault();
      console.log(this.state);

  this.setState({buttonScore: "button is-primary is-loading"});

  async function f(state_obj,this1){
  const accounts = await web3.eth.getAccounts();
       
  console.log('Sending from Metamask account: handle submit in REG FORM' + accounts[0]);

  console.log("Sending data is ",state_obj.completenessScore,state_obj.qualityScore,state_obj.agreementId);
  storehash.methods.evaluationCompleted(state_obj.completenessScore,state_obj.qualityScore,state_obj.agreementId).send({
            from: accounts[0]
          }, (error, transactionHash) => {
            console.log(transactionHash);
            this1.setState({buttonScore: "button is-primary "});
          }); //storehash 
    

  }


  f(this.state,this);

  }


/*applyTask = async (event)=>{
	event.preventDefault();
	const accounts = await web3.eth.getAccounts();
	     
	console.log('Sending from Metamask account: ' + accounts[0]);


  storehash.methods.agreements(this.props.agreementId).call({from: accounts[0]})
  .then(function(result){
    console.log(result); 

  storehash.methods.registerForTask(result.taskId).send({from: accounts[0]})
  .then(function(result1){
    console.log(result1);
  });
  });


}*/


giveScore = async (event) => {
	event.preventDefault();
  this.open_modal()

}


open_modal = ()=>{
  this.setState({modal_state:"modal is-active"});
}

open_modal_2 = ()=>{
  this.setState({modal_state_2:"modal is-active"});
}

close_modal = ()=>{
  this.setState({modal_state:"modal",modal_state_2:"modal",buttonClass:"button is-success"});

}

decryptDownload = async(event)=>{
  event.preventDefault();
  this.setState({buttonClass: "button is-success is-loading",buttonDnD:"button is-success is-loading"});
  var submissionLink = "https://ipfs.io/ipfs/".concat(this.props.submissionHash);

  console.log("Submission work url ",submissionLink);

  var dataRecieved;
  var tempPrivateKey=this.state.privateKey ;
  var tempHash = this.props.submissionHash;
  var request = new XMLHttpRequest();
    
    request.open('GET', submissionLink, true);
    
    request.responseType = 'blob';
    
    request.onload = function() {
    
    var reader = new FileReader();
    
    reader.readAsDataURL(request.response);
    
    reader.onload =  async(e)=>{
        console.log('DataURL:', e);
        dataRecieved = e.target.result;
        //this.decrypt(dataRecieved);

         const EthCrypto = require('eth-crypto');

        //console.log("data recieved",dataRecieved);
        const encrypted = atob(dataRecieved.slice(23));//base64 data begins from 23rd char
        console.log("encrypted-->",encrypted," private key is ", tempPrivateKey);

        const test_decrypted = await EthCrypto.decryptWithPrivateKey(tempPrivateKey,encrypted);
        
        const bufferDataFile = Buffer.from( JSON.parse(test_decrypted).data);
        
        /*console.log(" test_decrypted ", test_decrypted);

        
        const buff1 = Buffer.from(bufferDataFile) 

        var buff = new Uint8Array(bufferDataFile.length);


        const buffer = await Buffer.from("THIS IS A TEST");
        console.log("buffer is ",buffer,"original is ",buffer.toString());

        for(var i=0;i<bufferDataFile.length;i++){
          buff[i]=parseInt(bufferDataFile[i]);
        }

        console.log("DECRYPTED STUFF ",buff.toString());
        */
        var blob = new Blob([bufferDataFile]);//, {type: "text/plain"});
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = tempHash.toString();
        link.click();        


       

    };


};
 
request.send();

this.stopLoading();
this.close_modal();
this.setState({buttonDnD:"button is-success"});  
}

stopLoading = ()=>{
  this.setState({buttonClass: "button is-success"});
}

/*
decrypt = aync(dataRecieved)=>{
   const EthCrypto = require('eth-crypto');
        const encrypted = dataRecieved;
        const test_decrypted =  EthCrypto.decryptWithPrivateKey('93a9df2ae18af2a48414acfd2e418c3eb341c6782a18578a1355fb95ec61e704',encrypted);
        console.log("DECRYPTED STUFF ",test_decrypted);
}*/

loadEvaluLet = async (props1,this1) => {
	console.log("loading EvaluLet");
  this1.setState({agreementId:props1.agreementId});

	const accounts = await web3.eth.getAccounts();
	     
	console.log('Sending from Metamask account: ' + accounts[0]);



  storehash.methods.agreements(this.props.agreementId).call({from: accounts[0]})
  .then(function(result1){
    console.log(result1); 


	storehash.methods.tasks(result1.taskId).call({from: accounts[0] })
.then(function(result){
    console.log(result);
    this1.setState({
    	
    	taskTitle: result.taskTitle,
    	taskHash: result.taskMaterialsHash,
      taskId: result1.taskId//props1.taskId
    });//setState
});//function(result)

});


/*	storehash.methods.isTaskPoster(accounts[0]).call({from: accounts[0] })
.then(function(result){
    console.log(result);
    	this1.setState({isTaskPoster: result});
    });//function(result)*/


}

render(){


/*if(this.state.isTaskPoster)
{

*/

	return(




<div className="box">

<div className={this.state.modal_state_2}>
  <div className="modal-background" onClick={this.close_modal} ></div>
    <div className="modal-content">


     {/*BEGIN MODAL*/}
<div className="container box">
    <div className="columns">
        <div className="column">
            <form className="form" onSubmit={this.decryptDownload}>
            

                <div className="field">
                    <div className="control">
                        <label className="label">Enter Private Key to decrypt data</label>

                        <input className="input" name="privateKey" type={"text"} value={this.state.privateKey} onChange={this.handleChange} required />
                    </div>
                </div>

                    <div className="field">
                    <div className="control">
                        <button type="submit" className={this.state.buttonDnD}>
                        {"Decrypt and Download Now"}
                        
                      </button>
                      </div>
                </div>
            </form>
        </div>
    </div>
  </div>
  {/*END MODAL CONTENT*/}




        </div>
    
    <button className="modal-close is-large" onClick={this.close_modal} aria-label="close"></button>
    }
  </div>


<div className={this.state.modal_state}>
  <div className="modal-background" onClick={this.close_modal} ></div>
    <div className="modal-content">

  {/*BEGIN MODAL*/}
<div className="container box">
    <div className="columns">
        <div className="column">
            <form className="form" onSubmit={this.handleSubmit}>
            

                <div className="field">
                    <div className="control">
                        <label className="label">Completeness Score (out of 100) </label>

                        <input className="input" name="completenessScore" type={ "number"} value={this.state.completenessScore} onChange={this.handleChange} required />
                    </div>
                </div>

            <div className="field">
                    <div className="control">
                        <label className="label"> Quality Score (out of 100)</label>

                        <input className="input" name="qualityScore" type={ "number"} value={this.state.qualityScore} onChange={this.handleChange} required />
                    </div>
                </div>



                <div className="field">
                    <div className="control">
                        <button type="submit" className={this.state.buttonScore}>
                        {"Submit Scores"}
                        
                      </button>
                      </div>
                </div>
            </form>
        </div>
    </div>
  </div>
  {/*END MODAL CONTENT*/}

    </div>
    
    <button className="modal-close is-large" onClick={this.close_modal} aria-label="close"></button>
    }
  </div>



<div className="card">
  <div className="card-content">
    <p className="title">
      {this.state.taskTitle}
    </p>
    
    
  </div>
  
  <footer className="card-footer">
    <p className="card-footer-item">
      <span>
        View <a target="_blank" href={"https://ipfs.io/ipfs/"+this.state.taskHash}> Task Details</a>
      </span>
    </p>
  
    
    <p className="card-footer-item">
      <span>
        <button className={this.state.buttonClass} onClick={this.open_modal_2}>Decrypt and Download Submission</button>
      </span>
    </p>
  

     <p className="card-footer-item">
      <span>
       <a onClick={this.giveScore}>Give Scores</a> 
      </span>
    </p>
  
  </footer>
</div>
</div>
		);
}

componentDidMount(){
	console.log("componentDidmount");

	this.loadEvaluLet(this.props,this);
   console.log("oooooooooooooo",this.props.agreementId);
}


}

 export default EvaluLets;