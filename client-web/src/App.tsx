import { useEffect, useRef, useState } from 'react';
import buildPath from './function/dataConvert';
import { Point, Rect, Side } from './types/types';

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rects, setRects] = useState<Rect[]>([
    { position: { x: 200, y: 200 }, size: { width: 200, height: 200 } },
    { position: { x: 600, y: 501 }, size: { width: 200, height: 200 } },
  ]);
  const [dragging, setDragging] = useState<number | null>(null);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });

  const determineSide = (rect1: Rect, rect2: Rect): [Side, Side] => {
    const dx = rect2.position.x - rect1.position.x;
    const dy = rect2.position.y - rect1.position.y;

    let rect1Side: Side;
    let rect2Side: Side;

    if (Math.abs(dx) > Math.abs(dy)) {
      rect1Side = dx > 0 ? 'right' : 'left';
      rect2Side = dx > 0 ? 'left' : 'right';
    } else {
      rect1Side = dy > 0 ? 'bottom' : 'top';
      rect2Side = dy > 0 ? 'top' : 'bottom';
    }

    return [rect1Side, rect2Side];
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#259df4';
    rects.forEach(rect => {
      ctx.fillRect(
        rect.position.x - rect.size.width / 2,
        rect.position.y - rect.size.height / 2,
        rect.size.width,
        rect.size.height
      );
    });

    const [rect1Side, rect2Side] = determineSide(rects[0], rects[1]);

    const pathPoints = buildPath(
      rects[0],
      rects[1],
      rect1Side,
      rect2Side
    );

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
    pathPoints.slice(1).forEach(point => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const render = () => {
          draw(ctx);
          requestAnimationFrame(render);
        };
        render();
      }
    }
  }, [rects]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      rects.forEach((rect, index) => {
        const { x, y } = rect.position;
        const { width, height } = rect.size;
        if (
          mouseX >= x - width / 2 &&
          mouseX <= x + width / 2 &&
          mouseY >= y - height / 2 &&
          mouseY <= y + height / 2
        ) {
          setDragging(index);
          setOffset({ x: mouseX - x, y: mouseY - y });
        }
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging !== null) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const newRects = [...rects];
        newRects[dragging] = {
          ...newRects[dragging],
          position: {
            x: mouseX - offset.x,
            y: mouseY - offset.y
          }
        };
        setRects(newRects);
      }
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  return (
    <div className='canvas'>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>
    </div>
  );
}

export default App;
