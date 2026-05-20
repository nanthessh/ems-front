import { useState, useEffect, useCallback } from 'react'
import { employeeService } from '../api/employeeService'

export function useEmployees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setEmployees(await employeeService.getAll())
    } catch {
      setError('Failed to load employees.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const save = async (form) => {
    if (form.id) await employeeService.update(form)
    else await employeeService.create(form)
    await load()
  }

  const remove = async (id) => {
    await employeeService.remove(id)
    await load()
  }

  return { employees, loading, error, save, remove, reload: load }
}
