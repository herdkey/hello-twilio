#!/bin/zsh

# Check if root_dir environment variable exists
if [ -z "${root_dir:-}" ]; then
    echo "Error: root_dir environment variable is not set"
    exit 1
fi

# Check if NGROK_DOMAIN environment variable exists
if [ -z "${NGROK_DOMAIN:-}" ]; then
    echo "Error: NGROK_DOMAIN environment variable is not set"
    exit 1
fi

logfile="${root_dir}/logs/ngrok.log"
endpoint_name="twilio"
port="${port:-3001}"

# search processes for pre-existing ngrok
process_regex=".*ngrok.*http.*$port.*$endpoint_name.*"

# kill matching processes
pkill -9 -f "$process_regex"

# wait until the processes are gone
end=$((SECONDS+3))
while pgrep -f "$process_regex" > /dev/null && [ $SECONDS -lt $end ]; do
    sleep 1
done

# Start in the background
mkdir -p logs
nohup ngrok http "$port" --name "$endpoint_name" --domain "$NGROK_DOMAIN" \
    > "$logfile" 2>&1 &

echo ""
echo "ngrok started, tailing logs. cmd+c will exit tailing but leave the ngrok process running."
echo ""
tail -f "${logfile}"
