import { ReactNode } from "react"
import styles from "./Tooltip.module.css"

export const Tooltip = ({
  children,
  onClose,
  className = "",
}: {
  children: ReactNode
  onClose: () => void
  className?: string
}) => (
  <div className={className}>
    <div className={styles.tooltip}>
      {children}
      <i className={styles.close} onClick={onClose}></i>
    </div>
  </div>
)
