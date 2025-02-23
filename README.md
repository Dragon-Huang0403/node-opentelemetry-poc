# NodeJS OpenTelemetry Integration Proof Of Concept

This repository serves as a proof of concept (PoC) for integrating OpenTelemetry with an Express.js application using Winston for logging.

## Purpose

The existing OpenTelemetry examples are scattered and fragmented, making it difficult to understand how to integrate them effectively. After completing the Linux Foundation OpenTelemetry course, I decided to create this repository as a hands-on practice project. The goal is to explore how OpenTelemetry can be integrated with Express.js and Winston, making it easier to apply these concepts in other projects.

## Key Features

### 1. Automatic Span Context Propagation

The project demonstrates how to acquire an active span without explicitly passing context through the call chain. Using `startActiveSpan`, child functions can automatically access the current span context using `trace.getActiveSpan()`.

Example from the dice rolling implementation:

```typescript
tracer.startActiveSpan('rollTheDice', (parentSpan) => {
  const span = trace.getActiveSpan();
  // span === parentSpan (true)
});
```

### 2. Manual Context **Linking**

For scenarios where automatic context propagation isn't possible (e.g., worker processes or cross-process communication), the project shows how to manually link spans using span_id and trace_id. See the `rollOnceWithCtx` function for implementation details.

### 3. Error Handling and Logging Integration

- Demonstrates proper error tracking with OpenTelemetry
- Shows how to add error events to spans with severity levels
- Integrates Winston logging with trace context
- Captures error messages and stack traces in structured format

### 4. Best Practices

- Proper span lifecycle management (creation and closing)
- Adding relevant events and attributes to spans
- Integration with existing logging infrastructure
- Error handling patterns

## Getting Started

```sh
npm run start
```

## References

1. [OpenTelemetry JavaScript Documentation](https://opentelemetry.io/docs/languages/js/)
2. [OpenTelemetry Trace API Specification](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/api.md)
3. [Getting Started with OpenTelemetry (LFS148)](https://training.linuxfoundation.org/training/getting-started-with-opentelemetry-lfs148/)
