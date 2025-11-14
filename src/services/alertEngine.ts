// Smart Alert Engine
// Real-time monitoring with notifications

export interface Alert {
  id: string;
  symbol: string;
  type: 'price' | 'indicator' | 'volume' | 'pattern';
  condition: AlertCondition;
  message: string;
  isActive: boolean;
  triggered: boolean;
  triggeredAt?: Date;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  notifications: NotificationMethod[];
}

export interface MarketData {
    price: number;
    volume: number;
}

export interface MarketDataManager {
    getRealTimeQuote(symbol: string): Promise<MarketData | null>;
}

export interface IndicatorManager {
    calculateRSI(symbol: string): number[] | undefined;
    calculateMACD(symbol: string): { macd: number[] } | undefined;
}

export interface AlertCondition {
  field: string; // 'price', 'rsi', 'macd', 'volume', etc.
  operator: 'above' | 'below' | 'crosses_above' | 'crosses_below' | 'equals' | 'between';
  value: number | number[];
  timeframe?: string;
}

export interface NotificationMethod {
  type: 'browser' | 'email' | 'sms' | 'webhook' | 'sound';
  config: NotificationConfig;
  enabled: boolean;
}

export interface NotificationConfig {
  email?: string;
  phone?: string;
  webhookUrl?: string;
  soundFile?: string;
  priority?: number;
}

export interface AlertStats {
  totalAlerts: number;
  activeAlerts: number;
  triggeredToday: number;
  successRate: number;
}

export class SmartAlertEngine {
  private alerts: Alert[] = [];
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private marketData: MarketDataManager;
  private indicators: IndicatorManager;
  private subscribers: ((alert: Alert) => void)[] = [];

  constructor(marketDataManager: MarketDataManager, indicatorManager: IndicatorManager) {
    this.marketData = marketDataManager;
    this.indicators = indicatorManager;
    this.requestNotificationPermission();
  }

  // Notification Permission
  private async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  // Alert Management
  createAlert(alertData: Omit<Alert, 'id' | 'triggered' | 'createdAt'>): string {
    const alert: Alert = {
      ...alertData,
      id: this.generateId(),
      triggered: false,
      createdAt: new Date()
    };

    this.alerts.push(alert);
    this.saveAlerts();
    
    if (!this.isMonitoring) {
      this.startMonitoring();
    }

    return alert.id;
  }

  updateAlert(id: string, updates: Partial<Alert>): boolean {
    const index = this.alerts.findIndex(a => a.id === id);
    if (index === -1) return false;

    this.alerts[index] = { ...this.alerts[index], ...updates };
    this.saveAlerts();
    return true;
  }

  deleteAlert(id: string): boolean {
    const initialLength = this.alerts.length;
    this.alerts = this.alerts.filter(a => a.id !== id);
    this.saveAlerts();
    return this.alerts.length < initialLength;
  }

  toggleAlert(id: string): boolean {
    const alert = this.alerts.find(a => a.id === id);
    if (!alert) return false;

    alert.isActive = !alert.isActive;
    this.saveAlerts();
    return true;
  }

  getAlerts(): Alert[] {
    return [...this.alerts];
  }

  getActiveAlerts(): Alert[] {
    return this.alerts.filter(a => a.isActive && !a.triggered);
  }

  getTriggeredAlerts(): Alert[] {
    return this.alerts.filter(a => a.triggered);
  }

  // Monitoring Engine
  startMonitoring() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.checkAlerts();
    }, 5000); // Check every 5 seconds

    console.log('📢 Smart Alert Engine started monitoring');
  }

  stopMonitoring() {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    console.log('📢 Smart Alert Engine stopped monitoring');
  }

  private async checkAlerts() {
    const activeAlerts = this.getActiveAlerts();
    
    for (const alert of activeAlerts) {
      try {
        const shouldTrigger = await this.evaluateAlert(alert);
        if (shouldTrigger) {
          this.triggerAlert(alert);
        }
      } catch (error) {
        console.error(`Error checking alert ${alert.id}:`, error);
      }
    }
  }

  private async evaluateAlert(alert: Alert): Promise<boolean> {
    const { symbol, condition } = alert;
    
    try {
      // Get current market data
      const currentData = await this.marketData.getRealTimeQuote(symbol);
      if (!currentData) return false;

      let currentValue: number;

      // Determine what value to check
      switch (condition.field) {
        case 'price': {
          currentValue = currentData.price;
          break;
        }
        case 'volume': {
          currentValue = currentData.volume;
          break;
        }
        case 'rsi': {
          const rsi = this.indicators.calculateRSI(symbol);
          currentValue = rsi?.[rsi.length - 1] || 0;
          break;
        }
        case 'macd': {
          const macd = this.indicators.calculateMACD(symbol);
          currentValue = macd?.macd?.[macd.macd.length - 1] || 0;
          break;
        }
        default:
          return false;
      }

      // Evaluate condition
      return this.evaluateCondition(currentValue, condition);
    } catch (error) {
      console.error(`Error evaluating alert for ${symbol}:`, error);
      return false;
    }
  }

  private evaluateCondition(currentValue: number, condition: AlertCondition): boolean {
    const { operator, value } = condition;

    switch (operator) {
      case 'above': {
        return currentValue > (value as number);
      }
      case 'below': {
        return currentValue < (value as number);
      }
      case 'equals': {
        return Math.abs(currentValue - (value as number)) < 0.01;
      }
      case 'between': {
        const [min, max] = value as number[];
        return currentValue >= min && currentValue <= max;
      }
      case 'crosses_above': {
        // Would need historical data for proper implementation
        return currentValue > (value as number);
      }
      case 'crosses_below': {
        // Would need historical data for proper implementation
        return currentValue < (value as number);
      }
      default:
        return false;
    }
  }

  private async triggerAlert(alert: Alert) {
    alert.triggered = true;
    alert.triggeredAt = new Date();

    console.log(`🔔 Alert triggered: ${alert.message}`);

    // Send notifications
    for (const notification of alert.notifications) {
      if (notification.enabled) {
        await this.sendNotification(alert, notification);
      }
    }

    // Notify subscribers
    this.subscribers.forEach(callback => callback(alert));

    this.saveAlerts();
  }

  private async sendNotification(alert: Alert, notification: NotificationMethod) {
    try {
      switch (notification.type) {
        case 'browser':
          this.sendBrowserNotification(alert);
          break;
        case 'email':
          await this.sendEmailNotification(alert, notification.config);
          break;
        case 'sms':
          await this.sendSMSNotification(alert, notification.config);
          break;
        case 'webhook':
          await this.sendWebhookNotification(alert, notification.config);
          break;
        case 'sound':
          this.playSoundNotification(notification.config);
          break;
      }
    } catch (error) {
      console.error(`Failed to send ${notification.type} notification:`, error);
    }
  }

  private sendBrowserNotification(alert: Alert) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(`Alert: ${alert.symbol}`, {
        body: alert.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: alert.id,
        requireInteraction: alert.priority === 'critical'
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-close after 10 seconds unless critical
      if (alert.priority !== 'critical') {
        setTimeout(() => notification.close(), 10000);
      }
    }
  }

  private async sendEmailNotification(alert: Alert, config: NotificationConfig) {
    // In a real app, this would connect to an email service
    console.log(`📧 Email notification sent to ${config.email}: ${alert.message}`);
    
    // Simulate email API call
    const emailData = {
      to: config.email,
      subject: `Trading Alert: ${alert.symbol}`,
      body: `
        Alert Details:
        Symbol: ${alert.symbol}
        Message: ${alert.message}
        Triggered: ${alert.triggeredAt}
        Priority: ${alert.priority}
      `
    };

    // Would make actual API call here
    return Promise.resolve(emailData);
  }

  private async sendSMSNotification(alert: Alert, config: NotificationConfig) {
    // In a real app, this would connect to an SMS service like Twilio
    console.log(`📱 SMS notification sent to ${config.phone}: ${alert.message}`);
    
    const smsData = {
      to: config.phone,
      message: `Trading Alert: ${alert.symbol} - ${alert.message}`
    };

    return Promise.resolve(smsData);
  }

  private async sendWebhookNotification(alert: Alert, config: NotificationConfig) {
    if (!config.webhookUrl) return;

    const payload = {
      alert_id: alert.id,
      symbol: alert.symbol,
      message: alert.message,
      priority: alert.priority,
      triggered_at: alert.triggeredAt,
      type: alert.type
    };

    try {
      const response = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.statusText}`);
      }

      console.log(`🔗 Webhook notification sent: ${config.webhookUrl}`);
    } catch (error) {
      console.error('Webhook notification failed:', error);
    }
  }

  private playSoundNotification(config: NotificationConfig) {
    try {
      const audio = new Audio(config.soundFile || '/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(error => {
        console.error('Sound notification failed:', error);
      });
      console.log('🔊 Sound notification played');
    } catch (error) {
      console.error('Sound notification failed:', error);
    }
  }

  // Smart Alert Templates
  createPriceAlert(symbol: string, targetPrice: number, direction: 'above' | 'below'): string {
    return this.createAlert({
      symbol,
      type: 'price',
      condition: {
        field: 'price',
        operator: direction,
        value: targetPrice
      },
      message: `${symbol} price ${direction} $${targetPrice}`,
      isActive: true,
      priority: 'medium',
      notifications: [
        { type: 'browser', config: {}, enabled: true },
        { type: 'sound', config: {}, enabled: true }
      ]
    });
  }

  createRSIAlert(symbol: string, level: number, condition: 'overbought' | 'oversold'): string {
    const operator = condition === 'overbought' ? 'above' : 'below';
    const threshold = condition === 'overbought' ? 70 : 30;

    return this.createAlert({
      symbol,
      type: 'indicator',
      condition: {
        field: 'rsi',
        operator,
        value: level || threshold
      },
      message: `${symbol} RSI ${condition} (${level || threshold})`,
      isActive: true,
      priority: 'medium',
      notifications: [
        { type: 'browser', config: {}, enabled: true }
      ]
    });
  }

  createVolumeAlert(symbol: string, volumeThreshold: number): string {
    return this.createAlert({
      symbol,
      type: 'volume',
      condition: {
        field: 'volume',
        operator: 'above',
        value: volumeThreshold
      },
      message: `${symbol} unusual volume: ${volumeThreshold}+`,
      isActive: true,
      priority: 'high',
      notifications: [
        { type: 'browser', config: {}, enabled: true }
      ]
    });
  }

  // Statistics
  getAlertStats(): AlertStats {
    const total = this.alerts.length;
    const active = this.alerts.filter(a => a.isActive && !a.triggered).length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const triggeredToday = this.alerts.filter(a => 
      a.triggered && a.triggeredAt && a.triggeredAt >= today
    ).length;

    const totalTriggered = this.alerts.filter(a => a.triggered).length;
    const successRate = total > 0 ? (totalTriggered / total) * 100 : 0;

    return {
      totalAlerts: total,
      activeAlerts: active,
      triggeredToday,
      successRate: Math.round(successRate)
    };
  }

  // Event Subscription
  subscribe(callback: (alert: Alert) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // Persistence
  private saveAlerts() {
    try {
      localStorage.setItem('quantum-alerts', JSON.stringify(this.alerts));
    } catch (error) {
      console.error('Failed to save alerts:', error);
    }
  }

  loadAlerts() {
    try {
      const saved = localStorage.getItem('quantum-alerts');
      if (saved) {
        const parsedAlerts = JSON.parse(saved) as Array<Alert & { createdAt: string; triggeredAt?: string }>;
        this.alerts = parsedAlerts.map((alert) => ({
          ...alert,
          createdAt: new Date(alert.createdAt),
          triggeredAt: alert.triggeredAt ? new Date(alert.triggeredAt) : undefined
        }));
      }
    } catch (error) {
      console.error('Failed to load alerts:', error);
    }
  }

  // Utility
  private generateId(): string {
    return `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Clean up
  destroy() {
    this.stopMonitoring();
    this.subscribers = [];
  }
}

export default SmartAlertEngine;