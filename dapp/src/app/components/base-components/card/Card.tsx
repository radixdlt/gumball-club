import { ReactNode } from 'react'
import styles from './Card.module.css'

export const Card = ({
  children,
  outerClassName = '',
  className = '',
}: {
  children: ReactNode
  className?: string
  outerClassName?: string
}) => {
  return (
    <div className={`${styles['card-shadow']} ${outerClassName}`}>
      <div className={`${styles['card']} ${className}`}>{children}</div>
    </div>
  )
}
