export default {
  title: 'Bublina',
  themeConfig: {
    sidebar: sidebar(),
    socialLinks: socialLinks(),
    footer: {
      copyright: 'Copyright © 2023'
    }
  }
}

function sidebar() {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        { text: 'YASML?', link: '/guides/introduction' },
        { text: 'Getting started', link: '/guides/get-started' },
      ]
    },
    {
      text: 'Basic concepts',
      collapsed: false,
      items: [
        { text: 'Define a store', link: '/guides/define-a-store' },
        { text: 'Multiple instances', link: '/guides/multiple-instances' },
      ]
    }
  ]
}

function socialLinks() {
  return [
    {
      icon: 'github',
      link: 'https://github.com/bublina-store/bublina'
    },
  ]
}