#!/bin/bash

export BUILDAH_FORMAT=docker

set -e

git pull

GIT_HASH=$(git rev-parse --short HEAD)

podman build \
  --build-arg=GIT_HASH="${GIT_HASH}" \
  -f Dockerfile \
  -t cabana-gamingowa-bot \
  .

podman stop --ignore cabana-gamingowa-bot
podman rm --ignore cabana-gamingowa-bot

podman run \
  -d \
  -e DISCORD_TOKEN="$(cat ~/.config/cbb/discord_token)" \
  -e DISCORD_CLIENT_ID="$(cat ~/.config/cbb/discord_client_id)" \
  -e DISCORD_GUILD_ID="$(cat ~/.config/cbb/discord_guild_id)" \
  -e DISCORD_BRB_ROLE_ID="$(cat ~/.config/cbb/discord_brb_role_id)" \
  -v ~/cabanagamingowabotdata:/app/storage \
  --name cabana-gamingowa-bot \
  --security-opt=label=disable \
  localhost/cabana-gamingowa-bot

podman container wait --condition running cabana-gamingowa-bot

podman healthcheck run cabana-gamingowa-bot

sleep 10

set +e

podman image prune -f

set -e

export BUILDAH_FORMAT=