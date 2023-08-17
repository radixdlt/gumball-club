import styles from "./MachineHeader.module.css"
import { Text } from "../../../base-components/text"
import React from "react"

export const MachineHeader = ({
  header,
  subtitle,
  tags,
  textClass,
}: {
  header: string
  subtitle: string
  tags: React.ReactNode
  textClass?: string
}) => (
  <div className={styles.header}>
    <div className={`${styles.text} ${textClass}`}>
      <Text variant="header">{header}</Text>
      <Text variant="paragraph">{subtitle}</Text>
    </div>
    {tags}
  </div>
)
