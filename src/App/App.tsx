import React, { useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { StateType, Action } from '../Store/reducer';
import { QueryTypeT } from '../ApiUtils';

import { Title } from '../Components';
import { BikesList, NavList, StopMenu, TimeTable } from '../Components';

import './App.css';
import './Theme.css';

interface StateProps {
  type: QueryTypeT;
}

interface DispatchProps {
  hashChange: (hash: string) => Action;
  navigate: (type: QueryTypeT) => Action;
  update: () => Action;
}

const AppDiv = styled.div`
  background: var(--theme-color-1);
  box-sizing: border-box;
  color: var(--theme-color-2);
  display: flex;
  flex-direction: column;
  font-family: Helvetica, Arial, sans-serif;
  min-height: 100vh;
  transition: all 500ms;

  /* Force browser to respect margin-top: 0 */
  margin-top: -1px;
  padding-top: 1px;
`;

const Main = styled.main`
  flex: 1;
`;

const Footer = styled.footer`
  color: var(--theme-color-2);
  font-size: 0.75em;
  margin-top: 3em;
  padding: 0.25em;
  text-align: center;

  .Divider {
    display: inline-block;
    text-align: center;
    width: 0.5rem;
  }
`;

export function App({
  type,
  hashChange,
  navigate,
  update,
}: DispatchProps & StateProps) {
  useEffect(() => {
    const pushNewHash = (): void => {
      const match = window.location.href.match(/#.*/);
      const hash = match ? match[0] : '';

      hashChange(hash);
    };

    pushNewHash();

    const updateId = setInterval(update, 20e3);
    window.addEventListener('hashchange', pushNewHash);

    return () => {
      clearInterval(updateId);
      window.removeEventListener('hashchange', pushNewHash);
    };
  }, [hashChange, update]);

  const navButtons = [
    {
      text: 'Nearby',
      onClick: () => {
        navigate('nearestDepartures');
      },
      disabled: type === 'nearestDepartures',
    },
    {
      text: 'Bikes',
      onClick: () => {
        navigate('nearestBikes');
      },
      disabled: type === 'nearestBikes',
    },
    {
      text: 'Menu',
      onClick: () => {
        navigate('nearestStops');
      },
      disabled: type === 'nearestStops',
    },
  ];

  const View = () => {
    switch (type) {
      case 'nearestBikes':
        return <BikesList />;
      case 'nearestStops':
        return <StopMenu />;
      case 'nearestDepartures':
      case 'stopDepartures':
        return <TimeTable />;
    }
  };

  const theme = type === 'nearestBikes' ? 'BikesTheme' : 'MainTheme';

  return (
    <AppDiv className={theme}>
      <header>
        <Title />
        <NavList buttons={navButtons} expandable secondary />
      </header>
      <Main>
        <View />
      </Main>
      <Footer>
        <a href='https://github.com/kangasta/timetbl'>kangasta/timetbl</a>
        {' version '}
        {process.env.COMMIT}
        <span className='Divider'>|</span>
        <a href='https://digitransit.fi/en/developers/'>data source</a>
      </Footer>
    </AppDiv>
  );
}

const mapStateToProps = (state: StateType): StateProps => {
  return {
    type: state.view.type as QueryTypeT,
  };
};

const mapDispatchToProps = (
  dispatch: (args: Action) => Action
): DispatchProps => {
  return {
    hashChange: (hash: string) =>
      dispatch({ type: 'HASH_CHANGE', metadata: { hash } }),
    navigate: (type: QueryTypeT) =>
      dispatch({ type: 'NAVIGATE', metadata: { type } }),
    update: () => dispatch({ type: 'UPDATE' }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
