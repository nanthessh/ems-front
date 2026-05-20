import { useState, useEffect, useCallback } from 'react'
import { departmentService } from '../api/departmentService'

export function useDepartments() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setDepartments(await departmentService.getAll())
    } catch {
      setError('Failed to load departments.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const save = async (form) => {
    if (form.id) await departmentService.update(form)
    else await departmentService.create(form)
    await load()
  }

  const remove = async (id) => {
    await departmentService.remove(id)
    await load()
  }

  return { departments, loading, error, save, remove, reload: load }
}
