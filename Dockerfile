# =============================================================================
# Stage 1: Build frontend assets
# =============================================================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Install dependencies
RUN npm ci --prefer-offline --no-audit

# Copy source files needed for build
COPY resources ./resources
COPY vite.config.ts tsconfig.json tsconfig.node.json ./
COPY public ./public

# Build assets
RUN npm run build


# =============================================================================
# Stage 2: PHP dependencies
# =============================================================================
FROM php:8.4-cli-alpine AS composer-builder

# Install zip extension required by some packages
RUN apk add --no-cache libzip-dev \
    && docker-php-ext-install zip

# Install composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy composer files
COPY composer.json composer.lock ./

# Install dependencies without dev
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --prefer-dist

# Copy application code
COPY . .

# Generate optimized autoloader (no scripts to avoid dev-only providers)
RUN composer dump-autoload --optimize --no-dev --no-scripts


# =============================================================================
# Stage 3: Production image
# =============================================================================
FROM php:8.4-cli-alpine AS production

# Install system dependencies
RUN apk add --no-cache \
    supervisor \
    sqlite \
    sqlite-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    icu-dev \
    oniguruma-dev \
    linux-headers \
    $PHPIZE_DEPS

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo_sqlite \
    zip \
    gd \
    intl \
    mbstring \
    pcntl \
    opcache \
    bcmath

# Install Swoole for Octane
RUN pecl install swoole \
    && docker-php-ext-enable swoole

# Clean up
RUN apk del $PHPIZE_DEPS linux-headers \
    && rm -rf /var/cache/apk/* /tmp/*

# Configure PHP for production
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# PHP optimizations
COPY docker/php/opcache.ini $PHP_INI_DIR/conf.d/opcache.ini
COPY docker/php/php.ini $PHP_INI_DIR/conf.d/custom.ini

# Create non-root user
RUN addgroup -g 1000 -S www && adduser -u 1000 -S www -G www

WORKDIR /var/www/html

# Copy application from builders
COPY --from=composer-builder /app/vendor ./vendor
COPY . .
COPY --from=frontend-builder /app/public/build ./public/build

# Create necessary directories and set permissions
RUN mkdir -p \
    storage/app/private \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    database \
    bootstrap/cache \
    && chown -R www:www /var/www/html

# Copy supervisor configurations
COPY docker/supervisor/supervisord.conf /etc/supervisor/supervisord.conf
COPY docker/supervisor/octane.conf /etc/supervisor/conf.d/octane.conf
COPY docker/supervisor/queue.conf /etc/supervisor/conf.d/queue.conf
COPY docker/supervisor/scheduler.conf /etc/supervisor/conf.d/scheduler.conf

# Copy entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Set environment
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr

EXPOSE 8000

ENTRYPOINT ["entrypoint.sh"]
CMD ["octane"]
