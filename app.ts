import { SpanStatusCode, trace } from '@opentelemetry/api';
import express, { Express, ErrorRequestHandler } from 'express';
import { rollTheDice } from './dice';

const PORT: number = parseInt(process.env.PORT || '8080');
const app: Express = express();

const tracer = trace.getTracer('main');

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const span = trace.getActiveSpan();
  if (span) {
    span.recordException(err);
    span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
  }

  res.status(500).send('Internal Server Error');
};

app.get('/rolldice', (req, res) => {
  const rolls = req.query.rolls ? parseInt(req.query.rolls.toString()) : NaN;
  if (isNaN(rolls)) {
    res
      .status(400)
      .send("Request parameter 'rolls' is missing or not a number.");
    return;
  }
  res.send(JSON.stringify(rollTheDice(rolls, 1, 6)));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});
