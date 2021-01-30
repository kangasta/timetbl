import React, { useState } from 'react';
import styled from 'styled-components';
import { MainLi, MainUl } from '../Utils';

const NavBarDiv = styled.div`
  margin-bottom: 0.25em;
  text-align: center;
  transition: all 0.4s ease-in-out, transform 0.2s ease-in-out;

  &.Open {
    margin-top: 0.5em;
    max-height: auto;
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

const NavLi = styled(MainLi)`
  font-size: 1.75em;

  &.Disabled {
    color: var(--text-secondary);
  }

  &.Secondary {
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

interface PropsType {
  buttons: {
    className?: string;
    text: string;
    onClick: () => void;
    disabled?: boolean;
  }[];
  expandable?: boolean;
  secondary?: boolean;
}

export default function NavBar({
  buttons = [],
  expandable = false,
  secondary = false,
}: PropsType) {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((prev) => !prev);
  const openClass = !expandable || open ? 'Open' : 'Closed';

  return (
    <>
      <NavBarDiv className={openClass}>
        <MainUl>
          {buttons.map((button) => {
            const disabledClass = button.disabled ? 'Disabled ' : 'Active ';
            const secondaryClass = secondary ? 'Secondary' : '';
            const onClickFn =
              button.disabled || !button.onClick
                ? (): undefined => undefined
                : () => {
                    button.onClick();
                    setOpen(false);
                  };

            return (
              <NavLi
                key={button.text}
                className={`${secondaryClass} ${disabledClass} ${
                  button.className || ''
                }`}
                onClick={onClickFn}
              >
                {button.text}
              </NavLi>
            );
          })}
        </MainUl>
      </NavBarDiv>
      {expandable && (
        <ExpandIconDiv>
          <ExpandIconButton className={openClass} onClick={toggleOpen}>
            <ExpandIcon />
          </ExpandIconButton>
        </ExpandIconDiv>
      )}
    </>
  );
}
