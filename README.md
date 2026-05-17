# DEVOOPS Agents — Harness Runtime

Orquestacion multi-agente para el ecosistema DEVOOPS.

> El codigo de la plataforma vive en repos vecinos (devoops-core, devoops-cli, devoops-automation-engine). Este repo es el **cerebro**: define como los agentes de IA planifican, implementan y verifican cambios a traves de todo el ecosistema.

## Como esta organizado el arnes

| Pilar | Manifestacion en este repo |
|---|---|
| **El repositorio ES el sistema** | `AGENTS.md`, `init.sh`, `feature_list.json`, `progress/`, `docs/` |
| **Orquestacion multi-agente** | `.claude/agents/leader.md`, `implementer.md`, `reviewer.md` |
| **Multi-repo** | Las features en `feature_list.json` referencian el repo destino |

## Para empezar

```bash
bash ./init.sh
```

Si todo esta verde, abre `AGENTS.md` y sigue desde ahi.

## Estructura

```
.
├── AGENTS.md                 # Mapa para agentes (divulgacion progresiva)
├── CLAUDE.md                 # Fuerza al modelo a actuar como leader
├── CHECKPOINTS.md            # Criterios de "estado final correcto"
├── feature_list.json         # Alcance: una feature a la vez (multi-repo)
├── init.sh                   # Verificacion e inicializacion
├── progress/
│   ├── current.md            # Sesion activa (estado vivo)
│   └── history.md            # Bitacora append-only
├── docs/
│   ├── architecture.md       # Que significa "buen trabajo" en DEVOOPS
│   ├── conventions.md        # Estilo, nombres, stack por repo
│   └── verification.md       # Como demostrar que funciona
└── .claude/
    ├── agents/               # Definiciones de leader, implementer, reviewer
    └── settings.json         # Hooks que automatizan la verificacion
```

## Features actuales

| # | Feature | Estado |
|---|---|---|
| 1 | Agent Registry model and API | pending |
| 2 | Leader orchestration protocol | pending |
| 3 | Core-automation integration | pending |
| 4 | Environment management | pending |
| 5 | CLI environment commands | pending |
| 6 | API key management | pending |

## Proximo paso

Implementa la primera feature pendiente via el flujo leader/implementer/reviewer.
