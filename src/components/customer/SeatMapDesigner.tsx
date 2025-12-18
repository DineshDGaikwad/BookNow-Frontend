import React, { useState, useCallback } from 'react';
import { Plus, Trash2, RotateCcw, Save } from 'lucide-react';
import { Button } from '../ui/button';

interface SeatElement {
  id: string;
  type: 'seat' | 'aisle' | 'stage' | 'entrance';
  x: number;
  y: number;
  width: number;
  height: number;
  category?: string;
  label?: string;
}

interface SeatMapDesignerProps {
  onSave: (layout: SeatElement[]) => void;
  initialLayout?: SeatElement[];
}

export const SeatMapDesigner: React.FC<SeatMapDesignerProps> = ({
  onSave,
  initialLayout = []
}) => {
  const [elements, setElements] = useState<SeatElement[]>(initialLayout);
  const [selectedTool, setSelectedTool] = useState<string>('seat');
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [gridSize] = useState(20);

  const tools = [
    { id: 'seat', label: 'Seat', color: 'bg-blue-500' },
    { id: 'aisle', label: 'Aisle', color: 'bg-gray-300' },
    { id: 'stage', label: 'Stage', color: 'bg-purple-500' },
    { id: 'entrance', label: 'Entrance', color: 'bg-green-500' }
  ];

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (draggedElement) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / gridSize) * gridSize;
    const y = Math.floor((event.clientY - rect.top) / gridSize) * gridSize;

    const newElement: SeatElement = {
      id: `${selectedTool}_${Date.now()}`,
      type: selectedTool as SeatElement['type'],
      x,
      y,
      width: selectedTool === 'seat' ? gridSize : gridSize * 2,
      height: gridSize,
      category: selectedTool === 'seat' ? 'Standard' : undefined,
      label: selectedTool === 'seat' ? `S${elements.filter(e => e.type === 'seat').length + 1}` : selectedTool
    };

    setElements(prev => [...prev, newElement]);
  }, [selectedTool, gridSize, elements, draggedElement]);

  const handleMouseDown = (elementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setDraggedElement(elementId);
  };

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!draggedElement) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / gridSize) * gridSize;
    const y = Math.floor((event.clientY - rect.top) / gridSize) * gridSize;

    setElements(prev => prev.map(el => 
      el.id === draggedElement ? { ...el, x, y } : el
    ));
  }, [draggedElement, gridSize]);

  const handleMouseUp = () => {
    setDraggedElement(null);
  };

  const handleElementDelete = (elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
  };

  const clearCanvas = () => {
    setElements([]);
  };

  const saveLayout = () => {
    onSave(elements);
  };

  const getElementStyle = (element: SeatElement) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      border: '1px solid #ccc',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '10px',
      fontWeight: 'bold',
      cursor: 'move',
      userSelect: 'none' as const
    };

    const typeStyles = {
      seat: { backgroundColor: '#3b82f6', color: 'white' },
      aisle: { backgroundColor: '#e5e7eb', color: '#374151' },
      stage: { backgroundColor: '#8b5cf6', color: 'white' },
      entrance: { backgroundColor: '#10b981', color: 'white' }
    };

    return { ...baseStyle, ...typeStyles[element.type] };
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Seat Map Designer</h2>
        <div className="flex space-x-2">
          <Button onClick={clearCanvas} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Button onClick={saveLayout} size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save Layout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <h3 className="font-medium mb-3">Tools</h3>
          <div className="space-y-2">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`w-full p-3 rounded-lg border-2 transition-all ${
                  selectedTool === tool.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded ${tool.color}`}></div>
                  <span className="text-sm font-medium">{tool.label}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-3">Elements ({elements.length})</h3>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {elements.map(element => (
                <div
                  key={element.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                >
                  <span>{element.label || element.type}</span>
                  <button
                    onClick={() => handleElementDelete(element.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div
            className="relative border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 min-h-[500px] overflow-hidden"
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
              backgroundImage: `radial-gradient(circle, #ccc 1px, transparent 1px)`,
              backgroundSize: `${gridSize}px ${gridSize}px`
            }}
          >
            {elements.map((element) => (
              <div
                key={element.id}
                style={getElementStyle(element)}
                onMouseDown={(e) => handleMouseDown(element.id, e)}
              >
                {element.label}
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>Click on the canvas to add elements. Drag elements to reposition them.</p>
            <p>Grid size: {gridSize}px</p>
          </div>
        </div>
      </div>
    </div>
  );
};