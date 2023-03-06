import { deleteAsync } from 'del'

const clean = async () => {
  console.log('[clean] Starting clean')

  const files = await deleteAsync(['packages/**/dist'])

  for (const file of files) {
    console.log(`[clean] Deleted \`${file}\``)
  }

  console.log('[clean] Clean complete')
}

clean()
  .catch((err) => {
    console.error('[clean] Error:', err)
    process.exit(1)
  })
