# Verificacion — Como demostrar que el trabajo funciona

> Regla de oro: **el agente no dice "funciona", lo demuestra**.
> Toda feature termina con evidencia ejecutable, no con afirmaciones.

## Niveles de verificacion

### Nivel 1 — Tests del repo destino (obligatorio)

Toda feature incluye tests siguiendo el stack del repo afectado:

| Repo | Comando de tests |
|---|---|
| devoops-core | `php artisan test` o `vendor/bin/phpunit` |
| devoops-cli | `go test ./...` |
| devoops-automation-engine | `npm test` o `npx vitest run` |

### Nivel 2 — Verificacion del arnes (obligatorio)

```bash
bash ./init.sh
```

Debe terminar con `[OK] Entorno listo`.

### Nivel 3 — Smoke test manual (recomendado)

Antes de cerrar la sesion, ejecuta un flujo end-to-end si es posible:

```bash
# Ejemplo para feature de API
curl -X POST http://localhost:8000/api/organizations \
  -H "Authorization: Bearer $DEVOOPS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "test-org", "slug": "test-org"}'
```

## Anti-patrones (no hacer)

- "He anadido el cambio, deberia funcionar." — falta test ejecutable.
- Test que solo verifica que la funcion no lanza excepcion — tiene que comprobar el resultado concreto.
- Mock del filesystem — usa `tempfile.TemporaryDirectory()` real.
- Marcar la feature como `done` sin pasar `./init.sh`.

## Verificacion final antes de cerrar

```bash
bash ./init.sh  # debe terminar con [OK] Entorno listo
```

Si `./init.sh` esta rojo, **no** marques nada como `done`. Anota el bloqueo en `progress/current.md` con estado `blocked` en `feature_list.json`.
