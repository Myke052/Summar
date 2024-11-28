'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState([])
  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editSolicitud, setEditSolicitud] = useState(null)
  const [newSolicitud, setNewSolicitud] = useState({
    producto: '',
    cantidad: '',
    cliente: '',
  })
  const [errors, setErrors] = useState({
    producto: '',
    cantidad: '',
    cliente: '',
  })

  // Cargar solicitudes desde el localStorage al cargar la página
  useEffect(() => {
    const storedSolicitudes = localStorage.getItem('solicitudes')
    if (storedSolicitudes) {
      setSolicitudes(JSON.parse(storedSolicitudes))
    }
  }, [])

  // Guardar solicitudes en el localStorage cuando se actualicen
  useEffect(() => {
    localStorage.setItem('solicitudes', JSON.stringify(solicitudes))
  }, [solicitudes])

  const handleOpenCreate = () => setOpenCreate(true)
  const handleCloseCreate = () => setOpenCreate(false)

  const handleOpenEdit = (solicitud) => {
    setEditSolicitud(solicitud)
    setOpenEdit(true)
  }
  const handleCloseEdit = () => setOpenEdit(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewSolicitud({ ...newSolicitud, [name]: value })
    setErrors({ ...errors, [name]: '' }) // Limpiar el error cuando se cambia el campo
  }

  const validateSolicitud = () => {
    let valid = true
    let newErrors = { producto: '', cantidad: '', cliente: '' }

    // Validación de campos vacíos
    if (!newSolicitud.producto) {
      newErrors.producto = 'El producto es obligatorio.'
      valid = false
    }
    if (!newSolicitud.cantidad) {
      newErrors.cantidad = 'La cantidad es obligatoria.'
      valid = false
    }
    if (!newSolicitud.cliente) {
      newErrors.cliente = 'El cliente es obligatorio.'
      valid = false
    }

    // Validación de cantidad mayor a 0
    if (parseInt(newSolicitud.cantidad, 10) <= 0) {
      newErrors.cantidad = 'La cantidad debe ser mayor a 0.'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleCreateSolicitud = () => {
    // Validar antes de continuar
    if (!validateSolicitud()) {
      return
    }

    const nextId =
      solicitudes.length > 0 ? solicitudes[solicitudes.length - 1].id + 1 : 1
    const nuevaSolicitud = {
      id: nextId,
      ...newSolicitud,
      cantidad: parseInt(newSolicitud.cantidad, 10),
    }

    setSolicitudes((prev) => [...prev, nuevaSolicitud])
    setNewSolicitud({ producto: '', cantidad: '', cliente: '' })
    handleCloseCreate()
  }

  const handleEditSolicitud = () => {
    setSolicitudes((prev) =>
      prev.map((solicitud) =>
        solicitud.id === editSolicitud.id ? { ...editSolicitud } : solicitud
      )
    )
    handleCloseEdit()
  }

  const handleDeleteSolicitud = (id) => {
    setSolicitudes((prev) => prev.filter((solicitud) => solicitud.id !== id))
  }

  return (
    <div style={{ padding: '20px' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <h2>Lista de Solicitudes</h2>
        <Button variant="contained" color="primary" onClick={handleOpenCreate}>
          Crear Solicitud
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="solicitudes table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Producto</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {solicitudes.map((solicitud) => (
              <TableRow
                key={solicitud.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{solicitud.id}</TableCell>
                <TableCell>{solicitud.producto}</TableCell>
                <TableCell>{solicitud.cantidad}</TableCell>
                <TableCell>{solicitud.cliente}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleOpenEdit(solicitud)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteSolicitud(solicitud.id)}
                    >
                      Eliminar
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Crear */}
      <Modal open={openCreate} onClose={handleCloseCreate}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <h3>Crear Solicitud</h3>
          <TextField
            fullWidth
            label="Producto"
            name="producto"
            value={newSolicitud.producto}
            onChange={handleInputChange}
            margin="normal"
            error={!!errors.producto}
            helperText={errors.producto}
            sx={{
              '& .MuiInputBase-input': {
                border: 'none',
              },
            }}
          />
          <TextField
            fullWidth
            label="Cantidad"
            name="cantidad"
            value={newSolicitud.cantidad}
            onChange={handleInputChange}
            margin="normal"
            type="number"
            error={!!errors.cantidad}
            helperText={errors.cantidad}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Cliente"
            name="cliente"
            value={newSolicitud.cliente}
            onChange={handleInputChange}
            margin="normal"
            error={!!errors.cliente}
            helperText={errors.cliente}
            sx={{
              '& .MuiInputBase-input': {
                border: 'none',
              },
            }}
          />
          <Stack direction="row" spacing={2} mt={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCloseCreate}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateSolicitud}
            >
              Guardar
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Modal Editar */}
      <Modal open={openEdit} onClose={handleCloseEdit}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <h3>Editar Solicitud</h3>
          <TextField
            fullWidth
            label="Producto"
            name="producto"
            value={editSolicitud?.producto || ''}
            onChange={(e) =>
              setEditSolicitud({ ...editSolicitud, producto: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Cantidad"
            name="cantidad"
            value={editSolicitud?.cantidad || ''}
            onChange={(e) =>
              setEditSolicitud({ ...editSolicitud, cantidad: e.target.value })
            }
            margin="normal"
            type="number"
          />
          <TextField
            fullWidth
            label="Cliente"
            name="cliente"
            value={editSolicitud?.cliente || ''}
            onChange={(e) =>
              setEditSolicitud({ ...editSolicitud, cliente: e.target.value })
            }
            margin="normal"
          />
          <Stack direction="row" spacing={2} mt={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCloseEdit}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditSolicitud}
            >
              Guardar
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  )
}
