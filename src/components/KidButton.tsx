import type { ButtonHTMLAttributes } from 'react'

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
 * dispatches a click with `detail: 0`; every real pointer-originated click
 * has `detail >= 1`), which onPointerDown above already fully handles. This
 * distinction matters, not just as a double-fire guard: when a press swaps
 * the whole screen (e.g. "Начало" going back to the home screen), the
 * browser still dispatches the trailing click afterward, and it lands on
 * whatever element the newly-rendered screen now has at that same
 * position — a *different* button than the one the finger touched down on,
 * with no shared state to guard against it. Only ever acting on real
 * pointer input inside onPointerDown, and never treating a `detail >= 1`
 * click as an independent action, closes that hole entirely.
 */
export default function KidButton({ onPress, disabled, ...rest }: Props) {
  return (
    <button
      {...rest}
      disabled={disabled}
      onPointerDown={(e) => {
        if (disabled) return
        e.preventDefault()
        onPress()
      }}
      onClick={(e) => {
        if (disabled || e.detail !== 0) return
        onPress()
      }}
    />
  )
}
