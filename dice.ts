import { trace, Span, SpanContext } from '@opentelemetry/api';
import { logger } from './logger';

const tracer = trace.getTracer('dice-lib');

function rollOnce(i: number, min: number, max: number) {
  return tracer.startActiveSpan(`rollOnce:${i}`, (span: Span) => {
    span.addEvent('some log', {
      'log.severity': 'error',
      'log.message': 'Data not found',
    });
    const result = Math.floor(Math.random() * (max - min + 1) + min);
    randomError();
    span.end();
    return result;
  });
}

function randomError() {
  const random = Math.random();
  if (random < 0.2) {
    throw new Error('test error');
  }
}

export function rollTheDice(rolls: number, min: number, max: number) {
  // Create a span. A span must be closed.
  return tracer.startActiveSpan('rollTheDice', (parentSpan: Span) => {
    logger.info('test log in rollTheDice');

    const span = trace.getActiveSpan();

    console.log(span === parentSpan); // true, we can get the same span from trace api

    const result: number[] = [];
    for (let i = 0; i < rolls; i++) {
      result.push(rollOnce(i, min, max));
    }
    // Be sure to end the span!
    parentSpan.end();
    return result;
  });
}

/**
 * This demonstrates how to use the context to create a span by linking to an existing span metadata
 */
function rollOnceWithCtx(
  ctx: SpanContext,
  i: number,
  min: number,
  max: number
) {
  const span = tracer.startSpan(`rollOnce:${i}`, {
    links: [
      {
        context: {
          spanId: ctx.spanId,
          traceId: ctx.traceId,
          traceFlags: ctx.traceFlags,
        },
      },
    ],
  });

  const result = Math.floor(Math.random() * (max - min + 1) + min);
  span.end();
  return result;
}
