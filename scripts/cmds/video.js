const fetch = require("node-fetch");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytSearch = require("yt-search");

module.exports = {
  config: {
    name: "video",
    aliases: [],
    version: "1.4.3",
    author: "ArYAN",
    countDown: 5,
    role: 0,
    shortDescription: "Download YouTube video or audio",
    longDescription: "Use '/video [name]' to search, '/video -v [YouTube URL]' for video, or '/video -a [YouTube URL]' for audio.",
    category: "MUSIC",
    guide: "/video leja re\n/video -v https://youtu.be/abc123\n/video -a https://youtu.be/abc123"
  },

  onStart: async function ({ api, event, args }) {
    const apiKey = "itzaryan";
    let type = "video";
    let videoId, topResult;

    const processingMessage = await api.sendMessage("📥 Fetching your media...", event.threadID, null, event.messageID);

    try {
      const mode = args[0];
      const inputArg = args[1];

      if ((mode === "-v" || mode === "-a") && inputArg) {
        type = mode === "-a" ? "audio" : "video";

        let urlObj;
        try {
          urlObj = new URL(inputArg);
        } catch {
          throw new Error("❌ Invalid YouTube URL.");
        }

        if (urlObj.hostname === "youtu.be") {
          videoId = urlObj.pathname.slice(1);
        } else if (urlObj.hostname.includes("youtube.com")) {
          const urlParams = new URLSearchParams(urlObj.search);
          videoId = urlParams.get("v");
        }

        if (!videoId) throw new Error("❌ Could not extract video ID from URL.");

        const infoRes = await axios.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
        topResult = {
          title: infoRes.data.title || "Unknown Title",
          author: { name: infoRes.data.author_name || "Unknown Channel" },
          timestamp: "0:00",
          views: 0,
          ago: "N/A"
        };

      } else {
        const query = args.join(" ");
        if (!query) throw new Error("❌ Please enter a video name or YouTube URL.");

        const searchResults = await ytSearch(query);
        if (!searchResults || !searchResults.videos.length) {
          throw new Error("❌ No results found.");
        }
        topResult = searchResults.videos[0];
        videoId = topResult.videoId;
      }

      const timestamp = topResult.timestamp || "0:00";
      const parts = timestamp.split(":").map(Number);
      const durationSeconds = parts.length === 3
        ? parts[0] * 3600 + parts[1] * 60 + parts[2]
        : parts[0] * 60 + parts[1];

      if (durationSeconds > 600) {
        throw new Error(`❌ Video too long (${timestamp}). Only videos under 10 minutes are supported.`);
      }

      const apiUrl = `https://xyz-nix.vercel.app/aryan/youtube?id=${videoId}&type=${type}&apikey=${apiKey}`;

      api.setMessageReaction("⌛", event.messageID, () => {}, true);

      const downloadResponse = await axios.get(apiUrl, { timeout: 30000 });

      const downloadUrl = downloadResponse.data.downloadUrl;
      if (!downloadUrl) throw new Error("❌ Failed to get download link.");

      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error(`❌ Download failed. Status: ${response.status}`);

      const ext = type === "audio" ? "mp3" : "mp4";
      const safeTitle = topResult.title.replace(/[\\/:*?"<>|]/g, "").substring(0, 50);
      const filename = `${safeTitle}.${ext}`;
      const downloadPath = path.join(__dirname, filename);
      const buffer = await response.buffer();

      fs.writeFileSync(downloadPath, buffer);
      api.setMessageReaction("✅", event.messageID, () => {}, true);

      await api.sendMessage({
        attachment: fs.createReadStream(downloadPath),
        body:
          `${type === "audio" ? "🎵 AUDIO INFO" : "🎬 VIDEO INFO"}\n` +
          `━━━━━━━━━━━━━━━\n` +
          `📌 Title: ${topResult.title}\n` +
          `🎞 Duration: ${topResult.timestamp || "Unknown"}\n` +
          `📺 Channel: ${topResult.author.name}\n` +
          `👁 Views: ${topResult.views?.toLocaleString?.() || "N/A"}\n` +
          `📅 Uploaded: ${topResult.ago || "N/A"}`
      }, event.threadID, () => {
        fs.unlinkSync(downloadPath);
        api.unsendMessage(processingMessage.messageID);
      }, event.messageID);

    } catch (err) {
      console.error("Error:", err.message);
      api.sendMessage(err.message, event.threadID, event.messageID);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  }
};
