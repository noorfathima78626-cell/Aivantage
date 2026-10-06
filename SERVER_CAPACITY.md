# Aivantage local-server capacity

The project is configured as a college/demo application, not a production load-tested service.

- Spring Boot/Tomcat can serve many HTTP requests concurrently.
- MySQL connection count and the Python MediaPipe AI engine are the practical bottlenecks.
- On a typical Mac/college demo machine, plan around **5-10 simultaneous live AI interview sessions** as a safe starting point.
- Higher concurrency should be load-tested on the actual machine; the number is not a guaranteed hard limit.
- The AI engine uses a shared MediaPipe model protected by a lock so concurrent requests do not corrupt the model graph. This protects correctness but means frame-analysis work is still a bottleneck.
