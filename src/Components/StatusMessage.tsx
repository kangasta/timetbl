import React from 'react';
import styled, { keyframes } from 'styled-components';

const loadingRotate = keyframes`
  0% { transform: rotate(0deg); }
  50% { transform: rotate(180deg); }
  100% { transform: rotate(180deg); }
`;

const IconSvg = styled.svg`
  height: 1em;

  &.Loading {
    animation: ${loadingRotate} infinite 2s ease-in-out;
  }
`;

const ErrorIcon = () => (
  <IconSvg viewBox='0 0 64 64'>
    <path
      d='M 10 10 L 54 54 M 10 54 L 54 10'
      stroke='currentColor'
      strokeWidth='6'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </IconSvg>
);

const LoadingIcon = () => (
  <IconSvg viewBox='0 0 64 64'>
    <path
      d='M 16 4 v 16 l 10 12 l -10 12 v 16 h 32 v -16 l -10 -12 l 10 -12 v -16 h -32 M 16 6 l 16 6 l 16 -6 M 16 58 l 16 -6 l 16 6'
      stroke='currentColor'
      fill='none'
      strokeWidth='8'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </IconSvg>
);

const StatusDiv = styled.div`
  margin-top: 3em;
  text-align: center;
`;

const IconDiv = styled.div`
  font-size: 4em;

  & svg {
    height: 1em;
  }
`;

const TitleDiv = styled.div`
  font-size: 1.75em;
`;

interface StatusProps {
  error?: string;
  loading?: string;
}

const Status = ({ error, loading }: StatusProps): React.ReactElement =>
  !(error || loading) ? null : (
    <StatusDiv>
      <IconDiv>{error ? <ErrorIcon /> : <LoadingIcon />}</IconDiv>
      <TitleDiv>{error ? 'Error' : 'Loading'}</TitleDiv>
      <p>{error || loading}</p>
    </StatusDiv>
  );

export default Status;
