FROM drupal:11-apache

WORKDIR /opt/drupal

RUN composer require drush/drush