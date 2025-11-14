import React, { useState, useEffect } from 'react';
import SmartAlertEngine, { Alert, AlertStats } from '../services/alertEngine';

interface AlertUIProps {
  alertEngine: SmartAlertEngine | null;
}

const AlertUI: React.FC<AlertUIProps> = ({ alertEngine }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<AlertStats>({ totalAlerts: 0, activeAlerts: 0, triggeredToday: 0, successRate: 0 });
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlert, setNewAlert] = useState<{
    symbol: string;
    type: 'price' | 'indicator' | 'volume' | 'pattern';
    field: string;
    operator: 'above' | 'below' | 'crosses_above' | 'crosses_below' | 'equals' | 'between';
    value: number;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
  }>({
    symbol: 'AAPL',
    type: 'price',
    field: 'price',
    operator: 'above',
    value: 150,
    message: '',
    priority: 'medium'
  });

  useEffect(() => {
    const updateAlertsCallback = () => {
      if (alertEngine) {
        setAlerts(alertEngine.getAlerts());
      }
    };

    const updateStatsCallback = () => {
      if (alertEngine) {
        setStats(alertEngine.getAlertStats());
      }
    };

    if (alertEngine) {
      // Load initial data
      updateAlertsCallback();
      updateStatsCallback();

      // Subscribe to alert triggers
      const unsubscribe = alertEngine.subscribe((alert) => {
        console.log('Alert triggered:', alert);
        updateAlertsCallback();
        updateStatsCallback();
      });

      return unsubscribe;
    }
  }, [alertEngine]);

  const updateAlerts = () => {
    if (alertEngine) {
      setAlerts(alertEngine.getAlerts());
    }
  };

  const updateStats = () => {
    if (alertEngine) {
      setStats(alertEngine.getAlertStats());
    }
  };

  const handleCreateAlert = () => {
    if (!alertEngine) return;

    const alertData = {
      symbol: newAlert.symbol,
      type: newAlert.type,
      condition: {
        field: newAlert.field,
        operator: newAlert.operator,
        value: newAlert.value
      },
      message: newAlert.message || `${newAlert.symbol} ${newAlert.operator} ${newAlert.value}`,
      isActive: true,
      priority: newAlert.priority,
      notifications: [
        { type: 'browser' as const, config: {}, enabled: true },
        { type: 'sound' as const, config: {}, enabled: true }
      ]
    };

    alertEngine.createAlert(alertData);
    updateAlerts();
    updateStats();
    setShowCreateForm(false);
    
    // Reset form
    setNewAlert({
      symbol: 'AAPL',
      type: 'price',
      field: 'price',
      operator: 'above',
      value: 150,
      message: '',
      priority: 'medium'
    });
  };

  const handleToggleAlert = (id: string) => {
    if (!alertEngine) return;
    alertEngine.toggleAlert(id);
    updateAlerts();
    updateStats();
  };

  const handleDeleteAlert = (id: string) => {
    if (!alertEngine) return;
    alertEngine.deleteAlert(id);
    updateAlerts();
    updateStats();
  };

  const createQuickAlert = (type: 'price' | 'rsi') => {
    if (!alertEngine) return;

    if (type === 'price') {
      alertEngine.createPriceAlert('AAPL', 200, 'above');
    } else if (type === 'rsi') {
      alertEngine.createRSIAlert('AAPL', 70, 'overbought');
    }

    updateAlerts();
    updateStats();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-900/20';
      case 'high': return 'text-orange-400 bg-orange-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'low': return 'text-green-400 bg-green-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusColor = (alert: Alert) => {
    if (alert.triggered) return 'text-red-400';
    if (alert.isActive) return 'text-green-400';
    return 'text-gray-400';
  };

  return (
    <div className="fixed right-4 top-20 z-50">
      {/* Main Alert Panel */}
      <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-700 min-w-80">
        {/* Header */}
        <div 
          className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-t-lg cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium">🔔 Smart Alerts</span>
            {stats.activeAlerts > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {stats.activeAlerts}
              </span>
            )}
          </div>
          <button className="text-white hover:text-gray-200">
            {isExpanded ? '−' : '+'}
          </button>
        </div>

        {isExpanded && (
          <div className="p-4">
            {/* Alert Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
                <div className="text-xs text-gray-400">Total Alerts</div>
                <div className="text-lg font-bold text-white">{stats.totalAlerts}</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
                <div className="text-xs text-gray-400">Active</div>
                <div className="text-lg font-bold text-green-400">{stats.activeAlerts}</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
                <div className="text-xs text-gray-400">Triggered Today</div>
                <div className="text-lg font-bold text-orange-400">{stats.triggeredToday}</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
                <div className="text-xs text-gray-400">Success Rate</div>
                <div className="text-lg font-bold text-cyan-400">{stats.successRate}%</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Quick Alerts</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => createQuickAlert('price')}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                >
                  💰 Price Alert
                </button>
                <button
                  onClick={() => createQuickAlert('rsi')}
                  className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                >
                  📊 RSI Alert
                </button>
              </div>
            </div>

            {/* Create Alert Button */}
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="w-full mb-4 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium"
            >
              {showCreateForm ? '✕ Cancel' : '+ Create Custom Alert'}
            </button>

            {/* Create Alert Form */}
            {showCreateForm && (
              <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-600 space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Symbol</label>
                  <input
                    type="text"
                    value={newAlert.symbol}
                    onChange={(e) => setNewAlert({...newAlert, symbol: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-cyan-400 focus:outline-none text-sm"
                    placeholder="e.g., AAPL"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Field</label>
                    <select
                      value={newAlert.field}
                      onChange={(e) => setNewAlert({...newAlert, field: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-cyan-400 focus:outline-none text-sm"
                      title="Select field to monitor"
                    >
                      <option value="price">Price</option>
                      <option value="rsi">RSI</option>
                      <option value="volume">Volume</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Condition</label>
                    <select
                      value={newAlert.operator}
                      onChange={(e) => setNewAlert({...newAlert, operator: e.target.value as 'above' | 'below' | 'crosses_above' | 'crosses_below'})}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-cyan-400 focus:outline-none text-sm"
                      title="Select condition operator"
                    >
                      <option value="above">Above</option>
                      <option value="below">Below</option>
                      <option value="crosses_above">Crosses Above</option>
                      <option value="crosses_below">Crosses Below</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Value</label>
                    <input
                      type="number"
                      value={newAlert.value}
                      onChange={(e) => setNewAlert({...newAlert, value: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-cyan-400 focus:outline-none text-sm"
                      step="0.01"
                      title="Alert trigger value"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Priority</label>
                    <select
                      value={newAlert.priority}
                      onChange={(e) => setNewAlert({...newAlert, priority: e.target.value as 'low' | 'medium' | 'high' | 'critical'})}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-cyan-400 focus:outline-none text-sm"
                      title="Alert priority level"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Custom Message (optional)</label>
                  <input
                    type="text"
                    value={newAlert.message}
                    onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-cyan-400 focus:outline-none text-sm"
                    placeholder="Alert message..."
                  />
                </div>

                <button
                  onClick={handleCreateAlert}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                >
                  Create Alert
                </button>
              </div>
            )}

            {/* Active Alerts List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Active Alerts ({alerts.length})</h4>
              
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-2xl mb-2">🔕</div>
                  <p className="text-sm">No alerts configured</p>
                  <p className="text-xs">Create your first alert above</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`
                      p-3 rounded-lg border transition-all duration-200
                      ${alert.triggered
                        ? 'border-red-500 bg-red-900/20'
                        : alert.isActive
                        ? 'border-green-500 bg-green-900/10'
                        : 'border-gray-600 bg-gray-800'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-white">{alert.symbol}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(alert.priority)}`}>
                            {alert.priority}
                          </span>
                          <span className={`text-xs ${getStatusColor(alert)}`}>
                            {alert.triggered ? '🔴 Triggered' : alert.isActive ? '🟢 Active' : '⚪ Inactive'}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-300 mb-1">{alert.message}</p>
                        
                        <div className="text-xs text-gray-400">
                          {alert.condition.field} {alert.condition.operator} {alert.condition.value}
                          {alert.triggeredAt && (
                            <span className="ml-2">• Triggered: {alert.triggeredAt.toLocaleTimeString()}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-1 ml-2">
                        <button
                          onClick={() => handleToggleAlert(alert.id)}
                          className={`
                            px-2 py-1 rounded text-xs transition-colors
                            ${alert.isActive
                              ? 'bg-orange-600 hover:bg-orange-700 text-white'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                            }
                          `}
                        >
                          {alert.isActive ? 'Pause' : 'Resume'}
                        </button>
                        
                        <button
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Collapsed View - Show Active Alert Count */}
      {!isExpanded && stats.activeAlerts > 0 && (
        <div className="mt-2 bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium text-center">
          {stats.activeAlerts} Active Alert{stats.activeAlerts !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default AlertUI;