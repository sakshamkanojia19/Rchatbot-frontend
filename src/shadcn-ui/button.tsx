import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
}

export const Button: React.FC<ButtonProps> = ({ variant = 'default', className, ...props }) => {
  const variantClasses = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-gray-300 text-gray-800 hover:bg-gray-100',
    ghost: 'bg-transparent text-gray-800 hover:bg-gray-100',
    link: 'bg-transparent text-blue-500 hover:underline',
  }

  return (
    <button className={`${variantClasses[variant]} px-4 py-2 rounded ${className}`} {...props}>
      {props.children}
    </button>
  )
}