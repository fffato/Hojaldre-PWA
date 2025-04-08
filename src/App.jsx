
// src/App.jsx
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import emailjs from 'emailjs-com'

const SERVICE_ID = 'service_r03xdq2'
const TEMPLATE_ID = 'template_814z7lt'
const PUBLIC_KEY = '6SNUAvC9BxqbukMt7'

function App() {
  const [pedidos, setPedidos] = useState(() => {
    const saved = localStorage.getItem('pedidos')
    return saved ? JSON.parse(saved) : []
  })
  const [nuevoPedido, setNuevoPedido] = useState({ nombre: '', producto: '', nota: '', fecha: '' })

  useEffect(() => {
    localStorage.setItem('pedidos', JSON.stringify(pedidos))
  }, [pedidos])

  useEffect(() => {
    const hoy = dayjs()
    pedidos.forEach(p => {
      const fechaEntrega = dayjs(p.fecha)
      if (fechaEntrega.diff(hoy, 'day') === 1 && !p.emailEnviado) {
        emailjs.send(SERVICE_ID, TEMPLATE_ID, {
          nombre: p.nombre,
          producto: p.producto,
          nota: p.nota || '-',
          fecha: dayjs(p.fecha).format('DD/MM/YYYY'),
        }, PUBLIC_KEY)
        .then(() => {
          // Marcamos que el correo fue enviado (solo en esta sesión)
          p.emailEnviado = true
          setPedidos([...pedidos])
        })
        .catch(err => console.error('Error enviando email:', err))
      }
    })
  }, [pedidos])

  const agregarPedido = () => {
    if (!nuevoPedido.nombre || !nuevoPedido.producto || !nuevoPedido.fecha) return
    setPedidos([...pedidos, { ...nuevoPedido, id: Date.now(), emailEnviado: false }])
    setNuevoPedido({ nombre: '', producto: '', nota: '', fecha: '' })
  }

  const eliminarPedido = (id) => {
    setPedidos(pedidos.filter(p => p.id !== id))
  }

  return (
    <div className="min-h-screen p-4 bg-pink-50 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">HojaldreYSablée - Pedidos</h1>

      <div className="mb-4 grid gap-2">
        <input className="p-2 border rounded" placeholder="Nombre del cliente" value={nuevoPedido.nombre} onChange={e => setNuevoPedido({ ...nuevoPedido, nombre: e.target.value })} />
        <input className="p-2 border rounded" placeholder="Producto" value={nuevoPedido.producto} onChange={e => setNuevoPedido({ ...nuevoPedido, producto: e.target.value })} />
        <input className="p-2 border rounded" placeholder="Nota (opcional)" value={nuevoPedido.nota} onChange={e => setNuevoPedido({ ...nuevoPedido, nota: e.target.value })} />
        <input type="date" className="p-2 border rounded" value={nuevoPedido.fecha} onChange={e => setNuevoPedido({ ...nuevoPedido, fecha: e.target.value })} />
        <button className="bg-pink-500 text-white py-2 px-4 rounded" onClick={agregarPedido}>Agregar pedido</button>
      </div>

      <div className="grid gap-2">
        {pedidos.map(p => (
          <div key={p.id} className="p-3 bg-white shadow rounded flex justify-between items-start">
            <div>
              <p className="font-semibold">{p.nombre} - {p.producto}</p>
              {p.nota && <p className="text-sm text-gray-600">{p.nota}</p>}
              <p className="text-sm text-gray-500">Entrega: {dayjs(p.fecha).format('DD/MM/YYYY')}</p>
            </div>
            <button className="text-red-500" onClick={() => eliminarPedido(p.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App

