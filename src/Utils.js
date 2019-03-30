import React from 'react';

class Utils {
	static toDestinationItem(destination) {
		const metro = destination.match(/\(M\)/);
		destination = destination.replace('(M)','').trim();

		return (
			<span key={destination} className='DestinationItem'>
				{destination}
				{metro ? <span className='Metro'>M</span> : null}
			</span>
		);
	}
}

export default Utils;