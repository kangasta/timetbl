FROM python:3-alpine

ENV BROWSER=headlesschrome
ENV BROWSER_OPTIONS='add_argument("--no-sandbox"); add_argument("--disable-gpu"); add_argument("--hide-scrollbars")'

RUN apk add chromium chromium-chromedriver
RUN pip install robotframework robotframework-seleniumlibrary rf-se-dtl-selectors-plugin

WORKDIR /suites
COPY entrypoint.sh browser_tests/ /suites/
RUN chmod +x entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]
