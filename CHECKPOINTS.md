# CHECKPOINTS — Evaluacion del estado final

> En sistemas multi-agente no se evalua el camino, se evalua el destino.
> Estos son los checkpoints objetivos que un juez (humano o IA) puede usar
> para decidir si el proyecto esta sano.

## C1 — El arnes esta completo

- [ ] Existen los 4 archivos base: `AGENTS.md`, `init.sh`, `feature_list.json`, `progress/current.md`.
- [ ] Existen los 3 docs: `docs/architecture.md`, `docs/conventions.md`, `docs/verification.md`.
- [ ] `./init.sh` termina con exit code 0.

## C2 — El estado es coherente

- [ ] Como mucho una feature en `in_progress` en `feature_list.json`.
- [ ] Toda feature `done` tiene evidencia de verificacion.
- [ ] `progress/current.md` esta vacio o describe la sesion activa (no contiene basura de sesiones anteriores).

## C3 — El codigo respeta la arquitectura

- [ ] Los cambios en cada repo respetan `docs/architecture.md`.
- [ ] No hay dependencias externas no previstas.
- [ ] No hay `print()` sueltos para debug, ni TODOs sin contexto.
- [ ] No hay cambios en Docker internals, Traefik engine, o Compose runtime de devoops-core.

## C4 — La verificacion es real

- [ ] Tests nuevos siguen el patron del repo destino (PestPHP para devoops-core, Go test para devoops-cli, Jest/Vitest para automation-engine).
- [ ] Los tests existentes pasan despues del cambio.

## C5 — La sesion se cerro bien

- [ ] No hay archivos sin trackear sospechosos (`*.tmp`, `__pycache__`, `node_modules/`, `.env`).
- [ ] `progress/history.md` tiene una entrada por la ultima sesion.
- [ ] La ultima feature trabajada esta reflejada en su estado correcto.

---

**Como usar este archivo:** un agente revisor (`.claude/agents/reviewer.md`) recorre cada checkbox, marca `[x]` o `[ ]`, y rechaza el cierre de sesion si quedan boxes vacios en C1-C5.
