export const NAV = [
  ["about", "About"],
  ["services", "Services"],
  ["work", "Work"],
  ["experience", "Experience"],
  ["skills", "Skills"],
  ["faq", "FAQ"],
  ["contact", "Contact"],
];

export const MAIL =
  "mailto:nabeelakram629@gmail.com?subject=New%20project%20enquiry";

export const ABOUT_LIT =
  "I build and scale React, WordPress and Shopify websites for international clients, from custom themes to checkout flows, and now lead a WordPress team so nothing gets lost between the idea and the launch.";

export const TAGLINE =
  "Websites that load fast, sell well, and stay easy to run long after the launch day is over.";

export const BENEFITS = [
  [
    "Pages that load fast",
    "Performance optimization is part of every build, so visitors stay and search engines notice.",
  ],
  [
    "Built around your business",
    "Custom WordPress themes and plugins instead of bloated templates. The site does what you need and nothing more.",
  ],
  [
    "Stores that sell",
    "WooCommerce and Shopify Liquid builds made for a smooth path from product page to checkout.",
  ],
  [
    "Support after launch",
    "Bug fixes, performance tuning and maintenance, already handled for multiple clients at once.",
  ],
  [
    "Delivered on schedule",
    "Project deadlines and team targets met consistently, recognized with Team Lead Recognition.",
  ],
];

export const TAGS = [
  "Fast loading",
  "Custom themes",
  "Checkout flows",
  "Maintenance",
  "On schedule",
];

const SITES = [
  [
    "WordPress websites",
    [
      "qayam.store",
      "volvogaming.com",
      "velvetovens.com",
      "polani.ca",
      "dermatology.pk",
      "upfrontsecurityservices.com",
      "asphaltattire.com",
      "broviastore.com",
      "motopartslab.com",
      "theurbanstrap.com",
      "grindandgains.com",
      "furryswellness.com",
      "classicwoodhub.com",
      "ecogrocer.store",
      "zacadmia.com",
      "umberleesh.com",
      "zenithpharmaco.com",
      "dhunbazaar.com",
    ],
  ],
  [
    "WordPress business sites",
    [
      "mmatech.biz",
      "raitsolutions.biz",
      "wisersoftsol.com",
      "gabitronitsol.online",
      "rahnextech.com",
      "speedcabs.org",
    ],
  ],
  ["Custom PHP", ["dataloom.biz", "zpayso.com"]],
  [
    "Shopify stores",
    [
      "brandinpk.com",
      "colourway.pk",
      "originpharma.org",
      "zainabzari.pk",
      "nanomega.ca",
      "gowarafoods.com",
      "era4apparels.com",
      "footeaze.com",
      "vaellebeauty.com",
      "shabzshop.com",
      "houseofizal.com",
      "arabicaskin.com",
      "sizucchero.com",
      "bijjuonline.com",
      "theskintelligent.com",
      "khussaswag.com",
      "ysons.com.pk",
    ],
  ],
  ["React.js", ["binwaleedtours.com"]],
];

const WWW = [
  "zpayso.com",
  "binwaleedtours.com",
  "nanomega.ca",
  "gowarafoods.com",
  "vaellebeauty.com",
  "houseofizal.com",
  "arabicaskin.com",
  "sizucchero.com",
  "zainabzari.pk",
];

const HTTP = [
  "mmatech.biz",
  "raitsolutions.biz",
  "wisersoftsol.com",
  "gabitronitsol.online",
  "speedcabs.org",
  "asphaltattire.com",
  "broviastore.com",
  "motopartslab.com",
  "theurbanstrap.com",
  "grindandgains.com",
  "furryswellness.com",
  "classicwoodhub.com",
  "ecogrocer.store",
  "zacadmia.com",
  "umberleesh.com",
  "zenithpharmaco.com",
  "dhunbazaar.com",
];

export const WORK = SITES.flatMap(([cat, list]) =>
  list.map((domain) => ({
    domain,
    cat,
    url:
      (HTTP.includes(domain) ? "http://" : "https://") +
      (WWW.includes(domain) ? "www." : "") +
      domain +
      "/",
  })),
);

export const FEATURED = [
  "brandinpk.com",
  "zpayso.com",
  "binwaleedtours.com",
  "polani.ca",
  "colourway.pk",
];

export const FILTERS = ["All", ...SITES.map((s) => s[0])];

export const SVC = [
  {
    with: "React.js and custom PHP",
    sites: ["binwaleedtours.com", "zpayso.com", "dataloom.biz"],
  },
  {
    with: "WordPress custom themes",
    sites: ["polani.ca", "velvetovens.com", "dermatology.pk", "volvogaming.com"],
  },
  {
    with: "Shopify and WooCommerce",
    sites: ["brandinpk.com", "colourway.pk", "vaellebeauty.com", "arabicaskin.com"],
  },
  {
    with: "WordPress business sites",
    sites: ["mmatech.biz", "raitsolutions.biz", "wisersoftsol.com", "speedcabs.org"],
  },
  {
    with: "WordPress, Shopify and React",
    sites: ["zpayso.com", "nanomega.ca", "originpharma.org", "houseofizal.com"],
  },
];

export const STEPS = [
  [
    "Share your idea",
    "Send your brief with your idea, reference sites, content and goals. We agree on scope and timeline before any code is written.",
    "Client brief",
  ],
  [
    "Design, develop and review",
    "I plan, design and build in React, WordPress or Shopify, then test every page. You review it, I apply your feedback, and we refine until you approve.",
    "Build and review",
  ],
  [
    "Launch and deliver",
    "Once approved, the site goes live on your domain. I hand over the files, confirm everything works and stay on for support.",
    "Go live",
  ],
];

export const JOBS = [
  [
    "April 2025 to Present",
    "WordPress Team Lead",
    "ZPAYSO",
    [
      "Lead WordPress projects and manage a team delivering scalable websites on schedule.",
      "Built and maintained 50+ WordPress and custom PHP sites, including eCommerce platforms.",
      "Own bug fixes, performance optimization and ongoing maintenance.",
      "Use AI assisted tools to speed up development and code review.",
    ],
  ],
  [
    "Nov 2024 to April 2025",
    "WordPress and Shopify Developer",
    "Magnet Creative Company",
    [
      "Developed and customized WordPress sites and Shopify stores to client requirements.",
      "Resolved technical issues and tuned performance for a better user experience.",
      "Maintained websites for multiple clients.",
    ],
  ],
  [
    "Jan 2024 to Feb 2025",
    "WordPress and Shopify Developer",
    "PNY Training Institute",
    [
      "Built WordPress websites and Shopify stores, and managed the institute website.",
      "Designed custom landing pages for Dubai projects.",
      "Worked directly with international clients on business focused solutions.",
    ],
  ],
];

export const SKILLS = [
  [
    "Frontend",
    ["React.js", "JavaScript (ES6+)", "HTML5", "CSS3", "Responsive design"],
  ],
  ["Backend", ["PHP", "MySQL", "REST APIs"]],
  [
    "CMS and eCommerce",
    ["WordPress (custom themes and plugins)", "WooCommerce", "Shopify (Liquid)"],
  ],
  [
    "Practices",
    [
      "Performance optimization",
      "Bug fixing",
      "Website maintenance",
      "Team leadership",
    ],
  ],
  ["Tools", ["Git", "Claude", "GitHub Copilot"]],
];

export const FAQS = [
  [
    "Which platforms do you build on?",
    "React.js for custom interfaces, WordPress with custom themes and plugins, WooCommerce for stores, and Shopify using Liquid. I pick what fits your goal.",
  ],
  [
    "Can you build an online store?",
    "Yes. I have built eCommerce platforms on WordPress with WooCommerce and on Shopify, and delivered 50+ business and eCommerce websites in total.",
  ],
  [
    "Do you work with clients outside Pakistan?",
    "Yes. I work from Lahore with international clients, including landing pages for Dubai projects, and collaborate with clients directly.",
  ],
  [
    "Can you fix or speed up an existing site?",
    "Yes. Bug fixing and performance optimization are a regular part of my work, and I have maintained sites for several clients at once.",
  ],
  [
    "Do you keep maintaining the site after launch?",
    "Yes. I handle updates, bug fixes and performance checks so the site stays fast and reliable after it goes live.",
  ],
  [
    "Do you use AI tools?",
    "I use Claude and GitHub Copilot to speed up development and code review. Every change is still reviewed and tested by me before it ships.",
  ],
  [
    "Can you lead a team or take over a team project?",
    "Yes. I currently lead a WordPress development team at ZPAYSO and manage delivery against deadlines.",
  ],
  [
    "How do I start, and what does it cost?",
    "Email me a short brief with your goal and timeline. Pricing depends on scope, so I reply with next steps and a clear view of what the work involves.",
  ],
];

export const pad = (n) => String(n).padStart(2, "0");

export function siteUrl(domain) {
  const found = WORK.find((item) => item.domain === domain);
  return found ? found.url : `https://${domain}/`;
}

export function shotUrl(url) {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=800&h=600`;
}

export function pvShot(url) {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1000&vpw=1280&vph=2600`;
}

export function splitWords(text) {
  return text.trim().split(/\s+/);
}
