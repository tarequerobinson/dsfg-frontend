"use client"
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Calendar, List, Bell, BellOff, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function BusinessCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isCalendarView, setIsCalendarView] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const businessEvents = [
    {
      date: "2025-02-15",
      type: "AGM",
      company: "Tesla, Inc.",
      details: "Annual General Meeting"
    },
    {
      date: "2025-02-20",
      type: "Stock Split",
      company: "NVIDIA Corp.",
      details: "4:1 Stock Split"
    },
    {
      date: "2025-02-25",
      type: "Dividend",
      company: "Apple Inc.",
      details: "Q1 Dividend Payout"
    },
    {
      date: "2025-03-01",
      type: "Rights Issue",
      company: "Bank of America",
      details: "1:4 Rights Issue"
    },
    {
      date: "2025-03-05",
      type: "IPO",
      company: "AI Ventures Ltd",
      details: "Initial Public Offering"
    },
    {
      date: "2025-03-10",
      type: "Bonus Issue",
      company: "Microsoft Corp.",
      details: "1:1 Bonus Share Issue"
    },
    {
      date: "2025-03-15",
      type: "APO",
      company: "SpaceX",
      details: "Additional Public Offering"
    },
    {
      date: "2025-03-20",
      type: "Earnings",
      company: "Amazon.com Inc.",
      details: "Q4 Earnings Release"
    },
    {
      date: "2025-03-25",
      type: "Board Meeting",
      company: "Meta Platforms",
      details: "Quarterly Board Meeting"
    },
    {
      date: "2025-03-31",
      type: "Financial Year End",
      company: "Multiple Companies",
      details: "End of Financial Year"
    }
  ];

  const toggleAlerts = () => {
    setAlertsEnabled(!alertsEnabled);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const getEventStatus = (date) => {
    const today = new Date();
    const eventDate = new Date(date);
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate.getTime() === today.getTime()) return 'today';
    if (eventDate < today) return 'past';
    return 'upcoming';
  };

  const getStatusStyles = (status) => {
    const styles = {
      past: 'opacity-50',
      today: 'border-2 border-blue-500',
      upcoming: ''
    };
    return styles[status] || '';
  };

  const getStatusLabel = (status) => {
    const labels = {
      past: 'Past',
      today: 'Today',
      upcoming: 'Upcoming'
    };
    return labels[status];
  };

  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  };

  const getEventsForDate = (date) => {
    return businessEvents.filter(event => 
      new Date(event.date).toDateString() === date.toDateString()
    );
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  const getEventTypeColor = (type) => {
    const colors = {
      // Corporate Events
      'AGM': 'bg-blue-100 text-blue-800',
      'Board Meeting': 'bg-slate-100 text-slate-800',
      'Financial Year End': 'bg-red-100 text-red-800',
      'Earnings': 'bg-emerald-100 text-emerald-800',
      
      // Stock Events
      'Stock Split': 'bg-violet-100 text-violet-800',
      'Bonus Issue': 'bg-pink-100 text-pink-800',
      'Rights Issue': 'bg-orange-100 text-orange-800',
      
      // Public Offerings
      'IPO': 'bg-green-100 text-green-800',
      'APO': 'bg-teal-100 text-teal-800',
      
      // Financial Events
      'Dividend': 'bg-purple-100 text-purple-800',
      'Buyback': 'bg-amber-100 text-amber-800',
      'Merger': 'bg-indigo-100 text-indigo-800',
      'Acquisition': 'bg-cyan-100 text-cyan-800',
      
      // Default
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.default;
  };

  // Event type grouping for legend
  const eventGroups = {
    'Corporate Events': ['AGM', 'Board Meeting', 'Financial Year End', 'Earnings'],
    'Stock Events': ['Stock Split', 'Bonus Issue', 'Rights Issue'],
    'Public Offerings': ['IPO', 'APO'],
    'Financial Events': ['Dividend', 'Buyback', 'Merger', 'Acquisition']
  };

  const Legend = () => (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-lg font-semibold mb-4">Event Types</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(eventGroups).map(([group, types]) => (
          <div key={group} className="space-y-2">
            <h4 className="font-medium text-sm text-gray-600">{group}</h4>
            <div className="space-y-1">
              {types.map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${getEventTypeColor(type).replace('text-', 'bg-')}`}></span>
                  <span className="text-sm">{type}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );



  const getFilteredEvents = () => {
    return businessEvents
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getMonth() === currentMonth.getMonth() &&
               eventDate.getFullYear() === currentMonth.getFullYear();
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const CalendarView = () => (
    <div className="grid grid-cols-7 gap-2">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="text-center font-semibold p-2">
          {day}
        </div>
      ))}
      
      {getMonthDays(currentMonth).map((date, index) => {
        const events = getEventsForDate(date);
        const isToday = date.toDateString() === new Date().toDateString();
        
        return (
          <div 
            key={date.toString()}
            className={`min-h-24 p-2 border rounded-lg ${
              date.getMonth() === currentMonth.getMonth() 
                ? 'bg-white' 
                : 'bg-gray-50'
            } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
            style={{ gridColumnStart: index === 0 ? date.getDay() + 1 : 'auto' }}
          >
            <div className="font-medium text-sm mb-1">
              {date.getDate()}
            </div>
            <div className="space-y-1">
              {events.map((event, i) => {
                const status = getEventStatus(event.date);
                return (
                  <div 
                    key={i}
                    className={`text-xs p-1 rounded ${getEventTypeColor(event.type)} ${getStatusStyles(status)}`}
                  >
                    <div className="font-semibold">{event.type}</div>
                    <div>{event.company}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  const ListView = () => {
    const events = getFilteredEvents();
    const groupedEvents = {
      past: events.filter(event => getEventStatus(event.date) === 'past'),
      today: events.filter(event => getEventStatus(event.date) === 'today'),
      upcoming: events.filter(event => getEventStatus(event.date) === 'upcoming')
    };

    return (
      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([status, statusEvents]) => 
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
                        <span className={`px-2 py-1 rounded text-sm ${getEventTypeColor(event.type)}`}>
                          {event.type}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mt-2">{event.company}</h3>
                      <p className="text-gray-600 mt-1">{event.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    );
  };

 return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Business Calendar</CardTitle>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleAlerts}
              className={`p-2 rounded-full ${alertsEnabled ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
              title={alertsEnabled ? 'Disable alerts' : 'Enable alerts'}
            >
              {alertsEnabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
            </button>
            <button 
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-lg font-medium">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button 
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsCalendarView(!isCalendarView)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              {isCalendarView ? <List className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
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
        {isCalendarView ? <CalendarView /> : <ListView />}
        <Legend />
      </CardContent>
    </Card>
  );
}