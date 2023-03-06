export default {
  title: 'Bublina',
  themeConfig: {
    sidebar: sidebar()
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
    }
  ]
}