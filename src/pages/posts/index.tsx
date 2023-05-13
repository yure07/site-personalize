import {GetStaticProps} from 'next'
import Head from "next/head";
import Link from "next/link";
import styles from './styles.module.scss'
import Image from "next/image";
import {FiChevronLeft, FiChevronsLeft, FiChevronRight, FiChevronsRight} from 'react-icons/fi'
import Prismic from '@prismicio/client'
import {RichText} from 'prismic-dom'
import {getPrismic} from '../../services/prismic'
import { useState } from 'react'

type PostsType = {
    slug: string;
    title: string;
    description: string;
    cover: string;
    releaseAt: string;
}

interface PostsProps{
    posts: PostsType[],
    page: string;
    totalPage: string;
}
//                                  rename
export default function Posts({posts: postsBlog, page, totalPage}: PostsProps){
    const [posts, setPosts] = useState(postsBlog || [])
    const [currentPage, setCurrentPage] = useState(Number(page))

    async function req(pageNumber:Number) {
        const prismic = getPrismic()

        const response = await prismic.query([
        Prismic.Predicates.at('document.type', 'post')
        ],{
            orderings: '[document.last_publication_date desc]',
            fetch: ['post.title', 'post.description', 'post.cover'], 
            pageSize: 3,
            page: String(pageNumber)
        })
        return response;
    }

    async function changePage(pageNumber:Number) {
        const getResponse = await req(pageNumber)

        if(getResponse.results.length === 0) return;

        const postsFormat = getResponse.results.map(post=> {
            return{
                slug: post.uid,
                title: RichText.asText(post.data.title),
                description: post.data.description.find(content => content.type === 'paragraph')?.text ?? '',
                cover: post.data.cover.url,
                releaseAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR',{
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                })
            }
        })
        setPosts(postsFormat)
        setCurrentPage(Number(pageNumber))
    }

    return(
        <>
        <Head>
            <title>Blogs</title>
        </Head>

        <main className={styles.container}>
            <div className={styles.posts}>
                {posts.map(post=>(
                    <Link href={`/posts/${post.slug}`} legacyBehavior key={post.slug}>
                    <a key={post.slug}>
                        <Image alt={post.title} src={post.cover} width={720} height={410} quality={100} blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN0sbevBwAC1AFD25IFFgAAAABJRU5ErkJggg==' placeholder='blur'/>
                        <strong>{post.title}</strong>
                        <time>{post.releaseAt}</time>
                        <p>{post.description}</p>
                    </a>
                </Link>
                ))}
                <div className={styles.buttonNavigate}>

                {Number(currentPage) >= 2 &&(
                    <div>
                        <button onClick={()=> changePage(1)}>
                            <FiChevronsLeft size={25} color='#fff'/>
                        </button>
                        <button onClick={()=> changePage(Number(currentPage - 1))}>
                            <FiChevronLeft size={25} color='#fff'/>
                        </button>
                    </div>
                )}

                {Number(currentPage) < Number(totalPage) &&(
                    <div>
                        <button onClick={()=> changePage(Number(currentPage + 1))}>
                            <FiChevronRight size={25} color='#fff'/>
                        </button>
                        <button onClick={()=> changePage(Number(totalPage))}>
                            <FiChevronsRight size={25} color='#fff'/>
                        </button>
                    </div>
                )}

            </div>
            </div>
        </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismic()
    const response = await prismic.query([
        Prismic.Predicates.at('document.type', 'post')
    ],{
        orderings: '[document.last_publication_date desc]', // ordenar busca por ordem decrescente da publicação
        fetch: ['post.title', 'post.description', 'post.cover'], // buscar as info,
        pageSize: 3 // 3 doc por page
    })

    const posts = response.results.map(post=> {
        return{
            slug: post.uid,
            title: RichText.asText(post.data.title),
            description: post.data.description.find(content => content.type === 'paragraph')?.text ?? '',
            cover: post.data.cover.url,
            releaseAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR',{
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    })

    return{
        props:{
            posts,
            page: response.page,
            totalPage: response.total_pages
        },
        revalidate: 60 * 30 // 1 minuto x 30
    }
}