#!/bin/bash

# Setup X server for WSL visual browser testing
export DISPLAY=:0

# Install xvfb (virtual framebuffer X server)
sudo apt-get update
sudo apt-get install -y xvfb x11-apps

# Start Xvfb in background
Xvfb :0 -screen 0 1920x1080x24 &

# Wait for X server to start
sleep 2

# Test if X server is working
echo "Testing X server..."
xdpyinfo > /dev/null 2>&1 && echo "X server is running!" || echo "X server failed to start"