const BAL_KEY = "gc_v5_balance";
const INIT_BAL = 100000000000;
const PACKS = [
  { coins: 30, usd: 0.31 },
  { coins: 350, usd: 3.65 },
  { coins: 700, usd: 7.25 },
  { coins: 1400, usd: 14.8 },
  { coins: 3500, usd: 36.9 },
];

let balance = Number(localStorage.getItem(BAL_KEY)) || INIT_BAL;
const balanceDisplay = document.getElementById("balanceDisplay");
const packsEl = document.getElementById("packs");
const btnPay = document.getElementById("btnPay");
const popup = document.getElementById("popup");
const msg = document.getElementById("popupMsg");
const ting = document.getElementById("ting");

renderBalance();
renderPacks();

function renderBalance() {
  balanceDisplay.textContent = balance.toLocaleString("en-US");
}
function renderPacks() {
  packsEl.innerHTML = "";
  PACKS.forEach((p) => {
    const el = document.createElement("div");
    el.className = "pack";
    el.innerHTML = `
  <div class="coin">
    <svg class="coin-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFD700">
      <circle cx="12" cy="12" r="10" stroke="#E0B400" stroke-width="1.5" fill="#FFD700"/>
      <text x="12" y="16" text-anchor="middle" font-size="12" fill="#fff" font-weight="700">T</text>
    </svg>
    ${p.coins}
  </div>
  <div class="price">US$${p.usd}</div>
`;
    el.addEventListener("click", () => selectPack(el, p));
    packsEl.appendChild(el);
  });
}
let selected = null;
function selectPack(el, p) {
  document.querySelectorAll(".pack").forEach((x) => x.classList.remove("selected"));
  el.classList.add("selected");
  selected = p;
  btnPay.disabled = false;
  btnPay.textContent = `Pay US$${p.usd}`;
}

btnPay.disabled = true;

btnPay.onclick = async () => {
  const user = document.getElementById("username").value.trim() || "@unknown";
  if (!selected) return;
  if (balance < selected.coins) return showPopup("Insufficient balance", false);
  btnPay.disabled = true;
  btnPay.innerHTML = `<span class="spinner"></span> Processing...`;
  await delay(2000);
  playTingTwice();
  balance -= selected.coins;
  localStorage.setItem(BAL_KEY, balance);
  renderBalance();
  showPopup(
    `Payment successful<br><small>${selected.coins} coins added — charged $${selected.usd}<br>${user}</small>`,
    true
  );
  btnPay.textContent = "Pay";
  btnPay.disabled = true;
  if (balance <= 0) showPopup("No coins left", false);
};

function showPopup(text, success = true) {
  msg.innerHTML = text;
  document.getElementById("successIcon").style.display = success ? "block" : "none";
  popup.style.display = "flex";
  setTimeout(() => (popup.style.display = "none"), 1000);
}
function delay(ms) { return new Promise((r) => setTimeout(r, ms)); }
function playTingTwice() {
  ting.currentTime = 0; ting.play();
  setTimeout(() => { ting.currentTime = 0; ting.play(); }, 400);
}