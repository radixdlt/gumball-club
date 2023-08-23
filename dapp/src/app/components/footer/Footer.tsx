import { config } from "@/app/config"
import styles from "./Footer.module.css"
import Image from "next/image"

const LearnMore = () => (
  <div className={styles["learn-more"]}>
    <div className={styles.header}>Learn more</div>
    <a
      href={`${config.network.dashboardUrl}`}
      className={styles.link}
      target="_blank"
    >
      Radix Developer Console
      <Image
        src="/assets/external-link.svg"
        width={20}
        height={20}
        alt="developer console link"
      ></Image>
    </a>
    <a href="https://www.radixdlt.com" className={styles.link} target="_blank">
      About Radix
      <Image
        src="/assets/external-link.svg"
        width={20}
        height={20}
        alt="developer console link"
      ></Image>
    </a>
  </div>
)

const Socials = () => (
  <div className={styles["socials"]}>
    <div className={styles.header}>Join the Radix Community</div>
    <div className={styles["socials-links"]}>
      {[
        {
          iconPath: "/assets/twitter.svg",
          url: "https://x.com/RadixDLT",
          height: 24,
          width: 24,
          alt: "X link",
        },
        {
          iconPath: "/assets/github.svg",
          url: "https://github.com/radixdlt",
          height: 24,
          width: 24,
          alt: "Github link",
        },
        {
          iconPath: "/assets/telegram.svg",
          url: "https://t.me/radix_dlt",
          height: 24,
          width: 24,
          alt: "Telegram link",
        },
        {
          iconPath: "/assets/discord.svg",
          url: "https://discord.gg/radixdlt",
          height: 24,
          width: 24,
          alt: "Discord link",
        },
        {
          iconPath: "/assets/email.svg",
          url: "mailto:hello@radixdlt.com",
          height: 24,
          width: 24,
          alt: "Email address",
        },
      ].map((item) => (
        <a href={item.url} key={item.url} target="_blank">
          <Image
            src={item.iconPath}
            width={item.width}
            height={item.height}
            alt={item.alt}
          ></Image>
        </a>
      ))}
    </div>
  </div>
)

const RunsOnRadix = () => (
  <div className={styles["runs-on-radix"]}>
    <a href="https://www.radixdlt.com/full-stack" target="_blank">
      <Image
        src="/assets/runs-on-radix.svg"
        width={119.483}
        height={48.081}
        alt="developer console link"
      ></Image>
    </a>
  </div>
)

const CopyRight = () => (
  <div className={styles["copyright"]}>
    <div>
      © Radix Publishing Ltd, {new Date().getFullYear()}. All rights reserved.
      Radix Publishing Ltd.
    </div>
    <div className={styles.legal}>
      <a href="">Privacy Notice</a>
      <div className={styles["separator"]}></div>
      <a href="">Terms and Conditions</a>
    </div>
  </div>
)

export const Footer = () => (
  <div className={styles.footer}>
    <div className={styles.content}>
      <LearnMore />
      <Socials />
      <RunsOnRadix />
    </div>
    <div className={styles["border"]}></div>
    <CopyRight />
  </div>
)
