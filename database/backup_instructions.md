# Instrucciones de Backup y Restauración — SINIC DB

## Generar backup completo

```bash
# Con Docker
docker exec sinic_postgres pg_dump -U sinic_user -d sinic_db -F c -f /tmp/sinic_backup.dump
docker cp sinic_postgres:/tmp/sinic_backup.dump ./sinic_backup_$(date +%Y%m%d_%H%M%S).dump

# Sin Docker (servidor local)
pg_dump -U sinic_user -d sinic_db -F c -f sinic_backup_$(date +%Y%m%d_%H%M%S).dump
```

## Backup solo del esquema sinic_cr

```bash
pg_dump -U sinic_user -d sinic_db -n sinic_cr -F c -f sinic_cr_backup.dump
```

## Backup en formato SQL plano (legible)

```bash
pg_dump -U sinic_user -d sinic_db -F p --schema=sinic_cr > sinic_cr_backup.sql
```

## Restaurar backup

```bash
# Formato custom (.dump)
pg_restore -U sinic_user -d sinic_db -F c --clean sinic_backup.dump

# Formato SQL plano
psql -U sinic_user -d sinic_db < sinic_cr_backup.sql

# Con Docker
docker cp sinic_backup.dump sinic_postgres:/tmp/
docker exec sinic_postgres pg_restore -U sinic_user -d sinic_db -F c --clean /tmp/sinic_backup.dump
```

## Backup programado (cron)

```cron
# Cada día a las 2 AM
0 2 * * * docker exec sinic_postgres pg_dump -U sinic_user -d sinic_db -F c -f /tmp/sinic_$(date +\%Y\%m\%d).dump
```

## Verificar integridad del backup

```bash
pg_restore --list sinic_backup.dump | head -50
```
