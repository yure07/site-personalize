import { GetServerSideProps } from 'next'
import styles from './post.module.scss'
import { getPrismic } from '@/services/prismic'
import { RichText } from 'prismic-dom'
import Head from 'next/head'
import Image from 'next/image'

interface PostProps{
    post:{
        title: string;
        description: string;
        cover: string;
        releaseAt: string
    }
}

export default function Post({post}:PostProps){
    console.log(post)
    return(
        <>
            <Head>
                <title>{post.title}</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <Image src={post.cover} alt={post.title} width={720} height={410} quality={100} blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN0sbevBwAC1AFD25IFFgAAAABJRU5ErkJggg==' placeholder='blur'/>
                    <h1>{post.title}</h1>
                    <div className={styles.postContent} dangerouslySetInnerHTML={{__html: post.description}}></div>
                </article>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
    const {slug} = params
    const prismic = getPrismic(req)

    const response = await prismic.getByUID('post', String(slug), {})

    const post = {
        title: RichText.asText(response.data.title),
        description: RichText.asHtml(response.data.description),
        cover: response.data.cover.url,
        releaseAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return{
        props:{
            post
        }
    }
}