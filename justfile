# Fail immediately on errors
set shell := ["/bin/zsh", "-euo", "pipefail", "-c"]

# Make local node binaries available like npm does
export PATH := "node_modules/.bin:" + env_var("PATH")

build: clean
    tsc -p tsconfig.build.json
    @tsc-alias -p tsconfig.build.json
    @node ./scripts/privatize.js
    @node scripts/write-cjs-boundary.js

clean:
    rm -rf dist

# start server (depends on build)
start: build
    twilio serverless start

# deploy after build
deploy: build
    twilio serverless deploy --override-existing-project

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
