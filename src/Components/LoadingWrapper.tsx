import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Status from './StatusMessage';

export type Visibility = 'Show' | 'Hide' | 'None';

const FaderDiv = styled.div`
  transition: all 200ms;

  &.Show {
    opacity: 1;
  }

  &.Hide {
    opacity: 0;
  }

  &.None {
    display: none;
  }
`;

export interface FaderProps extends React.HTMLAttributes<HTMLDivElement> {
  visibility?: Visibility;
}

export function Fader({
  visibility = 'Show',
  children,
  className,
  ...props
}: FaderProps): React.ReactElement {
  return (
    <FaderDiv {...props} className={`${className} ${visibility}`}>
      {children}
    </FaderDiv>
  );
}

export interface ChangerProps extends React.HTMLAttributes<HTMLDivElement> {
  transitionTime?: number;
}

export function Changer({
  children,
  transitionTime = 300,
  ...props
}: ChangerProps): React.ReactElement {
  const [visibility, setVisibility] = useState<Visibility>('Hide');
  const [content, setContent] = useState<React.ReactNode>();

  useEffect(() => {
    if (content === children) {
      return;
    }

    setVisibility('Hide');
    const timeout = !content ? 50 : transitionTime + 50;
    const id = setTimeout((): void => {
      setContent(children);
      setVisibility('Show');
    }, timeout);

    return (): void => clearTimeout(id);
  }, [children, content, transitionTime]);

  return (
    <Fader visibility={visibility} {...props}>
      {content}
    </Fader>
  );
}

const LoadingWrapperDiv = styled.div`
  border-top: thin solid var(--text-primary);
`;

export interface IntervalChangerProps extends ChangerProps {
  children: React.ReactNode;
  error?: string;
  loading?: string;
}

export function LoadingWrapper({
  children,
  error,
  loading,
  ...props
}: IntervalChangerProps): React.ReactElement {
  const errorContent = error && <Status error={error} />;
  const loadingContent = loading && <Status loading={loading} />;
  const active = errorContent ?? loadingContent ?? children;

  return (
    <LoadingWrapperDiv>
      <Changer {...props}>{active}</Changer>
    </LoadingWrapperDiv>
  );
}
