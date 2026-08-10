import { format, formatDistanceToNow } from 'date-fns';
// import moment from 'moment';
import moment from 'moment-timezone';



export const generateSessionToken = () => {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
};

export const getFormattedDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);

  const formattedDate = format(date, 'MMM d, yyyy'); // e.g., Dec 10, 2023
  const relativeTime = formatDistanceToNow(date, { addSuffix: true }); // e.g., 2 days ago

  return `Listed on ${formattedDate} - ${relativeTime}`;
};


// export const formatDate = (
//   date?: any,
//   formatPattern: string = 'MMM DD, YYYY',
// ): string => {
//   if (!date) return '';
//   const m = moment(date);
//   return m.isValid() ? m.format(formatPattern) : '';
// };

export const formatDate = (
  date?: string | Date | number | null,
  formatPattern: string = 'MMM D, YYYY hh:mm:ss A',
): string => {
  if (!date) return '';

  const m = moment.utc(date).tz('America/New_York');

  return m.isValid() ? m.format(formatPattern) : '';
};

export const formatFromNow = (date?: any): string => {
  if (!date) return '';
  const m = moment(date);
  return m.isValid() ? m.fromNow() : '';
};