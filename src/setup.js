import React from 'react';
import {Link} from 'react-router';

export default class Setup extends React.Component {

	constructor() {
		super();
		this.state = {
			employees: []
		}
	}
	componentDidMount() {
		//whenever a value is a changed, tell us about it!
		firebase.auth().onAuthStateChanged((user) => {
			const theCurrentUser =  firebase.auth().currentUser;
			firebase.database().ref(`${theCurrentUser.uid}/employees`)
				.on('value', (res) => {
					console.log(res.val());
					const userData = res.val();
					const dataArray = [];

					for(let key in userData) {
						userData[key].key = key;
						dataArray.push(userData[key]);
					}
					this.setState({
						employees: dataArray
					})
				});
		});
	}

	addEmployees(e) {
		e.preventDefault();

		const employee = {
			//create this after you have created the ref in input 
			name: this.createEmployee.value
		}
		//clear my input on submit
		this.createEmployee.value = "";
		let newEmployees = [];
		const employeeName =  employee.name;
		console.log("this current state", this.state.employees);
		const currentState = this.state.employees;

		newEmployees =  currentState;
		const pushed = newEmployees.push(employeeName);

		console.log(employeeName);
	
		this.setState({
			employees: newEmployees
		})

		const theCurrentUser = firebase.auth().currentUser
		const currentUserId = theCurrentUser.uid
		console.log(currentUserId);

		if(theCurrentUser) {
			firebase.database().ref(`${currentUserId}/employees`)
				//pushing single employee rather than the whole list
				.push(employee);
		}
	}
	removeEmployee(employeeToRemove) {
		const currentUser = firebase.auth().currentUser;
		firebase.database().ref(`${currentUser.uid}/employees/${employeeToRemove.key}`).remove();
	}
	render() {
		return (
			<div class="mainApp">
				<h2>Setup all of your stuff here</h2>
				<form onSubmit={(e) => this.addEmployees.call(this, e)}>
					<input type='text' ref={ref => this.createEmployee =  ref}/>
					<br/>
					<br/>
					<input type='submit' />
					<Link className="button button--next" to="/setupTime">NEXT</Link>
				</form>
				<section>
					{this.state.employees.map((employee, i) => {
						return (
							<div key={i} >
								<i className="fa fa-minus" onClick={(e) => this.removeEmployee.call(this, employee) }></i>
								<a href="#"><h3 className="button">{employee.name}</h3></a>
							</div>
						)
					})}
				</section>
			</div>
		)
	}
}