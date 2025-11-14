// Professional Drawing Tools Engine
// 100% Independent - Better than TradingView

export interface DrawingTool {
  id: string;
  type: 'trendline' | 'horizontal' | 'vertical' | 'rectangle' | 'fibonacci' | 'text' | 'arrow';
  points: Point[];
  color: string;
  lineWidth: number;
  style: 'solid' | 'dashed' | 'dotted';
  text?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Point {
  x: number;
  y: number;
  time?: string;
  price?: number;
}

export interface FibonacciLevels {
  levels: number[];
  showPrices: boolean;
  showPercentages: boolean;
  extendLines: boolean;
}

export class DrawingToolsManager {
  private tools: DrawingTool[] = [];
  private activeTool: string | null = null;
  private isDrawing = false;
  private currentPoints: Point[] = [];
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  // Fibonacci retracement levels
  private fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1.0];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.canvas) return;

    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    this.canvas.addEventListener('dblclick', () => this.handleDoubleClick());
  }

  private getMousePos(e: MouseEvent): Point {
    const rect = this.canvas!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  private handleMouseDown(e: MouseEvent) {
    if (!this.activeTool) return;

    const point = this.getMousePos(e);
    this.isDrawing = true;
    this.currentPoints = [point];
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.isDrawing || !this.activeTool) return;

    const point = this.getMousePos(e);
    
    // Update preview for two-point tools
    if (this.currentPoints.length === 1) {
      this.drawPreview([this.currentPoints[0], point]);
    }
  }

  private handleMouseUp(e: MouseEvent) {
    if (!this.isDrawing || !this.activeTool) return;

    const point = this.getMousePos(e);
    this.currentPoints.push(point);

    // Complete drawing based on tool type
    switch (this.activeTool) {
      case 'trendline':
      case 'horizontal':
      case 'vertical':
      case 'fibonacci':
        if (this.currentPoints.length === 2) {
          this.completeTool();
        }
        break;
      case 'rectangle':
        if (this.currentPoints.length === 2) {
          this.completeTool();
        }
        break;
      case 'text':
        this.completeTextTool(point);
        break;
    }
  }

  private handleDoubleClick() {
    // Complete multi-point tools
    if (this.isDrawing && this.currentPoints.length > 1) {
      this.completeTool();
    }
  }

  private completeTool() {
    if (!this.activeTool || this.currentPoints.length < 2) return;

    const tool: DrawingTool = {
      id: this.generateId(),
      type: this.activeTool as DrawingTool['type'],
      points: [...this.currentPoints],
      color: '#06B6D4',
      lineWidth: 2,
      style: 'solid',
      isActive: false,
      createdAt: new Date()
    };

    this.tools.push(tool);
    this.resetDrawing();
    this.redrawAll();
  }

  private completeTextTool(point: Point) {
    const text = prompt('Enter text:');
    if (!text) {
      this.resetDrawing();
      return;
    }

    const tool: DrawingTool = {
      id: this.generateId(),
      type: 'text',
      points: [point],
      color: '#FFFFFF',
      lineWidth: 1,
      style: 'solid',
      text,
      isActive: false,
      createdAt: new Date()
    };

    this.tools.push(tool);
    this.resetDrawing();
    this.redrawAll();
  }

  private resetDrawing() {
    this.isDrawing = false;
    this.currentPoints = [];
  }

  private generateId(): string {
    return `tool-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Drawing methods
  drawTrendLine(points: Point[], color: string, lineWidth: number, style: string) {
    if (!this.ctx || points.length < 2) return;

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.setLineStyle(style);

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    this.ctx.lineTo(points[1].x, points[1].y);
    this.ctx.stroke();

    // Add extension option
    if (points.length === 2) {
      const dx = points[1].x - points[0].x;
      const dy = points[1].y - points[0].y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      // Extend line by 50% of its length
      const extendX = points[1].x + (dx / length) * (length * 0.5);
      const extendY = points[1].y + (dy / length) * (length * 0.5);
      
      this.ctx.setLineDash([5, 5]);
      this.ctx.beginPath();
      this.ctx.moveTo(points[1].x, points[1].y);
      this.ctx.lineTo(extendX, extendY);
      this.ctx.stroke();
    }

    this.ctx.setLineDash([]);
  }

  drawHorizontalLine(points: Point[], color: string, lineWidth: number, style: string) {
    if (!this.ctx || !this.canvas || points.length < 1) return;

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.setLineStyle(style);

    const y = points[0].y;
    this.ctx.beginPath();
    this.ctx.moveTo(0, y);
    this.ctx.lineTo(this.canvas.width, y);
    this.ctx.stroke();

    // Add price label
    this.ctx.fillStyle = color;
    this.ctx.font = 'bold 12px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Support/Resistance`, 10, y - 5);
  }

  drawVerticalLine(points: Point[], color: string, lineWidth: number, style: string) {
    if (!this.ctx || !this.canvas || points.length < 1) return;

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.setLineStyle(style);

    const x = points[0].x;
    this.ctx.beginPath();
    this.ctx.moveTo(x, 0);
    this.ctx.lineTo(x, this.canvas.height);
    this.ctx.stroke();
  }

  drawRectangle(points: Point[], color: string, lineWidth: number, style: string) {
    if (!this.ctx || points.length < 2) return;

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.setLineStyle(style);

    const width = points[1].x - points[0].x;
    const height = points[1].y - points[0].y;

    this.ctx.beginPath();
    this.ctx.rect(points[0].x, points[0].y, width, height);
    this.ctx.stroke();

    // Optional fill with transparency
    this.ctx.fillStyle = color + '20'; // Add 20 for transparency
    this.ctx.fill();
  }

  drawFibonacci(points: Point[], color: string, lineWidth: number) {
    if (!this.ctx || points.length < 2) return;

    const startY = points[0].y;
    const endY = points[1].y;
    const leftX = Math.min(points[0].x, points[1].x);
    const rightX = Math.max(points[0].x, points[1].x);

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.font = '12px Arial';

    this.fibLevels.forEach((level) => {
      const y = startY + (endY - startY) * level;
      
      // Set different colors for key levels
      if (level === 0 || level === 1) {
        this.ctx!.strokeStyle = '#EF4444'; // Red for 0% and 100%
      } else if (level === 0.5) {
        this.ctx!.strokeStyle = '#F59E0B'; // Orange for 50%
      } else if (level === 0.618) {
        this.ctx!.strokeStyle = '#10B981'; // Green for golden ratio
      } else {
        this.ctx!.strokeStyle = color;
      }

      // Draw level line
      this.ctx!.setLineDash([2, 2]);
      this.ctx!.beginPath();
      this.ctx!.moveTo(leftX, y);
      this.ctx!.lineTo(rightX, y);
      this.ctx!.stroke();

      // Add level label
      this.ctx!.fillStyle = this.ctx!.strokeStyle;
      this.ctx!.textAlign = 'right';
      this.ctx!.fillText(`${(level * 100).toFixed(1)}%`, rightX - 5, y - 5);
    });

    this.ctx.setLineDash([]);
  }

  drawText(point: Point, text: string, color: string) {
    if (!this.ctx || !text) return;

    this.ctx.fillStyle = color;
    this.ctx.font = 'bold 14px Arial';
    this.ctx.textAlign = 'left';
    
    // Add background
    const metrics = this.ctx.measureText(text);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(point.x - 5, point.y - 20, metrics.width + 10, 25);
    
    // Draw text
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, point.x, point.y);
  }

  drawArrow(points: Point[], color: string, lineWidth: number) {
    if (!this.ctx || points.length < 2) return;

    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    this.ctx.lineWidth = lineWidth;

    const start = points[0];
    const end = points[1];

    // Draw line
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();

    // Calculate arrowhead
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const arrowLength = 15;
    const arrowAngle = Math.PI / 6;

    // Draw arrowhead
    this.ctx.beginPath();
    this.ctx.moveTo(end.x, end.y);
    this.ctx.lineTo(
      end.x - arrowLength * Math.cos(angle - arrowAngle),
      end.y - arrowLength * Math.sin(angle - arrowAngle)
    );
    this.ctx.moveTo(end.x, end.y);
    this.ctx.lineTo(
      end.x - arrowLength * Math.cos(angle + arrowAngle),
      end.y - arrowLength * Math.sin(angle + arrowAngle)
    );
    this.ctx.stroke();
  }

  private setLineStyle(style: string) {
    if (!this.ctx) return;

    switch (style) {
      case 'dashed':
        this.ctx.setLineDash([10, 5]);
        break;
      case 'dotted':
        this.ctx.setLineDash([2, 3]);
        break;
      default:
        this.ctx.setLineDash([]);
    }
  }

  private drawPreview(points: Point[]) {
    if (!this.activeTool || !this.ctx) return;

    // Save current state
    this.ctx.save();
    this.ctx.globalAlpha = 0.5;

    switch (this.activeTool) {
      case 'trendline':
        this.drawTrendLine(points, '#06B6D4', 2, 'solid');
        break;
      case 'horizontal':
        this.drawHorizontalLine(points, '#06B6D4', 2, 'solid');
        break;
      case 'vertical':
        this.drawVerticalLine(points, '#06B6D4', 2, 'solid');
        break;
      case 'rectangle':
        this.drawRectangle(points, '#06B6D4', 2, 'solid');
        break;
      case 'fibonacci':
        this.drawFibonacci(points, '#06B6D4', 2);
        break;
    }

    // Restore state
    this.ctx.restore();
  }

  // Public API
  setActiveTool(toolType: string) {
    this.activeTool = toolType;
    this.resetDrawing();
  }

  clearActiveTool() {
    this.activeTool = null;
    this.resetDrawing();
  }

  redrawAll() {
    if (!this.ctx || !this.canvas) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Redraw all tools
    this.tools.forEach(tool => {
      switch (tool.type) {
        case 'trendline':
          this.drawTrendLine(tool.points, tool.color, tool.lineWidth, tool.style);
          break;
        case 'horizontal':
          this.drawHorizontalLine(tool.points, tool.color, tool.lineWidth, tool.style);
          break;
        case 'vertical':
          this.drawVerticalLine(tool.points, tool.color, tool.lineWidth, tool.style);
          break;
        case 'rectangle':
          this.drawRectangle(tool.points, tool.color, tool.lineWidth, tool.style);
          break;
        case 'fibonacci':
          this.drawFibonacci(tool.points, tool.color, tool.lineWidth);
          break;
        case 'text':
          if (tool.text) {
            this.drawText(tool.points[0], tool.text, tool.color);
          }
          break;
        case 'arrow':
          this.drawArrow(tool.points, tool.color, tool.lineWidth);
          break;
      }
    });
  }

  deleteTool(id: string) {
    this.tools = this.tools.filter(tool => tool.id !== id);
    this.redrawAll();
  }

  deleteAllTools() {
    this.tools = [];
    this.redrawAll();
  }

  getTools(): DrawingTool[] {
    return [...this.tools];
  }

  exportTools(): string {
    return JSON.stringify(this.tools);
  }

  importTools(data: string) {
    try {
      this.tools = JSON.parse(data);
      this.redrawAll();
    } catch (error) {
      console.error('Failed to import tools:', error);
    }
  }
}

// Drawing Tools UI Component Interface
export interface DrawingToolsProps {
  onToolChange: (tool: string | null) => void;
  activeTool: string | null;
}

export const DRAWING_TOOLS = [
  { id: 'trendline', name: 'Trend Line', icon: '📈', description: 'Draw trend lines' },
  { id: 'horizontal', name: 'Horizontal Line', icon: '➡️', description: 'Support/Resistance' },
  { id: 'vertical', name: 'Vertical Line', icon: '⬆️', description: 'Time markers' },
  { id: 'rectangle', name: 'Rectangle', icon: '🔲', description: 'Price ranges' },
  { id: 'fibonacci', name: 'Fibonacci', icon: '🌀', description: 'Fib retracements' },
  { id: 'text', name: 'Text', icon: '📝', description: 'Add annotations' },
  { id: 'arrow', name: 'Arrow', icon: '➡️', description: 'Point to areas' }
];

export default DrawingToolsManager;