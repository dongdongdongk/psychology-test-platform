'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import styles from './Header.module.scss'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className={styles.header}>
      <div className={styles.headerCard}>
        <div className={styles.container}>
          <nav className={styles.nav}>
            <Link href="/" className={styles.logo}>
              <Image 
                src="/icon.png" 
                alt="로고" 
                width={32} 
                height={32} 
                className={styles.logoIcon}
              />
              심리테스트 플랫폼
            </Link>
            
            {/* Desktop Navigation */}
            <ul className={styles.navLinks}>
              <li>
                <Link href="/" className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}>홈</Link>
              </li>
              <li>
                <Link href="/about" className={`${styles.navLink} ${isActive('/about') ? styles.active : ''}`}>소개</Link>
              </li>
              <li>
                <Link href="/faq" className={`${styles.navLink} ${isActive('/faq') ? styles.active : ''}`}>FAQ</Link>
              </li>
              <li>
                <Link href="/contact" className={`${styles.navLink} ${isActive('/contact') ? styles.active : ''}`}>문의</Link>
              </li>
              <li>
                <Link href="/admin/login" className={styles.navLink}>관리자</Link>
              </li>
            </ul>

            {/* Mobile Menu Button */}
            <button 
              className={styles.mobileMenuButton}
              onClick={toggleMobileMenu}
              aria-label="메뉴 열기"
            >
              <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </nav>

          {/* Mobile Menu Dropdown */}
          <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
            <ul className={styles.mobileNavLinks}>
              <li>
                <Link href="/" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>홈</Link>
              </li>
              <li>
                <Link href="/about" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>소개</Link>
              </li>
              <li>
                <Link href="/faq" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
              </li>
              <li>
                <Link href="/contact" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>문의</Link>
              </li>
              <li>
                <Link href="/admin/login" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>관리자</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}