<h1> Docker image environment variables </h1>
<h3><u> token </u></h3>
<p> The discord bot token to use (the bot identifier) </p>
<h3><u> prefix </u></h3>
<p> The prefix the bot should read when summoned. (ex $,%,!,/ ...) </br>
usage: $play, $help ... </p>
<h3> Example docker run usage </h3>
<p>```sudo docker run -d --env prefix="$" --env token="YOUR-BOT-TOKEN" --name discord-bot discord_bot_image:latest```</p>
