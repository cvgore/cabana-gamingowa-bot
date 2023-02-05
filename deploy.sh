#!/bin/bash

set -e

git pull

GIT_HASH=$(git rev-parse --short HEAD)

podman build \
  --build-arg=GIT_HASH="${GIT_HASH}" \
  -f Dockerfile \
  -t cabana-gamingowa-bot \
  .

podman stop cabana-gamingowa-bot

podman run \
  -d \
  -e DISCORD_TOKEN="$(cat ~/.config/cbb/discord_token)" \
  -e DISCORD_CLIENT_ID="$(cat ~/.config/cbb/discord_client_id)" \
  -e DISCORD_GUILD_ID="$(cat ~/.config/cbb/discord_guild_id)" \
  -v ~/cabanagamingowabotdata:/app/storage \
  --name cabana-gamingowa-bot \
  localhost/cabana-gamingowa-bot