'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function RotatingCards() {
  const images = [
    '/static/landing/Rectangle 5.png',
    '/static/landing/Rectangle 7 (1).svg',
    '/static/landing/Rectangle 6 (1).png',
  ];

  const [rotations, setRotations] = useState([-15, 0, 15]);
  const [zIndices, setZIndices] = useState([3, 2, 1]);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // cycle rotations
      setRotations((prev) => {
        const updated = [...prev];
        const first = updated.shift()!;
        updated.push(first);
        return updated;
      });

      // cycle z-indexes
      setZIndices((prev) => {
        const updated = [...prev];
        const first = updated.shift()!;
        updated.push(first);
        return updated;
      });

      // update top image
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative w-[16rem] h-[20rem] mx-auto">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute top-0 transition-transform duration-1000 ease-in-out"
          style={{
            transform: `rotate(${rotations[i]}deg)`,
            zIndex: zIndices[i],
          }}
        >
          <div className="relative w-[15rem] h-[20rem] rounded-xl overflow-hidden shadow-lg">
            <Image
              src={
                zIndices[i] === 3
                  ? images[imageIndex]
                  : images[(imageIndex + i + 1) % images.length]
              }
              alt="rotating card"
              width={250}
              height={300}
              className="object-fit rounded-xl"
            />
          </div>
        </div>
      ))}
    </section>
  );
}
