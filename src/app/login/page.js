'use client'
import { useState } from 'react'
import styles from './page.modules.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

function Login() {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('') // Estado para el mensaje de error
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault() // Evitar el comportamiento predeterminado del formulario

    // Limpia el mensaje de error al enviar el formulario
    setErrorMessage('')

    // Validar las credenciales
    if (usuario === 'admin' && password === '123') {
      // Guardar las credenciales en cookies
      document.cookie = `auth-username=${usuario}; path=/; max-age=3600; secure; SameSite=Strict`
      document.cookie = `auth-password=${password}; path=/; max-age=3600; secure; SameSite=Strict`

      // Redirigir al inicio si las credenciales son correctas
      await router.push('/')
    } else {
      // Mostrar el mensaje de error si las credenciales son incorrectas
      if (usuario !== 'admin') {
        setErrorMessage('Usuario incorrecto')
      } else if (password !== '123') {
        setErrorMessage('Contraseña incorrecta')
      }
    }
  }

  return (
    <>
      <link rel="icon" href="/Favicon-summar.webp" type="image/webp" />
      <div className={styles.principal_Img}>
        <Image src="/OIP.png" alt="Summar" width={290} height={129} />
      </div>
      <h2>Inicio de Sesión</h2>

      {/* Mostrar el mensaje de error si existe */}
      {errorMessage && (
        <div id="error-message" style={{ color: 'red', marginBottom: '20px' }}>
          <p>{errorMessage}</p>
        </div>
      )}

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
