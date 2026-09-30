#!/bin/bash
cd /home/wizarddev/Othina/shoprecord/shoprecord-backend
MONGODB_URI="mongodb://localhost:27017/shoprecord" \
JWT_SECRET="your-secret-key-here" \
PORT=8000 \
node src/server.entry.js
