import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './NavBar.css';

class NavBar extends Component {
	render() {
		if (this.props.buttons === undefined) return null;
		return (
			<div className='NavBar'>
				{this.props.buttons.map(button => <span key={button.text} className={'Link ' + (button.disabled ? 'Disabled' : 'Active')} onClick={button.disabled ? () => undefined : button.onClick}>{button.text}</span>)}
			</div>
		);
	}
}

NavBar.propTypes = {
	buttons: PropTypes.arrayOf(
		PropTypes.shape({
			text: PropTypes.string,
			onClick: PropTypes.func,
			disabled: PropTypes.bool
		})
	)
};

export default NavBar;
