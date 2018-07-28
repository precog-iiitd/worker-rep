
import React, { Component } from 'react';
import web3 from './web3';
import storehash from './storehash';



class AvailableWorkers extends Component {
	constructor (props) {
super(props);
 this.state = {
 	avail_workers_id: 0,
  worker_count:0,
  workers_data:[],
  avail_tasks:[]
 }

 //this.load_Avail_Workers(this);
/* this.load_tasks_applied(this);*/

}


load_Avail_Workers = async (this1) => {
	console.log("loading available workers");

	const accounts = await web3.eth.getAccounts();
	     
	console.log('Sending from Metamask account: ' + accounts[0]);

	storehash.methods.getWorkersCount().call({from: accounts[0] })
.then(function(result){
    console.log("the number of workers is :  ",result);
    	this1.setState({avail_workers_id: result});

      let temp = this1.state.workers_data;
      
      for(let i = result-1;i>=0;i--){
        console.log("i is ",i);

          storehash.methods.workers(i).call({from: accounts[0] })
            .then(function(result1){
              
              temp.push(result1);
              console.log("worker ",i,"data is ",temp);
              
              console.log("details for worker ",i," are : ",result1);
            }
              );
  
      }

      this1.setState({workers_data:temp});

    });//function(result)

  
}
  
load_tasks_applied = async(this1)=>{

    const accounts = await web3.eth.getAccounts();
    storehash.methods.showAvailableTasks().call({from: accounts[0] })
    .then(function(result){
       console.log("------------------------------------------");
          console.log("the number of tasks avail is :  ",result);

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
        console.log("result slice is ",not_zero,result);


          this1.setState({avail_tasks:result});




          for(var k = 0;k<result.length;k++){


//uncomment below
/*             storehash.methods.taskIdToRegisteredWorkersId(result[k]).call({from: accounts[0] })
    .then(function(result){
       console.log("------------------------------------------");
          console.log("task details :  ",result);});


          }


          });  */

}


render()
{	



var WorkerList = this.state.workers_data.map(function(wd){
            console.log("rendering task");
                        return (

                          <div className="box">
      <div className="card">
  <div className="card-content">
    <p className="title">
      {wd[0]}
    </p>
    <p className="subtitle">
      {""} ether
    </p>
  </div>
  <footer className="card-footer">
    <p className="card-footer-item">
      <span>
        View on <a href={""} target="_blank">View Task Details</a>
      </span>
    </p>
  
     <p className="card-footer-item">
      <span>
        Create  <a href="#" onClick={""}>Agreement</a> 
      </span>
    </p>
  
  </footer>
</div>

    </div>

                          );
                      })

  
  return(<div>{WorkerList}</div>);

    



}


componentDidMount(){
  console.log("mounting available workers");
   
this.load_Avail_Workers(this);
this.load_tasks_applied(this);
console.log(this.workers_data);

  
}
}



export default AvailableWorkers;