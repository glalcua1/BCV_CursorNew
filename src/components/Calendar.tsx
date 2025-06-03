import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  attendees: number;
}

interface Holiday {
  name: string;
  date: string;
  type: 'public' | 'bank' | 'observance';
}

const Calendar: React.FC<{ events: Event[] }> = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays] = useState<Holiday[]>([
    { name: "Easter Monday", date: "2024-04-01", type: "public" },
    { name: "Early May Bank Holiday", date: "2024-05-06", type: "bank" },
    { name: "Spring Bank Holiday", date: "2024-05-27", type: "bank" },
    { name: "St. George's Day", date: "2024-04-23", type: "observance" },
    { name: "Ramadan Start", date: "2024-04-09", type: "observance" },
    { name: "Eid al-Fitr", date: "2024-04-10", type: "observance" }
  ]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get events for the current day
  const getDayEvents = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.date), date)
    );
  };

  // Get holidays for the current day
  const getDayHolidays = (date: Date) => {
    return holidays.filter(holiday => 
      isSameDay(new Date(holiday.date), date)
    );
  };

  const previousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Calendar
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={previousMonth}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="text-xl font-semibold text-gray-800">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-t-2xl text-sm font-semibold text-gray-600">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="px-4 py-3 text-center">{day}</div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {daysInMonth.map((date, idx) => {
              const dayEvents = getDayEvents(date);
              const dayHolidays = getDayHolidays(date);
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isCurrentDay = isToday(date);

              return (
                <div
                  key={idx}
                  className={`min-h-[150px] bg-white p-2 ${
                    !isCurrentMonth ? 'text-gray-400' : 'text-gray-900'
                  } ${isCurrentDay ? 'ring-2 ring-purple-500 ring-inset' : ''}`}
                >
                  <div className="font-medium mb-1">{format(date, 'd')}</div>
                  
                  {/* Holidays */}
                  {dayHolidays.map((holiday, holidayIdx) => (
                    <div
                      key={holidayIdx}
                      className={`text-xs mb-1 px-2 py-1 rounded-full ${
                        holiday.type === 'public' ? 'bg-red-100 text-red-700' :
                        holiday.type === 'bank' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {holiday.name}
                    </div>
                  ))}

                  {/* Events */}
                  {dayEvents.map((event, eventIdx) => (
                    <div
                      key={eventIdx}
                      className="text-xs mb-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 truncate"
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-100 border border-red-700 mr-2"></div>
            <span className="text-sm text-gray-600">Public Holiday</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-700 mr-2"></div>
            <span className="text-sm text-gray-600">Bank Holiday</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-700 mr-2"></div>
            <span className="text-sm text-gray-600">Observance</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-100 border border-purple-700 mr-2"></div>
            <span className="text-sm text-gray-600">Event</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar; 