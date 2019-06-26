#!bin/sh
cd /Users/learn/node-blog/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log