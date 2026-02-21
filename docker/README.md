# XPlan Docker Production Setup

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Swarm                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   App (1)   │  │   App (2)   │  │   App (3)   │         │
│  │   Octane    │  │   Octane    │  │   Octane    │         │
│  │   :8000     │  │   :8000     │  │   :8000     │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│         └────────────────┼────────────────┘                 │
│                          │                                  │
│  ┌─────────────┐  ┌──────┴──────┐                          │
│  │   Queue     │  │  Scheduler  │                          │
│  │  (worker)   │  │   (cron)    │                          │
│  └──────┬──────┘  └──────┬──────┘                          │
│         │                │                                  │
│         └────────┬───────┘                                  │
│                  │                                          │
│         ┌────────┴────────┐                                │
│         │  SQLite Volume  │                                │
│         │  + Storage Vol  │                                │
│         └─────────────────┘                                │
└─────────────────────────────────────────────────────────────┘
```

## Requisitos

- Docker 20.10+
- Docker Swarm inicializado (`docker swarm init`)
- Volúmenes de almacenamiento configurados

## Configuración

### 1. Crear archivo de entorno

```bash
cp docker/.env.prod.example .env.prod
```

Edita `.env.prod` con tus valores:

```env
APP_KEY=base64:tu-app-key-aqui
APP_URL=https://tu-dominio.com
MAIL_MAILER=smtp
MAIL_HOST=smtp.ejemplo.com
# ... etc
```

### 2. Crear directorios de datos

```bash
sudo mkdir -p /data/xplan/{database,storage/private,storage/logs}
sudo chown -R 1000:1000 /data/xplan
```

### 3. Generar APP_KEY (si no tienes uno)

```bash
docker run --rm -it php:8.3-cli php -r "echo 'base64:' . base64_encode(random_bytes(32)) . PHP_EOL;"
```

## Deploy

### Opción 1: Script automático

```bash
chmod +x docker/deploy.sh
./docker/deploy.sh
```

### Opción 2: Manual

```bash
# Build
docker build -t xplan:latest .

# Deploy stack
docker stack deploy -c docker-compose.prod.yml xplan
```

## Comandos útiles

```bash
# Ver servicios
docker stack services xplan

# Ver logs de la app
docker service logs xplan_app -f

# Ver logs del queue
docker service logs xplan_queue -f

# Ver logs del scheduler
docker service logs xplan_scheduler -f

# Escalar replicas
docker service scale xplan_app=5

# Ejecutar comandos artisan
docker exec -it $(docker ps -q -f name=xplan_app) php artisan <comando>

# Remover stack
docker stack rm xplan
```

## Notas importantes

### SQLite con múltiples réplicas

⚠️ **Advertencia**: SQLite puede tener problemas de bloqueo con múltiples réplicas escribiendo simultáneamente. Para producción con alta concurrencia, considera:

1. Usar un volumen NFS compartido con bloqueo adecuado
2. Migrar a PostgreSQL o MySQL
3. Reducir réplicas a 1 para escrituras intensivas

### Volúmenes

Los volúmenes están configurados como bind mounts. Para NFS:

```yaml
volumes:
  sqlite_data:
    driver: local
    driver_opts:
      type: nfs
      o: addr=nfs-server,rw,nfsvers=4
      device: ":/path/to/xplan/database"
```

### Reverse Proxy

Necesitarás un reverse proxy (Traefik, Nginx, etc.) para:
- Balancear carga entre las 3 réplicas
- Terminar SSL
- Enrutar al puerto 8000

Ejemplo con Traefik labels:

```yaml
services:
  app:
    deploy:
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.xplan.rule=Host(`tu-dominio.com`)"
        - "traefik.http.services.xplan.loadbalancer.server.port=8000"
```

## Actualización

```bash
# Build nueva imagen
docker build -t xplan:v2 .

# Actualizar servicio (rolling update)
docker service update --image xplan:v2 xplan_app
docker service update --image xplan:v2 xplan_queue
docker service update --image xplan:v2 xplan_scheduler
```

## Troubleshooting

### Container no inicia

```bash
docker service ps xplan_app --no-trunc
```

### Permisos de SQLite

```bash
# En el host
sudo chown -R 1000:1000 /data/xplan/database
sudo chmod 775 /data/xplan/database
sudo chmod 664 /data/xplan/database/database.sqlite
```

### Limpiar y reiniciar

```bash
docker stack rm xplan
sleep 10
docker stack deploy -c docker-compose.prod.yml xplan
```
