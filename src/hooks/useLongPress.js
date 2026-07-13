import { useCallback, useRef } from 'react'

export function useLongPress(onLongPress, ms = 500) {
  const timerRef = useRef(null)
  const firedRef = useRef(false)

  const start = useCallback((e) => {
    firedRef.current = false
    timerRef.current = setTimeout(() => {
      firedRef.current = true
      onLongPress(e)
    }, ms)
  }, [onLongPress, ms])

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const onClickCapture = useCallback((e) => {
    if (firedRef.current) {
      e.preventDefault()
      e.stopPropagation()
      firedRef.current = false
    }
  }, [])

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchCancel: clear,
    onClickCapture,
  }
}
