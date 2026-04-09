#!/bin/sh
PORT="${PORT:-4399}"

case "$1" in
  --auth)
    exec bun run dist/main.js auth
    ;;
  start)
    shift
    exec bun run dist/main.js start -g "$GH_TOKEN" --port "$PORT" --account-type enterprise "$@"
    ;;
  auth|check-usage|debug|stop|restart|status|logs|enable|disable)
    exec bun run dist/main.js "$@"
    ;;
  *)
    exec bun run dist/main.js start -g "$GH_TOKEN" --port "$PORT" --account-type enterprise "$@"
    ;;
esac
