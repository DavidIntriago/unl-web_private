<?php

use Drupal\node\Entity\Node;
use Drupal\paragraphs\Entity\Paragraph;

// Usa la misma detección de redes que el tema.
require_once \Drupal::service('extension.list.theme')->getPath('unl_theme') . '/unl_theme.theme';

$ids = \Drupal::entityQuery('paragraph')->accessCheck(FALSE)->condition('type', 'redes_sociales')->execute();

foreach (Paragraph::loadMultiple($ids) as $p) {
  if (!$p->hasField('field_redes') || $p->get('field_redes')->isEmpty()) {
    continue;
  }

  // Página donde está el párrafo.
  $pagina = $p->getParentEntity();
  while ($pagina instanceof Paragraph) {
    $pagina = $pagina->getParentEntity();
  }
  $es_pagina_valida = $pagina instanceof Node && in_array($pagina->bundle(), ['carrera', 'facultades'], TRUE);

  foreach ($p->get('field_redes') as $delta => $item) {
    $url = $item->uri;

    // No crear duplicados si el script se corre dos veces.
    $existe = \Drupal::entityQuery('node')->accessCheck(FALSE)
      ->condition('type', 'red_social')
      ->condition('field_enlace_red.uri', $url)
      ->count()->execute();
    if ($existe) {
      echo "Ya existe: $url\n";
      continue;
    }

    $red = _unl_theme_red_desde_url($url);
    $titulo = $red['nombre'] . ' ' . ($es_pagina_valida ? $pagina->label() : 'UNL');

    Node::create([
      'type' => 'red_social',
      'title' => $titulo,
      'field_enlace_red' => ['uri' => $url],
      'field_pertenece_a' => $es_pagina_valida ? $pagina->id() : NULL,
      'field_orden' => $delta + 1,
      'status' => 1,
    ])->save();
    echo "Creada: $titulo -> $url\n";
  }
}