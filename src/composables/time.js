import store from '@/store'

export const timeToSeconds = (time) => {
  const timeArray = time.split(':').map(Number);
  let totalSeconds = 0;

  switch (timeArray.length) {
    case 1:
      totalSeconds = timeArray[0];
      break;
    case 2:
      totalSeconds = (timeArray[0] * 60) + timeArray[1];
      break;
    case 3:
      totalSeconds = (timeArray[0] * 3600) + (timeArray[1] * 60) + timeArray[2];
      break;
    default:
      const errorMessages = 'Invalid time format';
      store.dispatch('notification/addNotification', {color: 'danger', text: errorMessages})
      throw new Error(errorMessages);
  }

  return totalSeconds;
}

export const convertSecondsToHHMMSS = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
