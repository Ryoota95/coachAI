'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Gagal mendaftar')
    } else {
      router.push('/login')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 360, padding: '2rem', border: '1px solid #eee', borderRadius: 12 }}>
        <h1 style={{ marginBottom: '1.5rem', fontSize: 24, fontWeight: 700 }}>Register</h1>

        {error && (
          <p style={{ color: 'red', marginBottom: '1rem', fontSize: 14 }}>{error}</p>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Nama lengkap"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #ddd', fontSize: 15 }}
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #ddd', fontSize: 15 }}
          />
          <input
            type="password"
            placeholder="Password (min. 8 karakter)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            minLength={8}
            required
            style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #ddd', fontSize: 15 }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem',
              backgroundColor: '#2563eb',
              color: '#fff',
              borderRadius: 8,
              border: 'none',
              fontWeight: 600,
              fontSize: 15,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Memuat...' : 'Register'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', fontSize: 14, textAlign: 'center' }}>
          Sudah punya akun?{' '}
          <Link href="/login" style={{ color: '#2563eb' }}>Login</Link>
        </p>
      </div>
    </div>
  )
}