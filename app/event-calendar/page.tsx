"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, CalendarIcon, List, Bell, BellOff, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { extractDatesFromText, extractEventDetails } from "@/utils/dateExtractor"
import { format, isSameMonth, isSameDay } from "date-fns"

interface RssEvent {
  title: string
  link: string
  pubDate: string
  description: string
  eventDate: Date
  eventType: string
  company: string
}

export default function BusinessCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isCalendarView, setIsCalendarView] = useState(true)
  const [alertsEnabled, setAlertsEnabled] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [events, setEvents] = useState<RssEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/jse-events")
        if (!response.ok) throw new Error("Failed to fetch events")

        const data = await response.json()
        if (!data.jamstockex) {
          throw new Error("No JSE data received")
        }

        const parser = new DOMParser()
        const doc = parser.parseFromString(data.jamstockex, "text/xml")

        const items = Array.from(doc.querySelectorAll("item")).flatMap((item): RssEvent[] => {
          const title = item.querySelector("title")?.textContent || ""
          const description = item.querySelector("description")?.textContent || ""
          const pubDate = item.querySelector("pubDate")?.textContent || ""
          const link = item.querySelector("link")?.textContent || ""

          const dates = extractDatesFromText(description)
          const { eventType, company } = extractEventDetails(description)

          return dates.map((date) => ({
            title,
            link,
            pubDate,
            description,
            eventDate: date,
            eventType,
            company,
          }))
        })

        setEvents(items)
        setError(null)
      } catch (error) {
        console.error("Error fetching RSS feed:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch events")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const toggleAlerts = () => {
    setAlertsEnabled(!alertsEnabled)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  const getEventStatus = (date: string) => {
    const today = new Date()
    const eventDate = new Date(date)
    today.setHours(0, 0, 0, 0)
    eventDate.setHours(0, 0, 0, 0)

    if (eventDate.getTime() === today.getTime()) return "today"
    if (eventDate < today) return "past"
    return "upcoming"
  }

  const getStatusStyles = (status: string) => {
    const styles = {
      past: "opacity-50",
      today: "border-2 border-blue-500",
      upcoming: "",
    }
    return styles[status as keyof typeof styles] || ""
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      past: "Past Events",
      today: "Today's Events",
      upcoming: "Upcoming Events",
    }
    return labels[status as keyof typeof labels]
  }

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const days = []
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d))
    }
    return days
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.eventDate, date))
  }

  const getFilteredEvents = () => {
    return events
      .filter((event) => isSameMonth(event.eventDate, currentMonth))
      .sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime())
  }

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(currentMonth.getMonth() + direction)
    setCurrentMonth(newDate)
  }

  const getEventTypeColor = (type: string) => {
    const colors = {
      AGM: "bg-blue-100 text-blue-800",
      "Board Meeting": "bg-slate-100 text-slate-800",
      Earnings: "bg-emerald-100 text-emerald-800",
      "Stock Split": "bg-violet-100 text-violet-800",
      "Rights Issue": "bg-orange-100 text-orange-800",
      IPO: "bg-green-100 text-green-800",
      Dividend: "bg-purple-100 text-purple-800",
      Merger: "bg-indigo-100 text-indigo-800",
      Acquisition: "bg-cyan-100 text-cyan-800",
      "Corporate Event": "bg-gray-100 text-gray-800",
    }
    return colors[type as keyof typeof colors] || colors["Corporate Event"]
  }

  // Event type grouping for legend
  const eventGroups = {
    "Corporate Events": ["AGM", "Board Meeting", "Earnings"],
    "Stock Events": ["Stock Split", "Rights Issue"],
    "Public Offerings": ["IPO"],
    "Financial Events": ["Dividend", "Merger", "Acquisition"],
  }

  const Legend = () => (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-lg font-semibold mb-4">Event Types</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(eventGroups).map(([group, types]) => (
          <div key={group} className="space-y-2">
            <h4 className="font-medium text-sm text-gray-600">{group}</h4>
            <div className="space-y-1">
              {types.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${getEventTypeColor(type).replace("text-", "bg-")}`}></span>
                  <span className="text-sm">{type}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const CalendarView = () => (
    <div className="grid grid-cols-7 gap-2">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day} className="text-center font-semibold p-2">
          {day}
        </div>
      ))}

      {getMonthDays(currentMonth).map((date, index) => {
        const events = getEventsForDate(date)
        const isToday = isSameDay(date, new Date())

        return (
          <div
            key={date.toString()}
            className={`min-h-24 p-2 border rounded-lg ${
              isSameMonth(date, currentMonth) ? "bg-white" : "bg-gray-50"
            } ${isToday ? "ring-2 ring-blue-500" : ""}`}
            style={{ gridColumnStart: index === 0 ? date.getDay() + 1 : "auto" }}
          >
            <div className="font-medium text-sm mb-1">{date.getDate()}</div>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {events.map((event, i) => (
                <div
                  key={i}
                  className={`text-xs p-1 rounded ${getEventTypeColor(event.eventType)}`}
                  title={`${event.company}: ${event.title}`}
                >
                  <div className="font-semibold truncate">{event.eventType}</div>
                  <div className="truncate">{event.company}</div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )

  const ListView = () => {
    const events = getFilteredEvents()
    const today = new Date()

    const groupedEvents = {
      upcoming: events.filter((event) => event.eventDate > today),
      today: events.filter((event) => isSameDay(event.eventDate, today)),
      past: events.filter((event) => event.eventDate < today),
    }

    return (
      <div className="space-y-6">
        {Object.entries(groupedEvents).map(
          ([status, statusEvents]) =>
            statusEvents.length > 0 && (
              <div key={status} className="space-y-4">
                <h3 className="text-lg font-semibold capitalize flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {getStatusLabel(status)}
                </h3>
                <div className="space-y-4">
                  {statusEvents.map((event, index) => (
                    <div
                      key={index}
                      className={`flex items-start p-4 border rounded-lg hover:bg-gray-50 ${getStatusStyles(status)}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-sm ${getEventTypeColor(event.eventType)}`}>
                            {event.eventType}
                          </span>
                          <span className="text-sm text-gray-500">{format(event.eventDate, "MMMM d, yyyy")}</span>
                        </div>
                        <h3 className="text-lg font-semibold mt-2">{event.company}</h3>
                        <p className="text-gray-600 mt-1">{event.title}</p>
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-sm mt-2 inline-block"
                        >
                          Read more
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ),
        )}
      </div>
    )
  }

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">JSE Business Calendar</CardTitle>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleAlerts}
              className={`p-2 rounded-full ${alertsEnabled ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"}`}
              title={alertsEnabled ? "Disable alerts" : "Enable alerts"}
            >
              {alertsEnabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
            </button>
            <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-lg font-medium">
              {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
            </span>
            <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronRight className="h-5 w-5" />
            </button>
            <button onClick={() => setIsCalendarView(!isCalendarView)} className="p-2 hover:bg-gray-100 rounded-full">
              {isCalendarView ? <List className="h-5 w-5" /> : <CalendarIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {showAlert && (
          <Alert className="mt-4">
            <AlertDescription>
              {alertsEnabled
                ? "Event alerts have been enabled. You'll receive notifications for upcoming events."
                : "Event alerts have been disabled."}
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {isCalendarView ? <CalendarView /> : <ListView />}
            <Legend />
          </>
        )}
      </CardContent>
    </Card>
  )
}

