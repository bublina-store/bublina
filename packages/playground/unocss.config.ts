import { defineConfig, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        width: '1.5rem',
        height: '1.5rem'
      }
    })
  ]
}) as unknown
