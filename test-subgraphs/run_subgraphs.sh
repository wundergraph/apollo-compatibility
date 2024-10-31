#!/bin/sh

npx concurrently --kill-others \
    "cd ./inventory && npm i && npm run start" \
    "cd ./pandas && npm i && npm run start" \
    "cd ./products && npm i && npm run start" \
    "cd ./users && npm i && npm run start"
