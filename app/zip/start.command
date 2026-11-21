#!/bin/bash
cd "$(dirname "$0")" || exit 1
(sleep 1; open "http://localhost:4173/") &
node serve.mjs
