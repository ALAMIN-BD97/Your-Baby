const axios = require("axios");

module.exports = {
  config: {
    name: "4k",
    aliases: ["upscale"],
    version: "1.1",
    role: 0,
    author: "ArYAN",
    countDown: 5,
    longDescription: "Upscale images to 4K resolution.",
    category: "image",
    guide: {
      en: "{pn} reply to an image to upscale it to 4K resolution."
    }
  },

  onStart: async function ({ message, event }) {
    if (
      !event.messageReply ||
      !event.messageReply.attachments ||
      !event.messageReply.attachments[0] ||
      event.messageReply.attachments[0].type !== "photo"
    ) {
      return message.reply("📸 Please reply to an image to upscale it.");
    }

    const imgurl = encodeURIComponent(event.messageReply.attachments[0].url);
    const apiKey = "ArYANAHMEDRUDRO";
    const upscaleUrl = `https://aryan-xyz-upscale-api-phi.vercel.app/api/upscale-image?imageUrl=${imgurl}&apikey=${apiKey}`;

    message.reply("🔄 Processing your image, please wait...", async (err, info) => {
      if (err) return console.error("Message send error:", err);

      try {
        const response = await axios.get(upscaleUrl);
        const imageUrl = response.data.resultImageUrl;

        const attachment = await global.utils.getStreamFromURL(imageUrl, "upscaled.png");

        await message.reply({
          body: "✅ Your 4K upscaled image is ready!",
          attachment
        });

        await message.unsend(info.messageID);

      } catch (error) {
        console.error("Upscale Error:", error.message);
        message.reply("❌ Error occurred while upscaling the image.");
      }
    });
  }
};
