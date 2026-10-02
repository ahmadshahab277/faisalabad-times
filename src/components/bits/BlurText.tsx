import { motion, useReducedMotion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

export function BlurText({
  text,
  className,
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  const words = text.split(' ')

  return (
    <span className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block"
          initial={reduce ? false : { opacity: 0, filter: 'blur(8px)', y: 10 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{
            duration: reduce ? 0.15 : 0.4,
            delay: reduce ? 0 : delay + index * 0.035,
            ease,
          }}
        >
          {word}
          {index < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  )
}
