import { qs } from "@/router/page-loader";

interface ParticleOptions {
  x: number;
  y: number;
  angle: number;
  speed: number;
  accel: number;
}

class Particle {
  private x: number;
  private y: number;
  private angle: number;
  private speed: number;
  private accel: number;
  private radius: number;
  private decay: number;
  private life: number;

  constructor(opt: ParticleOptions) {
    this.x = opt.x;
    this.y = opt.y;
    this.angle = opt.angle;
    this.speed = opt.speed;
    this.accel = opt.accel;
    this.radius = 7;
    this.decay = 0.01;
    this.life = 1;
  }

  step(i: number, particles: Particle[]): void {
    this.speed += this.accel;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.angle += Math.PI / 64;
    this.accel *= 1.01;
    this.life -= this.decay;

    if (this.life <= 0) {
      particles.splice(i, 1);
    }
  }

  draw(
    i: number,
    ctx: CanvasRenderingContext2D,
    particles: Particle[],
    tick: number
  ): void {
    // Utilisation de couleurs violet/bleu
    const hue = this.life > 0.5 ? 260 : 230; // Alterne entre violet (260) et bleu (230)
    ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${this.life})`;
    ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${this.life})`;
    
    ctx.beginPath();
    if (particles[i - 1]) {
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(particles[i - 1].x, particles[i - 1].y);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(
      this.x,
      this.y,
      Math.max(0.001, this.life * this.radius),
      0,
      Math.PI * 2
    );
    ctx.fill();

    const size: number = Math.random() * 1.25;
    ctx.fillRect(
      ~~(this.x + (Math.random() - 0.5) * 35 * this.life),
      ~~(this.y + (Math.random() - 0.5) * 35 * this.life),
      size,
      size
    );
  }
}

const ParticleSystem = {
  private: {
    container: null as HTMLElement | null,
    canvas: null as HTMLCanvasElement | null,
    ctx: null as CanvasRenderingContext2D | null,
    width: 0,
    height: 0,
    min: 0,
    particles: [] as Particle[],
    globalAngle: 0,
    tick: 0,
    now: 0,
    frameDiff: 0,
    lastFrame: 0,
    resizeObserver: null as ResizeObserver | null,
    animationFrameId: 0,
    isRunning: false,
    isInitialized: false,
    currentTimer: 5,
    externalTimer: null as number | null
  },

  init() {
    const p = this.private;
    p.container = qs("game.gameSpace") as HTMLElement;
    p.canvas = qs("game.loadingWaiting") as HTMLCanvasElement;
    
    if (!p.container || !p.canvas) {
      console.error("Container or canvas not found");
      return false;
    }

    // Ne pas ajouter le canvas car il existe déjà
    // Et ne pas définir ses classes car elles sont déjà définies

    p.isInitialized = true;
    return true;
  },

  setup() {
    const p = this.private;
    if (!p.isInitialized || !p.canvas || !p.container) return false;

    p.width = p.container.clientWidth;
    p.height = p.container.clientHeight;
    p.min = Math.min(p.width, p.height) * 0.5;

    p.canvas.width = p.width * window.devicePixelRatio;
    p.canvas.height = p.height * window.devicePixelRatio;
    p.canvas.style.width = "100%";
    p.canvas.style.height = "100%";

    p.ctx = p.canvas.getContext("2d")!;
    p.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    p.ctx.globalCompositeOperation = "lighter";

    this.setupResizeObserver();
    return true;
  },

  setupResizeObserver() {
    const p = this.private;
    p.resizeObserver = new ResizeObserver(() => {
      if (!p.container || !p.canvas || !p.ctx) return;
      
      p.width = p.container.clientWidth;
      p.height = p.container.clientHeight;
      p.canvas.width = p.width * window.devicePixelRatio;
      p.canvas.height = p.height * window.devicePixelRatio;
      p.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      p.ctx.globalCompositeOperation = "lighter";
    });

    if (p.container) {
      p.resizeObserver.observe(p.container);
    }
  },

  updateTimer(value: number) {
    const p = this.private;
    p.currentTimer = value;
  },

  start() {
    const p = this.private;
    if (!p.isInitialized) {
      console.error("ParticleSystem must be initialized before starting");
      return;
    }
    if (!p.isRunning && this.setup()) {
      p.isRunning = true;
      this.loop();
    }
  },

  stop() {
    const p = this.private;
    p.isRunning = false;
    if (p.animationFrameId) {
      cancelAnimationFrame(p.animationFrameId);
    }
  },

  clear() {
    const p = this.private;
    p.particles = [];
    if (p.ctx) {
      p.ctx.clearRect(0, 0, p.width, p.height);
    }
  },

  drawTimer() {
    const p = this.private;
    if (!p.ctx) return;

    // Configuration du style du texte
    p.ctx.font = "bold 48px Arial";
    p.ctx.textAlign = "center";
    p.ctx.textBaseline = "middle";

    // Effet de glow
    p.ctx.shadowBlur = 20;
    p.ctx.shadowColor = "#8B5CF6"; // Violet-500

    // Dégradé du texte
    const gradient = p.ctx.createLinearGradient(
      p.width / 2 - 25,
      p.height / 2 - 25,
      p.width / 2 + 25,
      p.height / 2 + 25
    );
    gradient.addColorStop(0, "#8B5CF6"); // Violet-500
    gradient.addColorStop(1, "#3B82F6"); // Bleu-500
    
    p.ctx.fillStyle = gradient;

    // Dessiner le nombre
    if (p.currentTimer >= 0) {
      p.ctx.fillText(p.currentTimer.toString(), p.width / 2, p.height / 2);
    }

    // Réinitialiser les effets
    p.ctx.shadowBlur = 0;
  },

  step() {
    const p = this.private;
    if (!p.ctx) return;

    p.particles.push(
      new Particle({
        x: p.width / 2 + (Math.cos(p.tick / 20) * p.min) / 2,
        y: p.height / 2 + (Math.sin(p.tick / 20) * p.min) / 2,
        angle: p.globalAngle,
        speed: 0,
        accel: 0.01,
      })
    );

    p.particles.forEach((particle, i) => {
      particle.step(i, p.particles);
    });

    p.globalAngle += Math.PI / 3;
  },

  draw() {
    const p = this.private;
    if (!p.ctx) return;

    p.ctx.clearRect(0, 0, p.width, p.height);
    p.particles.forEach((particle, i) => {
      particle.draw(i, p.ctx!, p.particles, p.tick);
    });
    this.drawTimer();
  },

  loop() {
    const p = this.private;
    if (!p.isRunning) return;

    p.animationFrameId = requestAnimationFrame(() => this.loop());
    p.now = Date.now();
    p.frameDiff = p.now - p.lastFrame;
    
    if (p.frameDiff >= 1000 / 60) {
      p.lastFrame = p.now;
      this.step();
      this.draw();
      p.tick++;
    }
  },

  cleanup() {
    const p = this.private;
    this.stop();
    if (p.resizeObserver) {
      p.resizeObserver.disconnect();
    }
    p.particles = [];
    p.isInitialized = false;
  }
};

export default ParticleSystem;