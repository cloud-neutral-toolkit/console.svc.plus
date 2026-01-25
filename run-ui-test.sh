#!/bin/bash
# run-ui-test.sh
# Usage: ./run-ui-test.sh [test-file]

TEST_FILE=${1:-"tests/e2e/ui/registration/register.spec.ts"}

echo "Running UI tests: $TEST_FILE"
npx playwright test "$TEST_FILE"
