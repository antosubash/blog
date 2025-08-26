import { genPageMetadata } from 'app/seo'
import { type Authors, allAuthors } from 'contentlayer/generated'
import { coreContent } from 'pliny/utils/contentlayer'
import CustomMDXLayoutRenderer from '@/components/CustomMDXLayoutRenderer'
import AuthorLayout from '@/layouts/AuthorLayout'

export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)

  return (
    <AuthorLayout content={mainContent}>
      <CustomMDXLayoutRenderer code={author.body.code} />
    </AuthorLayout>
  )
}
