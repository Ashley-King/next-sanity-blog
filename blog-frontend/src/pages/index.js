import Link from 'next/link'
import groq from 'groq'
import client from '../../client'





export default function Home({posts}) {
  console.log("posts", posts[0])
  return (
    <div>
      <h1>Welcome to the blog!</h1>

      {posts.length > 0 && posts.map(
          ({ _id, title = '', slug = '', publishedAt = '' }) =>
            slug && (
              <li key={_id}>
                <Link href={`/posts/${encodeURIComponent(slug.current)}`}>
                  {title}
                </Link>{' '}
                ({new Date(publishedAt).toDateString()})
              </li>
            )
        )}
    </div>
  )
}


export async function getStaticProps() {
  const posts = await client.fetch(groq`
    *[_type == "post" ] | order(publishedAt desc)
  `)
  return {
    props: {
      posts
    }
  }
}

