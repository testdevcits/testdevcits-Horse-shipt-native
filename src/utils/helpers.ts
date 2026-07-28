import { format, formatDistanceToNow } from 'date-fns';


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