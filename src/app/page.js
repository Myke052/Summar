'use client'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function Home() {
  const router = useRouter()
  const handleClick = (e) => {
    e.preventDefault()
    router.push('/clients')
  }
  const handleClickApplications = (e) => {
    e.preventDefault()
    router.push('/solicitudes')
  }
  const deleteCookies = (e) => {
    e.preventDefault()
    const cookies = document.cookie.split(';')

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i]
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie

      // Establece la cookie con una fecha de expiración pasada para eliminarla
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
      router.replace('/login')
    }
  }

  return (
    <div className={styles.principalScreen}>
      <link rel="icon" href="/Favicon-summar.webp" type="image/webp" />
      <div className={styles.menu}>
        <h1 className={styles.letter}>Bienvenidos a Summar procesos</h1>
        <button onClick={deleteCookies}>Cerrar Sesión</button>
      </div>

      <div className={styles.screen}>
        <button onClick={handleClickApplications}>Solicitudes</button>
        <button>Ordenes</button>
        <button>Traslados</button>
        <button onClick={handleClick}>Clientes</button>
      </div>
    </div>
  )
}
