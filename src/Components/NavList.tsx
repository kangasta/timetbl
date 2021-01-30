import React, { useState } from 'react';
import styled from 'styled-components';
import { MainLi, MainUl } from '../Utils';

const NavBarDiv = styled.div`
  margin-bottom: 0.25em;
  text-align: center;
  transition: all 0.4s ease-in-out, transform 0.2s ease-in-out;

  &.Open {
    margin-top: 0.5em;
    max-height: 100vh;
    transform: scale(1, 1);
  }

  &.Closed {
    max-height: 0;
    transform: scale(1, 0);
  }
`;

const ExpandIconDiv = styled.div`
  text-align: center;
`;

const ExpandIconButton = styled.button`
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: 50%;
  box-sizing: content-box;
  color: inherit;
  font-size: inherit;
  height: 1em;
  line-height: 1em;
  margin: -0.75em 0;
  padding: 1em;

  :focus {
    background: var(--background-secondary);
    outline: none;
  }

  &.Open {
    margin: 0.25em 0;
  }

  &.Open svg {
    transform: scale(1, -1);
  }
`;

const ExpancdIconSvg = styled.svg`
  height: 1em;
  transition: inherit;
`;

const NavTextSpan = styled.span`
  font-size: 1.75em;
`;

const NavLi = styled(MainLi)`
  text-align: left;

  &.Disabled {
    color: var(--text-secondary);
  }

  &.Child {
    padding-left: 2.5em;
  }

  &.Secondary,
  &.Child {
    border-top: thin dotted var(--text-primary);
  }

  &.Secondary:last-child {
    border-bottom: thin dotted var(--text-primary);
  }
`;

const ExpandIcon = () => (
  <ExpancdIconSvg viewBox='0 0 64 64'>
    <path
      d='M 16 24 l 16 16 l 16 -16'
      stroke='currentColor'
      strokeWidth='6'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </ExpancdIconSvg>
);

interface Button {
  className?: string;
  text: string;
  onClick: () => void;
  disabled?: boolean;
  buttons?: Button[];
}

interface PropsType {
  buttons: Button[];
  expandable?: boolean;
  secondary?: boolean;
}

export default function NavList({
  buttons = [],
  expandable = false,
  secondary = false,
}: PropsType) {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((prev) => !prev);
  const openClass = !expandable || open ? 'Open' : 'Closed';

  const getButtons = (buttons: Button[], child = false): React.ReactElement[] =>
    buttons.map(
      ({ className, disabled, onClick, text, buttons: childButtons }) => {
        const childClass = child ? 'Child' : '';
        const disabledClass = disabled ? 'Disabled ' : 'Active ';
        const secondaryClass = secondary ? 'Secondary' : '';
        const onClickFn =
          disabled || !onClick
            ? (): undefined => undefined
            : () => {
                onClick();
                setOpen(false);
              };

        return (
          <React.Fragment key={text}>
            {text && (
              <NavLi
                key={text}
                className={`${childClass} ${secondaryClass} ${disabledClass} ${
                  className || ''
                }`}
                onClick={onClickFn}
              >
                <NavTextSpan>{text}</NavTextSpan>
              </NavLi>
            )}
            {childButtons && getButtons(childButtons, true)}
          </React.Fragment>
        );
      }
    );

  return (
    <>
      <NavBarDiv className={openClass}>
        <MainUl>{getButtons(buttons)}</MainUl>
      </NavBarDiv>
      {expandable && (
        <ExpandIconDiv>
          <ExpandIconButton
            className={openClass}
            onClick={toggleOpen}
            data-testid='navlist-expand-button'
          >
            <ExpandIcon />
          </ExpandIconButton>
        </ExpandIconDiv>
      )}
    </>
  );
}
