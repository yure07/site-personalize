import styles from './styles.module.scss'
import Image from 'next/image'
import logo from '../../../public/images/logo.svg'
import Link from 'next/link'
import { useRouter } from 'next/router'

export function Header(){
    const router = useRouter()
    const {asPath} = router

    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <a>
                    <Image src={logo} alt='logo-img'/>
                </a>

            <nav>
                <Link href='/'>
                    <p className={asPath === '/' ? 'active' : ''}>Home</p>
                </Link>

                <Link href='/posts' >
                    <p className={asPath === '/posts' ? 'active' : ''}>Conteúdos</p>
                </Link>

                <Link href='/sobre' >
                    <p className={asPath === '/sobre' ? 'active' : ''}>Sobre</p>
                </Link>
            </nav>

            <a 
            className={styles.readyButton} 
            href='https://yurerafael.dev/'>
                COMEÇAR
            </a>
            </div>
        </header>
    )
}