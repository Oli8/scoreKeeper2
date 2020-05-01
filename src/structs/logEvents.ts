import EventsType from '@/structs/events';

interface eventData {
  player?: string,
  points?: number,
  turn?: number,
}

interface event {
  type: EventsType,
  data?: eventData,
}

export {
  event,
  eventData,
};
