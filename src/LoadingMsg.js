import React, { Component } from 'react';
import './LoadingMsg.css';

class LoadingMsg extends Component {
	render() {
		return (
			<div className='loading'>
				<h1>Loading</h1>
				<h2>{this.props.name}</h2>
				<p>{this.props.message}</p>
			</div>
		);
	}
}

LoadingMsg.defaultProps = {
	name: 'Loading name',
	message: 'Loading something. This is the default message. Blame the lazy developer for not giving you any more info and copy-pasting this text from ErrorMsg screen.'
};

LoadingMsg.propTypes = {
	name: React.PropTypes.string,
	message: React.PropTypes.string
};

export default LoadingMsg;
