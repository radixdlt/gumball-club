import { ReactNode, MouseEvent } from "react"
import styles from "./Button.module.css"

export const Button = ({
  children,
  disabled,
  icon = "none",
  onClick,
  className = "",
}: {
  children: ReactNode
  disabled?: boolean
  icon?: "external-link" | "none"
  onClick?: (ev: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void
  className?: string
}) => {
  const iconClass = icon
    ? { "external-link": styles["external-link"], none: "" }[icon]
    : ""

  const handleOnClick = (
    ev: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    if (disabled || !onClick) return
    onClick(ev)
  }
  const classes = `${styles.button} ${iconClass} ${className}`
  return (
    <button disabled={disabled} className={classes} onClick={handleOnClick}>
      {children}
    </button>
  )
}
