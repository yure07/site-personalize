import Prismic from '@prismicio/client'

export function getPrismic(req?: unknown){
    const prismicConnect = Prismic.client('https://next-learn.cdn.prismic.io/api/v2',{
        req
    })
    return prismicConnect
}