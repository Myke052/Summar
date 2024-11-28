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
import Stack from '@mui/material/Stack'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'

export default function ClientsPage() {
  // Estado para clientes
  const [clients, setClients] = useState([])

  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [clientToEdit, setClientToEdit] = useState(null)
  const [clientToDelete, setClientToDelete] = useState(null)
  const [emailError, setEmailError] = useState('')
  const [formError, setFormError] = useState('')

  // Cargar clientes desde localStorage al iniciar la página
  useEffect(() => {
    const savedClients = JSON.parse(localStorage.getItem('clients')) || []
    setClients(savedClients)
  }, [])

  // Guardar clientes en localStorage cada vez que cambie el estado de clients
  useEffect(() => {
    if (clients.length > 0) {
      localStorage.setItem('clients', JSON.stringify(clients))
    }
  }, [clients])

  // Abrir modal de agregar cliente
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true)
  }

  // Cerrar modal de agregar cliente
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false)
    setEmailError('') // Resetear error de email cuando se cierre el modal
    setFormError('') // Resetear error de formulario
  }

  // Abrir modal de editar cliente con datos pre-cargados
  const handleOpenEditDialog = (client) => {
    setClientToEdit(client)
    setNewClient({ ...client }) // Pre-llenar los campos con los datos del cliente
    setOpenEditDialog(true)
    setEmailError('') // Resetear error de email cuando se abre el modal
    setFormError('') // Resetear error de formulario
  }

  // Cerrar modal de editar cliente
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false)
  }

  // Abrir modal de borrar cliente
  const handleOpenDeleteDialog = (client) => {
    setClientToDelete(client)
    setOpenDeleteDialog(true)
  }

  // Cerrar modal de borrar cliente
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  // Manejar cambio de inputs en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setNewClient((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  //Expresion regular para la validacion de los correos electronicos
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  // Función para validar el email
  const validateEmail = (email) => {
    if (emailRegex.test(email)) {
      return true
    } else {
      return false
    }
    // return email.includes('@') // Verifica si el email contiene el carácter '@'
  }

  // Validar si los campos no están vacíos
  const validateForm = () => {
    if (!newClient.name || !newClient.email || !newClient.phone) {
      setFormError('Todos los campos son obligatorios')
      return false
    }
    if (!validateEmail(newClient.email)) {
      setEmailError('El correo electrónico es invalido')
      return false
    }
    setFormError('')
    setEmailError('')
    return true
  }

  // Agregar un nuevo cliente
  const addClient = () => {
    if (!validateForm()) return // Solo procede si la validación pasa
    const nextId = clients.length > 0 ? clients[clients.length - 1].id + 1 : 1
    const newClientData = { id: nextId, ...newClient }
    setClients((prevClients) => [...prevClients, newClientData])
    setNewClient({ name: '', email: '', phone: '' })
    handleCloseAddDialog()
  }

  // Editar un cliente existente
  const editClient = () => {
    if (!validateForm()) return // Solo procede si la validación pasa
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === clientToEdit.id ? { ...client, ...newClient } : client
      )
    )
    setNewClient({ name: '', email: '', phone: '' })
    setClientToEdit(null)
    handleCloseEditDialog()
  }

  // Borrar un cliente
  const deleteClient = () => {
    // Eliminar el cliente del estado
    const updatedClients = clients.filter(
      (client) => client.id !== clientToDelete.id
    )
    setClients(updatedClients)

    // Actualizar el localStorage con la lista de clientes actualizada
    localStorage.setItem('clients', JSON.stringify(updatedClients))

    setClientToDelete(null)
    handleCloseDeleteDialog()
  }

  return (
    <>
      <div style={{ padding: '20px' }}>
        <Stack direction="row" spacing={2} justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddDialog}
          >
            Agregar Cliente
          </Button>
        </Stack>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="clients table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <TableRow
                  key={client.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{client.id}</TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleOpenEditDialog(client)}
                        sx={{ backgroundColor: '#8cc110' }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        sx={{ backgroundColor: '#cdc7c7' }}
                        onClick={() => handleOpenDeleteDialog(client)}
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

        {/* Modal de agregar cliente */}
        <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
          <DialogTitle>Agregar Cliente</DialogTitle>
          <DialogContent aria-hidden="false">
            <TextField
              autoFocus
              margin="dense"
              label="Nombre"
              type="text"
              fullWidth
              name="name"
              value={newClient.name}
              onChange={handleChange}
              sx={{
                '& .MuiInputBase-input': {
                  border: 'none',
                },
              }}
            />

            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              name="email"
              value={newClient.email}
              onChange={handleChange}
              sx={{ marginBottom: 2 }} // Espacio consistente entre los inputs
            />
            {emailError && <FormHelperText error>{emailError}</FormHelperText>}

            <TextField
              margin="dense"
              label="Teléfono"
              type="text"
              fullWidth
              variant="outlined"
              name="phone"
              value={newClient.phone}
              onChange={handleChange}
              sx={{
                '& .MuiInputBase-input': {
                  border: 'none',
                },
              }}
            />
            {formError && <FormHelperText error>{formError}</FormHelperText>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog} color="secondary">
              Cancelar
            </Button>
            <Button onClick={addClient} color="primary">
              Agregar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal de editar cliente */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nombre"
              type="text"
              fullWidth
              name="name"
              value={newClient.name}
              onChange={handleChange}
            />

            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              name="email"
              value={newClient.email}
              onChange={handleChange}
            />
            {emailError && <FormHelperText error>{emailError}</FormHelperText>}

            <TextField
              margin="dense"
              label="Teléfono"
              type="text"
              fullWidth
              variant="outlined"
              name="phone"
              value={newClient.phone}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} color="secondary">
              Cancelar
            </Button>
            <Button onClick={editClient} color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal de eliminar cliente */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Eliminar Cliente</DialogTitle>
          <DialogContent>
            <p>¿Estás seguro de que deseas eliminar a este cliente?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="secondary">
              Cancelar
            </Button>
            <Button onClick={deleteClient} color="error">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}
