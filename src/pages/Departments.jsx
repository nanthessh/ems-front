import { useState } from 'react'
import Navbar from '../components/Navbar'
import DepartmentModal from '../components/DepartmentModal'
import { useDepartments } from '../hooks/useDepartments'
import { useAuth } from '../context/AuthContext'

export default function Departments() {
  const { departments, loading, error, save, remove } = useDepartments()
  const { isAdmin } = useAuth()
  const [search, setSearch]       = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected]   = useState(null)
  const [deleteId, setDeleteId]   = useState(null)

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = async (form) => {
    await save(form)
    setModalOpen(false)
  }

  const handleDelete = async () => {
    await remove(deleteId)
    setDeleteId(null)
  }

  return (
    <div className="layout">
      <div className="bg-blobs">
        <div className="blob blob-1" /><div className="blob blob-2" /><div className="blob blob-3" />
      </div>

      <Navbar />

      <main className="main-content">
        <div className="page-header">
          <h1>🏢 Departments</h1>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => { setSelected(null); setModalOpen(true) }}>
              + Add Department
            </button>
          )}
        </div>

        {error && <div className="alert error">⚠ {error}</div>}

        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="empty">Loading...</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Description</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={isAdmin ? 4 : 3} className="empty">No departments found.</td></tr>
                ) : (
                  filtered.map((dept, i) => (
                    <tr key={dept.id}>
                      <td>{i + 1}</td>
                      <td><span className="badge">{dept.name}</span></td>
                      <td>{dept.description || <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>}</td>
                      {isAdmin && (
                        <td>
                          <button className="btn btn-sm btn-edit" onClick={() => { setSelected(dept); setModalOpen(true) }}>Edit</button>
                          <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(dept.id)}>Delete</button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {modalOpen && (
        <DepartmentModal
          department={selected}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this department?</p>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
