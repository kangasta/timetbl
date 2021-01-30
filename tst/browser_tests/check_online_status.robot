*** Settings ***
Library         OperatingSystem
Library         SeleniumLibrary
Test setup      Open timetbl
Test teardown   Close Browser

*** Variables ***
${URL}              https://kangasta.github.io/timetbl
${BROWSER}          headlesschrome
${BROWSER_OPTIONS}  ${EMPTY}

*** Test Cases ***
Check page is online
    Check title
    Check has departures
    Capture page screenshot

*** Keywords ***
Open timetbl
    ${browser_options}=  Get Environment Variable    BROWSER_OPTIONS    ${BROWSER_OPTIONS}
    ${browser}=  Get Environment Variable    BROWSER    ${BROWSER}
    Open browser    ${URL}/#/stop?code=Rautatientori    browser=${browser}    options=${browser_options}

Check title
    Wait Until Page Contains    Rautatientori

Check has departures
    Wait Until Page Contains Element    css:li.DepartureInfo
