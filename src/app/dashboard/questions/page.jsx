import React from 'react'
import AddNewQuestion from './_components/AddNewQuestion'
import QuestionList from './_components/QuestionList'
import { Code, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const QuestionsPage = () => {
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
          <div className='w-12 h-12 rounded-lg bg-orange-500/20 text-orange-500 flex items-center justify-center'>
            <Code className='w-6 h-6' />
          </div>
          <div>
            <h1 className='text-4xl font-bold mb-2'>Technical Skills Practice</h1>
            <p className='text-lg text-muted-foreground'>Master coding challenges and technical concepts with guided AI feedback and best practices.</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='px-6 md:px-20 pb-20'>
        {/* Add New Section */}
        <div className='mb-12'>
          <h2 className='text-xl font-semibold mb-6'>Create a New Question</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
            <AddNewQuestion />
          </div>
        </div>

        {/* Questions List */}
        <div>
          <h2 className='text-xl font-semibold mb-6'>Your Questions</h2>
          <QuestionList />
        </div>
      </div>
    </div>
  )
}

export default QuestionsPage