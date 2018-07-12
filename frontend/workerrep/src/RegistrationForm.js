	import React, { Component } from 'react';
	import web3 from './web3';
	import ipfs from './ipfs';
	import storehash from './storehash';
	import '../node_modules/bulma/css/bulma.css';
	import './App.css';
	
	class RegistrationForm extends Component {

	constructor (props) {
	      super(props);
	      this.state = {
			username:"",
			ethAddress:"",
			isWorker:"Yes",
			profileHash:"",
			deposit:1,
			publicKey:"",
			button:"button is-primary",
			button_pubKeyHash:"button is-primary",
			privateKey:"",
			modal_state:"modal",
			button3:"button is-primary",
			ipfsHash:"",
			buffer:""
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

	this.setState({button: "button is-primary is-loading"});

	async function f(state_obj,this1){
	const accounts = await web3.eth.getAccounts();
	     
	console.log('Sending from Metamask account: ' + accounts[0]);

	if(state_obj.isWorker == "Yes"){
	storehash.methods.makeWorker(state_obj.username,state_obj.profileHash,state_obj.publicKey).send({
	          from: accounts[0],
	          value: state_obj.deposit*1000000000
	        }, (error, transactionHash) => {
	          console.log(transactionHash);
	          this1.setState({button: "button is-primary "});
	        }); //storehash 
		}
		else {


	storehash.methods.makeTaskPoster(state_obj.username,state_obj.profileHash,state_obj.publicKey).send({
	          from: accounts[0],
	          value: state_obj.deposit*1000000000
	        }).on('error', function(error){ 
				this1.setState({button: "button is-danger "});
			})
			.on('confirmation', function(confNumber, receipt){ 
				this1.setState({button: "button is-success "});
			 })
			.then(function(receipt){
				this1.setState({button: "button is-success "});
				console.log(receipt);
			}); 
		

		}
	}


	f(this.state,this);

	}



pubHash = ()=>{
	this.setState({modal_state:"modal is-active",button_pubKeyHash:"button is-primary is-loading"});
}

close_modal = ()=>{
	this.setState({modal_state:"modal",button_pubKeyHash:"button is-primary"});

}




handleSubmit2 = async(event) => {
event.preventDefault()
this.setState({button3:"button is-primary is-loading"});
//87ce67769a37527d0ad2859f6650a1f6cde3aba6bbc41485dcf4f92b927fcd42
const privateKey = Buffer.from(this.state.privateKey, 'hex')
const util = require('ethereumjs-util');
const value = util.privateToPublic(privateKey);
console.log("--------------------------------------------------------------")
console.log(Buffer.from(value).toString('hex'));
console.log("--------------------------------------------------------------")



	await ipfs.add(Buffer.from(Buffer.from(value).toString('hex')), (err, ipfsHash) => {
        console.log(err,ipfsHash);
        //setState by setting ipfsHash to ipfsHash[0].hash 
        this.setState({ button_pubKeyHash:" button is-success" });
        console.log(this.state.ipfsHash);
        this.setState({ privateKey:"" , publicKey:ipfsHash[0].hash});//remove private key from state
        console.log("ipfs hash of stored public keys is",this.state.publicKey);
        this.setState({modal_state:"modal",button_pubKeyHash:"button is-primary"});
});

}





		render() {


	    return (

<div className="container box gap">
    <div className="columns">
       
<div className={this.state.modal_state}>
  <div className="modal-background" onClick={this.close_modal} ></div>
  <div className="modal-content">
  <div className="box">
    <form className="form" onSubmit={this.handleSubmit2}>

                <div className="field">
                    <div className="control">
                        <label className="label">
	                      Private Key
	                    </label>
	                     <input className="input" name="privateKey" type={ "text"} value={this.state.privateKey} onChange={this.handleChange} required />
                    </div>
                </div>

                   <div className="field">
                    <div className="control">
                        <button type="submit" className={this.state.button3}>
	                      {"Submit"}
	                      
	                    </button>
	                   </div>
                </div>
            </form>



    </div>
  </div>
  <button className="modal-close is-large" onClick={this.close_modal} aria-label="close"></button>
</div>

        <div className="column is-9">



            <form className="form" onSubmit={this.handleSubmit}>



                <div className="field">
                    <div className="control">
                        <label className="label">
	                      Account Type
	                    </label>
                        <label className="radio">
	          <input  type="radio" name="isWorker" onChange={this.handleChange}  value="Yes" checked={this.state.isWorker === "Yes"} /> Worker
	          </label>
                        <label className="radio">
	          <input  type="radio" name="isWorker" onChange={this.handleChange}  value="No" checked={this.state.isWorker === "No"} /> Task Poster
	          </label>
                    </div>
                </div>



                <div className="field">
                    <div className="control">
                        <label className="label">Username</label>

                        <input className="input" name="username" type={ "text"} value={this.state.username} onChange={this.handleChange} required />
                    </div>
                </div>


                <div className="field">
                    <div className="control">
                        <label className="label">Profile Hash/Link</label>
                        <input className="input" name="profileHash" type={ "text"} value={this.state.profileHash} onChange={this.handleChange} required />
                    </div>
                </div>

                <div className="field">
                    <div className="control">
                        <label className="label">Public Key Hash</label>
                        <div className="field">
                        <div className="control">
                        <button onClick={this.pubHash} className={this.state.button_pubKeyHash}>
	                      {"Click to generate this hash"}
	                      
	                    </button>
	                    <br />
	                    </div></div>

                        <input className="input" name="publicKey" type={ "text"} value={this.state.publicKey} onChange={this.handleChange} disabled/>
                    </div>
                </div>

                <div className="field">
                    <div className="control">
                        <label className="label">Deposit Amount {"(Min 10 Gwei)"}</label>

                        <input className="input" name="deposit" type={ "number"} value={this.state.deposit} onChange={this.handleChange} required/>{"Giga-Wei"}
                    </div>
                </div>

                <div className="field">
                    <div className="control">
                        <button type="submit" className={this.state.button}>
	                      {"Submit"}
	                      
	                    </button></div>
                </div>
            </form>
        </div>
    </div>
</div>

	    	);
	}
	}

	export default RegistrationForm;