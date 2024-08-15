import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="mr-3 rounded-3xl border border-gray-300 px-2 py-1 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:border-gray-700 dark:hover:text-primary-400"
    >
      {text?.split(' ').join('-')}
    </Link>
  )
}

export default Tag
