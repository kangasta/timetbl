import React, { Component } from 'react';
import './Loading.css';

class Loading extends Component {
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

Loading.defaultProps = {
	name: 'Loading name',
	message: 'Loading something. This is the default message. Blame the lazy developer for not giving you any more info and copy-pasting this text from Error screen.'
};

Loading.propTypes = {
	name: React.PropTypes.string,
	message: React.PropTypes.string
};

export default Loading;
