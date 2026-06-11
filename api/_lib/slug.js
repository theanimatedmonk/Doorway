export function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function generateUniqueSlug(supabase, baseValue) {
  const baseSlug = slugify(baseValue) || 'link'
  let slug = baseSlug
  let counter = 2

  while (true) {
    const { data } = await supabase.from('links').select('id').eq('slug', slug).maybeSingle()

    if (!data) return slug

    slug = `${baseSlug}-${counter}`
    counter++
  }
}

export async function resolveUniqueSlug(supabase, { slug, fallback }) {
  const normalized = slugify(slug || fallback)

  if (!normalized) {
    throw new Error('Invalid link slug')
  }

  return generateUniqueSlug(supabase, normalized)
}
