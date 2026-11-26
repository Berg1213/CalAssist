const statuses = ['not_started', 'active', 'completed', 'paused', 'abandoned'];

function isValidDate(str) {
  if (typeof str !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;

  const [y, m, d] = str.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));

  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
}

function isValidTime(str) {
  return typeof str === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(str);
}

function isValidId(id) {
  return typeof id === "string" && /^[1-9]\d*$/.test(id);
}

function isValidStatus() {
  if (query.status !== undefined) {
    const allAllowed = [].concat(query.status).every((status) => statuses.includes(status));
    if (!allAllowed) {
      errors.push('search contains invalid status');
    }
  }
}

function validateTodoInput(body) {
  const errors = [];

  if (typeof body.name !== 'string' || body.name.trim() === '') {
    errors.push('name is required');
  } else if (body.name.length > 255) {
    errors.push('name must be 255 characters or fewer');
  }

  if (body.status != null && !statuses.includes(body.status)) {
    errors.push('status is not an allowed value');
  }

  if (body.due_date != null && !isValidDate(body.due_date)) {
    errors.push('due_date must be a valid date (YYYY-MM-DD)');
  }

  if (body.due_time != null && !isValidTime(body.due_time)) {
    errors.push('due_time must be a valid time (HH:MM)');
  }

  if (body.goal_id != null && !Number.isInteger(body.goal_id)) {
    errors.push('goal_id must be an integer');
  }

  return errors;
}

module.exports = {statuses, isValidTime, isValidDate, isValidId, isValidStatus, validateTodoInput};
