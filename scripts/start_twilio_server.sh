#!/bin/zsh

# Check if root_dir environment variable exists
if [ -z "${root_dir:-}" ]; then
    echo "Error: root_dir environment variable is not set"
    exit 1
fi

logfile="${root_dir}/logs/twilio.log"
port="${port:-3001}"

lsof -ti tcp:$port | xargs -r kill -9
while lsof -i tcp:$port >/dev/null; do
    sleep 1
done

# Start in the background
mkdir -p logs
export PINO_PRETTY=true
nohup twilio serverless start --port "$port" --load-local-env \
    > "${logfile}" 2>&1 &

echo ""
echo "Twilio server started, tailing logs. cmd+c will exit tailing but leave the Twilio process running."
echo ""
tail -f "${logfile}"
