import { rollup } from 'rollup'
import AutoImport from 'unplugin-auto-import/rollup'
import ts from 'rollup-plugin-ts'

import { mapObjectValues, PackageJson, readJson, writeJson } from './utilities'
import { packages } from '../packages'
import fs from 'fs'
import path from 'path'

type Pkg = typeof packages[number]

const bundlePackage = async (pkg: Pkg) => {
  const input = `${pkg.path}\\index.ts`
  const output = `${pkg.path}\\dist\\index.mjs`
  const packageJson = await readJson<PackageJson>(`${pkg.path}\\package.json`)

  console.log(`[bundle-package] Bundling \`${input}\``)

  const external = Object.entries(packageJson.dependencies ?? {})
    .filter(([, version]) => version !== 'workspace:*')
    .map(([name]) => name)

  const bundle = await rollup({
    input,
    external: [
      'vue',
      ...external
    ],
    plugins: [
      AutoImport({
        imports: ['vue'],
        dts: false
      }),
      ts()
    ]
  })

  await bundle.write({
    file: output,
    format: 'es'
  })

  console.log(`[bundle-package] Bundle written to \`${output}\``)
}

const copyAdditionalFiles = async (pkg: Pkg) => {
  for (const file of pkg.files) {
    const input = `${pkg.path}\\${file}`
    const output = `${pkg.path}\\dist\\${path.parse(file).base}`

    console.log(`[copy-additional-files] Copying \`${input}\``)

    await fs.promises.copyFile(input, output)

    console.log(`[copy-additional-files] \`${output}\` created`)
  }
}

const adjustPackageJson = async (pkg: Pkg) => {
  const inputPath = `${pkg.path}\\package.json`
  const outputPath = `${pkg.path}\\dist\\package.json`

  console.log(`[adjust-package-json] Adjusting \`${inputPath}\``)

  const packageJson = await readJson<PackageJson>(inputPath)

  const version = packageJson.version ?? '*'

  const adjustedPackageJson = {
    ...packageJson,
    exports: {
      ...packageJson.exports,
      '.': {
        ...(packageJson.exports?.['.'] && typeof packageJson.exports['.'] === 'object'
          ? packageJson.exports['.']
          : undefined
        ),
        import: './index.mjs'
      }
    },
    dependencies: mapObjectValues(
      packageJson.dependencies ?? {},
      (dependencyVersion) => dependencyVersion === 'workspace:*' ? version : dependencyVersion
    ),
    devDependencies: undefined
  }

  await writeJson(outputPath, adjustedPackageJson)

  console.log(`[adjust-package-json] \`${outputPath}\` created`)
}

const buildPackage = async (pkg: typeof packages[number]) => {
  console.log(`[build-package] Building \`${pkg.name}\``)

  await bundlePackage(pkg)
  await copyAdditionalFiles(pkg)
  await adjustPackageJson(pkg)

  console.log(`[build-package] \`${pkg.name}\` built`)
}

const build = async () => {
  console.log('[build] Starting build')

  for (const pkg of packages) {
    await buildPackage(pkg)
    console.log()
  }

  console.log('[build] Build complete')
}

build()
  .catch((err) => {
    console.error('[build] Error:', err)
    process.exit(1)
  })
