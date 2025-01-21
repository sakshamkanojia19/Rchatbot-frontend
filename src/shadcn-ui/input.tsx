import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input className={`border border-gray-300 rounded px-4 py-2 ${className}`} {...props} />
  )
}