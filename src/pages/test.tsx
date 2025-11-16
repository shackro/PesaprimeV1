import { useState, useEffect } from 'react';

const BreakpointTest = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Breakpoint Test</h1>
      <div className="text-lg">Current Width: {width}px</div>
      
      <div className="grid gap-4">
        <div className={`p-4 rounded ${width >= 1536 ? 'bg-green-500' : 'bg-gray-300'}`}>
          2xl (≥1536px)
        </div>
        <div className={`p-4 rounded ${width >= 1280 ? 'bg-green-500' : 'bg-gray-300'}`}>
          xl (≥1280px)
        </div>
        <div className={`p-4 rounded ${width >= 1024 ? 'bg-green-500' : 'bg-gray-300'}`}>
          lg (≥1024px) - THIS SHOULD BE GREEN ON DESKTOP
        </div>
        <div className={`p-4 rounded ${width >= 768 ? 'bg-yellow-500' : 'bg-gray-300'}`}>
          md (≥768px)
        </div>
        <div className={`p-4 rounded ${width >= 640 ? 'bg-red-500' : 'bg-gray-300'}`}>
          sm (≥640px)
        </div>
        <div className={`p-4 rounded ${width < 640 ? 'bg-red-500' : 'bg-gray-300'}`}>
          xs (640px)
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-100 rounded">
        <h2 className="font-bold mb-2">If lg is not green, check:</h2>
        <ul className="list-disc list-inside">
          <li>Browser zoom level (Ctrl+0)</li>
          <li>DevTools device emulation</li>
          <li>Viewport meta tag</li>
          <li>Browser window size</li>
        </ul>
      </div>
    </div>
  );
};


export default BreakpointTest;