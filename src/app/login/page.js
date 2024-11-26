'use client'
import { useState } from 'react'
import styles from './page.modules.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

function Login() {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault() // Evitar el comportamiento predeterminado del formulario

    // Escribir directamente las credenciales en las cookies
    document.cookie = `auth-username=${usuario}; path=/; max-age=3600; secure; SameSite=Strict`
    document.cookie = `auth-password=${password}; path=/; max-age=3600; secure; SameSite=Strict`

    // Simular la validación de usuario y redirigir en caso exitoso
    if (usuario === 'admin' && password === '123') {
      await router.push('/') // Redirigir al inicio
    } else {
      console.log('Credenciales incorrectas') // Mensaje en caso de error
    }
  }

  return (
    <>
      <link rel="icon" href="/Favicon-summar.webp" type="image/webp" />
      <div className={styles.principal_Img}>
        <Image src="/OIP.png" alt="Summar" width={290} height={129} />
      </div>
      <h2>Inicio de Sesión</h2>

      <div id="error-message" style={{ color: 'red', display: 'none' }}>
        {/* Aquí puedes incluir un mensaje dinámico */}
      </div>

      <form id="login-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Usuario:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />

        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Iniciar Sesión</button>
      </form>
    </>
  )
}

export default Login
