import React, { Component } from 'react';
import web3 from './web3';
import storehash from './storehash';
import RegistrationForm from './RegistrationForm';

class NavTabs extends Component {









render(){


if(this.props.type == "Worker"){
return (

<section className="is-medium">
<div className="tabs is-medium is-centered">
  <ul>
    <li className={(this.props.activeTab == 1)?"is-active":""}  ><a onClick={()=>this.props.setCurrentTab(1)} >Profile </a></li>
    <li className={(this.props.activeTab == 2)?"is-active":""} ><a onClick={()=>this.props.setCurrentTab(2)} >Available Tasks</a></li>
    <li className={(this.props.activeTab == 3)?"is-active":""} ><a onClick={()=>this.props.setCurrentTab(3)} >Evaluations</a></li>
    <li className={(this.props.activeTab == 4)?"is-active":""} ><a onClick={()=>this.props.setCurrentTab(4)} >Agreements</a></li>

  </ul>
</div>

</section>
);
}
else if(this.props.type == "TaskPoster") {
	return(
	<section className="is-medium">
<div className="tabs is-medium is-centered">
  <ul>
    <li  className={(this.props.activeTab == 1)?"is-active":""} ><a onClick={()=>this.props.setCurrentTab(1)} >Profile</a></li>
    <li className={(this.props.activeTab == 2)?"is-active":""} ><a onClick={()=>this.props.setCurrentTab(2)} >Available Workers</a></li>
    <li className={(this.props.activeTab == 3)?"is-active":""} ><a onClick={()=>this.props.setCurrentTab(3)} >Tasks</a></li>
    <li className={(this.props.activeTab == 4)?"is-active":""} ><a onClick={()=>this.props.setCurrentTab(4)} >Agreements</a></li>
  </ul>
 
</div>
</section>

	);}

	else {
		return (
			<section>
			<br />
			<div className = "container gap">
			  <div className = "notification is-primary">
				<h3 className="title is-3">
<span className="icon has-text-info">
  <i className="fas fa-info-circle"></i>
</span>
				You are not registered, register now 
				</h3>
			  </div>		
			</div>
			<br />
			<RegistrationForm />
			</section>
		);
	}


}

}

 export default NavTabs;