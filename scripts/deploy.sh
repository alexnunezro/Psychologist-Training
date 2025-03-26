#!/bin/bash

# Exit on error
set -e

# Build the application
echo "Building the application..."
npm run build

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Build successful!"
  
  # Start the production server
  echo "Starting the production server..."
  npm run start
else
  echo "Build failed!"
  exit 1
fi 