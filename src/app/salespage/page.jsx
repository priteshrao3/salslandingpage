'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse, theme } from 'antd';


const truncateDescription = (description, maxWords) => {
  const words = description.split(' ');
  return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : description;
};

function Salespage() {
  const [salesData, setSalesData] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const { token } = theme.useToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://www.bkarogyam.com/lapissalespage/');
        setSalesData(response.data[0]);
        setTimeLeft(calculateTimeLeft(response.data[0].end_time));
      } catch (error) {
        console.error('Error fetching sales page data:', error);
      }
    };

    fetchData();
    
    const timer = setInterval(() => {
      if (salesData) {
        setTimeLeft(calculateTimeLeft(salesData.end_time));
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [salesData]);

  const calculateTimeLeft = (endTime) => {
    const difference = new Date(endTime) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  if (!salesData) {
    return <div>Loading...</div>;
  }


  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };


  
  return (
    <div className="text-center bg-slate-200">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-4 text-orange-500 pt-10">{salesData.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: salesData.heading }} className="mt-5 md:text-[4em]  font-bold"></div>
      <p className="text-black text-xl mt-5">{salesData.sort_description}</p>
    
      {/* Main Content with Cards and Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:mt-10 md:px-[15em]">
        {/* Left Column */}
        <div className="text-right">
          <img 
            src={salesData.image} 
            alt="Sales promotion" 
            className="w-full h-auto rounded-lg"
          />
           <div className='text-center md:mt-10 mt-5'>
           <Link href={salesData.book_now_link} passHref>
              <h2 className="md:text-2xl font-bold text-blue-600 cursor-pointer">{salesData.book_now_text}</h2>
           </Link>
           <p className="text-lg mt-2">{salesData.image_title}</p>
           </div>
        </div>

        {/* Right Column with Cards */}
        <div className="text-center grid grid-cols-2 md:grid-cols-2 gap-4">
          {salesData.cards && salesData.cards.length > 0 ? (
            salesData.cards.map(card => (
              <div key={card.id} className="border p-4 rounded-lg shadow-md">
                <div className='text-center'>
                  <img
                    src={card.icon}
                    className="w-16 h-16 mb-2 rounded-md object-cover mx-auto"
                  />
                </div>
                <h2 className="text-xl font-bold mt-2">{card.card_title}</h2>
                <p className="mt-1">{card.card_description}</p>
              </div>
            ))
          ) : (
            <div>No cards available.</div>
          )}

          {/* Countdown Timer */}
          <div className="col-span-2 text-3xl font-bold mt-4 flex justify-center space-x-6 text-red-700 px-3 md:px-0">
            <div className="flex flex-col items-center">
              <span className="text-xl md:text-2xl">{timeLeft.days || '00'}</span>
              <span className="text-sm md:text-lg">days</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl md:text-2xl">{timeLeft.hours || '00'}</span>
              <span className="text-sm md:text-lg">hours</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl md:text-2xl">{timeLeft.minutes || '00'}</span>
              <span className="text-sm md:text-lg">minutes</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl md:text-xl">{timeLeft.seconds || '00'}</span>
              <span className="text-sm md:text-lg">seconds</span>
            </div>

            {/* Book Now Link */}
            <Link href={salesData.book_now_link} passHref>
              <p className="hidden md:block text-blue-600 text-3xl cursor-pointer">
                {salesData.book_now_text}
              </p>
            </Link>

            {/* Alternative text for mobile view */}
            <p className="block md:hidden text-blue-600 text-sm">
              BOOK NOW
            </p>
          </div>
        </div>
      </div>
      <Link href={salesData.book_now_link} passHref>
        <p className="text-white md:text-3xl p-2 mt-2 cursor-pointer bg-blue-700 p-">
          {salesData.book_now_text}
        </p>
      </Link>

      <div className='md:px-[15em] bg-gray-300'>
      {salesData.benefits && salesData.benefits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:p-20">
          {salesData.benefits.map(benefit => (
            <div key={benefit.id} className="border p-4 rounded-lg shadow-md w-full">
              <div className="p-4 flex flex-col items-center">
                {/* Use img tag and adjust size */}
                <img
                  src={benefit.icon}
                  alt={benefit.title}
                  className="w-16 h-16 mb-2 rounded-md object-cover"
                />
                <h2 className="text-xl font-bold text-center">{benefit.title}</h2> 
                <p className="mt-2 text-center">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No benefits available.</div>
      )}

      <Link href={salesData.book_now_link} passHref>
        <p className="text-white md:text-3xl text-xl p-2  rounded-lg cursor-pointer bg-blue-700">
        {salesData.book_now_text}
        </p>
      </Link>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:p-20 p-4 md:px-[10em]">
        {/* Right Column for centered image (mobile first) */}
        <div className="flex items-center justify-center md:mt-20 order-1 md:order-2">
          <img
            src={salesData.aboutbkarogyam.hospital_image}
            alt="BK Kidney Care Hospital"
            className="md:w-3/4 h-auto object-cover rounded-lg"
          />
        </div>

        {/* Left Column for content */}
        <div className="flex flex-col justify-between md:mt-20 order-2 md:order-1">
          <div>
            <h2 className="md:text-5xl text-4xl md:text-left text-blue-600">{salesData.aboutbkarogyam.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: salesData.aboutbkarogyam.aboutbkarogyam }} className="mt-4 text-lg"></div>
          </div>
          {/* Button below the content */}
          <div className="mt-6 md:px-20">
            <Link href={salesData.book_now_link} passHref>
              <p className="text-white md:text-2xl p-2 mt-2 cursor-pointer bg-blue-700 rounded-lg">
                {salesData.book_now_text}
              </p>
            </Link>
          </div>
        </div>
      </div>




      <div className="testimonial-section md:p-20 bg-blue-500 md:px-[20em] p-5">
        <h2 className="text-center text-white text-3xl font-bold mb-6">TARGET AUDIENCE</h2>
        <p className='text-center text-4xl text-white font-bold mb-6'>यह आहार योजना किसके लिए है?</p>


        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-10">
          <div className="border border-gray-300 rounded-lg shadow-lg p-4 bg-white text-center">
            {/* <div className="flex justify-center items-center mb-2">
              <img
                src="path_to_icon1" // Replace with actual image path
                alt="Icon for CKD Patients"
                className="w-12 h-12 object-contain"
              />
            </div> */}
            <h4 className="text-md font-semibold mb-1 text-black">
              क्रोनिक किडनी डिजीज (CKD) के मरीज: जिन लोगों की किडनी की बीमारी लंबे समय से है, उन्हें इस आहार योजना का पालन करना चाहिए।
            </h4>
          </div>

          <div className="border border-gray-300 rounded-lg shadow-lg p-4 bg-white text-center">
            {/* <div className="flex justify-center items-center mb-2">
              <img
                src="path_to_icon2" // Replace with actual image path
                alt="Icon for Dialysis Patients"
                className="w-12 h-12 object-contain"
              />
            </div> */}
            <h4 className="text-md font-semibold mb-1 text-black">
              डायलिसिस पर जा रहे लोग: जिन लोगों को डायलिसिस करवाना पड़ता है, उनके लिए यह आहार योजना बहुत महत्वपूर्ण होती है।
            </h4>
          </div>

          <div className="border border-gray-300 rounded-lg shadow-lg p-4 bg-white text-center">
            {/* <div className="flex justify-center items-center mb-2">
              <img
                src="path_to_icon3" // Replace with actual image path
                alt="Icon for Kidney Transplant Patients"
                className="w-12 h-12 object-contain"
              />
            </div> */}
            <h4 className="text-md font-semibold mb-1 text-black">
              किडनी प्रत्यारोपण के बाद के मरीज: किडनी प्रत्यारोपण के बाद भी, इस आहार योजना का पालन करने से प्रत्यारोपित किडनी को स्वस्थ रखने में मदद मिलती है।
            </h4>
          </div>

          <div className="border border-gray-300 rounded-lg shadow-lg p-4 bg-white text-center">
            {/* <div className="flex justify-center items-center mb-2">
              <img
                src="path_to_icon4" // Replace with actual image path
                alt="Icon for High Blood Pressure and Diabetes Patients"
                className="w-12 h-12 object-contain"
              />
            </div> */}
            <h4 className="text-md font-semibold mb-1 text-black">
              उच्च रक्तचाप और मधुमेह के मरीज: ये दोनों बीमारियां किडनी को नुकसान पहुंचा सकती हैं, इसलिए इन मरीजों के लिए भी यह आहार योजना फायदेमंद हो सकती है।
            </h4>
          </div>
        </div>

        <h2 className="text-center text-white text-3xl font-bold mb-6">Success Story</h2>
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          modules={[Pagination, Autoplay]}
          className="mySwiper"
        >
          {salesData.testimonials && salesData.testimonials.length > 0 ? (
            salesData.testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="p-4">
                <div 
                  className="border border-gray-300 rounded-lg shadow-lg p-6 bg-blue-500 text-center"
                  style={{ minHeight: '400px', maxHeight: '500px' }}
                >
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-24 h-24 rounded-full mx-auto mb-4" 
                  />
                  <h4 className="text-xl font-bold mb-2 text-white">{testimonial.name}</h4>
                  <p className="text-lg italic mb-4 text-white">
                    &quot;{truncateDescription(testimonial.description, 50)}&quot;
                  </p>
                  <div className="flex justify-center items-center mb-2 space-x-2">
                    <div className="flex">
                      {[...Array(testimonial.stars)].map((_, index) => (
                        <span key={index} className="text-yellow-500 text-2xl">★</span>
                      ))}
                      {[...Array(5 - testimonial.stars)].map((_, index) => (
                        <span key={index} className="text-white">★</span>
                      ))}
                    </div>
                    <p className="text-lg font-semibold text-white">{testimonial.rating} ratings</p>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="text-center p-6">
                <p className="text-white">No testimonials available.</p>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>



      <div className='md:mt-20 mt-5 md:px-[15em]'>
        <h4 className="text-xl font-bold mb-2 text-black">Diet Plan Benefits</h4>
        <p className="text-4xl italic mb-4 text-blue-500 p-3">What&apos;s inside?</p>
        <p className="text-lg italic mb-4 text-black">
          हम आपको एक विशेष वेबिनार में आमंत्रित करते हैं जिसमें किडनी रोगियों के लिए सबसे प्रभावी आहार योजना के बारे में विस्तृत जानकारी दी जाएगी। इस वेबिनार में, आप सीखेंगे:
        </p>

        {/* Grid Layout with 2 Cards per Row on mobile, 4 Cards per Row on larger screens */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
          {salesData.what_inside && salesData.what_inside.length > 0 ? (
            salesData.what_inside.map((item) => (
              <div
                key={item.id}
                className="border border-gray-300 rounded-lg shadow-lg p-4 bg-white text-center"
              >
                <div className="flex justify-center items-center mb-2"> {/* Flex centering */} 
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-contain" // Smaller size to resemble icons
                  />
                </div>
                <h4 className="text-md font-semibold mb-1 text-black">{item.name}</h4>
                <p className="text-sm italic mb-2 text-gray-600">{item.description}</p>
              </div>
            ))
          ) : (
            <p>No data available</p>
          )}
        </div>
        
        <Link href={salesData.book_now_link} passHref>
          <p className="text-white text-2xl p-2 md:mt-20 mt-5 rounded-lg cursor-pointer bg-blue-700">
            {salesData.book_now_text}
          </p>
        </Link>
      </div>



      <div className="about-me-section p-6 bg-blue-50 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-4 md:px-[20em] md:mt-20 mt-5">
        {/* Image will be shown first on mobile */}
        <div className="flex justify-center items-center mt-5 order-1 md:order-2">
          <img
            src={salesData.aboutme.image}
            alt={salesData.aboutme.title}
            className="rounded-lg shadow-lg max-w-xs h-auto"
          />
        </div>
        
        <div className='text-left mt-10 order-2 md:order-1'>
          <h3 className="text-2xl font-bold text-orange-400 mb-4">{salesData.aboutme.title}</h3>
          <h1 dangerouslySetInnerHTML={{ __html: salesData.aboutme.description }} />
          
          <Link href={salesData.book_now_link} passHref>
            <p className="text-white text-center md:text-2xl text-xl p-1 mt-10 rounded-lg cursor-pointer bg-blue-700">
              {salesData.book_now_text}
            </p>
          </Link>
        </div>
      </div>


      <div className="testimonial-section md:p-10 bg-blue-50 md:px-[20em]">
        <h2 className="text-center text-black text-3xl font-bold mb-6">Awards</h2>

        <Swiper
          slidesPerView={2} // Default to show 2 slides
          spaceBetween={20}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 3000, // Change slide every 3 seconds
            disableOnInteraction: false, // Keep autoplay running after user interactions
          }}
          breakpoints={{
            640: {
              slidesPerView: 2, // Show 2 slides on small screens (>=640px)
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4, // Show 4 slides on medium screens (>=768px)
              spaceBetween: 30,
            },
          }}
          modules={[Pagination, Autoplay]} // Include both Pagination and Autoplay modules
          className="mySwiper"
        >
          {salesData.awards && salesData.awards.length > 0 ? (
            salesData.awards.map((award) => ( 
              <SwiperSlide key={award.id} className="p-4">
                <img 
                  src={award.image} 
                  alt={`Award ${award.id}`} 
                  className="w-auto md:h-auto mx-auto mb-4 object-contain" 
                />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="text-center p-6">
                <p>No awards available.</p>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      <hr />


      <div className='text-left md:px-[15em] md:pb-36 pb-[5em]'>
        <h1 className="text-2xl font-bold mb-4 pl-5 md:pl-0 py-5">FAQ</h1>
        <h2 className="text-6xl  pl-5 mt-2 text-blue-700 mb-6">कोई प्रश्न है?</h2>

        <div className="faq-section grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Left Column for Panels 1 to 4 */}
          <div>
            <Collapse
              bordered={false}
              defaultActiveKey={['1']}
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              style={{
                background: token.colorBgContainer,
              }}
              items={salesData.faq.slice(0, 4).map((faqItem) => ({
                key: faqItem.id,
                label: faqItem.question,
                children: <p>{faqItem.answer}</p>,
                style: panelStyle,
              }))}
            />
          </div>

          {/* Right Column for Panels 5 to 8 */}
          <div>
            <Collapse
              bordered={false}
              defaultActiveKey={['5']}
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              style={{
                background: token.colorBgContainer,
              }}
              items={salesData.faq.slice(4, 8).map((faqItem) => ({
                key: faqItem.id,
                label: faqItem.question,
                children: <p>{faqItem.answer}</p>,
                style: panelStyle,
              }))}
            />
          </div>
        </div>
      </div>

      {/* Countdown Timer and Footer with "Book Now" Link */}
      <div className="fixed bottom-0 left-0 right-0 flex flex-col md:flex-row items-center bg-blue-200 shadow-lg justify-center z-10 p-1">
  {/* Book Now Link (shown on top for mobile) */}
  <div className="flex items-center md:hidden bg-blue-700 p-1 rounded-lg px-5">
    <Link href={salesData.book_now_link} passHref>
      <p className="text-white text-lg md:text-xl cursor-pointer hover:text-blue-800 transition duration-200 ">
        {salesData.book_now_text}
      </p>
    </Link>
  </div>
  
  {/* Countdown Timer */}
  <div className="text-lg md:text-xl font-bold flex space-x-6 text-red-700 justify-center">
    <div className="flex flex-col items-center">
      <span className='pl-2'>{timeLeft.days || '00'}</span>
      <span className="text-sm md:text-lg">days</span>
    </div>
    <div className="flex flex-col items-center">
      <span>{timeLeft.hours || '00'}</span>
      <span className="text-sm md:text-lg">hours</span>
    </div>
    <div className="flex flex-col items-center">
      <span>{timeLeft.minutes || '00'}</span>
      <span className="text-sm md:text-lg">minutes</span>
    </div>
    <div className="flex flex-col items-center">
      <span>{timeLeft.seconds || '00'}</span>
      <span className="text-sm md:text-lg">seconds</span>
    </div>
  </div>

  {/* Book Now Link */}
  <div className="hidden md:block items-center md:ml-6 bg-blue-700 rounded-lg p-1"> 
    <Link href={salesData.book_now_link} passHref>
      <p className="text-white text-lg md:text-2xl cursor-pointer hover:text-blue-800 transition duration-200">
        {salesData.book_now_text}
      </p>
    </Link>
  </div>
</div>


  </div>
  );
}

export default Salespage;
