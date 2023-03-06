import { execSync } from 'child_process'
import { packages } from '../packages'

type Pkg = typeof packages[number]

const publishPackage = async (pkg: Pkg) => {
  console.log(`[publish-package] Publishing \`${pkg.name}\``)

  execSync(
    [
      'npm publish',
      '--access public'
      // '--dry-run'
    ].join(' '),
    { stdio: 'inherit', cwd: `${pkg.path}\\dist` }
  )

  console.log(`[publish-package] \`${pkg.name}\` published`)
}

const publish = async () => {
  console.log('[publish] Publish started')

  execSync('pnpm run clean', { stdio: 'inherit' })
  execSync('pnpm run lint', { stdio: 'inherit' })
  execSync('pnpm run test', { stdio: 'inherit' })

  execSync('pnpm run build', { stdio: 'inherit' })

  for (const pkg of packages) {
    await publishPackage(pkg)
    console.log()
  }

  console.log('[publish] Publish complete')
}

publish()
  .catch((err) => {
    console.error('[publish] Error:', err)
    process.exit(1)
  })
