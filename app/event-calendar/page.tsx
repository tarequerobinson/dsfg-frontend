"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Clock, Bell, BellOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format, isSameMonth, isSameDay } from "date-fns";

interface RssEvent {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  eventDate: Date | null;
  eventType: string;
  company: string;
}

export default function BusinessCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [events, setEvents] = useState<RssEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listViewMode, setListViewMode] = useState<"month" | "all">("all");

  useEffect(() => {
    async function fetchEvents() {
      // Check local storage for cached events
      const cachedEvents = localStorage.getItem("jse-events");
      if (cachedEvents) {
        const { events, timestamp } = JSON.parse(cachedEvents);
        if (Date.now() - timestamp < 60 * 60 * 1000) { // 1 hour cache
          setEvents(
            events.map((event: RssEvent) => ({
              ...event,
              eventDate: event.eventDate ? new Date(event.eventDate) : null,
            }))
          );
          setLoading(false);
          return;
        }
      }

      try {
        const response = await fetch("/api/jse-events");
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();
        if (!data.events) {
          throw new Error("No event data received");
        }

        const parsedEvents = data.events.map((event: RssEvent) => ({
          ...event,
          eventDate: event.eventDate ? new Date(event.eventDate) : null,
        }));

        setEvents(parsedEvents);
        setError(null);

        // Cache events in local storage
        localStorage.setItem(
          "jse-events",
          JSON.stringify({ events: parsedEvents, timestamp: Date.now() })
        );
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const toggleAlerts = () => {
    setAlertsEnabled(!alertsEnabled);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const getEventStatus = (date: Date | null) => {
    if (!date) return "upcoming";
    const today = new Date();
    const eventDate = new Date(date);
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate.getTime() === today.getTime()) return "today";
    if (eventDate < today) return "past";
    return "upcoming";
  };

  const getStatusStyles = (status: string) => {
    const styles = {
      past: "opacity-50",
      today: "border-2 border-blue-500",
      upcoming: "",
    };
    return styles[status as keyof typeof styles] || "";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      past: "Past Events",
      today: "Today's Events",
      upcoming: "Upcoming Events",
    };
    return labels[status as keyof typeof labels];
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  const getFilteredEvents = () => {
    const filtered = listViewMode === "month"
      ? events.filter((event) => event.eventDate && isSameMonth(event.eventDate, currentMonth))
      : events.filter((event) => !event.eventDate || event.eventDate >= new Date());

    return filtered.sort((a, b) => {
      const dateA = a.eventDate ? a.eventDate.getTime() : Infinity;
      const dateB = b.eventDate ? b.eventDate.getTime() : Infinity;
      return dateA - dateB;
    });
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      AGM: "bg-blue-100 text-blue-900 dark:bg-blue-400 dark:text-blue-950",
      "Board Meeting": "bg-neutral-100 text-neutral-900 dark:bg-neutral-400 dark:text-neutral-950",
      Earnings: "bg-emerald-100 text-emerald-900 dark:bg-emerald-400 dark:text-emerald-950",
      "Stock Split": "bg-violet-100 text-violet-900 dark:bg-violet-400 dark:text-violet-950",
      "Rights Issue": "bg-orange-100 text-orange-900 dark:bg-orange-400 dark:text-orange-950",
      IPO: "bg-green-100 text-green-900 dark:bg-green-400 dark:text-green-950",
      Dividend: "bg-purple-100 text-purple-900 dark:bg-purple-400 dark:text-purple-950",
      Merger: "bg-indigo-100 text-indigo-900 dark:bg-indigo-400 dark:text-indigo-950",
      Acquisition: "bg-cyan-100 text-cyan-900 dark:bg-cyan-400 dark:text-cyan-950",
      "Corporate Event": "bg-neutral-100 text-neutral-900 dark:bg-neutral-400 dark:text-neutral-950",
    };
    return colors[type as keyof typeof colors] || colors["Corporate Event"];
  };

  const getEventColorDot = (type: string) => {
    // Extract the background color class for the legend dots
    const colorClass = getEventTypeColor(type);
    const bgClassMatch = colorClass.match(/bg-([^\s]+)/);
    return bgClassMatch ? `bg-${bgClassMatch[1]}` : "bg-neutral-400";
  };

  const eventGroups = {
    "Corporate Events": ["AGM", "Board Meeting", "Earnings"],
    "Stock Events": ["Stock Split", "Rights Issue"],
    "Public Offerings": ["IPO"],
    "Financial Events": ["Dividend", "Merger", "Acquisition"],
  };

  const Legend = () => (
    <div className="mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-800">
      <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-50">Event Types</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(eventGroups).map(([group, types]) => (
          <div key={group} className="space-y-2">
            <h4 className="font-medium text-sm text-neutral-600 dark:text-neutral-300">{group}</h4>
            <div className="space-y-1">
              {types.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${getEventColorDot(type)}`}></span>
                  <span className="text-sm text-neutral-700 dark:text-neutral-200">{type}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ListView = () => {
    const events = getFilteredEvents();
    const today = new Date();

    const groupedEvents = {
      upcoming: events.filter((event) => !event.eventDate || event.eventDate > today),
      today: events.filter((event) => event.eventDate && isSameDay(event.eventDate, today)),
      past: events.filter((event) => event.eventDate && event.eventDate < today && listViewMode === "month"),
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setListViewMode(listViewMode === "month" ? "all" : "month")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {listViewMode === "month" ? "Show All Upcoming" : "Show Current Month Only"}
          </button>
        </div>
        {Object.entries(groupedEvents).map(
          ([status, statusEvents]) =>
            statusEvents.length > 0 && (
              <div key={status} className="space-y-4">
                <h3 className="text-lg font-semibold capitalize flex items-center gap-2 text-neutral-900 dark:text-neutral-50">
                  <Clock className="h-5 w-5" />
                  {getStatusLabel(status)}
                </h3>
                <div className="space-y-4">
                  {statusEvents.map((event, index) => (
                    <div
                      key={index}
                      className={`flex items-start p-4 border rounded-lg 
                        border-neutral-200 dark:border-neutral-800
                        hover:bg-neutral-50 dark:hover:bg-neutral-800 
                        ${getStatusStyles(status)}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-sm ${getEventTypeColor(event.eventType)}`}>
                            {event.eventType}
                          </span>
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">
                            {event.eventDate ? format(event.eventDate, "MMMM d, yyyy") : "TBD"}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold mt-2 text-neutral-900 dark:text-neutral-50">
                          {event.company}
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-300 mt-1">{event.title}</p>
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
    );
  };

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            JSE Business Calendar
            <span className="text-sm font-normal ml-2">
              ({listViewMode === "month" ? "Current Month" : "All Upcoming"})
            </span>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleAlerts}
              className={`p-2 rounded-full ${
                alertsEnabled
                  ? "bg-blue-100 text-blue-900 dark:bg-blue-400 dark:text-blue-950"
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
              title={alertsEnabled ? "Disable alerts" : "Enable alerts"}
            >
              {alertsEnabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
            </button>
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-lg font-medium text-neutral-900 dark:text-neutral-50">
              {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
            </span>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
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
        {error && (
          <Alert className="mt-4" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : events.length === 0 && !error ? (
          <div className="text-center py-12 text-neutral-500">
            <p>No events available. Please try again later.</p>
          </div>
        ) : (
          <>
            <ListView />
            <Legend />
          </>
        )}
      </CardContent>
    </Card>
  );
}