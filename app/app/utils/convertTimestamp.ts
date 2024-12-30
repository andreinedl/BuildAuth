export default function convertTimestamp(dateTimestamp: String) {
    const dateString = `${dateTimestamp}`;
    const date = new Date(dateString);

    const formattedDate = date.toLocaleString("ro-RO", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
    });

    return formattedDate;
}