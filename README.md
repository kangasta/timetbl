# timetbl

[![Build Status](https://travis-ci.org/kangasta/timetbl.svg?branch=master)](https://travis-ci.org/kangasta/timetbl)
[![Maintainability](https://api.codeclimate.com/v1/badges/5f82a139ff356840c565/maintainability)](https://codeclimate.com/github/kangasta/timetbl/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5f82a139ff356840c565/test_coverage)](https://codeclimate.com/github/kangasta/timetbl/test_coverage)

Simple timetable screen that uses Digitransit API to fetch HSL realtime data and React to render the data. See [digitransit](https://digitransit.fi/en/developers/) for details of the HSL API.

## Development

Application logic is developed under `app/` directory. This directory is created with [create-react-app](https://github.com/facebookincubator/create-react-app), see README over there for details on development environment.

UI components are developed in base directory, which acts as a react component library.

### Getting stared

To get development server running on your machine, run:
```bash
# Install component dependencies and build components
npm install;
npm run build;

cd app;
# Install application dependencies and start development server
npm install;
npm start;
```

### Before committing

The code is linted and unit tested with:

```bash
# Lint
npm run lint
# or
npm run lint -- --fix
# to also fix automatically fixable errors

# Unit test
npm test
# or
npm test -- --coverage
# to also get coverage analysis
```

To create production build, run build in both base and `app/` directories:
```bash
for dir in . app; do
	pushd $dir;
	npm install && npm run build;
	popd;
done;
```
