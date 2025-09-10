# Fail immediately on errors
set shell := ["/bin/zsh", "-euo", "pipefail", "-c"]

# Make local node binaries available like npm does
export PATH := "node_modules/.bin:" + env_var("PATH")

# build step
build:
    tsc && tsc-alias
    node scripts/write-cjs-boundary.js

# start server (depends on build)
start: build
    twilio-run start dist

# deploy after build
deploy: build
    twilio-run deploy --override-existing-project

# run tests, pass through extra args
test *args:
    vitest {{args}}

# run tests with UI
test-ui:
    vitest --ui

# run coverage
coverage:
    vitest run --coverage

# lint code
lint:
    ESLINT_STRICT=true eslint . --fix --ext .ts,.js

# format code
fmt:
    prettier --write .
