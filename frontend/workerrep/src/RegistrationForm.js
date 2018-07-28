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


f1 = async(this1) => {
		this1.setState({ button:" button is-primary is-loading" });
	await ipfs.add(this1.state.buffer, (err, ipfsHash) => {
        console.log(err,ipfsHash);
        //setState by setting ipfsHash to ipfsHash[0].hash 
        this1.setState({ ipfsHash:ipfsHash[0].hash, button:" button is-success" });
        console.log(this1.state.ipfsHash);
}
)//ipfs add 
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
        const buffer = await Buffer.from(reader.result);
        this.setState({buffer});
         this.f1(this); 
    };






	  handleSubmit(event) {


	    event.preventDefault();
	    console.log(this.state);

	this.setState({button: "button is-primary is-loading"});

	async function f(state_obj,this1){
	const accounts = await web3.eth.getAccounts();
	     
	console.log('Sending from Metamask account: handle submit in REG FORM' + accounts[0]);

	if(state_obj.isWorker == "Yes"){
	storehash.methods.makeWorker(state_obj.username,state_obj.ipfsHash,state_obj.publicKey).send({
	          from: accounts[0],
	          value: state_obj.deposit*1000000000*1000000000
	        }, (error, transactionHash) => {
	          console.log(transactionHash);
	          this1.setState({button: "button is-primary "});
	        }); //storehash 
		}
		else {


	storehash.methods.makeTaskPoster(state_obj.username,state_obj.ipfsHash,state_obj.publicKey).send({
	          from: accounts[0],
	          value: state_obj.deposit*1000000000*1000000000
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



pubHash = (event)=>{
	event.preventDefault()
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

//removed IPFS
this.setState({ button_pubKeyHash:" button is-success" });
console.log("Calculated public keys is",this.state.publicKey);
this.setState({ privateKey:"" , publicKey:Buffer.from(value).toString('hex')});
 this.setState({modal_state:"modal",button_pubKeyHash:"button is-primary"});
//removed IPFS end


/*	await ipfs.add(Buffer.from(Buffer.from(value).toString('hex')), (err, ipfsHash) => {
        console.log(err,ipfsHash);
        //setState by setting ipfsHash to ipfsHash[0].hash 
        this.setState({ button_pubKeyHash:" button is-success" });
        console.log(this.state.ipfsHash);
        //Don't send public key to IPFS, just send it to smart contract instead.
        //this.setState({ privateKey:"" , publicKey:ipfsHash[0].hash});//remove private key from state
        this.setState({ privateKey:"" , publicKey:Buffer.from(value).toString('hex')});//replaced aboove comment with this
        //console.log("ipfs hash of stored public keys is",this.state.publicKey);
        console.log("Calculated public keys is",this.state.publicKey);
        this.setState({modal_state:"modal",button_pubKeyHash:"button is-primary"});
});*/

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
                        </div></div>

<div className="field">
                <div className="file has-name is-fullwidth">
                
  <label className="file-label">

    <input className="file-input" type="file" name="buffer" onChange = {this.captureFile} />
    <span className="file-cta">
      <span className="file-icon">
        <i className="fas fa-upload"></i>
      </span>
      <span className="file-label">
        Choose a file…
      </span>
    </span>
    <span className="file-name">
      {this.state.ipfsHash}
    </span>
  </label>
</div>
</div>

{/* old profile hash
                <div className="field">
                    <div className="control">
                        <label className="label">Profile Hash/Link</label>
                        <input className="input" name="profileHash" type={ "text"} value={this.state.profileHash} onChange={this.handleChange} required />
                    </div>
                </div>
*/}


                <div className="field">
                    <div className="control">
                        <label className="label">Public Key</label>
                        <div className="field">
                        <div className="control">
                        <button onClick={this.pubHash} className={this.state.button_pubKeyHash}>
	                      {"Click to generate public key"}
	                      
	                    </button>
	                    <br />
	                    </div></div>

                        <input className="input" name="publicKey" type={ "text"} value={this.state.publicKey} onChange={this.handleChange} />
                    </div>
                </div>

                <div className="field">
                    <div className="control">
                        <label className="label">Deposit Amount {"( Minimum 0.125 Ether )"}</label>

                        <input className="input" name="deposit" type={ "number"} value={this.state.deposit} onChange={this.handleChange} required/>{" Ether "}
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