'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError('Email atau password salah')
    } else {
      router.push(callbackUrl)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 360, padding: '2rem', border: '1px solid #eee', borderRadius: 12 }}>
        <h1 style={{ marginBottom: '1.5rem', fontSize: 24, fontWeight: 700 }}>Login</h1>

        {error && (
          <p style={{ color: 'red', marginBottom: '1rem', fontSize: 14 }}>{error}</p>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #ddd', fontSize: 15 }}
/>
<input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Memuat...' : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', fontSize: 14, textAlign: 'center' }}>
          Belum punya akun?{' '}
          <Link href="/register" style={{ color: '#2563eb' }}>Register</Link>
        </p>
      </div>
    </div>
  )
}