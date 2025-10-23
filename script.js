const BAL_KEY = "gc_v5_balance_usd";
const INIT_BAL = 1000000000; // 💰 1 tỷ USD khởi tạo
const PACKS = [
  { coins: 30, usd: 0.31 },
  { coins: 350, usd: 3.65 },
  { coins: 700, usd: 7.25 },
  { coins: 1400, usd: 14.8 },
  { coins: 3500, usd: 36.9 },
  { custom: true, coins: 0, usd: 0 }
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

// 🔁 Reset trạng thái khi load lại trang
window.addEventListener("load", () => {
  selected = null;
  btnPay.textContent = "Pay";
  btnPay.disabled = true;
  document.querySelectorAll(".pack").forEach(p => p.classList.remove("selected"));
  document.querySelectorAll(".customInput, .customPrice").forEach(e => e.remove());
});

function renderBalance() {
  balanceDisplay.textContent = balance.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

function renderPacks() {
  packsEl.innerHTML = "";
  PACKS.forEach((p) => {
    const el = document.createElement("div");
    el.className = "pack";

    if (p.custom) {
      el.innerHTML = `
        <div class="coin">Other</div>
        <div class="price">Enter manually</div>
      `;
    } else {
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
    }

    el.addEventListener("click", (e) => {
      e.stopPropagation();
      selectPack(el, p);
    });
    packsEl.appendChild(el);
  });
}

let selected = null;

function selectPack(el, p) {
  document.querySelectorAll(".pack").forEach((x) => x.classList.remove("selected"));
  el.classList.add("selected");
  selected = p;
  btnPay.disabled = false;

  // Remove old input
  document.querySelectorAll(".customInput, .customPrice").forEach(e => e.remove());

  if (p.custom) {
    showCustomInput(el);
  } else {
    btnPay.textContent = `Pay US$${p.usd}`;
  }
}

function showCustomInput(container) {
  const input = document.createElement("input");
  input.id = "customCoins";
  input.type = "number";
  input.placeholder = "Enter coin amount";
  input.min = 1;
  input.className = "customInput";

  const priceLabel = document.createElement("p");
  priceLabel.id = "customPrice";
  priceLabel.className = "customPrice";
  priceLabel.textContent = "US$0.00";

  container.appendChild(input);
  container.appendChild(priceLabel);

  input.focus();

  input.addEventListener("input", () => {
    const val = parseInt(input.value || "0");
    selected.coins = val;
    selected.usd = (val * 0.0105).toFixed(2);
    priceLabel.textContent = `US$${selected.usd}`;
    btnPay.textContent = `Pay US$${selected.usd}`;
  });
}

btnPay.disabled = true;

btnPay.onclick = async () => {
  const user = document.getElementById("username").value.trim() || "@unknown";
  if (!selected || selected.usd <= 0) return;
  if (balance < selected.usd) return showPopup("Insufficient balance", false);

  btnPay.disabled = true;
  btnPay.innerHTML = `<span class="spinner"></span> Processing...`;

  await delay(1500);
  playTingTwice();

  // 💸 Trừ tiền thật (USD)
  balance -= parseFloat(selected.usd);
  localStorage.setItem(BAL_KEY, balance);
  renderBalance();

  showPopup(
    `Payment successful<br><small>${selected.coins} coins sent — charged US$${selected.usd}<br>${user}</small>`,
    true
  );

  btnPay.textContent = "Pay";
  btnPay.disabled = true;

  if (balance <= 0) showPopup("No funds left", false);
};

function showPopup(text, success = true) {
  msg.innerHTML = text;
  document.getElementById("successIcon").style.display = success ? "block" : "none";
  popup.style.display = "flex";
  setTimeout(() => (popup.style.display = "none"), 1300);
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function playTingTwice() {
  ting.currentTime = 0;
  ting.play();
  setTimeout(() => {
    ting.currentTime = 0;
    ting.play();
  }, 350);
}
