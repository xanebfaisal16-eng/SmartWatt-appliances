import React, { useState } from 'react'

const Contactus = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 flex items-center justify-center py-12 px-4'>
      
      {/* Main Container */}
      <div className='max-w-6xl w-full flex flex-col lg:flex-row gap-8 items-center'>
        
        {/* Contact Information */}
        <div className='lg:w-1/2 text-white space-y-8'>
          <div>
            <h1 className='text-5xl font-bold mb-4'>
              Get In <span className='text-yellow-400'>Touch</span>
            </h1>
            <p className='text-xl text-gray-300 leading-relaxed'>
              Have questions about our energy-efficient products? We're here to help you find the perfect solutions for your needs.
            </p>
          </div>

          {/* Contact Methods */}
          <div className='space-y-6'>
            <div className='flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm'>
              <div className='w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center'>
                <span className='text-2xl'>📞</span>
              </div>
              <div>
                <h3 className='font-semibold text-lg'>Call Us</h3>
                <p className='text-gray-300'>1-800-SMARTWATT</p>
              </div>
            </div>

            <div className='flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm'>
              <div className='w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center'>
                <span className='text-2xl'>✉️</span>
              </div>
              <div>
                <h3 className='font-semibold text-lg'>Email Us</h3>
                <p className='text-gray-300'>support@smartwatt.com</p>
              </div>
            </div>

            <div className='flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm'>
              <div className='w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center'>
                <span className='text-2xl'>🕒</span>
              </div>
              <div>
                <h3 className='font-semibold text-lg'>Business Hours</h3>
                <p className='text-gray-300'>Mon-Fri: 8AM-8PM EST</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className='lg:w-1/2 w-full'>
          <div className='bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8'>
            <div className='text-center mb-8'>
              <h2 className='text-3xl font-bold text-white mb-2'>Send us a Message</h2>
              <p className='text-gray-300'>We'll get back to you within 24 hours</p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label className='block text-white font-medium mb-2'>Your Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Enter your full name'
                  className='w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all'
                  required
                />
              </div>

              <div>
                <label className='block text-white font-medium mb-2'>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Enter your email'
                  className='w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all'
                  required
                />
              </div>

              <div>
                <label className='block text-white font-medium mb-2'>Your Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder='Tell us about your inquiry...'
                  rows="5"
                  className='w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all resize-none'
                  required
                />
              </div>

              <button 
                type="submit"
                className='w-full bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 font-bold py-4 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl'
              >
                Send Message
              </button>
            </form>

            {/* Trust Badge */}
            <div className='mt-6 text-center'>
              <p className='text-gray-400 text-sm'>🔒 Your information is secure and encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contactus