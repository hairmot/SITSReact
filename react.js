class SvTable extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		var inpts = this.props.formcol.map(a =>  {return <SvTableRow inputs={a.fields} key={a.record} record={a.record}  />});	
		var cols = this.props.formcol[0].fields.map(a => <th key={"header" + a.id}>{a.id}</th>);
		return (
			<table className="sv-table sv-table-striped sv-table-bordered">
				<thead>
					<tr>
					{cols}				
					</tr>
				</thead>
				<tbody>
				{inpts}
				</tbody>
			</table>
		)
	}	
}

class SvTableRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {"SLP_CODE":this.props.record, dataModel:[]};
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	render() {
		var inputs = this.props.inputs.map(a =>  {return <SvTableCell key={a.id} val={a.val} id={a.id} label={a.label} primaryKey={a.primaryKey} dataModel={this.state.dataModel}  handleSubmit={this.handleSubmit} />}	);
		
		return (
				<tr>
					{inputs}
				</tr>
		)
	}
	
	handleSubmit(event) {
		var updateData = '';
		event.preventDefault();
		updateData = Object.keys(this.state.dataModel).map(a => a + "=" + this.state.dataModel[a]).join(String.fromCharCode(27) + ';');

		$('#ANSWER\\.TTQ\\.MENSYS\\.2\\.').val(updateData);	
		$('#ANSWER\\.TTQ\\.MENSYS\\.1\\.').val(this.state.SLP_CODE);		
		var formData = $('form[action="SIW_TTQ"]').serialize();
		formData += "&NEXT.DUMMY.MENSYS.1=NEXT";
		console.log(updateData);
		$.ajax({			type:'POST',			url:'SIW_TTQ',			data: formData		}		).done(function(data) {		
		//console.log(data);
		});		
		return false;
	}
}

class SvTableCell extends React.Component {
	constructor(props) {
		super(props);
		this.state = {val:props.val,primaryKey:props.primaryKey,dataModel:this.props.dataModel};		
		this.update = this.update.bind(this);		
	}
	render() {
			var readOnly;
			if (this.state.primaryKey)
			{ readOnly = "readOnly";}
			return (
					<td>
						<input id={this.props.id} type="text" onBlur={this.props.handleSubmit} className="sv-form-control" onChange={this.update} value={this.state.val} readOnly={readOnly} />
					</td>
			)
		
		
	}
	update(event) {
			this.state.dataModel[this.props.id] = event.target.value;
			this.setState({val:event.target.value});
	}

}

class SvInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {val:props.val, dataModel:this.props.dataModel};
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
				
			this.state.dataModel[this.props.id] = event.target.value;
			this.setState({val:event.target.value});
			
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

class StoreBtn extends React.Component {
	constructor(props) {
		super(props);	
	}
	render() {
		return (			
				<input type="submit" value={this.props.label} onClick={this.props.handleSubmit} className="sv-btn sv-btn-primary sv-form-control"/>
		)		
	}

}

class RetrieveScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {dataModel:[]}
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	render() {
		var inputs = this.props.fields.map(a =>  {return <SvInput key={a.id} val={a.val} id={a.id} label={a.label} dataModel={this.state.dataModel} />}	);
		return (
			<div className="sv-form-horizontal">
				{inputs}
				<SubmitBtn handleSubmit={this.handleSubmit} label="Search"/>
			</div>
		)
	}
	
	handleSubmit(event) {
		event.preventDefault();
		$('#ANSWER\\.TTQ\\.MENSYS\\.1\\.').val(Object.keys(this.state.dataModel).map(a => a + "=" + this.state.dataModel[a].replace('*', String.fromCharCode(16))).join(String.fromCharCode(27) + ';'));
		var formData = $('form[action="SIW_TTQ"]').serialize();
		formData += "&NEXT.DUMMY.MENSYS.1=NEXT";
		$.ajax({			type:'POST',			url:'SIW_TTQ',			data: formData		}		).done(function(data) {	
			ReactDOM.unmountComponentAtNode(document.getElementById('container'));
			var inpts = JSON.parse($($.parseHTML(data)).find("#ajaxResult").html());
			inpts.shift();	
			
			
			ReactDOM.render(
				<SvTable formcol={inpts} />,  document.getElementById('container')
			);
		});
		
	}
}

ReactDOM.render(
  <RetrieveScreen fields={fields} />,  document.getElementById('container')
);
