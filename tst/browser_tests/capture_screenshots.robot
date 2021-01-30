*** Settings ***
Resource        ${CURDIR}/resources/common.robot
Suite setup      Prepare browser
Suite teardown   Close Browser

*** Variables ***
${CODE_QUERY}=              ?code=Rautatientori
${COORDS_QUERY}=            ?lat=60.171611&lon=24.943918&maxDistance=1500&maxResults=30&follow=false
${SCREENSHOT_FILENAME}=     selenium-screenshot-{index}.png

*** Test Cases ***
Stop view
    Go to timetbl path    /#/stop${CODE_QUERY}
    Wait Until Page Contains Element    css:li.DepartureInfo
    Sleep  1 seconds  Wait for UI animation
    Capture Page Screenshot  timetbl-stop.png

Nearby view
    Go to timetbl path    /#/nearby${COORDS_QUERY}
    Wait Until Page Contains Element    css:li.DepartureInfo
    Sleep  1 seconds  Wait for UI animation
    Capture Page Screenshot  timetbl-nearby.png

Menu views
    Click Element  testid:navlist-expand-button
    Sleep  1 seconds  Wait for UI animation
    Capture Page Screenshot  timetbl-app-menu.png
    Click element  text:Menu
    Wait Until Page Contains  All nearby departures
    Sleep  1 seconds  Wait for UI animation
    Capture Page Screenshot  timetbl-stop-menu.png

Bikes view
    Go to timetbl path    /#/bikes${COORDS_QUERY}
    Wait Until Page Contains Element    css:li.DepartureInfo
    Sleep  1 seconds  Wait for UI animation
    Capture Page Screenshot  timetbl-bikes.png

*** Keywords ***
Prepare browser
    Open timetbl
    Set Window Size    240    360
