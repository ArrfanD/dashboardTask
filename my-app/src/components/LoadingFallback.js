import React from 'react'

const LoadingFallback = () => {
  return (
    <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
        <h1 className='fs-2'>Loading! Please Wait...</h1>
    </div>
  )
}

export default LoadingFallback