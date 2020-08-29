import EventsType from '@/structs/events';

interface eventData {
  player?: string,
  points?: number,
  turn?: number,
  message?: string,
}

interface event {
  type: EventsType,
  data?: eventData,
}

export {
  event,
  eventData,
};
