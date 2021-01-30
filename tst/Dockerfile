FROM python:3-alpine

ENV BROWSER=headlesschrome
ENV BROWSER_OPTIONS='add_argument("--no-sandbox"); add_argument("--disable-gpu")'

RUN apk add chromium chromium-chromedriver
RUN pip install robotframework robotframework-seleniumlibrary

WORKDIR /suites
COPY entrypoint.sh browser_tests/ /suites/
RUN chmod +x entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]
