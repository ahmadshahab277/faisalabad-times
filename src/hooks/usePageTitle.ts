import { useEffect } from 'react'

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title =
      title === 'Home'
        ? 'Faisalabad Times — What’s Happening in Faisalabad'
        : `${title} — Faisalabad Times`
  }, [title])
}
