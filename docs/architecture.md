# Arquitectura — Que significa "hacer un buen trabajo" en DEVOOPS

> Este documento define el estandar de calidad. Los agentes revisores evaluan codigo contra este archivo. Si no esta aqui, no es un requisito.

## Principios del ecosistema

1. **Multi-repo, no monorepo.** Cada componente vive en su propio repositorio. Las features pueden cruzar repos, pero cada cambio se hace dentro del repo correspondiente.

2. **API-first.** Toda functionalidad nueva se expone via API REST antes que via UI o CLI. El CLI y la UI son clientes de la API, no fuentes de verdad.

3. **RBAC en cada capa.** Ningun endpoint, comando, o worker opera sin verificar permisos. El modelo de autorizacion sigue la jerarquia: owner > admin > developer > operator > viewer.

4. **Audit trail.** Toda accion mutante (create, update, delete) se registra en AuditLog. No hay operaciones silenciosas.

5. **Automation-ready.** Cualquier evento de negocio (deploy, rollback, env create, member invite) puede disparar un workflow en el automation-engine via webhook.

## Capas del sistema

```
[CLI / UI]                devoops-cli, (frontend)
    |
[Platform API]            devoops-core (Laravel)
    |
[RBAC + Organizations]    devoops-core (Policies, Models)
    |
[Automation Engine]       devoops-automation-engine (TypeScript + BullMQ)
    |
[Agents Runtime]          devoops-agents (harness + subagentes)
    |
[Coolify Runtime]         devoops-core (Docker + Traefik)
```

## Flujo de una operacion tipica

```
Usuario -> CLI -> Core API -> Policy -> Model -> DB
                                  |
                             AuditLog
                                  |
                     Automation Hook (webhook)
                                  |
                     Automation Engine -> Worker -> Action
```

## Que NO hacer

- No modificar Docker runtime, Compose internals, o Traefik engine de Coolify.
- No meter logica de negocio en controladores (solo orquestacion delgada).
- No hardcodear configuraciones sensibles.
- No saltarse el RBAC "porque es solo un prototipo".
- No crear dependencias circulares entre repos.

## Stack por repo

| Repo | Stack | Tests |
|---|---|---|
| devoops-core | Laravel + PostgreSQL | PestPHP |
| devoops-cli | Go + Cobra + resty | Go test |
| devoops-automation-engine | TypeScript + Express + BullMQ + Redis | Jest/Vitest |
| devoops-agents | Harness framework | init.sh |
| devoops-docs | Markdown | — |
