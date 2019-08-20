import React from 'react';

import '../Style/NavBar.css';


interface PropsType {
	buttons: {
		className?: string;
		text: string;
		onClick: () => void;
		disabled: boolean;
	}[];
}
export default function NavBar({buttons}: PropsType) {
	return (
		<div className='NavBar'>
			{buttons.map(button => {
				const disabledClass = button.disabled ? 'Disabled ' : 'Active ';
				const onClickFn = button.disabled || !button.onClick ? (): undefined => undefined : button.onClick;

				return <span
					key={button.text}
					className={`Link ${disabledClass} ${button.className || ''}`}
					onClick={onClickFn}>
					{button.text}
				</span>;
			})}
		</div>
	);
}
