import React, { useState, useEffect } from 'react';
import DrawingToolsManager, { DRAWING_TOOLS } from '../services/drawingTools';

interface DrawingToolsUIProps {
  drawingManager: DrawingToolsManager | null;
}

const DrawingToolsUI: React.FC<DrawingToolsUIProps> = ({ drawingManager }) => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [tools, setTools] = useState(drawingManager?.getTools() || []);

  useEffect(() => {
    if (drawingManager) {
      setTools(drawingManager.getTools());
    }
  }, [drawingManager]);

  const handleToolSelect = (toolId: string) => {
    if (!drawingManager) return;

    if (activeTool === toolId) {
      // Deselect tool
      setActiveTool(null);
      drawingManager.clearActiveTool();
    } else {
      // Select new tool
      setActiveTool(toolId);
      drawingManager.setActiveTool(toolId);
    }
  };

  const handleClearAll = () => {
    if (!drawingManager) return;
    drawingManager.deleteAllTools();
    setTools([]);
  };

  const handleExport = () => {
    if (!drawingManager) return;
    const data = drawingManager.exportTools();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drawing-tools.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !drawingManager) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      drawingManager.importTools(data);
      setTools(drawingManager.getTools());
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed left-4 top-20 z-50">
      {/* Main Drawing Tools Panel */}
      <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-700 min-w-64">
        {/* Header */}
        <div 
          className="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-t-lg cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium">🎨 Drawing Tools</span>
          </div>
          <button className="text-white hover:text-gray-200">
            {isExpanded ? '−' : '+'}
          </button>
        </div>

        {isExpanded && (
          <div className="p-4">
            {/* Drawing Tools Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {DRAWING_TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolSelect(tool.id)}
                  className={`
                    flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200
                    ${activeTool === tool.id
                      ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
                      : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                    }
                  `}
                  title={tool.description}
                >
                  <span className="text-lg mb-1">{tool.icon}</span>
                  <span className="text-xs text-center font-medium">{tool.name}</span>
                </button>
              ))}
            </div>

            {/* Active Tool Info */}
            {activeTool && (
              <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-600">
                <h4 className="text-sm font-medium text-cyan-400 mb-1">Active Tool</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {DRAWING_TOOLS.find(t => t.id === activeTool)?.icon}
                  </span>
                  <span className="text-sm text-gray-300">
                    {DRAWING_TOOLS.find(t => t.id === activeTool)?.name}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {DRAWING_TOOLS.find(t => t.id === activeTool)?.description}
                </p>
                <button
                  onClick={() => handleToolSelect(activeTool)}
                  className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
                >
                  Deselect
                </button>
              </div>
            )}

            {/* Tool Management */}
            <div className="space-y-2">
              <div className="flex space-x-2">
                <button
                  onClick={handleClearAll}
                  className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                  title="Clear all drawings"
                >
                  🗑️ Clear All
                </button>
                
                <button
                  onClick={handleExport}
                  className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                  title="Export drawings"
                >
                  💾 Export
                </button>
              </div>

              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Import drawing tools"
                />
                <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                  📂 Import
                </button>
              </div>
            </div>

            {/* Drawing Count */}
            <div className="mt-4 pt-3 border-t border-gray-600">
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Total Drawings:</span>
                <span className="font-medium text-cyan-400">{tools.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Access Toolbar (when collapsed) */}
      {!isExpanded && (
        <div className="mt-2 flex flex-col space-y-1">
          {DRAWING_TOOLS.slice(0, 4).map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolSelect(tool.id)}
              className={`
                w-12 h-12 rounded-lg border-2 transition-all duration-200 flex items-center justify-center
                ${activeTool === tool.id
                  ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
                  : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                }
              `}
              title={tool.description}
            >
              <span className="text-lg">{tool.icon}</span>
            </button>
          ))}
        </div>
      )}

      {/* Instructions */}
      {activeTool && (
        <div className="mt-2 bg-gray-900 rounded-lg border border-gray-700 p-3">
          <h4 className="text-xs font-medium text-cyan-400 mb-2">Instructions</h4>
          <div className="text-xs text-gray-300 space-y-1">
            {activeTool === 'trendline' && (
              <>
                <p>• Click and drag to draw trend line</p>
                <p>• Line extends automatically</p>
              </>
            )}
            {activeTool === 'horizontal' && (
              <>
                <p>• Click to place horizontal line</p>
                <p>• Spans entire chart width</p>
              </>
            )}
            {activeTool === 'vertical' && (
              <>
                <p>• Click to place vertical line</p>
                <p>• Spans entire chart height</p>
              </>
            )}
            {activeTool === 'rectangle' && (
              <>
                <p>• Click and drag to draw rectangle</p>
                <p>• Useful for price ranges</p>
              </>
            )}
            {activeTool === 'fibonacci' && (
              <>
                <p>• Click and drag from low to high</p>
                <p>• Shows retracement levels</p>
              </>
            )}
            {activeTool === 'text' && (
              <>
                <p>• Click to place text annotation</p>
                <p>• Enter text in the prompt</p>
              </>
            )}
            {activeTool === 'arrow' && (
              <>
                <p>• Click and drag to draw arrow</p>
                <p>• Points to important areas</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawingToolsUI;