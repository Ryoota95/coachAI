import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabase } from '@/app/lib/supabase'

export async function POST(req: Request) {
  const { name, email, password } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
  }

  
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const { error } = await supabase
    .from('users')
    .insert({ name, email, password: hashedPassword })

  if (error) {
    return NextResponse.json({ error: 'Gagal mendaftar' }, { status: 500 })
  }

  return NextResponse.json({ message: 'Berhasil mendaftar' }, { status: 201 })
}