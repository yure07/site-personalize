import { GetStaticProps } from 'next'
import styles from './styles.module.scss'
import { getPrismic } from '@/services/prismic'
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'
import Head from 'next/head'
import {FaGithub, FaInstagram, FaLinkedin} from 'react-icons/fa'

type ContentType = {
    title: string;
    description: string;
    banner: string;
    github: string;
    instagram: string;
    linkedin: string;
}

interface ContentProps{
    content: ContentType
}

export default function Sobre({content}: ContentProps){
    
    return(
        <>
            <Head>
                <title>Sobre - Yure</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.containerHeader}>
                    <section className={styles.ctaText}>
                        <h1>{content.title}</h1>
                        <p>{content.description}</p>

                        <a href={content.github}>
                            <FaGithub size={40}/>
                        </a>

                        <a href={content.instagram}>
                            <FaInstagram size={40}/>
                        </a>

                        <a href={content.linkedin}>
                            <FaLinkedin size={40}/>
                        </a>

                    </section>
                    <img src={content.banner} alt="img-yure" />
                </div>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismic()
    const response = await prismic.query([
        Prismic.Predicates.at('document.type', 'about')
    ])

    const {
        title,
        description,
        banner,
        link,
        link1,
        link2
    } = response.results[0].data

    const content = {
        title: RichText.asText(title),
        description: RichText.asText(description),
        banner: banner.url,
        github: link.url,
        instagram: link1.url,
        linkedin: link2.url
    }

    return{
        props:{
            content
        }
    }
}