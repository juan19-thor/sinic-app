interface PaginationProps {
  page: number
  total: number
  size: number
  onPage: (p: number) => void
}

export default function Pagination({ page, total, size, onPage }: PaginationProps) {
  const pages = Math.ceil(total / size)
  if (pages <= 1) return null
  return (
    <div className="pagination">
      <span>Mostrando {Math.min((page - 1) * size + 1, total)}–{Math.min(page * size, total)} de {total}</span>
      <button className="page-btn" disabled={page === 1} onClick={() => onPage(page - 1)}>‹</button>
      {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map((p) => (
        <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => onPage(p)}>{p}</button>
      ))}
      <button className="page-btn" disabled={page === pages} onClick={() => onPage(page + 1)}>›</button>
    </div>
  )
}
