# Convenciones de codigo DEVOOPS

> Homogeneidad extrema. La IA predice mejor cuando el ecosistema se parece a si mismo en todas partes.

## Laravel (devoops-core)

### Modelos
- Usar `HasFactory`, `SoftDeletes` cuando aplique
- `$fillable` o `$guarded` + `$casts` explicitos
- Relations como metodos con tipo de retorno explicito
- Nombres: `Organization`, `AuditLog`, `AutomationHook`, `UsageRecord`

### Migraciones
- Timestamp manual: `2025_01_01_000001_create_organizations_table.php`
- `$table->foreignId()->constrained()->cascadeOnDelete()`
- `$table->softDeletes()` si aplica

### Controladores API
- `app/Http/Controllers/Api/{Resource}Controller.php`
- Inyectar Request y Policy via dependency injection
- `authorize()` al inicio del metodo
- Retornar `response()->json()` con `Resource` classes

### Policies
- Metodo por habilidad: `viewAny`, `view`, `create`, `update`, `delete`, `manageMembers`, `manageBilling`
- Owner siempre pasa todo
- Admin pasa todo excepto manageBilling / manageMembers

### Tests (PestPHP)
```php
uses(RefreshDatabase::class);
beforeEach(fn () => ...);
describe('ability', function () {
    test('owner can ...', fn () => ...);
});
```

## Go (devoops-cli)

### Comandos Cobra
- Un archivo por comando: `cmd/{comando}.go`
- `init()` con `rootCmd.AddCommand()`
- `Run: func(cmd *cobra.Command, args []string) { ... }`

### API Client
- `internal/api/client.go` con metodo por endpoint
- Bearer token via `DEVOOPS_TOKEN` env var
- Config via `internal/config/config.go`

### Tests
- `_test.go` junto al archivo
- Usar `httptest.NewServer()` para mockear API

## TypeScript (devoops-automation-engine)

### Archivos
- `src/api/routes/{resource}.ts` para rutas
- `src/engine/{component}.ts` para logica
- `src/queue/index.ts` + `src/workers/{worker}.ts` para queues

### Estilo
- `const` sobre `let` (nunca `var`)
- `async/await`, promesas, no callbacks
- Tipos explicitos en TypeScript

### Tests
- `*.test.ts` junto al archivo
- `supertest` para endpoints
- `vitest` o `jest`

## General

- Strings con comillas dobles `"..."` en todos los lenguajes
- Nada de `print()` / `console.log()` de debug
- f-strings / template literals para interpolacion
- Sin comentarios de codigo (deja que los nombres hablen)
