import { useEffect, useState } from 'react'

export function useFinePointer() {
  const [fine, setFine] = useState(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches)

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    const apply = () => setFine(query.matches)
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])

  return fine
}
