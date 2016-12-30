import React, { Component } from 'react';
import './Error.css';

class Error extends Component {
	render() {
		return (
			<div className='error'>
				<h1>Error:</h1>
				<h2>{this.props.name}</h2>
				<p>{this.props.message}</p>
			</div>
		);
	}
}

Error.defaultProps = {
	header: 'Error',
	message: 'Something went wrong. This is the default message. Blame the lazy developer for not giving you any more info.'
};

export default Error;
