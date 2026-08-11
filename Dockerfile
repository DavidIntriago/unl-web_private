FROM drupal:11-apache

WORKDIR /opt/drupal

COPY php-custom.ini /usr/local/etc/php/conf.d/

RUN composer require drush/drush