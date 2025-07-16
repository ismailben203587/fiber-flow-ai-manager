import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
}

const NeuralNetworkBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createNodes = () => {
      const nodeCount = 50;
      const nodes: Node[] = [];

      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          connections: []
        });
      }

      // Create connections between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150 && Math.random() > 0.7) {
            nodes[i].connections.push(j);
          }
        }
      }

      nodesRef.current = nodes;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const nodes = nodesRef.current;

      // Update node positions
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Keep nodes within bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));
      });

      // Draw connections
      ctx.strokeStyle = 'rgba(34, 197, 194, 0.3)';
      ctx.lineWidth = 1;
      
      nodes.forEach((node, i) => {
        node.connections.forEach(connectionIndex => {
          const connectedNode = nodes[connectionIndex];
          if (connectedNode) {
            const dx = node.x - connectedNode.x;
            const dy = node.y - connectedNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200) {
              const opacity = (200 - distance) / 200 * 0.5;
              ctx.globalAlpha = opacity;
              
              // Create pulsing effect
              const pulse = Math.sin(Date.now() * 0.002 + i * 0.1) * 0.3 + 0.7;
              ctx.globalAlpha *= pulse;
              
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(connectedNode.x, connectedNode.y);
              ctx.stroke();
            }
          }
        });
      });

      // Draw nodes
      ctx.globalAlpha = 1;
      nodes.forEach((node, i) => {
        // Node glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 8);
        const pulse = Math.sin(Date.now() * 0.003 + i * 0.2) * 0.5 + 0.5;
        
        gradient.addColorStop(0, `rgba(34, 197, 194, ${0.8 * pulse})`);
        gradient.addColorStop(0.5, `rgba(34, 197, 194, ${0.4 * pulse})`);
        gradient.addColorStop(1, 'rgba(34, 197, 194, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Node core
        ctx.fillStyle = `rgba(34, 197, 194, ${0.9 * pulse})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Add data flow particles
      const time = Date.now() * 0.001;
      nodes.forEach((node, i) => {
        node.connections.forEach((connectionIndex, connIndex) => {
          const connectedNode = nodes[connectionIndex];
          if (connectedNode) {
            const progress = (time * 0.5 + i * 0.1 + connIndex * 0.3) % 1;
            const x = node.x + (connectedNode.x - node.x) * progress;
            const y = node.y + (connectedNode.y - node.y) * progress;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.sin(progress * Math.PI) * 0.8})`;
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createNodes();
    animate();

    const handleResize = () => {
      resizeCanvas();
      createNodes();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-60"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default NeuralNetworkBackground;
