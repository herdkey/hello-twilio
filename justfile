# Fail immediately on errors
set shell := ["/bin/zsh", "-euo", "pipefail", "-c"]

# Make local node binaries available like npm does
export PATH := "node_modules/.bin:" + env_var("PATH")

build: build-assets build-functions
    @node scripts/write-cjs-boundary.js

build-assets: clean
    tsc -p tsconfig.assets.json
    @tsc-alias -p tsconfig.assets.json
    @node ./scripts/privatize.js

build-functions: clean
    tsc -p tsconfig.functions.json
    @tsc-alias -p tsconfig.functions.json
    @# Cleanup unnecessary output
    @# There is no way to get tsc to stop outputting this, since we import from here
    @# But when deployed, we import these from asset/ instead
    @rm -rf dist/shared

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
