'use client'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ContinueWatching = () => {
  const data = [
    {
      title: 'Basics of Multimedia',
      description: 'Advance PHP Knowledge with JS to make smart webAdvance PHP Knowledge with JS to make smart webAdvance PHP Knowledge with JS to make smart',
      chapters: '09/20 Chapters',
      image: '/static/landing/course.svg'
    },
    {
      title: 'Fundamental of Torque',
      description: 'Advance PHP Knowledge with JS to make smart webAdvance PHP Knowledge with JS to make smart webAdvance PHP Knowledge with JS to make smart',
      chapters: '09/20 Chapters',
      image: 'https://via.placeholder.com/300x200?text=Fundamental+of+Torque'
    },
    {
      title: 'Advanced Numerics',
      description: 'Advance PHP Knowledge with JS to make smart webAdvance PHP Knowledge with JS to make smart webAdvance PHP Knowledge with JS to make smart',
      chapters: '09/20 Chapters',
      image: 'https://via.placeholder.com/300x200?text=Advanced+Numerics'
    },{
      title: 'Basics of Multimedia',
      description: 'Advance PHP Knowledge with JS to make smart webAdvance PHP Knowledge with JS to make smart webAdvance PHP Knowledge with JS to make smart',
      chapters: '09/20 Chapters',
      image: '/static/landing/course.svg'
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } }
    ]
  };

  return (
   <div className="p-5">
  <h2 className="text-2xl font-semibold mb-5">Continue Watching</h2>
  <Slider {...settings}>
    {data.map((item, index) => (
      <div key={index} className="px-2">
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-52 object-cover"
          />
          <div className="p-3">
            <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
            <p className="mb-2 text-gray-600 text-sm">{item.description}</p>
            <p className="text-gray-500 text-xs">{item.chapters}</p>
          </div>
        </div>
      </div>
    ))}
  </Slider>
</div>

  );
};

export default ContinueWatching;