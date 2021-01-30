import React from 'react';
import styled from 'styled-components';

import { AlertSeverity } from './ApiUtils';

export const MainUl = styled.ul`
  margin: 0;
  padding: 0;
`;

export const MainLi = styled.li`
  box-sizing: border-box;
  border-top: thin solid currentColor;
  list-style-type: none;
  padding: 0.33em 1.5em;
  width: 100%;

  :last-child {
    border-bottom: thin solid currentColor;
  }
`;

const DestinationItemSpan = styled.span`
  font-size: 0.666em;
  margin-left: 0.333em;

  :first-child {
    font-size: 1em;
    margin-left: 0;
  }
`;

const MetroSpan = styled.span`
  background: orangered;
  border-radius: 0.125em;
  color: white;
  font-size: 0.7em;
  margin-left: 0.25em;
  padding: 0.125em;
  vertical-align: middle;
`;

export function DestinationItem({ destination }: { destination: string }) {
  const metro = destination.match(/\(M\)/);
  destination = destination.replace('(M)', '').trim();

  return (
    <DestinationItemSpan key={destination} className='DestinationItem'>
      {destination}
      {metro && <MetroSpan className='Metro'>M</MetroSpan>}
    </DestinationItemSpan>
  );
}

const SymbolFillSvg = styled.svg`
  height: 1em;
  fill: currentColor;
`;

export function AlertSymbol({ severity }: { severity?: AlertSeverity }) {
  const mask =
    severity === 'INFO' ? 'AlertSymbolInfoMask' : 'AlertSymbolWarningMask';

  return (
    <SymbolFillSvg viewBox='0 0 64 64'>
      <defs>
        <mask id='AlertSymbolWarningMask'>
          <path
            d='M 32 4 l 28 56 h -56 l 28 -56'
            fill='white'
            stroke='white'
            strokeWidth='8'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M 32 20 v 20'
            stroke='black'
            strokeWidth='6'
            fill='none'
            strokeLinecap='round'
          />
          <circle cx='32' cy='54' r='3' fill='black' />
        </mask>
        <mask id='AlertSymbolInfoMask'>
          <circle cx='32' cy='32' r='32' fill='white' />
          <path
            d='M 32 16 v 20'
            stroke='black'
            strokeWidth='6'
            fill='none'
            strokeLinecap='round'
          />
          <circle cx='32' cy='50' r='3' fill='black' />
        </mask>
      </defs>
      <rect x='0' y='0' width='64' height='64' mask={`url(#${mask})`} />
    </SymbolFillSvg>
  );
}

export class TimeUtils {
  static currentTimeInMinutes() {
    const curTime = new Date(Date.now());
    return curTime.getHours() * 60 + curTime.getMinutes();
  }

  static parseHour(seconds: number, max23 = true) {
    let h = ~~(seconds / 3600);
    h = h > 23 && max23 ? h - 24 : h;
    return h;
  }

  static parseMinute(seconds: number, max23 = true) {
    let min = ~~(seconds / 60);
    min = min > 24 * 60 && max23 ? min - 24 * 60 : min;
    return min;
  }

  static parseTime(seconds: number, delim = ':') {
    const h = TimeUtils.parseHour(seconds);

    let hStr = h.toString();
    hStr = hStr.length < 2 ? ' ' + hStr : hStr;
    let minStr = (~~((seconds % 3600) / 60)).toString();
    minStr = minStr.length < 2 ? '0' + minStr : minStr;

    return hStr + delim + minStr;
  }

  static departureTimeToStr(seconds: number, showInMinutesLimit = 10) {
    let departureInMinutes =
      TimeUtils.parseMinute(seconds) - TimeUtils.currentTimeInMinutes();
    departureInMinutes =
      departureInMinutes < 0
        ? departureInMinutes + 24 * 60
        : departureInMinutes;

    return departureInMinutes < showInMinutesLimit && departureInMinutes >= 0
      ? departureInMinutes + ' min'
      : TimeUtils.parseTime(seconds);
  }
}

export function getField<T = unknown>(
  obj: any,
  fieldString: string
): T | undefined {
  try {
    return fieldString.split(/[.[]/).reduce<T>((o: any, i: string): any => {
      const numberMatch = i.match(/([0-9]+)\]/);
      const key = numberMatch ? Number(numberMatch[1]) : i;

      if (key === '') {
        return o;
      }

      return o[key];
    }, obj);
  } catch (e) {
    return undefined;
  }
}

export function getUniqueFilter(field: string) {
  return function <T>(element: T, index: number, array: T[]): boolean {
    return (
      array.findIndex(
        (i) => getField(i, field) === getField(element, field)
      ) === index
    );
  };
}
