import DepartureInfo from './DepartureInfo.js';

describe('DepartureInfo.currentTimeInMinutes', () => {
	it('should not be larger that 24*60', () => {
		expect(DepartureInfo.currentTimeInMinutes()).toBeLessThanOrEqual(24*60);
	});
});

describe('DepartureInfo.parseHour', () => {
	it('should not be larger that 23', () => {
		expect(DepartureInfo.parseHour(24*3600)).toBe(0);
		expect(DepartureInfo.parseHour(26*3600)).toBe(2);
	});
	it('shoud be integer', () => {
		expect(DepartureInfo.parseHour(26*3600+1830)).toBe(2);
		expect(DepartureInfo.parseHour(3*3600+1234)).toBe(3);
	});
});

describe('DepartureInfo.parseTime', () => {
	it('should add leading zero to minutes', () => {
		expect(DepartureInfo.parseTime(10*3600+6*60)).toBe('10:06');
		expect(DepartureInfo.parseTime(10*3600+16*60)).toBe('10:16');
	});
	it('should add leading space to hours', () => {
		expect(DepartureInfo.parseTime( 9*3600+ 0*60)).toBe(' 9:00');
		expect(DepartureInfo.parseTime(26*3600+16*60)).toBe(' 2:16');
	});
	it('should allow custom deliminator', () => {
		expect(DepartureInfo.parseTime(22*3600+45*60, '&')).toBe('22&45');
	});
});

describe('DepartureInfo.departureTimeToStr', () => {
	it('should start with tilde if not in real time', () => {
		expect(DepartureInfo.departureTimeToStr(22*3600+45*60, false)).toMatch(/^~/);
		expect(DepartureInfo.departureTimeToStr(22*3600+45*60)).toMatch(/^~/);
	});
	it('should start with space if in real time', () => {
		expect(DepartureInfo.departureTimeToStr(22*3600+45*60, true)).toMatch(/^\s/);
	});
	it('should show minutes left, if departure in next ten minutes', () => {
		expect(DepartureInfo.departureTimeToStr((DepartureInfo.currentTimeInMinutes() + 5)*60))
		.toMatch(/5\smin/);
		expect(DepartureInfo.departureTimeToStr(DepartureInfo.currentTimeInMinutes()*60))
		.toMatch(/0\smin/);
	});
	it('should show departure time, if departure not in next ten minutes', () => {
		expect(DepartureInfo.departureTimeToStr((DepartureInfo.currentTimeInMinutes() + 10)*60))
		.toMatch(/[0-9]{1,2}.[0-9]{2,2}/);
		expect(DepartureInfo.departureTimeToStr((DepartureInfo.currentTimeInMinutes() - 3)*60))
		.toMatch(/[0-9]{1,2}.[0-9]{2,2}/);
	});

});