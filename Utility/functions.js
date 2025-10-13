// Utility/getDateRange.js
function getDateRange(filter) {
  const now = new Date();
  let start, end;

  switch (filter) {
    case "today":
      start = new Date(now.setHours(0, 0, 0, 0));
      end = new Date();
      break;

    case "week":
      const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      start = new Date(firstDayOfWeek.setHours(0, 0, 0, 0));
      end = new Date();
      break;

    case "month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      break;

    default: // 'all'
      return null;
  }

  return { start, end };
}

module.exports = { getDateRange };
