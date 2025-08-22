const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "imagine",
    version: "0.0.1",
    author: "ArYAN",
    description: "Generate an image from a text prompt using custom API",
    usage: "imagine <prompt>",
    cooldown: 10,
    role: 1,
    category: "AI"
  },

  onStart: async function ({ api, event, args, message }) {
    const prompt = args.join(" ").trim();
    if (!prompt) return message.reply("⚠️ Provide a prompt, e.g. imagine a red dragon.");

    const loadingMsg = await message.reply("⏳ Generating image...");

    try {
      const response = await axios.post("https://aryan-nix-imagine.onrender.com/imagine", { prompt }, {
        responseType: "arraybuffer"
      });

      const fileName = path.join(__dirname, "cache", `img_${Date.now()}.jpg`);
      fs.writeFileSync(fileName, response.data);

      await api.unsendMessage(loadingMsg.messageID);

      await api.sendMessage(
        {
          body: `✅ Image generated for prompt:\n"${prompt}"`,
          attachment: fs.createReadStream(fileName)
        },
        event.threadID,
        () => fs.unlinkSync(fileName),
        event.messageID
      );
    } catch (error) {
      console.error(error);
      await api.unsendMessage(loadingMsg.messageID);
      message.reply("[⚜️]➜ Failed to generate image.");
    }
  }
};
