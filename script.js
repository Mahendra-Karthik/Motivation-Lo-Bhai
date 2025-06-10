const loadEl = document.getElementById("load"),
      quoteBox = document.getElementById("quoteContainer"),
      quoteEl = document.getElementById("quote"),
      authorEl = document.getElementById("author"),
      newBtn = document.getElementById("newQuoteBtn");

const apis = [
  {
    url: "https://zenquotes.io/api/quotes/random",
    parser: d => ({ q: d[0].q, a: d[0].a })
  },
  {
    url: "https://api.realinspire.live/v1/quotes/random",
    parser: d => ({ q: d[0].content, a: d[0].author })
  },
  {
    url: "https://quoteslate.vercel.app/quotes/random?limit=1",
    parser: d => ({ q: d[0].content, a: d[0].author })
  }
];

const offline = [
  { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
  { q: "Success is not final, failure is not fatal.", a: "Winston Churchill" },
  { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" }
];

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

async function fetchQuote() {
  loadEl.style.display = "flex";
  quoteBox.style.display = "none";

  await new Promise(r => setTimeout(r, 1500)); // artificial delay for loader

  shuffle(apis);
  let final = null;

  for (const api of apis) {
    try {
      const res = await fetch(api.url);
      if (!res.ok) throw new Error("API failed");
      final = api.parser(await res.json());
      if (final.q) break;
    } catch (e) {
      console.warn("API failed:", api.url, e);
    }
  }

  if (!final) final = offline[Math.floor(Math.random() * offline.length)];

  quoteEl.textContent = final.q;
  authorEl.textContent = final.a ? `— ${final.a}` : "";

  loadEl.style.display = "none";
  quoteBox.style.display = "block";
}

newBtn.onclick = fetchQuote;
window.onload = fetchQuote;
