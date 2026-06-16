const BIRTHDAY_PASSWORD = "O6I5";

const wishes = [
  "愿朱子仪新的一岁无忧无虑。",
  "愿 Ziyi Zhu 一直幸福。",
  "愿 Stephanie Zhu 永远健康。",
  "愿你每天都有稳定而真实的快乐。",
  "愿烦心事绕路走，好运直接抵达。",
  "愿你睡得安稳，醒来轻松。",
  "愿你的身体一直被好好照顾。",
  "愿你的心情永远有出口。",
  "愿你想要的平静，不必费力争取。",
  "愿你走到哪里，都有人真心祝福。",
  "愿你做自己的时候最自在。",
  "愿所有压力都变轻，所有期待都有回声。",
  "愿你被生活温柔保护。",
  "愿你的每一次选择，都通向更好的自己。",
  "愿你不用逞强，也不用害怕。",
  "愿你拥有足够多的自由和底气。",
  "愿生日这天的光，照到之后很多天。",
  "愿你远离病痛，平安顺遂。",
  "愿你心里常有晴朗，眼里常有光。",
  "愿你遇见的人，都懂得珍惜你。",
  "愿你所有认真，都被世界认真回应。",
  "愿你不被烦恼困住，也不被时间催促。",
  "愿你一直被好运记得名字。",
  "愿 26 岁这一章安稳、明亮、顺利。",
  "愿你永远健康，永远快乐。",
  "愿你成为自己最喜欢的样子。",
];

const magicLines = [
  "愿今天的风，替你吹来一整年的好运。",
  "愿你新的一岁无忧无虑，一直幸福。",
  "愿健康和平安，永远稳稳地站在你身边。",
  "愿快乐不只在生日这天来，也在每个普通日子里来。",
  "愿你的 26 岁，有明亮的开始，也有圆满的答案。",
];

const body = document.body;
const gate = document.querySelector("#gate");
const gateForm = document.querySelector("#gateForm");
const gatePassword = document.querySelector("#gatePassword");
const gateError = document.querySelector("#gateError");
const canvas = document.querySelector("#starCanvas");
const ctx = canvas.getContext("2d");
const wishGrid = document.querySelector("#wishGrid");
const wishCount = document.querySelector("#wishCount");
const lightButton = document.querySelector("#lightButton");
const magicBox = document.querySelector("#magicBox");
const magicButton = document.querySelector("#magicButton");
const magicLine = document.querySelector("#magicLine");
const sparkles = document.querySelector("#sparkles");
const letterSection = document.querySelector("#letterSection");
const planet = document.querySelector("#planet");
const cakeSection = document.querySelector(".cake-section");
const cakeStage = document.querySelector("#cakeStage");
const lighter = document.querySelector("#lighter");
const cakeStatus = document.querySelector("#cakeStatus");
const fireworkCanvas = document.querySelector("#fireworkCanvas");
const fireworkCtx = fireworkCanvas.getContext("2d");
const candles = [...document.querySelectorAll("[data-candle]")];

const litWishes = new Set();
let stars = [];
let magicIndex = 0;
let lighterDrag = null;
let fireworks = [];
let finaleStarted = false;

function unlockPage() {
  gate.classList.add("is-open");
  body.classList.remove("is-locked");
  setTimeout(() => gate.remove(), 450);
}

gateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (gatePassword.value.trim() === BIRTHDAY_PASSWORD) {
    gateError.textContent = "";
    unlockPage();
    return;
  }
  gateError.textContent = "口令不对，再试一次。";
  gatePassword.value = "";
  gatePassword.focus();
});

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  stars = Array.from(
    { length: Math.min(130, Math.floor(window.innerWidth / 9)) },
    () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.22 + 0.05,
      glow: Math.random() * 0.55 + 0.25,
    }),
  );
  resizeFireworkCanvas();
}

function resizeFireworkCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const rect = cakeStage.getBoundingClientRect();
  fireworkCanvas.width = rect.width * ratio;
  fireworkCanvas.height = rect.height * ratio;
  fireworkCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawStars() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  stars.forEach((star) => {
    star.y += star.speed;
    if (star.y > window.innerHeight + 4) {
      star.y = -4;
      star.x = Math.random() * window.innerWidth;
    }
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 236, 183, ${star.glow})`;
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}

function renderWishes() {
  wishes.forEach((wish, index) => {
    const button = document.createElement("button");
    button.className = "wish-card";
    button.type = "button";
    button.innerHTML = `
      <span class="wish-card__number">${String(index + 1).padStart(2, "0")}</span>
      <span class="wish-card__text">${wish}</span>
    `;
    button.addEventListener("click", () => lightWish(button, index));
    wishGrid.appendChild(button);
  });
}

function lightWish(button, index) {
  if (litWishes.has(index)) return;
  litWishes.add(index);
  button.classList.add("is-lit");
  wishCount.textContent = litWishes.size;
  burstAtElement(button, 7);

  if (litWishes.size === wishes.length) {
    cakeStatus.textContent =
      "26 道祝福已经点亮。现在拖动打火机，点燃生日蜡烛。";
    cakeSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function burstAtElement(element, amount) {
  const rect = element.getBoundingClientRect();
  for (let i = 0; i < amount; i += 1) {
    const dot = document.createElement("span");
    dot.style.left = `${rect.left + rect.width / 2}px`;
    dot.style.top = `${rect.top + rect.height / 2}px`;
    dot.style.position = "fixed";
    dot.style.zIndex = "6";
    dot.style.width = "8px";
    dot.style.height = "8px";
    dot.style.borderRadius = "50%";
    dot.style.background = i % 2 ? "#d9ae62" : "#1f6f5b";
    dot.style.boxShadow = "0 0 18px currentColor";
    dot.style.setProperty("--x", `${Math.cos(i) * 70}px`);
    dot.style.setProperty("--y", `${Math.sin(i * 1.7) * 70}px`);
    dot.style.animation = "sparkle 820ms ease-out forwards";
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 860);
  }
}

function openMagicBox() {
  magicBox.classList.add("is-open");
  magicLine.textContent = magicLines[magicIndex % magicLines.length];
  magicIndex += 1;
  sparkles.replaceChildren();

  Array.from({ length: 18 }).forEach((_, index) => {
    const sparkle = document.createElement("span");
    sparkle.style.left = `${38 + Math.random() * 24}%`;
    sparkle.style.top = `${30 + Math.random() * 16}%`;
    sparkle.style.setProperty("--x", `${(Math.random() - 0.5) * 220}px`);
    sparkle.style.setProperty("--y", `${-80 - Math.random() * 130}px`);
    sparkle.style.animationDelay = `${index * 18}ms`;
    sparkles.appendChild(sparkle);
  });

  setTimeout(() => magicBox.classList.remove("is-open"), 650);
}

function setLighterPosition(clientX, clientY) {
  const stageRect = cakeStage.getBoundingClientRect();
  const x = clientX - stageRect.left - lighter.offsetWidth / 2;
  const y = clientY - stageRect.top - 18;
  const maxX = stageRect.width - lighter.offsetWidth;
  const maxY = stageRect.height - lighter.offsetHeight;
  lighter.style.left = `${Math.max(0, Math.min(maxX, x))}px`;
  lighter.style.top = `${Math.max(0, Math.min(maxY, y))}px`;
  lighter.style.bottom = "auto";
  checkCandleContact();
}

function checkCandleContact() {
  const flameRect = lighter
    .querySelector(".lighter-flame")
    .getBoundingClientRect();
  const flameCenter = {
    x: flameRect.left + flameRect.width / 2,
    y: flameRect.top + flameRect.height / 2,
  };

  candles.forEach((candle) => {
    if (candle.classList.contains("is-lit")) return;
    const wickRect = candle.querySelector(".wick").getBoundingClientRect();
    const wickCenter = {
      x: wickRect.left + wickRect.width / 2,
      y: wickRect.top + wickRect.height / 2,
    };
    const distance = Math.hypot(
      flameCenter.x - wickCenter.x,
      flameCenter.y - wickCenter.y,
    );
    if (distance < 42) {
      candle.classList.add("is-lit");
      burstAtElement(candle, 12);
      const litCount = candles.filter((item) =>
        item.classList.contains("is-lit"),
      ).length;
      cakeStatus.textContent =
        litCount === candles.length
          ? "生日蜡烛点亮了。许愿吧，烟花开始。"
          : "很好，还差一根蜡烛。";
      if (litCount === candles.length) {
        launchFinale();
      }
    }
  });
}

function startLighterDrag(event) {
  lighterDrag = event.pointerId;
  lighter.classList.add("is-dragging");
  lighter.setPointerCapture(event.pointerId);
  setLighterPosition(event.clientX, event.clientY);
}

function moveLighter(event) {
  if (lighterDrag !== event.pointerId) return;
  setLighterPosition(event.clientX, event.clientY);
}

function stopLighterDrag(event) {
  if (lighterDrag !== event.pointerId) return;
  lighterDrag = null;
  lighter.classList.remove("is-dragging");
}

function launchFinale() {
  if (finaleStarted) return;
  finaleStarted = true;
  letterSection.classList.remove("letter-section--locked");
  cakeStage.classList.add("is-complete");

  let launches = 0;
  const timer = setInterval(() => {
    const rect = cakeStage.getBoundingClientRect();
    createFirework(
      rect.width * (0.18 + Math.random() * 0.64),
      rect.height * (0.14 + Math.random() * 0.3),
      ["#d9ae62", "#fff3ba", "#7f2036", "#1f6f5b"][launches % 4],
    );
    launches += 1;
    if (launches > 16) clearInterval(timer);
  }, 260);
}

function createFirework(x, y, color) {
  const count = 34;
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = 1.5 + Math.random() * 3.8;
    fireworks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 70 + Math.random() * 26,
      age: 0,
      color,
    });
  }
}

function drawFireworks() {
  const rect = cakeStage.getBoundingClientRect();
  fireworkCtx.clearRect(0, 0, rect.width, rect.height);
  fireworks = fireworks.filter((particle) => particle.age < particle.life);

  fireworks.forEach((particle) => {
    particle.age += 1;
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.025;
    const alpha = 1 - particle.age / particle.life;
    fireworkCtx.beginPath();
    fireworkCtx.fillStyle = particle.color;
    fireworkCtx.globalAlpha = alpha;
    fireworkCtx.arc(particle.x, particle.y, 2.2, 0, Math.PI * 2);
    fireworkCtx.fill();
    fireworkCtx.globalAlpha = 1;
  });

  requestAnimationFrame(drawFireworks);
}

function movePlanet(event) {
  const rect = planet.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  planet.style.transform = `rotateX(${y * -8}deg) rotateY(${x * 10}deg)`;
}

resizeCanvas();
drawStars();
renderWishes();
drawFireworks();

lightButton.addEventListener("click", () => {
  body.classList.add("is-awake");
  document
    .querySelector(".planet-section")
    .scrollIntoView({ behavior: "smooth" });
});

magicButton.addEventListener("click", openMagicBox);
magicBox.addEventListener("click", openMagicBox);
lighter.addEventListener("pointerdown", startLighterDrag);
lighter.addEventListener("pointermove", moveLighter);
lighter.addEventListener("pointerup", stopLighterDrag);
lighter.addEventListener("pointercancel", stopLighterDrag);
lighter.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    candles.forEach((candle) => candle.classList.add("is-lit"));
    cakeStatus.textContent = "生日蜡烛点亮了。许愿吧，烟花开始。";
    launchFinale();
  }
});
planet.addEventListener("pointermove", movePlanet);
planet.addEventListener("pointerleave", () => {
  planet.style.transform = "rotateX(0deg) rotateY(0deg)";
});
window.addEventListener("resize", resizeCanvas);
