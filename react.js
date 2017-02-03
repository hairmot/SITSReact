var dataModel = [];
var ajaxResult = [];

class SvTableRow extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		var inputs = this.props.inputs.map(a =>  {return <SvTableCell key={a.id} val={a.val} id={a.id} label={a.label} />}	);
		
		return (
				//<div className="sv-form-horizontal">
				<tr>
					{inputs}
				</tr>
				//<div className="sv-form-group">
					//<SubmitBtn handleSubmit={this.handleSubmit} label="Submit" />
				//</div>
			//</div>
		)
	}
	
	handleSubmit(event) {
		
		event.preventDefault();
		$('#ANSWER\\.TTQ\\.MENSYS\\.2\\.').val(Object.keys(dataModel).map(a => a + "=" + dataModel[a]).join(String.fromCharCode(27) + ';'));		
		var formData = $('form[action="SIW_TTQ"]').serialize();
		formData += "&NEXT.DUMMY.MENSYS.1=NEXT";
		$.ajax({			type:'POST',			url:'SIW_TTQ',			data: formData		}		).done(function(data) {		
		console.log(data);});
		
		//ReactDOM.unmountComponentAtNode(document.getElementById('container'));
		return false;
	}
}

class SvInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {val:props.val};
		this.update = this.update.bind(this);		
	}
	render() {

		return (
			<div className="sv-form-group">
				<label htmlFor={this.props.id} className="sv-control-label sv-col-md-4">{this.props.label}</label> 
				<div className="sv-col-md-4">
					<input id={this.props.id} type="text" className="sv-form-control" onChange={this.update} value={this.state.val}/>
				</div>
			</div>
		);
		
	}
	update(event) {
			this.setState({val:event.target.value});	
			dataModel[this.props.id] = event.target.value;
			
	}

}

class SvTableCell extends React.Component {
	constructor(props) {
		super(props);
		this.state = {val:props.val};
		this.update = this.update.bind(this);		
	}
	render() {

		return (

				<td >
					<input id={this.props.id} type="text" className="sv-form-control" onChange={this.update} value={this.state.val}/>
				</td>
		);
		
	}
	update(event) {
			this.setState({val:event.target.value});	
			dataModel[this.props.id] = event.target.value;
			
	}

}

class SubmitBtn extends React.Component {
	render() {
		return (
			<div className="sv-col-md-2 sv-col-md-offset-6">
				<input type="submit" value={this.props.label} onClick={this.props.handleSubmit} className="sv-btn sv-btn-primary sv-form-control"/>
			</div>
		)		
	}

}

class RetrieveScreen extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		var inputs = this.props.fields.map(a =>  {return <SvInput key={a.id} val={a.val} id={a.id} label={a.label} />}	);
		return (
			<div className="sv-form-horizontal">
				{inputs}
				<SubmitBtn handleSubmit={this.handleSubmit} label="Search"/>
			</div>
		)
	}
	
	handleSubmit(event) {
		event.preventDefault();
		$('#ANSWER\\.TTQ\\.MENSYS\\.1\\.').val(Object.keys(dataModel).map(a => a + "=" + dataModel[a].replace('*', String.fromCharCode(16))).join(String.fromCharCode(27) + ';'));
		var formData = $('form[action="SIW_TTQ"]').serialize();
		formData += "&NEXT.DUMMY.MENSYS.1=NEXT";
		$.ajax({			type:'POST',			url:'SIW_TTQ',			data: formData		}		).done(function(data) {	
			ReactDOM.unmountComponentAtNode(document.getElementById('container'));
			var inpts = JSON.parse($($.parseHTML(data)).find("#ajaxResult").html());
			console.log($($.parseHTML(data)).find("#ajaxResult").html());
			inpts.shift();	
			
			
			ReactDOM.render(
				<MultiFormRender formcol={inpts} />,  document.getElementById('container')
			);
		});
		
	}
}

class MultiFormRender extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		var inpts = this.props.formcol.map(a =>  {return <SvTableRow inputs={a.fields} key={a.record}  />}	);		
		return (
			<table className="sv-table sv-table-striped">
				{inpts}
			</table>
		)
	}
	
}


ReactDOM.render(
  <RetrieveScreen fields={fields} />,  document.getElementById('container')
);
