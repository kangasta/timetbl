import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../Style/NavBar.css';

class NavBar extends Component {
	render() {
		if (this.props.buttons === undefined) return null;
		return (
			<div className='NavBar'>
				{this.props.buttons.map(button => {
					const disabledClass = button.disabled ? 'Disabled ' : 'Active ';
					const className = button.className !== undefined ? button.className : '';
					const onClickFn = button.disabled || !button.onClick ? () => undefined : button.onClick;

					return <span
						key={button.text}
						className={'Link ' + disabledClass + className}
						onClick={onClickFn}>
						{button.text}
					</span>;
				})}
			</div>
		);
	}
}

NavBar.propTypes = {
	buttons: PropTypes.arrayOf(
		PropTypes.shape({
			className: PropTypes.string,
			text: PropTypes.string,
			onClick: PropTypes.func,
			disabled: PropTypes.bool
		})
	)
};

export default NavBar;
