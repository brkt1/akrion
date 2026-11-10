import { useEffect, useState } from 'react'
import { hasConstrainedConnection } from './publicRoutes'

export default function useConstrainedConnection() {
  const [constrained, setConstrained] = useState(() => hasConstrainedConnection(navigator.connection))
  useEffect(() => {
    const connection = navigator.connection
    const update = () => setConstrained(hasConstrainedConnection(connection))
    connection?.addEventListener('change', update)
    return () => connection?.removeEventListener('change', update)
  }, [])
  return constrained
}
