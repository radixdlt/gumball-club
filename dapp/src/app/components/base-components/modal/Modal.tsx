import { ReactNode, useEffect, useState } from 'react'
import { useSpring, animated } from '@react-spring/web'
import styles from './Modal.module.css'

export const Modal = ({
  show: showIntent,
  children,
}: {
  show: boolean
  children: ReactNode
}) => {
  const [showModal, setShowModal] = useState<boolean>(showIntent)

  const [style, api] = useSpring(() => ({
    from: { opacity: 0 },
  }))

  useEffect(() => {
    if (showIntent) {
      api.start({
        onStart: () => setShowModal(true),
        to: {
          opacity: 1,
        },
      })
    } else {
      api.start({
        onResolve: () => setShowModal(false),
        to: {
          opacity: 0,
        },
      })
    }
  }, [showIntent, api, setShowModal])

  if (!showModal) return null

  return (
    <animated.div className={styles.backdrop} style={style}>
      <div className={styles.modal}>{children}</div>
    </animated.div>
  )
}
