const helmet = require("helmet");

const scriptSrcUrls = ["https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net/npm"];

const styleSrcUrls = ["https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"];

const fontSrcUrls = [
  "https://fonts.gstatic.com",
  "https://cdnjs.cloudflare.com",
  "https://cdn.jsdelivr.net", // <-- needed for bootstrap icons
  "data:",
];

const connectSrcUrls = []; // Add APIs / CDNs if you fetch data from outside

module.exports.security = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    connectSrc: ["'self'", ...scriptSrcUrls],
    scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
    styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
    workerSrc: ["'self'", "blob:"],
    objectSrc: [],
    imgSrc: ["'self'", "blob:", "data:"],
    fontSrc: ["'self'", ...fontSrcUrls],
  },
});
