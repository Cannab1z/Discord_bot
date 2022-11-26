from node:latest
copy . /discord_bot
workdir /discord_bot
run npm install
entrypoint ["node", "app.js"]
