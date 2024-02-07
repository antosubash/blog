interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Abp React',
    description: `React Template with ABP Framework, which can be used as a starting point for your next React project.`,
    href: 'https://github.com/antosubash/AbpReact',
  },
  {
    title: 'Abp Microservice',
    description: `Microservice Template with ABP Framework, which can be used as a starting point for your next Microservice project.`,
    href: 'https://github.com/antosubash/AbpMicroservice',
  },
]

export default projectsData
