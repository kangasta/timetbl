#!/bin/sh
rm -rf ./out comment.md
docker cp $(docker-compose ps -q test):/out ./out;

echo "Screenshots of the application views:\n" > comment.md;
for screenshot in $(ls ./out/timetbl-*.png); do
  echo '<img src="data:image/png;base64,'$(base64 -w0 ${screenshot})'" />' >> comment.md;
done;
