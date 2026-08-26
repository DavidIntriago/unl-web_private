FROM drupal:11-apache

RUN apt-get update && apt-get install -y git unzip && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/drupal

COPY php-custom.ini /usr/local/etc/php/conf.d/

COPY composer.json composer.lock ./

RUN composer install --no-dev --no-interaction --optimize-autoloader

RUN composer require drush/drush

COPY web/ web/
COPY config/ config/

RUN chown -R www-data:www-data /opt/drupal/web
