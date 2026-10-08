/* =========================================================
   042042.com — central configuration
   Edit this one file to switch on payments, ad units, videos
   and partner links. No other file needs touching for go-live.
   ========================================================= */
window.SITE_CONFIG = {
  siteName: "042042",
  siteUrl: "https://042042.com",
  adsenseClient: "ca-pub-6620975821265271",

  /* Manual AdSense units. Leave "" and Auto Ads fills the area.
     AdSense → Ads → By ad unit → copy the numeric data-ad-slot. */
  adSlots: { header: "", inContent: "", sidebar: "", footer: "" },

  /* Inquiry routing. The inbox address is stored as reversed
     character codes and only assembled in memory at submit time,
     so it never appears in page text, links, markup or mailto.
     After FormSubmit's one-time activation email, paste the random
     alias it issues into formAlias — the codes are then unused. */
  formAlias: "",
  _r: [109,111,99,46,108,105,97,109,103,64,49,97,115,107,114,111,119,98,101,119],

  /* Top-of-page interest banner */
  interestUrl: "https://web.works/contact",

  /* Donation / payment links. While empty, buttons open the pledge form. */
  payments: {
    paypal: "",        // https://www.paypal.com/donate/?hosted_button_id=XXXX
    stripe: "",        // https://donate.stripe.com/XXXX
    buyMeACoffee: "",  // https://buymeacoffee.com/yourname
    kofi: "",          // https://ko-fi.com/yourname
    patreon: "",       // https://patreon.com/yourname
    upi: ""            // upi://pay?pa=name@bank&pn=042042
  },
  fundraising: { goal: 5000, raised: 0, currency: "USD" },

  /* YouTube channel + video IDs (11-char ID after watch?v=).
     Until IDs are added, the video grid shows curated searches. */
  youtube: {
    channelUrl: "",
    videos: [
      // { id: "XXXXXXXXXXX", title: "How to spot a fake bank call", topic: "scams" },
    ]
  },

  /* Affiliate / referral links. Leave "" → button routes to the lead form. */
  partners: {
    remittance: [
      { name: "Wise",          url: "", note: "Mid-market rate, transparent fee" },
      { name: "Remitly",       url: "", note: "Promo rate on first transfer, JazzCash/Easypaisa payout" },
      { name: "WorldRemit",    url: "", note: "Bank, cash pickup, mobile wallet, airtime" },
      { name: "Western Union", url: "", note: "Largest cash-pickup network" }
    ],
    calling: [
      { name: "Rebtel",         url: "", note: "Bundle minutes to Pakistan landlines" },
      { name: "Boss Revolution",url: "", note: "Calling + top-up + transfer in one app" }
    ],
    business: [
      { name: "Cloud VoIP / virtual numbers", url: "", note: "Local 042 presence for your business" },
      { name: "Call-centre platform",         url: "", note: "Teams of 5–500 agents" }
    ],
    protection: [
      { name: "Call-blocking app", url: "", note: "Block spoofed and robocalls" }
    ]
  }
};
