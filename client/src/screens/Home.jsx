import React, { useState } from 'react'
import { Typewriter } from 'react-simple-typewriter'
import { Link } from 'react-router-dom'

const Home = () => {
  const [showDemo, setShowDemo] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)

  const handleScheduleDemo = () => {
    setShowSchedule(true)
    setTimeout(() => {
      setShowSchedule(false)
      setShowDemo(false)
    }, 3000)
  }

  return (
    <div className='space-y-24'>

      {/* Schedule Confirmation Modal */}
      {showSchedule && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60 p-4">
          <div className="bg-gradient-to-br from-green-900/90 to-emerald-800/90 rounded-2xl max-w-md w-full shadow-2xl border border-green-400/30 p-6 text-center">
            <div className="text-5xl mb-2">🎉</div>

            <h3 className="text-xl font-semibold text-white mb-3 leading-relaxed">
              <Typewriter
                words={[
                  'Demo Scheduled Successfully!',
                  'Our team will contact you within 24 hours!',
                  'Get ready for an amazing experience!'
                ]}
                loop={1}
                cursor
                cursorStyle="|"
                typeSpeed={50}
                deleteSpeed={40}
                delaySpeed={1500}
              />
            </h3>

            <div className="text-base text-emerald-200 mb-4 leading-relaxed">
              <Typewriter
                words={[
                  'Thank you for your interest!',
                  'We are excited to show you our products!',
                  'Preparing your personalized demo...'
                ]}
                loop={1}
                cursor
                cursorStyle="_"
                typeSpeed={40}
                deleteSpeed={30}
                delaySpeed={2000}
              />
            </div>

            <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-emerald-300">Redirecting you back...</p>
          </div>
        </div>
      )}

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl max-w-3xl w-full shadow-2xl border border-yellow-400/20">
            
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-yellow-400">Product Demo</h3>
              <button 
                onClick={() => setShowDemo(false)}
                className="text-gray-400 hover:text-yellow-400 text-xl transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="bg-black rounded-xl p-6 text-center border-2 border-dashed border-yellow-400/30">
                <div className="text-5xl mb-2">🎬</div>

                <h4 className="text-xl font-semibold text-yellow-400 mb-3 leading-relaxed">
                  <Typewriter
                    words={[
                      'Smart Appliance Demo',
                      'Experience the Future Today',
                      'Revolutionary Energy Efficiency'
                    ]}
                    loop={1}
                    cursor
                    cursorStyle="|"
                    typeSpeed={60}
                    deleteSpeed={40}
                    delaySpeed={2000}
                  />
                </h4>

                <p className="text-base text-gray-300 mb-6 max-w-2xl mx-auto">
                  Watch how our energy-efficient appliances transform your home experience with smart automation.
                </p>

                {/* Feature Points */}
                <div className="max-w-2xl mx-auto space-y-4 text-left">
                  {[
                    ['⚡','Smart Energy Monitoring','Real-time consumption tracking with AI optimization'],
                    ['🤖','AI Optimization','Automatically adjusts settings for maximum efficiency'],
                    ['📱','Mobile App Control','Manage appliances from your smartphone'],
                    ['🌍','Eco-Friendly','Sustainable design that reduces carbon footprint']
                  ].map(([icon, title, desc], i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-md hover:bg-white/10 transition">
                      <div className="text-2xl">{icon}</div>
                      <div>
                        <h5 className="text-lg font-semibold text-yellow-300">{title}</h5>
                        <p className="text-sm text-gray-300">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="mt-6">
                  <button 
                    onClick={handleScheduleDemo}
                    className="w-full max-w-md bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 px-6 py-3 rounded-xl font-semibold text-base
                    hover:shadow-lg transition-all mx-auto flex items-center justify-center gap-2"
                  >
                    🎬 Schedule Live Demo →
                  </button>

                  <p className="text-sm text-gray-400 mt-3">
                    <Typewriter
                      words={[
                        'Free 30-minute personalized demo',
                        'No commitment required',
                        'See real products in action'
                      ]}
                      loop={true}
                      cursor
                      cursorStyle="_"
                      typeSpeed={60}
                      deleteSpeed={40}
                      delaySpeed={2000}
                    />
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className='relative text-center py-20 bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 rounded-3xl shadow-2xl overflow-hidden'>
        
        {/* Add subtle appliance image background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}></div>
        </div>
        
        <div className='relative max-w-5xl mx-auto px-6'>
          
          {/* Badge */}
          <div className='inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-1 mb-5'>
            <div className='w-2 h-2 bg-yellow-400 rounded-full animate-pulse'></div>
            <span className='text-sm text-yellow-300 font-medium'>Trusted by 10,000+ Customers</span>
          </div>

          {/* Title */}
          <h1 className='font-bold md:text-5xl text-4xl text-white leading-tight mb-4'>
            Powering <br />
            <span className='bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent italic'>
              <Typewriter
                words={['the Future ⚡', 'Smart Homes 🏠', 'Efficiency 🌟', 'Innovation 🚀']}
                loop={true}
                cursor
                cursorStyle="|"
                typeSpeed={100}
                deleteSpeed={100}
                delaySpeed={600}
              />
            </span>
          </h1>

          {/* Subtitle */}
          <p className='text-base md:text-lg text-gray-200 max-w-3xl mx-auto'>
            Discover premium appliances that blend <span className='text-yellow-300 font-semibold'>cutting-edge technology</span> with 
            <span className='text-green-400 font-semibold'> eco-conscious design</span>.
          </p>

          {/* Buttons */}
          <div className='mt-10 flex flex-col sm:flex-row gap-3 justify-center'>
            <Link
              to="/Products"
              className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 px-8 py-3 rounded-xl font-semibold text-base
              hover:shadow-lg transition transform hover:scale-[1.03]"
            >
              Explore Products →
            </Link>

            <button 
              onClick={() => setShowDemo(true)}
              className="border border-yellow-400 text-yellow-400 px-8 py-3 rounded-xl font-semibold text-base
              hover:bg-yellow-400/10 transition transform hover:scale-[1.03]"
            >
              🎬 Watch Demo
            </button>
          </div>
          
        </div>
      </section>

      {/* FEATURES */}
      <section className='max-w-7xl mx-auto px-6'>
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold text-white mb-2'>
            Why Choose <span className='text-yellow-400'>Our Products</span>
          </h2>
          <p className='text-base text-gray-300'>Engineered for excellence, designed for life.</p>
        </div>

        {/* Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {[
            ['🔌','Energy Efficient','Save up to 50% on electricity bills with smart monitoring','Save ₹15K/yr'],
            ['🏭','Built to Last','Industrial-grade durability with 10-year comprehensive warranty','10Y Warranty'],
            ['🌿','Eco-Friendly','Made with 95% recycled materials, low carbon footprint','Zero Waste'],
            ['📱','Smart Connected','Works with Alexa, Google Home, and mobile apps','IoT Ready']
          ].map(([icon, title, desc, badge], i) => (
            <div 
              key={i}
              className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-yellow-400/30 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className='text-4xl mb-4'>{icon}</div>
              <div className='flex justify-between mb-2'>
                <h3 className='text-xl font-bold text-white'>{title}</h3>
                <span className='text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full'>
                  {badge}
                </span>
              </div>
              <p className='text-sm text-gray-300'>{desc}</p>

              <div className='mt-4 pt-3 border-t border-white/10'>
                <span className='text-sm text-yellow-400 font-semibold flex items-center gap-1 hover:gap-2 transition-all'>
                  Learn more →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default Home