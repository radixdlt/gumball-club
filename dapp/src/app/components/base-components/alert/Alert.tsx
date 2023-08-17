import styles from "./Alert.module.css"

export const Alert = ({
  variant,
  onClose,
  text,
  button,
  title,
  className = "",
}: {
  className?: string
  variant: "info"
  title: string
  text: React.ReactNode
  button?: React.ReactNode
  onClose: () => void
}) => (
  <div className={`${styles.alert} ${styles[variant]} ${className}`}>
    <div className={styles.close} onClick={onClose}></div>
    <div className={styles.title}>{title}</div>
    <div className={styles.text}>{text}</div>
    {button ? <div className={styles.button}>{button}</div> : null}
  </div>
)
