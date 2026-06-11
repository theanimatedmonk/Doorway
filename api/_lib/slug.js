export function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function generateUniqueSlug(supabase, recipientName) {
  const baseSlug = slugify(recipientName) || 'link'
  let slug = baseSlug
  let counter = 2

  while (true) {
    const { data } = await supabase.from('links').select('id').eq('slug', slug).maybeSingle()

    if (!data) return slug

    slug = `${baseSlug}-${counter}`
    counter++
  }
}
