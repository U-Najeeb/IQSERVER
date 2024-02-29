const timeFormatter = (currentDate) => {
  const currentTime = currentDate;
  const hours = currentTime.getHours().toString().padStart(2, "0");
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
module.exports = timeFormatter;
