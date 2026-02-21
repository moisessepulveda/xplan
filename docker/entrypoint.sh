#!/bin/sh
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "${GREEN}Starting XPlan container...${NC}"

# Ensure storage directories exist and are writable
mkdir -p \
    /var/www/html/storage/app/private \
    /var/www/html/storage/framework/cache/data \
    /var/www/html/storage/framework/sessions \
    /var/www/html/storage/framework/views \
    /var/www/html/storage/logs

# Ensure database directory exists
mkdir -p /var/www/html/database

# Create SQLite database if it doesn't exist
if [ ! -f /var/www/html/database/database.sqlite ]; then
    echo "${YELLOW}Creating SQLite database...${NC}"
    touch /var/www/html/database/database.sqlite
fi

# Function to run migrations (only on octane container to avoid race conditions)
run_migrations() {
    echo "${YELLOW}Running migrations...${NC}"
    php artisan migrate --force --no-interaction
    echo "${GREEN}Migrations completed.${NC}"
}

# Function to cache config
cache_config() {
    echo "${YELLOW}Caching configuration...${NC}"
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    php artisan event:cache
    echo "${GREEN}Configuration cached.${NC}"
}

# Determine which service to start
SERVICE=${1:-octane}

case $SERVICE in
    octane)
        echo "${GREEN}Starting Octane server...${NC}"

        # Run migrations
        run_migrations
        cache_config

        # Remove queue and scheduler configs, keep only octane
        rm -f /etc/supervisor/conf.d/queue.conf
        rm -f /etc/supervisor/conf.d/scheduler.conf

        # Start Octane directly with supervisor
        exec /usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf
        ;;

    queue)
        echo "${GREEN}Starting Queue worker...${NC}"

        # Wait for app to be ready
        sleep 10

        # Remove octane and scheduler configs, keep only queue
        rm -f /etc/supervisor/conf.d/octane.conf
        rm -f /etc/supervisor/conf.d/scheduler.conf

        exec /usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf
        ;;

    scheduler)
        echo "${GREEN}Starting Scheduler...${NC}"

        # Wait for app to be ready
        sleep 10

        # Remove octane and queue configs, keep only scheduler
        rm -f /etc/supervisor/conf.d/octane.conf
        rm -f /etc/supervisor/conf.d/queue.conf

        exec /usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf
        ;;

    *)
        echo "${RED}Unknown service: $SERVICE${NC}"
        echo "Available services: octane, queue, scheduler"
        exit 1
        ;;
esac
