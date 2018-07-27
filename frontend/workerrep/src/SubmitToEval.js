	import React, { Component } from 'react';
	import web3 from './web3';
	import ipfs from './ipfs';
	import storehash from './storehash';
	import '../node_modules/bulma/css/bulma.css'
	import './App.css';
class SubmitToEval extends Component {

	constructor (props) {
super(props);
	      this.state = {
			buffer:{},
			ipfsHashCommaSeperated:"",
			addresses:[],
			walletAddresses:[],
			agreementId:1,
			button:"button is-primary",
			bufferArg:{}
            

		}

	    this.handleChange = this.handleChange.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
	  }

f1 = async(this1,bufferId) => {

		console.log("BUffer ID is ",this1.state.buffer[bufferId],bufferId,this.state.buffer);	
		this1.setState({ button:" button is-primary is-loading" });
	await ipfs.add(this1.state.buffer[bufferId], (err, ipfsHash) => {
		console.log("case is buffer ID",bufferId);
        console.log(err,ipfsHash);
        //setState by setting ipfsHash to ipfsHash[0].hash 
       	const addHash = this1.state.ipfsHashCommaSeperated;
       	let addhash1;
       	console.log("add hash is ",addHash,"ipfs is ",ipfsHash[0].hash);
       	if(addHash == "")

       	{
       		/*addhash1 = addHash.concat(ipfsHash[0].hash);*/
       	this1.setState({ ipfsHashCommaSeperated:addHash.concat(ipfsHash[0].hash), button:" button is-success" });
       	}
       else {
       	this1.setState({ ipfsHashCommaSeperated:addHash.concat(",").concat(ipfsHash[0].hash), button:" button is-success" });
       	/*var temp = addHash.concat(",");
       	addhash1 = temp.concat(ipfsHash[0].hash);*/
       }
      
       // this1.setState({ ipfsHashCommaSeperated:addHash1, button:" button is-success" });
        console.log("ipfsHashCommaSeperated is ",this1.state.ipfsHashCommaSeperated);
        console.log("ADDRESSES ",this1.state.addresses);
}
);//ipfs add

};

 captureFile = (event) => {
 	console.log("in capture file");
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)   
        
      };

    convertToBuffer = async(reader) => {
    	console.log("converting to buffer");
      //file is converted to a buffer to prepare for uploading to IPFS
        const buffer = await Buffer.from(reader.result);
        console.log("buffer is ",buffer,"original is ",buffer.toString());
      //set this buffer -using es6 syntax
/*const createKeccakHash = require('keccak');
this.setState({keccakHash:createKeccakHash('keccak256').update(buffer).digest('hex')});
console.log("Shubham is awsome Dude",this.state.keccakHash);*/
		
		//this.setState({bufferArg:buffer});
		//console.log("STate buffer is ",this.state.bufferArg);
		this.getEvalPubAddressesEncrypt(this,0,buffer);		
		this.getEvalPubAddressesEncrypt(this,1,buffer);
		this.getEvalPubAddressesEncrypt(this,2,buffer);
	

        /* this.f1(this);*/ 
    };

getEvalPubAddressesEncrypt = async(this1,evalId,buffer)=>{
	console.log("-------------------");
	console.log("entered getEvalPubAddressesEncrypt",this1.state.agreementId,evalId,buffer);
	console.log("-------------------");

	storehash.methods.agreementToEvaluators(this1.state.agreementId,evalId).call()

			.then(function(receipt1){

				console.log("++++++++++");
				console.log(receipt1);

				storehash.methods.workers(receipt1).call().then(
					function(result){
						
						console.log(result.encryptionkeyAddress);



						var addresses1= this1.state.addresses;
						addresses1.push(result.encryptionkeyAddress);
						this1.setState({addresses:addresses1});
						
						var WallAddresses= this1.state.walletAddresses;
						WallAddresses.push(result.publicAddress );
						this1.setState({walletAddresses:WallAddresses});
						
						console.log("addresses array ",addresses1);
						console.log("wallet addresses array ",WallAddresses);
						this1.encryptFile(buffer,result.encryptionkeyAddress,evalId);


					}

					);

			});

			console.log(evalId," Encryption process completed");
}


encryptFile = async(fileBuffer,pubkey,evaluatorId)=>{
	console.log(evaluatorId," PUB KEY IS " ,pubkey);

	 	const EthCrypto = require('eth-crypto');
        const secretMessage = JSON.stringify(fileBuffer);
        const pubKeyBob = pubkey;



        const encrypted = await EthCrypto.encryptWithPublicKey(
            pubKeyBob, // by encryping with bobs publicKey, only bob can decrypt the payload with his privateKey
            secretMessage // we have to stringify the payload before we can encrypt it
        );

        const encryptedString = EthCrypto.cipher.stringify(encrypted);
        console.log("ENCRYPTED STRING ",encryptedString);
        const buffer1 = await Buffer.from(encryptedString);

        var bufferObj = this.state.buffer;
        bufferObj[evaluatorId] = buffer1;
        this.setState({buffer:bufferObj});//.then(function(){console.log("here here");this.f1(this);});
        console.log(evaluatorId," calling F1");
        this.f1(this,evaluatorId);
        console.log(evaluatorId," COMPLETED calling F1");

        //console.log("buffer to str",buffer1.toString(),buffer1);
        //this.setState({buffer:buffer1});
        
        //to decrypt
/*
        console.log("encrypted string file",encrypted,"public key",pubkey);

        const test_decrypted = await EthCrypto.decryptWithPrivateKey('dca2385363d0827163951d3fc9ad4aa9848cf559190e3753949a2baac94eb1e2',encrypted);
        console.log("DECRYPTED STUFF ",test_decrypted);
        */
        //end to decrypt
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

	async function f(this1){
	const accounts = await web3.eth.getAccounts();

console.log('Sending from Metamask account: ' + accounts[0]);

console.log("whats being sent you ask ?\n","\n IPFS hash: ",this1.state.ipfsHashCommaSeperated,"Wallet address: ",this1.state.walletAddresses,"agreementId :",this1.state.agreementId)



storehash.methods.submitToEvaluators(this1.state.ipfsHashCommaSeperated,this1.state.walletAddresses,this1.state.agreementId).send({
	          from: accounts[0]
	        })
			.on('error', function(error){ 
				this1.setState({button: "button is-danger "});
				console.log("error is 1 :",error)
			})
			.on('confirmation', function(confNumber, receipt){ 
				this1.setState({button: "button is-success "});
              	console.log("reciept is 1 :",receipt) 
         	 })
			.then(function(receipt){

				this1.setState({button: "button is-success "});
				this1.setState(this1.state); //added for re-render
				console.log(receipt);

			});








	        


}

f(this);


	}






		render() {

			


	    return (
	    <div className="container box">
    <div className="columns">
        <div className="column">
            <form className="form" onSubmit={this.handleSubmit}>
<div className="field">
<div className="control">

                <label className="label">Upload Solution to Submit </label>
</div>
</div>

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
      {this.state.ipfsHashCommaSeperated}
    </span>
  </label>
</div>
</div>             

            

                <div className="field">
                    <div className="control">
                        <button type="submit" className={this.state.button}>
	                      {"Submit Solution To Evaluators"}
	                      
	                    </button></div>
                </div>
            </form>
        </div>
    </div>
</div>


	    );
	}



componentDidMount(){
	console.log("componentDidmount, agreement ID is ",this.props.agreementId);
	this.setState({agreementId:this.props.agreementId});
}

}


export default SubmitToEval;