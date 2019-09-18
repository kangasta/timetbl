import React from 'react';
import styled from 'styled-components';

const NavBarDiv = styled.div`
	text-align: center;
	margin-bottom: 0.333em;
`;

const LinkSpan = styled.span`
	background: var(--theme-color-2);
	color: var(--theme-color-1);
	cursor: pointer;
	margin-left: 0.0625em;
	display: inline-block;
	padding: 0.25em 1.25em;
	transition: all 0.2s ease-in-out;

	:first-child { border-radius: 0.25em 0 0 0.25em; }
	:last-child { border-radius: 0 0.25em 0.25em 0; }

	&.Active:hover {
		opacity: 0.66;
	}

	&.Disabled {
		opacity: 0.33;
	}
`;

interface PropsType {
	buttons: {
		className?: string;
		text: string;
		onClick: () => void;
		disabled?: boolean;
	}[];
}

export default function NavBar({buttons= []}: PropsType) {
	return (
		<NavBarDiv className='NavBar'>
			{buttons.map(button => {
				const disabledClass = button.disabled ? 'Disabled ' : 'Active ';
				const onClickFn = button.disabled || !button.onClick ? (): undefined => undefined : button.onClick;

				return <LinkSpan
					key={button.text}
					className={`Link ${disabledClass} ${button.className || ''}`}
					onClick={onClickFn}
				>
					{button.text}
				</LinkSpan>;
			})}
		</NavBarDiv>
	);
}
