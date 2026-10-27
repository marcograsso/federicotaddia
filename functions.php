<?php

use Timber\Timber;

// Load Composer dependencies.
if (file_exists(__DIR__ . "/vendor")) {
    $vendor_path = __DIR__;
} else {
    $vendor_path = dirname(__DIR__);
}

require_once $vendor_path . "/vendor/autoload.php";

require_once __DIR__ . "/src/StarterSite.php";
require_once __DIR__ . "/src/hooks.php";
require_once __DIR__ . "/src/routes.php";

$context['is_front_page'] = is_front_page();
$context['is_home'] = is_home();

add_filter('timber/twig', function($twig) {
    $twig->addFunction(new \Twig\TwigFunction('do_shortcode', 'do_shortcode'));
    return $twig;
});

Timber::init();
new StarterSite();

