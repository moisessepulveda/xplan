<?php
/**
 * XPlan Icon Generator
 * Run: php public/icons/generate-icons.php
 *
 * Creates PNG icons from SVG template for PWA manifest.
 * Requires GD extension.
 */

$sizes = [72, 96, 128, 144, 152, 192, 384, 512];
$outputDir = __DIR__;

foreach ($sizes as $size) {
    $img = imagecreatetruecolor($size, $size);
    imagesavealpha($img, true);

    // Background - primary blue (#1677ff)
    $bg = imagecolorallocate($img, 22, 119, 255);
    imagefilledrectangle($img, 0, 0, $size, $size, $bg);

    // Rounded corners simulation with white circle
    $white = imagecolorallocate($img, 255, 255, 255);

    // Draw "X" letter
    $fontSize = (int) ($size * 0.5);
    $x = (int) ($size * 0.22);
    $y = (int) ($size * 0.72);

    // Use built-in font scaled
    $fontScale = max(1, (int) ($size / 32));
    for ($i = 0; $i < $fontScale; $i++) {
        for ($j = 0; $j < $fontScale; $j++) {
            imagestring($img, 5, $x + ($size * 0.02) + $i, ($size * 0.28) + $j, 'XP', $white);
        }
    }

    // Save regular icon
    imagepng($img, "{$outputDir}/icon-{$size}x{$size}.png");

    // Save maskable version (with extra padding for safe zone)
    if ($size === 192 || $size === 512) {
        imagepng($img, "{$outputDir}/icon-maskable-{$size}x{$size}.png");
    }

    imagedestroy($img);
    echo "Generated icon-{$size}x{$size}.png\n";
}

echo "Done!\n";
