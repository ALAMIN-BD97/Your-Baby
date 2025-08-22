const { GoatWrapper } = require("fca-aryan-nix");
const axios = require("axios");

module.exports = {
  config: {
    name: "ai",
    aliases: ["Ai", "chat"],
    version: "0.0.3",
    author: "ArYAN",
    countDown: 3,
    role: 0,
    shortDescription: "Ask AI",
    longDescription: "Talk with AI using Aryan's API",
    category: "AI",
    guide: "/gemini [your question]"
  },

  onStart: async function ({ api, event, args }) {
    const prompt = args.join(" ");
    if (!prompt) {
      return api.sendMessage("❌ Please type a question for the AI to answer.\n\nExample: /Ai why is the sky blue?", event.threadID, event.messageID);
    }

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const res = await axios.get(`https://aryan-nix-apis.vercel.app/api/gemini?prompt=${encodeURIComponent(prompt)}`, {
        signal: controller.signal
      });

      clearTimeout(timeout);

      const reply = res.data?.response;
      if (!reply) throw new Error("Empty response from AI.");

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      api.sendMessage(reply, event.threadID, (err, info) => {
        if (err) return;
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          author: event.senderID
        });
      }, event.messageID);
    } catch (err) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      let errorMsg = "⚠️ Sorry, the AI did not respond. Please try again later.";
      if (err.code === "ERR_CANCELED") {
        errorMsg = "⌛ Request timed out. The AI took too long to respond. Try again.";
      }
      return api.sendMessage(errorMsg, event.threadID, event.messageID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    if ([api.getCurrentUserID()].includes(event.senderID)) return;

    const prompt = event.body;
    if (!prompt) return;

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const res = await axios.get(`https://aryan-nix-apis.vercel.app/api/gemini?prompt=${encodeURIComponent(prompt)}`, {
        signal: controller.signal
      });

      clearTimeout(timeout);

      const reply = res.data?.response;
      if (!reply) throw new Error("Empty response from AI.");

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      api.sendMessage(reply, event.threadID, (err, info) => {
        if (!info) return;
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          author: event.senderID
        });
      }, event.messageID);
    } catch (err) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      let errorMsg = "⚠️ Sorry, the AI did not respond. Please try again later.";
      if (err.code === "ERR_CANCELED") {
        errorMsg = "⌛ Request timed out. The AI took too long to respond. Try again.";
      }
      return api.sendMessage(errorMsg, event.threadID, event.messageID);
    }
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
