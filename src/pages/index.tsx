import Head from "next/head"
import styles from '../styles/home.module.scss'
import Image from "next/image"
import iconsTec from '../../public/images/techs.svg'
import { GetStaticProps } from "next"
import {getPrismic} from '../services/prismic'
import Prismic from '@prismicio/client'
import { RichText } from "prismic-dom"

type TypeContent = {
  title: string;
  subTitle: string;
  linkActive: string;
  mobile: string;
  mobileContent: string;
  mobileBanner: string;
  web: string;
  webContent: string;
  webBanner: string;
}

interface HomeProps{
  content: TypeContent
}

export default function Home({content}:HomeProps) {
  return (
    <>
     <Head>
        <title>Apaixonado por Tecnologia</title>
     </Head> 

     <main className={styles.container}>
      <div className={styles.containerHeader}>
        <section className={styles.ctaText}>
        <h1>{content.title}</h1>
        <span>{content.subTitle}</span>

        <a href={content.linkActive}>
          <button>
            COMEÇAR AGORA
          </button>
        </a>
        </section>

        <img src="/images/banner-conteudos.png" alt="Conteúdos Sujeito Programador" />
      </div>

      <hr className={styles.divisor}/>

      <div className={styles.sectionContent}>
        <section>
          <h2>{content.mobile}</h2>
          <span>{content.mobileContent}</span>
        </section>

        <img src={content.mobileBanner} alt="conteudo-mobile" />
      </div>

      <hr className={styles.divisor}/>

      <div className={styles.sectionContent}>
        <img src={content.webBanner} alt="conteudo-mobile" />
        <section>
          <h2>{content.web}</h2>
          <span>{content.webContent}</span>
        </section>
      </div>

      <div className={styles.footerContainer}>
        <Image src={iconsTec} alt="icons-tec" />
        <h2>Mais de <span className={styles.alunos}>15 mil</span> já levaram sua carreira ao próximo nivel.</h2>
        <span>E você vai perder a chance de evoluir de uma vez por todas?</span>

        <a href={content.linkActive}>
          <button>
            ACESSAR TURMA
          </button>
        </a>
      </div>

     </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismic()

  const response = await prismic.query([
    Prismic.Predicates.at('document.type', 'home')
  ])

  const {
    title, sub_title, link_action,
    mobile, mobile_content, mobile_banner,
    web, web_content, web_banner
  } = response.results[0].data

  const content = {
    title: RichText.asText(title),
    subTitle: RichText.asText(sub_title),
    linkActive: link_action.url,
    mobile: RichText.asText(mobile),
    mobileContent: RichText.asText(mobile_content),
    mobileBanner: mobile_banner.url,
    web: RichText.asText(web),
    webContent: RichText.asText(web_content),
    webBanner: web_banner.url
  }

  return{
    props:{
      content
    },
    revalidate: 60 * 2 // 60s * 2
  }
}