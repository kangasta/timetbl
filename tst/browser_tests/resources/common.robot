*** Settings ***
Library         OperatingSystem
Library         SeleniumLibrary    plugins=TestingLibrarySelectorsPlugin

*** Variables ***
${URL}              https://kangasta.github.io/timetbl
${BROWSER}          headlesschrome
${BROWSER_OPTIONS}  ${EMPTY}

*** Keywords ***
Open timetbl
    ${browser_options}=  Get Environment Variable    BROWSER_OPTIONS    ${BROWSER_OPTIONS}
    ${browser}=  Get Environment Variable    BROWSER    ${BROWSER}
    Open browser    browser=${browser}    options=${browser_options}

Go to timetbl path
    [Arguments]  ${path}
    Go To  ${URL}${path}
