import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'

interface CrudApi {
  list: (params?: object) => Promise<any>
  get?: (id: number) => Promise<any>
  create: (data: object) => Promise<any>
  update: (id: number, data: object) => Promise<any>
  delete: (id: number) => Promise<any>
}

export function useCrud<T>(api: CrudApi) {
  const [items, setItems] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<T | null>(null)

  const fetchList = useCallback(async (params?: object) => {
    setLoading(true)
    try {
      const res = await api.list({ page, size: 20, ...params })
      setItems(res.data.items || [])
      setTotal(res.data.total || 0)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [page])

  const create = useCallback(async (data: object) => {
    const res = await api.create(data)
    toast.success('Registro creado exitosamente')
    return res.data
  }, [])

  const update = useCallback(async (id: number, data: object) => {
    const res = await api.update(id, data)
    toast.success('Registro actualizado')
    return res.data
  }, [])

  const remove = useCallback(async (id: number) => {
    await api.delete(id)
    toast.success('Registro eliminado')
  }, [])

  return { items, total, page, setPage, loading, selected, setSelected, fetchList, create, update, remove }
}
