*** Settings ***
Resource        ${CURDIR}/resources/common.robot
Suite setup      Open timetbl
Suite teardown   Close Browser

*** Test Cases ***
Check page is online
    Go to timetbl path    /#/stop?code=Rautatientori
    Check title
    Check has departures

*** Keywords ***
Check title
    Wait Until Page Contains    Rautatientori

Check has departures
    Wait Until Page Contains Element    css:li.DepartureInfo
