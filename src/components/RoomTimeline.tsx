"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, Edit, Trash2, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format, differenceInDays, addDays, startOfMonth } from "date-fns"
import { es } from "date-fns/locale"

interface Room {
  name: string
  slug: string
  description: string
  floor: number
  capacity: number
  hasPrivateToilet: boolean
}

interface Booking {
  id: string
  roomSlug: string
  startDay: number
  endDay: number
  guestName: string
  description: string
  color: string
}

// Colores para las reservas
const BOOKING_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-amber-500",
]

const ROOMS: Room[] = [
  {
    name: "Rapa Nui",
    slug: "rapa-nui",
    description: "Habitación con cama matrimonial y baño privado, con vista al lago Villarrica.",
    floor: 1,
    capacity: 2,
    hasPrivateToilet: true,
  },
  {
    name: "Conguillío",
    slug: "conguillio",
    description: "Habitación con 3 camas individuales de 1,5 plazas, agradable luz natural y calefacción en el interior.",
    floor: 1,
    capacity: 3,
    hasPrivateToilet: false,
  },
  {
    name: "Villarrica",
    slug: "villarrica",
    description: "Habitación con una cama matrimonial y vista al volcán Villarrica, con luz del amanecer y atardeceres coloridos.",
    floor: 1,
    capacity: 2,
    hasPrivateToilet: false,
  },
  {
    name: "Laguna San Rafael",
    slug: "laguna-san-rafael",
    description: "Dormitorio compartido con 6 camas individuales, 2 de ellas literas, y luz natural.",
    floor: 0,
    capacity: 6,
    hasPrivateToilet: false,
  },
  {
    name: "Torres del Paine",
    slug: "torres-del-paine",
    description: "Habitación con 2 camas individuales de 1,5 plazas, vista al volcán Villarrica y luz natural.",
    floor: 1,
    capacity: 4,
    hasPrivateToilet: false,
  },
  {
    name: "Huerquehue",
    slug: "huerquehue",
    description: "Habitación individual con una cama de 1,5 plazas y vista al volcán.",
    floor: 2,
    capacity: 2,
    hasPrivateToilet: false,
  },
  {
    name: "Pumalin",
    slug: "pumalin",
    description: "Habitación con 2 camas de 1,5 plazas, luz natural y vista al volcán Villarrica.",
    floor: 2,
    capacity: 2,
    hasPrivateToilet: false,
  },
  {
    name: "Nahuelbuta",
    slug: "nahuelbuta",
    description: "Habitación con una cama de 1,5 plazas.",
    floor: 2,
    capacity: 2,
    hasPrivateToilet: false,
  },
  {
    name: "Queulat",
    slug: "queulat",
    description: "Habitación con una cama matrimonial y una cama de 1,5 plazas, vista a la ciudad, al lago y al volcán Llaima.",
    floor: 2,
    capacity: 3,
    hasPrivateToilet: false,
  },
]

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (booking: Omit<Booking, "id" | "color">) => void
  editingBooking?: Booking
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onSave, editingBooking }) => {
  // Get the first day of the current month
  const monthStart = startOfMonth(new Date())

  // Convert day number to date
  const dayToDate = (day: number) => {
    return addDays(monthStart, day - 1)
  }

  // Convert date to day number
  const dateToDay = (date: Date) => {
    return differenceInDays(date, monthStart) + 1
  }

  const [formData, setFormData] = useState({
    roomSlug: editingBooking?.roomSlug || "",
    startDate: editingBooking ? format(dayToDate(editingBooking.startDay), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    endDate: editingBooking ? format(dayToDate(editingBooking.endDay), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    guestName: editingBooking?.guestName || "",
    description: editingBooking?.description || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.roomSlug || !formData.guestName) return

    // Convert dates to day numbers
    const startDay = dateToDay(new Date(formData.startDate))
    const endDay = dateToDay(new Date(formData.endDate))

    onSave({
      roomSlug: formData.roomSlug,
      startDay,
      endDay,
      guestName: formData.guestName,
      description: formData.description,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            {editingBooking ? "Editar Reserva" : "Nueva Reserva"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="room">Habitación</Label>
            <Select
              value={formData.roomSlug}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, roomSlug: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar habitación" />
              </SelectTrigger>
              <SelectContent>
                {ROOMS.map((room) => (
                  <SelectItem key={room.slug} value={room.slug}>
                    <div className="flex flex-col">
                      <span>{room.name}</span>
                      <span className="text-xs text-gray-500">{room.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha inicio</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                min={format(monthStart, "yyyy-MM-dd")}
                max={format(addDays(monthStart, 29), "yyyy-MM-dd")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha fin</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                min={formData.startDate}
                max={format(addDays(monthStart, 29), "yyyy-MM-dd")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guestName">Nombre del huésped</Label>
            <Input
              id="guestName"
              value={formData.guestName}
              onChange={(e) => setFormData((prev) => ({ ...prev, guestName: e.target.value }))}
              placeholder="Nombre completo del huésped"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Notas adicionales</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Detalles adicionales de la reserva..."
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Guardar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface BookingPopoverProps {
  booking: Booking
  onEdit: () => void
  onDelete: () => void
  children: React.ReactNode
}

const BookingPopover: React.FC<BookingPopoverProps> = ({ booking, onEdit, onDelete, children }) => {
  const room = ROOMS.find((r) => r.slug === booking.roomSlug)
  const duration = booking.endDay - booking.startDay + 1
  const monthStart = startOfMonth(new Date())
  const startDate = addDays(monthStart, booking.startDay - 1)
  const endDate = addDays(monthStart, booking.endDay - 1)

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg">{booking.guestName}</h4>
            <div className="text-sm text-gray-500">{room?.name}</div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>
              {duration} día{duration > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              {format(startDate, "dd MMM", { locale: es })} - {format(endDate, "dd MMM yyyy", { locale: es })}
            </span>
          </div>

          {booking.description && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{booking.description}</p>
            </div>
          )}

          <div className="flex space-x-2 pt-2 border-t">
            <Button variant="outline" onClick={onEdit} className="flex-1">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="secondary"
              onClick={onDelete}
              className="flex-1"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Borrar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default function RoomTimeline() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | undefined>()
  const [bookings, setBookings] = useState<Booking[]>([])

  const days = Array.from({ length: 30 }, (_, i) => i + 1)

  // Cargar reservas del localStorage al iniciar
  useEffect(() => {
    const savedBookings = localStorage.getItem("roomBookings")
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings))
    }
  }, [])

  // Guardar reservas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("roomBookings", JSON.stringify(bookings))
  }, [bookings])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => setIsDragging(false)
  const handleMouseLeave = () => setIsDragging(false)

  const handleSaveBooking = (bookingData: Omit<Booking, "id" | "color">) => {
    if (editingBooking) {
      // Actualizar reserva existente
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === editingBooking.id
            ? { ...booking, ...bookingData }
            : booking
        )
      )
    } else {
      // Crear nueva reserva
      const newBooking: Booking = {
        ...bookingData,
        id: Math.random().toString(36).substr(2, 9),
        color: BOOKING_COLORS[Math.floor(Math.random() * BOOKING_COLORS.length)],
      }
      setBookings((prev) => [...prev, newBooking])
    }
    setEditingBooking(undefined)
  }

  const handleDeleteBooking = (bookingId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta reserva?")) {
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId))
    }
  }

  const renderBooking = (booking: Booking) => {
    const width = (booking.endDay - booking.startDay + 1) * 40
    const left = (booking.startDay - 1) * 40

    return (
      <BookingPopover
        key={booking.id}
        booking={booking}
        onEdit={() => {
          setEditingBooking(booking)
          setIsModalOpen(true)
        }}
        onDelete={() => handleDeleteBooking(booking.id)}
      >
        <div
          className={`absolute top-1 bottom-1 ${booking.color} rounded-md flex items-center justify-center text-white text-xs font-medium shadow-sm cursor-pointer hover:shadow-md transition-all hover:scale-105`}
          style={{ left: `${left}px`, width: `${width}px` }}
          title={booking.guestName}
        >
          <span className="truncate px-2">{booking.guestName}</span>
        </div>
      </BookingPopover>
    )
  }

  // Función para obtener el día de la semana en español
  const getDayOfWeek = (dayNumber: number) => {
    const startDate = new Date(2024, 0, 1) // 1 de enero de 2024 (lunes)
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + dayNumber - 1)

    const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
    return daysOfWeek[currentDate.getDay()]
  }

  // Función para verificar si es fin de semana
  const isWeekend = (dayNumber: number) => {
    const startDate = new Date(2024, 0, 1)
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + dayNumber - 1)
    const dayOfWeek = currentDate.getDay()
    return dayOfWeek === 0 || dayOfWeek === 6 // Domingo o Sábado
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
        <h2 className="text-xl font-semibold text-slate-800">Cronograma de Habitaciones</h2>
        <Button
          onClick={() => {
            setEditingBooking(undefined)
            setIsModalOpen(true)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Reserva
        </Button>
      </div>

      <div className="flex">
        {/* Rooms Column */}
        <div className="w-48 bg-slate-50 border-r">
          <div className="h-12 border-b bg-slate-100 flex items-center px-3">
            <span className="text-sm font-medium text-slate-600">Habitaciones</span>
          </div>
          {ROOMS.map((room) => (
            <div
              key={room.slug}
              className="h-12 border-b border-slate-200 flex items-center px-3 bg-white hover:bg-slate-50 transition-colors"
            >
              <div>
                <span className="text-sm font-medium text-slate-700">{room.name}</span>
                <div className="text-xs text-slate-500">
                  {room.capacity} persona{room.capacity > 1 ? "s" : ""}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ userSelect: "none" }}
        >
          <div className="relative" style={{ width: `${days.length * 40}px` }}>
            {/* Days Header */}
            <div className="h-12 border-b bg-slate-100 flex">
              {days.map((day) => {
                const dayOfWeek = getDayOfWeek(day)
                const weekend = isWeekend(day)

                return (
                  <div
                    key={day}
                    className={`w-10 h-12 border-r border-slate-200 flex flex-col items-center justify-center text-xs font-medium ${
                      weekend ? "bg-slate-200 text-slate-700" : "text-slate-600"
                    }`}
                  >
                    <span className="text-[10px] text-slate-500">{dayOfWeek}</span>
                    <span>{day}</span>
                  </div>
                )
              })}
            </div>

            {/* Room Rows */}
            {ROOMS.map((room) => (
              <div key={room.slug} className="relative h-12 border-b border-slate-200">
                <div className="flex h-full">
                  {days.map((day) => {
                    const weekend = isWeekend(day)
                    return (
                      <div
                        key={day}
                        className={`w-10 h-full border-r border-slate-200 transition-colors ${
                          weekend ? "bg-slate-100" : "hover:bg-slate-50"
                        }`}
                      />
                    )
                  })}
                </div>
                {bookings
                  .filter((booking) => booking.roomSlug === room.slug)
                  .map((booking) => renderBooking(booking))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingBooking(undefined)
        }}
        onSave={handleSaveBooking}
        editingBooking={editingBooking}
      />
    </div>
  )
}
