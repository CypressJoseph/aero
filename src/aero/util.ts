export const toCamel = (s: string) => {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '')
  })
}

export function findOrCreateById<T extends { id: string }> (
  arr: Array<T>, id: string, defaultObject: T
) {
  const existing: any | undefined = arr.find(item => item.id === id)
  if (existing) { return existing }
  const it: any = { ...defaultObject }
  arr.push(it)
  return it
}

export function update (target: any, updates: any) {
  Object.entries(updates).forEach(([attr, val]) => { target[attr] = val })
}
