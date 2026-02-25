#!/bin/sh
cd /var/www/host && PORT=3000 HOSTNAME=0.0.0.0 node server.js &
sleep 2
exec nginx -g "daemon off;"
