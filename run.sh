#!/bin/bash

# Navigate to the frontend directory and run the dev script in the background
echo "Running dev script in frontend..."
cd frontend
bun run dev &

# Navigate to the backend directory and run the dev script in the background
echo "Running dev script in backend..."
cd ../backend
bun run dev &

# Wait for both background processes to complete
wait