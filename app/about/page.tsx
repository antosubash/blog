import { getAllAuthors, getAuthorBySlug, type Author } from '@/lib/mdx'
import AuthorLayout from '@/layouts/AuthorLayout'
import { genPageMetadata } from 'app/seo'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { components } from '@/components/MDXComponents'

export const metadata = genPageMetadata({ title: 'About' })

export default async function Page() {
  const author = await getAuthorBySlug('default')

  return (
    <>
      <AuthorLayout content={author}>
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <MDXRemote source={author.content} components={components} />
        </div>
      </AuthorLayout>
    </>
  )
}
