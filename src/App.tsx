import { useState, useEffect, useRef } from 'react'
import './App.css'
import { InputWithButton } from './components/ui/InputWithButton'
import ConsoleComponent from './components/Console/ConsoleComponent'
import { ConsoleInfo } from './components/Console/types'
import ContextMenuComponent from './components/ContextMenu/ContextMenuComponent'

function App() {
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [consoles, setConsoles] = useState<ConsoleInfo[]>([
    {
      id: 'terminal_1',
      title: 'terminal_1',
      position: { x: 50, y: 50 },
      size: { width: 600, height: 400 },
      visible: true,
    },
    {
      id: 'terminal_2',
      title: 'terminal_2',
      position: { x: 650, y: 150 },
      size: { width: 500, height: 350 },
      visible: true,
    }
  ]);
  
  function onCommand(command: string) {
    console.log("Command received:", command)
  }

  const handleContextMenu = (event: React.MouseEvent) => {
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
  }

  const handleCloseConsole = (consoleId: string) => {
    setConsoles(prevConsoles => 
      prevConsoles.map(console => 
        console.id === consoleId 
          ? { ...console, visible: false } 
          : console
      )
    );
  };

  const handleCreateConsole = () => {
    // Generate a unique ID
    const newId = `terminal_${consoles.length + 1}`;
    
    // Create a new console at a random position
    const newConsole: ConsoleInfo = {
      id: newId,
      title: `terminal_${newId}`,
      position: {
        x: contextMenuPosition.x,
        y: contextMenuPosition.y
      },
      size: { width: 600, height: 400 },
      visible: true,
    };
    
    setConsoles([...consoles, newConsole]);
  };

  return (
    <div className="h-screen bg-black overflow-hidden relative" onContextMenu={handleContextMenu}>
      <ContextMenuComponent onCreateConsole={handleCreateConsole} />
      {consoles.filter(c => c.visible).map(console => (
        <div key={console.id} onContextMenu={handleContextMenu}>
          <ConsoleComponent 
            key={console.id}
            title={console.title} 
            onCommand={onCommand}
            initialPosition={console.position}
            initialSize={console.size}
            onClose={() => handleCloseConsole(console.id)}
          />
        </div>
      ))}
    </div>
    
  )
}

export default App