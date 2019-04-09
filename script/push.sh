#!/bin/bash
# 1) And then push current change to npm

msg="$1"

echo "git commit with message: $msg"
git add .
git commit -m "$msg"
git push

echo "Push Completed"
