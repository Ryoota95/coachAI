"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession()
  const isActive = (path: string) => pathname === path;

  return (
    <nav style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "15px 30px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <div style={{ 
        maxWidth: 1200, 
        margin: "0 auto", 
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Link href="/" style={{ 
          fontSize: 24, 
          fontWeight: "bold", 
          color: "white",
          textDecoration: "none"
        }}>
          QuickCareer AI
        </Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {session ? (
          <>
            <span style={{ fontSize: 14 }}>Halo, {session.user?.name}</span>
            <Link href="/dashboard">Dashboard</Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              style={{
                padding: '0.4rem 1rem',
                backgroundColor: '#ef4444',
                color: '#fff',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
              }}
            > Logout </button>
             </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register" style={{ padding: '0.4rem 1rem', backgroundColor: '#2563eb', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>
              Register
            </Link>
          </>
        )}
      </div>

        <div style={{ display: "flex", gap: 30 }}>
          <Link 
            href="/" 
            style={{ 
              color: "white",
              textDecoration: "none",
              fontWeight: isActive("/") ? "bold" : "normal",
              opacity: isActive("/") ? 1 : 0.8,
              transition: "opacity 0.2s"
            }}
          >
            Home
          </Link>
          <Link 
            href="/dashboard" 
            style={{ 
              color: "white",
              textDecoration: "none",
              fontWeight: isActive("/dashboard") ? "bold" : "normal",
              opacity: isActive("/dashboard") ? 1 : 0.8,
              transition: "opacity 0.2s"
            }}
          >
            CV Analysis
          </Link>
          <Link 
            href="#features" 
            style={{ 
              color: "white",
              textDecoration: "none",
              opacity: 0.8,
              transition: "opacity 0.2s"
            }}
          >
            Features
          </Link>
        </div>
      </div>
    </nav>
  );
}