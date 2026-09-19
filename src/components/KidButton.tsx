import { useRef, type ButtonHTMLAttributes } from 'react'

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  onPress: () => void
}

/**
 * A button that reacts the instant a finger touches down instead of waiting
 * for a "clean" release over the same element. A native `click` only fires
 * if pointerup lands back on the element it started on — a young child's
 * finger commonly drifts a little while pressing, or a second stray touch
 * elsewhere on the screen makes the browser treat it as a possible
 * pinch-zoom gesture, and either way the tap silently does nothing. Firing
 * on pointerdown sidesteps both.
 *
 * onClick is kept as a fallback purely for keyboard activation (Enter/Space
 * dispatches a click, not a pointerdown) — a `firedAt` guard stops it from
 * double-firing after a pointerdown already handled the same touch/click.
 */
export default function KidButton({ onPress, disabled, ...rest }: Props) {
  const firedAtRef = useRef(0)

  return (
    <button
      {...rest}
      disabled={disabled}
      onPointerDown={(e) => {
        if (disabled) return
        firedAtRef.current = Date.now()
        e.preventDefault()
        onPress()
      }}
      onClick={() => {
        if (disabled || Date.now() - firedAtRef.current < 500) return
        onPress()
      }}
    />
  )
}
