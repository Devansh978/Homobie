import React, { useState, useEffect, useRef } from "react";

const Bricks = () => {
  const wallRef = useRef(null);
  const bricksRef = useRef([]);

  const BRICK_WIDTH = 60;
  const BRICK_HEIGHT = 40;

  const brickImage = "/assets/brick.png";

  const houseLayout = [
    [0,0,0,1,0,0,0],
    [0,0,1,1,1,0,0],
    [0,1,1,1,1,1,0],
    [1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [1,1,1,1,1,1,1],
  ];

  const createDustParticles = (x, y) => {
    if (!wallRef.current) return;
    for (let i = 0; i < 5; i++) {
      const dust = document.createElement("div");
      dust.className = "absolute w-0.5 h-0.5 bg-orange-300 rounded-full pointer-events-none opacity-70";
      dust.style.left = x + Math.random() * 20 - 10 + "px";
      dust.style.top = y + "px";
      dust.style.animation = `dustFall 1s ease-out ${Math.random() * 0.3}s forwards`;
      wallRef.current.appendChild(dust);
      setTimeout(() => dust.remove(), 1300);
    }
  };

  const createBrick = (row, col, delay) => {
    if (!wallRef.current) return;
    const brick = document.createElement("div");
    brick.className = "absolute";
    brick.style.width = BRICK_WIDTH + "px";
    brick.style.height = BRICK_HEIGHT + "px";
    brick.style.left = col * BRICK_WIDTH + "px";
    brick.style.top = row * BRICK_HEIGHT + "px";
    brick.style.backgroundImage = `url(${brickImage})`;
    brick.style.backgroundSize = "cover";
    brick.style.backgroundPosition = "center";
    brick.style.animation = `realisticFall 1.5s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s forwards`;

    wallRef.current.appendChild(brick);
    bricksRef.current.push(brick);

    setTimeout(() => {
      createDustParticles(col * BRICK_WIDTH + BRICK_WIDTH/2, row * BRICK_HEIGHT + BRICK_HEIGHT);
      brick.style.animation += ", settleShake 0.4s ease-in-out";
    }, (delay + 1.5) * 1000);
  };

  const startAnimation = () => {
    if (!wallRef.current) return;

    bricksRef.current.forEach(b => b.remove());
    bricksRef.current = [];

    let delay = 0;
    houseLayout.forEach((rowArr, row) => {
      rowArr.forEach((cell, col) => {
        if (cell === 1) createBrick(row, col, delay + col * 0.05);
      });
      delay += 0.2;
    });
  };

 useEffect(() => {
  startAnimation();

  const dustInterval = setInterval(() => {
    if (!wallRef.current) return;
    const randomX = Math.random() * (BRICK_WIDTH * 7);
    const randomY = Math.random() * (BRICK_HEIGHT * 8);
    createDustParticles(randomX, randomY);
  }, 200); 

  return () => clearInterval(dustInterval); 
}, []);


  return (
    <>
      <style>{`
        @keyframes realisticFall {
          0% { transform: translateY(-600px); opacity:0; }
          50% { opacity:1; }
          100% { transform: translateY(0); opacity:1; }
        }
        @keyframes dustFall {
          0% { transform: translateY(0px); opacity:0.8; }
          100% { transform: translateY(50px); opacity:0; }
        }
        @keyframes settleShake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-1px); }
          75% { transform: translateX(1px); }
        }
      `}</style>

      <div className=" ml-[100px] w-screen h-screen flex items-center justify-centeroverflow-hidden">
        <div ref={wallRef} className="relative" style={{ width: BRICK_WIDTH*7, height: BRICK_HEIGHT*8 }} />
      </div>
    </>
  );
};

export default Bricks;
