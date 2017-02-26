import React, { Component } from 'react';
import './ErrorMsg.css';

class ErrorMsg extends Component {
	render() {
		return (
			<div className='error-msg-bg'>
				<div className='error-msg'>
					<h1>Error:</h1>
					<h2>{this.props.name}</h2>
					<p>{this.props.message}</p>
				</div>
			</div>
		);
	}
}

ErrorMsg.defaultProps = {
	name: 'Error name',
	message: 'Something went wrong. This is the default message. Blame the lazy developer for not giving you any more info.'
};

ErrorMsg.propTypes = {
	name: React.PropTypes.string,
	message: React.PropTypes.string
};

export default ErrorMsg;
