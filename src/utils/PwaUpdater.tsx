import { useRegisterSW } from 'virtual:pwa-register/react'

export default function PwaUpdater() {
  const {
    needRefresh, /* boolean */
    updateServiceWorker /* function */
  } = useRegisterSW({
    onRegisteredSW(_swUrl, _reg) {
      // Registered successfully
    },
    onNeedRefresh() {
      // A new version is ready
    }
  })

  if (!needRefresh) return null

  return (
    <button onClick={() => updateServiceWorker(true)}>
      Update available – click to refresh
    </button>
  )
}
