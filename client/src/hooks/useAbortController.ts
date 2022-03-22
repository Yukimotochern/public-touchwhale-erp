import { useRef, useEffect } from 'react'

// Custom Abort Controll Hook
const initAbortController = () => new AbortController()
const useAbortController = (shouldAutoRestart = false) => {
  const abortController = useRef(initAbortController())

  useEffect(() => {
    if (shouldAutoRestart && abortController.current.signal.aborted) {
      abortController.current = initAbortController()
    }
  }, [abortController.current.signal.aborted, shouldAutoRestart])

  useEffect(() => () => abortController.current.abort(), [])

  return abortController.current
}

export default useAbortController
export { useAbortController }
