# AGENTS.md - Mapa de navegacion para agentes de IA

> Este archivo es el **punto de entrada** para cualquier agente que trabaje en este repositorio. NO es una biblia de reglas: es un **mapa**. Lee solo lo que necesites cuando lo necesites (divulgacion progresiva).

---

## 1. Antes de empezar (obligatorio)

1. Ejecuta `./init.sh` y verifica que termina sin errores. Si falla, **para** y resuelve el entorno antes de tocar codigo.
2. Lee `progress/current.md` para entender en que estado quedo la ultima sesion.
3. Lee `feature_list.json` y elige **una** tarea con estado `pending`. No trabajes en mas de una a la vez.

## 2. Mapa del repositorio

| Archivo / carpeta | Que contiene | Cuando leerlo |
|---|---|---|
| `feature_list.json` | Lista de tareas con estado (pending / in_progress / done) | Siempre, al empezar |
| `progress/current.md` | Estado de la sesion actual | Siempre, al empezar |
| `progress/history.md` | Bitacora append-only de sesiones anteriores | Si necesitas contexto historico |
| `docs/architecture.md` | Que significa "hacer un buen trabajo" en este proyecto | Antes de implementar |
| `docs/conventions.md` | Reglas de estilo, nombres, estructura | Antes de escribir codigo |
| `docs/verification.md` | Como verificar que tu trabajo funciona | Antes de declarar una tarea como `done` |
| `CHECKPOINTS.md` | Criterios objetivos de "estado final correcto" | Para auto-evaluarte |
| `.claude/agents/` | Definiciones de subagentes (leader, implementer, reviewer) | Si orquestas trabajo |

## 3. Alcance multi-repo

Este repositorio orquesta cambios a **todo el ecosistema DEVOOPS**. Una feature puede tocar:

- `devoops-core` - modelo, migraciones, controladores, policies, tests (Laravel)
- `devoops-cli` - comandos Go, API client, config
- `devoops-automation-engine` - workflows, workers, endpoints (TypeScript)
- `devoops-docs` - documentacion
- `devoops-agents` - el harness runtime y los agentes mismos

**Siempre** verifica en que repo(s) estas trabajando antes de editar.

## 4. Reglas duras (no negociables)

- **Una sola feature a la vez.** No mezcles cambios de varias tareas en la misma sesion.
- **No declares una tarea `done` sin pruebas.** Ejecuta `./init.sh` y asegurate de que pasa.
- **Documenta lo que haces** en `progress/current.md` mientras trabajas, no al final.
- **Deja el repositorio limpio** antes de cerrar la sesion (ver seccion 6).
- **Si no sabes algo, busca en `docs/`** antes de inventarlo.

## 5. Como elegir una tarea

1. Abre `feature_list.json`
2. Filtra por `status == "pending"`
3. Coge la de menor `id`
4. Cambia su `status` a `in_progress` y guarda
5. Anota en `progress/current.md`: feature, hora de inicio, plan breve

## 6. Cierre de sesion (lifecycle)

Antes de terminar:

1. Ejecuta `./init.sh` - todo verde.
2. Si la tarea esta acabada: marca `status: "done"` en `feature_list.json`.
3. Mueve el resumen de `progress/current.md` al final de `progress/history.md`.
4. Vacia `progress/current.md` dejando solo la plantilla.
5. No dejes archivos temporales, ni `print()` de debug, ni TODOs sin contexto.

## 7. Si te bloqueas

- Relee la seccion relevante de `docs/`.
- Si la herramienta no hace lo que esperas, **no inventes un workaround**: documenta el bloqueo en `progress/current.md` y para la sesion.
