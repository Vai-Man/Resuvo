import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'
import { Zap, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const InterviewPage = () => {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Header */}
      <div className='px-6 md:px-20 pt-8 pb-12'>
        <Link
          href='/dashboard'
          className='inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6'
        >
          <ArrowLeft className='w-4 h-4' />
          Back
        </Link>
        
        <div className='flex items-start gap-3'>
          <div className='w-12 h-12 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center'>
            <Zap className='w-6 h-6' />
          </div>
          <div>
            <h1 className='text-4xl font-bold mb-2'>AI Mock Interviews</h1>
            <p className='text-lg text-muted-foreground'>Practice with realistic AI-driven interviews tailored to your role. Get real-time feedback on clarity, confidence, and technical depth.</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='px-6 md:px-20 pb-20'>
        {/* Add New Section */}
        <div className='mb-12'>
          <h2 className='text-xl font-semibold mb-6'>Start a New Interview</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
            <AddNewInterview />
          </div>
        </div>

        {/* Interview List */}
        <div>
          <h2 className='text-xl font-semibold mb-6'>Your Interviews</h2>
          <InterviewList />
        </div>
      </div>
    </div>
  )
}

export default InterviewPage