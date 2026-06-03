function safeMessage(message) {
  return String(message ?? "The library lights flickered. Try again in a moment.")
    .replace(/sk_(test|live)_[A-Za-z0-9_*]+/g, "sk_$1_***")
    .replace(/rk_(test|live)_[A-Za-z0-9_*]+/g, "rk_$1_***");
}

function safeValue(value) {
  return value ? safeMessage(value) : value;
}

export function errorHandler(error, _req, res, _next) {
  const status = error.statusCode ?? 500;
  const payload = {
    message: safeMessage(error.message),
    code: error.code,
    type: error.type,
    statusCode: status,
    traceId: error.traceId,
    stack: safeValue(error.stack),
    causeMessage: safeValue(error.causeMessage),
    causeStack: safeValue(error.causeStack)
  };

  console.error("[error-handler] response payload", payload);

  res.status(status).json({
    ...payload
  });
}
