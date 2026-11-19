import fs from "fs";
import vm from "vm";

const html = fs.readFileSync(
  "C:/Users/DELL/Downloads/portfolio-catalyst-style-v3.html",
  "utf8",
);

const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
fs.writeFileSync(
  "C:/Users/DELL/Nabeel Akram/src/styles/site.css",
  css.replace(/^\n/, ""),
);

const img = html.match(/src="(data:image\/png;base64,[^"]+)"/);
if (!img) {
  console.error("NO PORTRAIT");
  process.exit(1);
}
const b64 = img[1].slice(img[1].indexOf(",") + 1);
const portrait = Buffer.from(b64, "base64");
fs.writeFileSync("C:/Users/DELL/Nabeel Akram/public/portrait.png", portrait);
console.log("portrait bytes", portrait.length);

const marker = "const STEP_VIS = ";
const i = html.indexOf(marker);
const j = html.indexOf("const JOBS =", i);
const stepCode = html.slice(i, j);
const STEP_VIS = vm.runInNewContext(stepCode + "\nSTEP_VIS");
const parsed = STEP_VIS.map((s) => {
  const m = s.match(
    /^<div class="([^"]+)" data-loop="(\d+)" aria-hidden="true">([\s\S]*)<\/div>\s*$/,
  );
  if (!m) {
    console.error("STEP PARSE FAIL", s.slice(0, 120));
    process.exit(1);
  }
  return { className: m[1], loop: m[2], html: m[3] };
});
fs.writeFileSync(
  "C:/Users/DELL/Nabeel Akram/src/data/stepVisuals.js",
  "export const STEP_VIS = " + JSON.stringify(parsed) + ";\n",
);
console.log(
  "steps",
  parsed.map((p) => p.className + " " + p.html.length).join(" | "),
);

const beh = "/* =================== MENU, NAV, SCROLL =================== */";
const bi = html.indexOf(beh);
const be = html.lastIndexOf("</script>");
const behavior = html.slice(bi, be).replace(/\s*$/, "");
fs.writeFileSync(
  "C:/Users/DELL/Nabeel Akram/src/engine/_behavior.js.txt",
  behavior,
);
console.log("behavior chars", behavior.length);
console.log("css chars", css.length);
