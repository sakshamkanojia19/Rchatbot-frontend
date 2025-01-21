import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className, ...props }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`} {...props}>
      {props.children}
    </div>
  )
}

export const CardHeader: React.FC<CardProps> = ({ className, ...props }) => {
  return <div className={`p-4 ${className}`} {...props} />
}

export const CardTitle: React.FC<CardProps> = ({ className, ...props }) => {
  return <h3 className={`text-lg font-bold ${className}`} {...props} />
}

export const CardContent: React.FC<CardProps> = ({ className, ...props }) => {
  return <div className={`p-4 ${className}`} {...props} />
}

export const CardFooter: React.FC<CardProps> = ({ className, ...props }) => {
  return <div className={`p-4 ${className}`} {...props} />
}