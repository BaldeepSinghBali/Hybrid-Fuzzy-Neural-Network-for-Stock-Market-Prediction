(function () {
    const tickers = ["AAPL", "TSLA", "RELIANCE", "TATA", "INFOSYS", "SBI", "NIFTY50", "HDFC"];
    let i = 0;
    const el = document.getElementById("stockTicker");

    setInterval(() => {
        el.style.opacity   = "0";
        el.style.transform = "translateY(-8px)";

        setTimeout(() => {
            i = (i + 1) % tickers.length;
            el.textContent     = tickers[i];
            el.style.opacity   = "1";
            el.style.transform = "translateY(0)";
        }, 320);
    }, 2200);
})();

const MOCK = {
    AAPL:     { price: "$182.34", change: "+1.2%", signal: "BUY",  confidence: "87%", rsi: "62.4" },
    TSLA:     { price: "$168.29", change: "-0.8%", signal: "SELL", confidence: "81%", rsi: "38.7" },
    RELIANCE: { price: "₹2,856",  change: "+2.1%", signal: "BUY",  confidence: "91%", rsi: "68.2" },
    TATA:     { price: "₹3,421",  change: "+1.5%", signal: "BUY",  confidence: "84%", rsi: "59.1" },
    INFOSYS:  { price: "₹1,532",  change: "-0.4%", signal: "SELL", confidence: "78%", rsi: "42.3" },
    SBI:      { price: "₹789",    change: "+0.7%", signal: "BUY",  confidence: "76%", rsi: "55.8" },
    NIFTY50:  { price: "22,104",  change: "+0.9%", signal: "BUY",  confidence: "89%", rsi: "61.0" },
    HDFC:     { price: "₹1,680",  change: "+1.3%", signal: "BUY",  confidence: "83%", rsi: "58.4" },
};

function randomSignal() {
    const sig = Math.random() > 0.45 ? "BUY" : "SELL";
    return {
        price:      "—",
        change:     sig === "BUY" ? "+?%" : "-?%",
        signal:     sig,
        confidence: (68 + Math.random() * 22).toFixed(0) + "%",
        rsi:        (28 + Math.random() * 46).toFixed(1),
    };
}

function openModal(stock) {
    const overlay = document.getElementById("modalOverlay");
    const body    = document.getElementById("modalBody");
    const key     = stock.toUpperCase();

    body.innerHTML = `
        <div class="loading-wrap">
            <div class="loading-dots">
                <span></span><span></span><span></span>
            </div>
            <p class="loading-text">Running FuzzyNet model on <strong>${key}</strong>…</p>
        </div>`;

    overlay.classList.add("active");

    setTimeout(() => {
        const d   = MOCK[key] || randomSignal();
        const buy = d.signal === "BUY";
        const up  = d.change && d.change.startsWith("+");

        body.innerHTML = `
            <div class="modal-stock">${key}</div>
            <div class="modal-sub">Hybrid Fuzzy Neural Network Analysis</div>

            <div class="modal-metrics">
                <div class="metric">
                    <div class="metric-label">Current Price</div>
                    <div class="metric-value blue">${d.price}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">24h Change</div>
                    <div class="metric-value ${up ? "up" : "down"}">${d.change}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Confidence</div>
                    <div class="metric-value blue">${d.confidence}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">RSI</div>
                    <div class="metric-value ${parseFloat(d.rsi) > 50 ? "up" : "down"}">${d.rsi}</div>
                </div>
            </div>

            <div class="modal-signal ${buy ? "buy-signal" : "sell-signal"}">
                <i class="fas ${buy ? "fa-arrow-up" : "fa-arrow-down"}"></i>
                ${d.signal} Signal Detected
            </div>`;
    }, 1500);
}

document.getElementById("predictBtn").addEventListener("click", () => {
    const input = document.getElementById("stockInput");
    const stock = input.value.trim();

    if (!stock) {
        input.style.outline = "2px solid var(--red)";
        input.focus();
        setTimeout(() => { input.style.outline = ""; }, 1200);
        return;
    }

    openModal(stock);
});

document.getElementById("stockInput").addEventListener("keydown", e => {
    if (e.key === "Enter") document.getElementById("predictBtn").click();
});

document.getElementById("modalClose").addEventListener("click", () => {
    document.getElementById("modalOverlay").classList.remove("active");
});

document.getElementById("modalOverlay").addEventListener("click", function (e) {
    if (e.target === this) this.classList.remove("active");
});
