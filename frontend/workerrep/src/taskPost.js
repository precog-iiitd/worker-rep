	import React, { Component } from 'react';
	import web3 from './web3';
	import ipfs from './ipfs';
	import storehash from './storehash';
	import '../node_modules/bulma/css/bulma.css'
	import './App.css';
	
	class TaskPost extends Component {

	constructor (props) {
super(props);
	      this.state = {
			taskTitle:"",
			taskHash:"",
			taskReward:0,
			buffer:"",
			ipfsHash:"",
			button:"button is-primary"

		}

	    this.handleChange = this.handleChange.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
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
      //file is converted to a buffer to prepare for uploading to IPFS
        const buffer = await Buffer.from(reader.result);
      //set this buffer -using es6 syntax
        this.setState({buffer});
         this.f1(this); 
    };


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




storehash.methods.postTask(this1.state.taskTitle,this1.state.ipfsHash,this1.state.taskReward).send({
	          from: accounts[0],
	          value: 0
	        })
			.on('error', function(error){ 
				this1.setState({button: "button is-danger "});
			})
			.on('confirmation', function(confNumber, receipt){ 
				this1.setState({button: "button is-success "});
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
        <div className="column is-9">



            <form className="form" onSubmit={this.handleSubmit}>

                <div className="field">
                    <div className="control">
                        <label className="label">Task Title</label>


                        <input className="input" name="taskTitle" type={ "text"} value={this.state.taskTitle} onChange={this.handleChange}/>
                    </div>
                </div>



<div className="field">
<div className="control">

                <label className="label">Upload Task details to IPFS </label>
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
      {this.state.ipfsHash}
    </span>
  </label>
</div>
</div>

                

                <div className="field">
                    <div className="control">
                        <label className="label">Reward Amount offered </label>

                        <input className="input" name="taskReward" type={ "number"} value={this.state.taskReward} onChange={this.handleChange} /> Giga-Wei
                    </div>
                </div>

                <div className="field">
                    <div className="control">
                        <button type="submit" className={this.state.button}>
	                      {"Creat Task"}
	                      
	                    </button></div>
                </div>
            </form>
        </div>
    </div>
</div>


	    );
	}

}

export default TaskPost;