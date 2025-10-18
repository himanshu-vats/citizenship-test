#!/bin/bash

# Start dev server in background
echo "Starting development server..."
npm run dev &
DEV_PID=$!

# Wait for server to be ready
echo "Waiting for server to start..."
sleep 5

# Run tests
echo "Running Playwright tests..."
npx playwright test --reporter=html

# Kill dev server
echo "Stopping development server..."
kill $DEV_PID

echo ""
echo "✅ Tests complete! View the report with:"
echo "   npx playwright show-report"
