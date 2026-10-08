/* =========================================================
   042042.com — reference data
   ========================================================= */
window.DATA = {
  regions: {
    lahore: {
      name: "Lahore, Pakistan", short: "Lahore", country: "Pakistan", cc: "92", area: "42",
      tz: "Asia/Karachi", localLen: [8, 9], nationalFormat: "042-XXXX-XXXX (UAN: 042-111-XXX-XXX)",
      intlFormat: "+92 42 XXXX XXXX", url: "lahore.html",
      blurb: "Pakistan's second-largest city and capital of Punjab. Landline numbers are 042 followed by 8 digits.",
      mobile: /^3\d{9}$/, mobileNote: "Pakistani mobiles start 03xx (e.g. 0300, 0321, 0333, 0345) and never use 042.",
      hotlines: [
        ["Police emergency", "15"], ["Rescue / ambulance", "1122"],
        ["Cyber-crime helpline (NCCIA)", "1799"], ["PTA complaints", "complaint.pta.gov.pk"]
      ],
      scams: [
        "Fake prize / lucky-draw calls claiming you won a TV-show prize or car",
        "Callers posing as a government benefit programme asking for CNIC and OTP",
        "Bank 'verification' calls asking for card PIN, CVV or a one-time code",
        "WhatsApp account takeover: 'please send me the 6-digit code I sent by mistake'",
        "Fake courier / customs fee calls for a parcel you never ordered"
      ]
    },
    daejeon: {
      name: "Daejeon, South Korea", short: "Daejeon", country: "South Korea", cc: "82", area: "42",
      tz: "Asia/Seoul", localLen: [7, 8], nationalFormat: "042-XXX-XXXX / 042-XXXX-XXXX",
      intlFormat: "+82 42 XXX XXXX", url: "daejeon.html",
      blurb: "Korea's science and research city, home to Daedeok Innopolis and major universities. Numbers are 042 plus 7 or 8 digits.",
      mobile: /^10\d{8}$/, mobileNote: "Korean mobiles start 010. Internet phones start 070.",
      hotlines: [
        ["Police", "112"], ["Fire / ambulance", "119"],
        ["Financial fraud (FSS)", "1332"], ["Spam reporting (KISA)", "118"]
      ],
      scams: [
        "Voice phishing posing as prosecutors or police saying your account is linked to a crime",
        "Low-interest 'loan refinancing' calls that ask you to install an app",
        "Smishing texts about wedding invitations, obituaries or parcel delivery with a link",
        "Family-in-trouble messages asking for urgent transfers",
        "Fake investment rooms promising guaranteed stock or crypto returns"
      ]
    },
    tama: {
      name: "Tama & western Tokyo, Japan", short: "Tama", country: "Japan", cc: "81", area: "42",
      tz: "Asia/Tokyo", localLen: [7], nationalFormat: "042-XXX-XXXX",
      intlFormat: "+81 42 XXX XXXX", url: "tama.html",
      blurb: "The 042 code covers Hachioji, Tachikawa, Fuchu, Machida, Chofu and neighbouring Sagamihara. Numbers are 042 plus 7 digits (10 digits in total).",
      mobile: /^[789]0\d{8}$/, mobileNote: "Japanese mobiles start 070, 080 or 090. IP phones start 050.",
      hotlines: [
        ["Police emergency", "110"], ["Fire / ambulance", "119"],
        ["Police consultation (non-urgent)", "#9110"], ["Consumer hotline", "188"]
      ],
      scams: [
        "'Ore ore' calls: a 'son' or 'grandson' needs money urgently",
        "Fake police or bank staff collecting your cash card at the door",
        "Refund fraud: 'you are owed a medical or tax refund, go to an ATM'",
        "Callers claiming to be from the telecom carrier about unpaid fees",
        "Automated calls in English or Chinese pretending to be an embassy"
      ]
    }
  },

  /* Country list for the dialing calculator: [name, country code, exit prefix, time zone] */
  countries: [
    ["United States","1","011","America/New_York"],["Canada","1","011","America/Toronto"],
    ["United Kingdom","44","00","Europe/London"],["Saudi Arabia","966","00","Asia/Riyadh"],
    ["United Arab Emirates","971","00","Asia/Dubai"],["Qatar","974","00","Asia/Qatar"],
    ["Kuwait","965","00","Asia/Kuwait"],["Oman","968","00","Asia/Muscat"],
    ["Bahrain","973","00","Asia/Bahrain"],["Germany","49","00","Europe/Berlin"],
    ["France","33","00","Europe/Paris"],["Italy","39","00","Europe/Rome"],
    ["Spain","34","00","Europe/Madrid"],["Netherlands","31","00","Europe/Amsterdam"],
    ["Norway","47","00","Europe/Oslo"],["Sweden","46","00","Europe/Stockholm"],
    ["Australia","61","0011","Australia/Sydney"],["New Zealand","64","00","Pacific/Auckland"],
    ["India","91","00","Asia/Kolkata"],["Pakistan","92","00","Asia/Karachi"],
    ["Bangladesh","880","00","Asia/Dhaka"],["China","86","00","Asia/Shanghai"],
    ["Hong Kong","852","001","Asia/Hong_Kong"],["Singapore","65","000","Asia/Singapore"],
    ["Malaysia","60","00","Asia/Kuala_Lumpur"],["Philippines","63","00","Asia/Manila"],
    ["Vietnam","84","00","Asia/Ho_Chi_Minh"],["Thailand","66","001","Asia/Bangkok"],
    ["Indonesia","62","001","Asia/Jakarta"],["South Korea","82","001","Asia/Seoul"],
    ["Japan","81","010","Asia/Tokyo"],["Turkey","90","00","Europe/Istanbul"],
    ["South Africa","27","00","Africa/Johannesburg"],["Nigeria","234","009","Africa/Lagos"],
    ["Brazil","55","0021","America/Sao_Paulo"],["Mexico","52","00","America/Mexico_City"]
  ],

  /* Patterns that raise the risk score regardless of region */
  riskSignals: [
    { re: /^(?:\+|00)?(?:882|883|881)/, pts: 4, msg: "International network / satellite range — often used for one-ring 'call-back' fraud." },
    { re: /^(?:\+|00)?(?:1(?:268|284|473|649|664|767|809|829|849|876))/, pts: 3, msg: "Caribbean '1' code that looks domestic in North America — a known one-ring scam pattern." },
    { re: /^(?:\+|00)?(?:224|225|232|234|242|243|252|261|263|269|371|373|375|381)/, pts: 2, msg: "Country code frequently reported in missed-call (wangiri) campaigns." },
    { re: /(\d)\1{5,}/, pts: 1, msg: "Long run of repeated digits — common in spoofed caller IDs." }
  ],

  /* Number lore for the 042 meaning page */
  lore: [
    ["Japanese wordplay", "Digits are read as syllables (goroawase). 0 can be 'o', 4 'shi' or 'yo', 2 'ni' or 'fu' — so 04 reads 'oshi', the word fans use for their favourite idol or character."],
    ["Chinese & Japanese tradition", "4 sounds like the word for death (sì / shi) and is avoided in floor and room numbers. 2 is balanced and auspicious in Chinese culture, so 042 pairs a feared digit with a lucky one."],
    ["Western pop culture", "42 is famous as the comic 'answer to life, the universe and everything' from a 1979 science-fiction novel, and is widely used as an in-joke by programmers."],
    ["Sport", "42 is the jersey number retired across Major League Baseball in honour of Jackie Robinson, who broke the colour line in 1947."],
    ["Mathematics", "42 is a Catalan number, a pronic number (6 × 7) and the number of ways to triangulate a heptagon. And 042042 = 42 × 1001 = 2 × 3 × 7 × 7 × 11 × 13."],
    ["Telephony", "042 is a trunk code in at least three countries at once: Lahore (Pakistan), Daejeon (South Korea) and the Tama area of Tokyo (Japan). The leading 0 is a domestic trunk prefix, dropped when dialling from abroad."],
    ["Numerology", "Popular numerology reduces 042 to 4 + 2 = 6 — a number associated with home, responsibility and care. Repeated as 042042, it is read as a doubled message."]
  ]
};
