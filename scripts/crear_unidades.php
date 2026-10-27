<?php

/**
 * Crea las unidades administrativas en el vocabulario Unidad.
 * Si una ya existe con el mismo nombre, solo actualiza su peso (orden).
 *
 * Uso: drush php:script scripts/crear_unidades.php
 */

use Drupal\taxonomy\Entity\Term;

$unidades = [
  'Auditoría Interna',
  'Autoridad',
  'Coordinación de Evaluación Institucional y Acreditación de la Calidad',
  'Coordinación General Administrativa Financiera',
  'Coordinación General de Docencia',
  'Dirección Administrativa',
  'Dirección de Bienestar Estudiantil',
  'Dirección de Comunicación e Imagen Institucional',
  'Dirección de Contratación Pública',
  'Dirección de Desarrollo Físico',
  'Dirección de Educación a Distancia',
  'Dirección de Investigación',
  'Dirección de Planificación y Desarrollo',
  'Dirección de Seguridad y Salud Ocupacional',
  'Dirección de Talento Humano',
  'Dirección de Tecnologías de Información',
  'Dirección Financiera',
  'Dirección General de Vinculación con la Sociedad',
  'Facultad Agropecuaria y de Recursos Naturales Renovables',
  'Facultad de la Educación el Arte y la Comunicación',
  'Facultad de la Energía, las Industrias y los Recursos Naturales no Renovables',
  'Facultad de la Salud Humana',
  'Facultad Jurídica Social y Administrativa',
  'Procuraduría General',
  'Secretaría General',
  'Vicerrectorado Académico',
];

$storage = \Drupal::entityTypeManager()->getStorage('taxonomy_term');

foreach ($unidades as $peso => $nombre) {
  $existentes = $storage->loadByProperties([
    'vid' => 'unidad',
    'name' => $nombre,
  ]);

  if ($existentes) {
    $termino = reset($existentes);
    $termino->setWeight($peso)->save();
    echo "Ya existía (orden actualizado): $nombre\n";
    continue;
  }

  Term::create([
    'vid' => 'unidad',
    'name' => $nombre,
    'weight' => $peso,
  ])->save();
  echo "Creada: $nombre\n";
}

echo "\nListo: " . count($unidades) . " unidades revisadas.\n";