interface AnimationOptions {
  duration: number;
  baseColor?: string;
}

class CircleManager {
  private ctx!: CanvasRenderingContext2D;
  private containerSize: number = 0;
  private currentAnimationId?: number;
  private static instance: CircleManager | null = null;
  private baseColor: string = "#9333EA";
  private readonly LINE_WIDTH = 2;
  private startTime: number = 0;
  private totalDuration: number = 0;

  private constructor() {}

  public static getInstance(): CircleManager {
    if (!CircleManager.instance) {
      CircleManager.instance = new CircleManager();
    }
    return CircleManager.instance;
  }

  public initializeContext(ctx: CanvasRenderingContext2D, containerSize: number) {
    this.ctx = ctx;
    this.containerSize = containerSize;
    this.ctx.lineCap = "round";
    this.drawBaseCircle();
  }

  private getCircleCenter(): { x: number; y: number } {
    return {
      x: this.containerSize / 2,
      y: this.containerSize / 2
    };
  }

  private getCircleRadius(): number {
    return (this.containerSize / 2) - (this.LINE_WIDTH * 2);
  }

  private drawBaseCircle() {
    if (!this.ctx) return;
    const { x, y } = this.getCircleCenter();
    const radius = this.getCircleRadius();

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = `${this.baseColor}22`;
    this.ctx.lineWidth = this.LINE_WIDTH;
    this.ctx.stroke();
  }

  private drawProgressArc(progress: number) {
    if (!this.ctx) return;
    const { x, y } = this.getCircleCenter();
    const radius = this.getCircleRadius();

    // Arc de progression
    this.ctx.beginPath();
    this.ctx.arc(
      x,
      y,
      radius,
      -Math.PI / 2,
      -Math.PI / 2 + (2 * Math.PI * progress)
    );
    this.ctx.strokeStyle = this.baseColor;
    this.ctx.lineWidth = this.LINE_WIDTH;
    this.ctx.stroke();

    // Point en mouvement
    if (progress > 0) {
      const angle = -Math.PI / 2 + (2 * Math.PI * progress);
      const pointX = x + Math.cos(angle) * radius;
      const pointY = y + Math.sin(angle) * radius;
      
      this.ctx.beginPath();
      this.ctx.arc(pointX, pointY, this.LINE_WIDTH * 1.5, 0, Math.PI * 2);
      this.ctx.fillStyle = this.baseColor;
      this.ctx.fill();
    }
  }

  private clearCanvas() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.containerSize, this.containerSize);
  }

  public animate(options: AnimationOptions) {
    if (!this.ctx) return;
    
    this.stopAnimation();
    this.baseColor = options.baseColor || this.baseColor;
    this.totalDuration = options.duration;
    this.startTime = performance.now();
    
    const animate = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - this.startTime;
      const progress = Math.min(1 - (elapsed / this.totalDuration), 1);
      
      // Clear et redessiner en une seule fois
      this.clearCanvas();
      this.drawBaseCircle();
      this.drawProgressArc(1 - progress);
      
      if (progress > 0) {
        this.currentAnimationId = requestAnimationFrame(animate);
      }
    };
    
    this.currentAnimationId = requestAnimationFrame(animate);
  }

  public stopAnimation() {
    if (this.currentAnimationId) {
      cancelAnimationFrame(this.currentAnimationId);
      this.currentAnimationId = undefined;
    }
  }
}

export default CircleManager.getInstance();