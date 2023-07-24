import type { PageServerLoad } from './$types'

export const load = (({ url }) => {
  const list = (url.searchParams.get('q') ?? '')
    .split('\n')
    .map((item) => item.trim().replace(/^[-◦*●▪•+▸▹]+/, ''))
    .filter(Boolean)

  return {
    list,
  }
}) satisfies PageServerLoad
