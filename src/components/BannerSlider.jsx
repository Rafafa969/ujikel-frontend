import { useState, useEffect } from 'react';

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const [imageError, setImageError] = useState({});

  // Banner pake gambar - bisa ganti URL sendiri!
  const banners = [
    { 
      title: 'NMAX FAMILY', 
      desc: 'Semangat Bukan Sekadar Cepat',
      image: 'https://imgcdn.oto.com/large/gallery/exterior/84/2967/yamaha-nmax-turbo-right-side-viewfull-image-331101.jpg'
    },
    { 
      title: 'YAMAHA XSR 155', 
      desc: 'Road to Champion',
      image: 'https://imgcdn.oto.com/medium/gallery/exterior/84/2261/yamaha-xsr-155-right-side-viewfull-image-479861.jpg'
    },
    { 
      title: 'YAMAHA BYSON', 
      desc: 'Ultimate Performance',
      image: 'https://sepeda-motor.info/wp-content/uploads/2016/02/yamaha-byson.jpg'
    },
    { 
      title: 'MT-15', 
      desc: 'The Legend Reborn',
      image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=1200'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((current - 1 + banners.length) % banners.length);
  const next = () => setCurrent((current + 1) % banners.length);

  const handleImageError = (index) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className="relative h-[250px] md:h-[350px] overflow-hidden mb-6">
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-500 ${
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          {/* Gambar */}          
          {!imageError[index] ? (
            <img 
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
              onError={() => handleImageError(index)}
            />
          ) : (
            /* Fallback gradient kalo gambar error */
            <div className="w-full h-full bg-gradient-to-r from-red-700 to-red-900" />
          )}
          
          {/* Overlay gelap */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Teks */}
          <div className="absolute bottom-10 left-6 md:left-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-widest">
              {banner.title}
            </h2>
            <p className="text-white/70 mt-1 text-lg">{banner.desc}</p>
          </div>
        </div>
      ))}

      {/* Arrow Left */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white text-2xl flex items-center justify-center transition"
      >
        ‹
      </button>

      {/* Arrow Right */}
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white text-2xl flex items-center justify-center transition"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-8 h-1 transition ${i === current ? 'bg-white' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
}