#!/bin/bash
host="$1"
shift
cmd="$@"

while ! (echo > /dev/tcp/$host/5432) 2>/dev/null; do
  echo "Postgres is unavailable - sleeping"
  sleep 2
done

echo "Postgres is up - executing command"
exec $cmd

