export function calculateDuration(departureTime, arrivalTime) {
    // Convert the time strings into Date objects
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    // Calculate the difference in milliseconds
    const difference = arrival - departure;
    // Convert the difference to minutes
    const totalMinutes = Math.floor(difference / (1000 * 60));
    // Calculate hours and remaining minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h : ${minutes}m`;
}

// // Example usage:
// const departure = "2024-09-28T06:30:00";
// const arrival = "2024-09-28T08:35:00";
// const duration = calculateDuration(departure, arrival);

// console.log(duration);  // Output: "2h 5m"

export function extractTime(dateTimeString) {
    // Split the string by "T" and return the second part (the time)
    return dateTimeString.split("T")[1];
}

// // Example usage:
// const dateTime = "2024-09-28T23:15";
// const time = extractTime(dateTime);
// console.log(time);  // Output: "23:15"






export function calculateWaitingTime(startTime, endTime) {
    // Parse the time strings into Date objects
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    // Calculate the difference in milliseconds
    let diffMs = end - start;

    // If the difference is negative, it means the end time is on the next day
    if (diffMs < 0) {
        diffMs += 24 * 60 * 60 * 1000; // add 24 hours in milliseconds
    }

    // Convert milliseconds to hours and minutes
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHours}H ${diffMinutes} M`;
}

// Example usage
// const waitingTime = calculateWaitingTime("15:45", "20:55");
// console.log(`Waiting time: ${waitingTime}`);
