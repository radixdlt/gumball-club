import { config } from '@/app/config'
import styles from './Footer.module.css'
import Image from 'next/image'
import ExternalLink from '../../../../public/assets/external-link.svg'
import Twitter from '../../../../public/assets/twitter.svg'
import Github from '../../../../public/assets/github.svg'
import Telegram from '../../../../public/assets/telegram.svg'
import Discord from '../../../../public/assets/discord.svg'
import Email from '../../../../public/assets/email.svg'
import RunsOnRadixImage from '../../../../public/assets/runs-on-radix.svg'

const LearnMore = () => (
  <div className={styles['learn-more']}>
    <div className={styles.header}>Learn more</div>
    <a
      href={`${config.network.dashboardUrl}`}
      className={styles.link}
      target="_blank"
    >
      Radix Developer Console
      <Image
        src={ExternalLink}
        width={20}
        height={20}
        alt="developer console link"
      ></Image>
    </a>
    <a href="https://www.radixdlt.com" className={styles.link} target="_blank">
      About Radix
      <Image
        src={ExternalLink}
        width={20}
        height={20}
        alt="developer console link"
      ></Image>
    </a>
  </div>
)

const Socials = () => (
  <div className={styles['socials']}>
    <div className={styles.header}>Join the Radix Community</div>
    <div className={styles['socials-links']}>
      {[
        {
          iconPath: Twitter,
          url: 'https://x.com/RadixDLT',
          height: 24,
          width: 24,
          alt: 'X link',
        },
        {
          iconPath: Github,
          url: 'https://github.com/radixdlt',
          height: 24,
          width: 24,
          alt: 'Github link',
        },
        {
          iconPath: Telegram,
          url: 'https://t.me/radix_dlt',
          height: 24,
          width: 24,
          alt: 'Telegram link',
        },
        {
          iconPath: Discord,
          url: 'https://discord.gg/radixdlt',
          height: 24,
          width: 24,
          alt: 'Discord link',
        },
        {
          iconPath: Email,
          url: 'mailto:hello@radixdlt.com',
          height: 24,
          width: 24,
          alt: 'Email address',
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
  <div className={styles['runs-on-radix']}>
    <a href="https://www.radixdlt.com/full-stack" target="_blank">
      <Image
        src={RunsOnRadixImage}
        width={119.483}
        height={48.081}
        alt="developer console link"
      ></Image>
    </a>
  </div>
)

const CopyRight = () => (
  <div className={styles['copyright']}>
    <div>
      © Radix Publishing Ltd, {new Date().getFullYear()}. All rights reserved.
      Radix Publishing Ltd.
    </div>
    <div className={styles.legal}>
      <a href="">Privacy Notice</a>
      <div className={styles['separator']}></div>
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
    <div className={styles['border']}></div>
    <CopyRight />
  </div>
)
