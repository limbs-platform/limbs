const target = document.title;
const NOISE = "0123456789#<>/\\░▒▓";
const FRAME_MS = 90;
const PAUSE_MS = 3000;
const GLITCH_CHANCE = 0.15;

const BLINK_MS = 700;

const noiseChar = () => NOISE[Math.floor(Math.random() * NOISE.length)];
const isStatic = (ch) => ch === "." || ch === " ";

function runDecrypt() {
  const letters = [...target];
  const delays = letters.map(
    (_, i) => 3 + i * 4 + Math.floor(Math.random() * 4),
  );
  const last = Math.max(...delays);
  let frame = 0;

  const timer = setInterval(() => {
    document.title = letters
      .map((ch, i) => (isStatic(ch) || frame >= delays[i] ? ch : noiseChar()))
      .join("");

    if (frame++ > last) {
      clearInterval(timer);
      idle();
    }
  }, FRAME_MS);
}

function idle() {
  document.title = target;
  let start = Date.now();

  const timer = setInterval(() => {
    if (document.hasFocus()) {
      start = Date.now();
      const dotsOn = !BLINK_MS || Math.floor(Date.now() / BLINK_MS) % 2 === 0;
      document.title = dotsOn ? target : target.replaceAll(".", " ");
      return;
    }

    if (Date.now() - start > PAUSE_MS) {
      clearInterval(timer);
      runDecrypt();
      return;
    }

    if (Math.random() < GLITCH_CHANCE) {
      const letters = [...target];
      const i = Math.floor(Math.random() * letters.length);
      if (!isStatic(letters[i])) letters[i] = noiseChar();
      document.title = letters.join("");
    } else {
      document.title = target;
    }
  }, FRAME_MS);
}

runDecrypt();
