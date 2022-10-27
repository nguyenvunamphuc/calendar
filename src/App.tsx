import { createRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import scrollGridPlugin from '@fullcalendar/scrollgrid';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import moment from 'moment-timezone';

import './styles.css';
import { events, eventConstraints, resources } from './data';

export default function App() {
  const handleDateClick = (arg: any) => {
    // bind with an arrow function
    alert(arg.dateStr);
  };

  const handleEventClick = (arg: any) => {
    console.log(arg);
  };

  const calendarRef = createRef<FullCalendar>();

  useEffect(() => {
    if (calendarRef && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();

      debugger;
      //window.dateOnClick = calendarApi.select;
    }
  }, [calendarRef]);

  const handleResizeStart = (arg: any) => {
    const resources = arg.event.getResources();
    const eventEndTime = moment(arg.event.endStr).minute();

    if (calendarRef.current) {
      if (+eventEndTime === 10) {
        console.log('sfsdfsd');
        calendarRef.current?.getApi().setOption('snapDuration', { minute: 5 });
      }

      eventConstraints.forEach((item) => {
        if (+resources[0].id === +item.resourceId) {
          calendarRef.current?.getApi().addEvent(item);
        }
      });
    }
  };

  const handleResizeStop = () => {
    if (calendarRef.current) {
      calendarRef.current?.getApi().setOption('snapDuration', { minute: 15 });

      eventConstraints.forEach((item) => {
        const event = calendarRef.current?.getApi().getEventById(item.id);

        event?.remove();
      });
    }
  };

  const businessHours = {
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    startTime: '8:00:00',
    endTime: '18:00:00',
  };

  return (
    <div className="App">
      <FullCalendar
        allDaySlot={false}
        businessHours={businessHours}
        customButtons={{
          futureDay: {
            text: 'Future Date',
            click: () => {
              const calendarApi = calendarRef?.current?.getApi();

              let futureDate = new Date('2021-07-30');

              console.log(futureDate);

              calendarApi?.gotoDate(futureDate);
            },
          },
        }}
        dateClick={handleDateClick}
        editable={true}
        eventClick={handleEventClick}
        events={events}
        eventConstraint={businessHours}
        eventResizableFromStart={true}
        eventResizeStart={handleResizeStart}
        eventResizeStop={handleResizeStop}
        expandRows={true}
        headerToolbar={{
          start: 'title',
          center: 'futureDay',
          end: 'today prev,next',
        }}
        height="100%"
        initialView="resourceTimeGridDay"
        nowIndicator={true}
        plugins={[
          interactionPlugin,
          momentTimezonePlugin,
          scrollGridPlugin,
          resourceTimeGridPlugin,
        ]}
        ref={calendarRef}
        resources={resources}
        selectable={true}
        slotLabelInterval={{
          hour: 1,
        }}
        slotDuration={{
          minute: 15,
        }}
        slotEventOverlap={false}
        timeZone="America/Los_Angeles"
        timeZoneParam="America/Los_Angeles"
        dayMinWidth={240}
      />
    </div>
  );
}
