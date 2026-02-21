<?php
/**
 * XPlan Icon Generator
 * Run: php public/icons/generate-icons.php
 *
 * Creates modern PNG icons for PWA manifest.
 * Requires GD extension with FreeType support.
 */

$sizes = [72, 96, 128, 144, 152, 192, 384, 512];
$outputDir = __DIR__;

// Primary blue color
$primaryR = 22;
$primaryG = 119;
$primaryB = 255;

foreach ($sizes as $size) {
    // Create image with transparency support
    $img = imagecreatetruecolor($size, $size);
    imagesavealpha($img, true);
    imagealphablending($img, false);

    // Transparent background first
    $transparent = imagecolorallocatealpha($img, 0, 0, 0, 127);
    imagefill($img, 0, 0, $transparent);

    imagealphablending($img, true);

    // Colors
    $primary = imagecolorallocate($img, $primaryR, $primaryG, $primaryB);
    $primaryDark = imagecolorallocate($img, 9, 88, 217);
    $white = imagecolorallocate($img, 255, 255, 255);
    $whiteTranslucent = imagecolorallocatealpha($img, 255, 255, 255, 40);

    // Draw rounded rectangle background
    $radius = (int)($size * 0.18);
    drawRoundedRect($img, 0, 0, $size - 1, $size - 1, $radius, $primary);

    // Draw stylized X with thick lines
    $padding = (int)($size * 0.22);
    $strokeWidth = (int)($size * 0.12);

    // Draw X shape using thick lines
    drawThickLine($img,
        $padding, $padding,
        $size - $padding, $size - $padding,
        $strokeWidth, $white
    );
    drawThickLine($img,
        $size - $padding, $padding,
        $padding, $size - $padding,
        $strokeWidth, $white
    );

    // Add subtle highlight at top-left
    $highlightSize = (int)($size * 0.15);
    for ($i = 0; $i < $highlightSize; $i++) {
        $alpha = (int)(100 + ($i / $highlightSize) * 27);
        $highlight = imagecolorallocatealpha($img, 255, 255, 255, $alpha);
        imageline($img, $radius + $i, $radius, $radius, $radius + $i, $highlight);
    }

    // Save regular icon
    imagepng($img, "{$outputDir}/icon-{$size}x{$size}.png", 9);

    // For maskable icons, create with extra safe zone padding
    if ($size === 192 || $size === 512) {
        $maskableImg = imagecreatetruecolor($size, $size);
        imagesavealpha($maskableImg, true);
        imagealphablending($maskableImg, true);

        // Fill entire background with primary color (maskable needs full bleed)
        $maskablePrimary = imagecolorallocate($maskableImg, $primaryR, $primaryG, $primaryB);
        imagefill($maskableImg, 0, 0, $maskablePrimary);

        // Draw smaller X in center (safe zone is 80% of icon)
        $safeZone = (int)($size * 0.1);
        $innerPadding = $padding + $safeZone;
        $innerStroke = (int)($strokeWidth * 0.85);

        $maskableWhite = imagecolorallocate($maskableImg, 255, 255, 255);
        drawThickLine($maskableImg,
            $innerPadding, $innerPadding,
            $size - $innerPadding, $size - $innerPadding,
            $innerStroke, $maskableWhite
        );
        drawThickLine($maskableImg,
            $size - $innerPadding, $innerPadding,
            $innerPadding, $size - $innerPadding,
            $innerStroke, $maskableWhite
        );

        imagepng($maskableImg, "{$outputDir}/icon-maskable-{$size}x{$size}.png", 9);
        imagedestroy($maskableImg);
    }

    imagedestroy($img);
    echo "Generated icon-{$size}x{$size}.png\n";
}

echo "Done!\n";

/**
 * Draw a rounded rectangle
 */
function drawRoundedRect($img, $x1, $y1, $x2, $y2, $radius, $color): void
{
    // Draw filled rectangle (center)
    imagefilledrectangle($img, $x1 + $radius, $y1, $x2 - $radius, $y2, $color);
    imagefilledrectangle($img, $x1, $y1 + $radius, $x2, $y2 - $radius, $color);

    // Draw four corners
    imagefilledellipse($img, $x1 + $radius, $y1 + $radius, $radius * 2, $radius * 2, $color);
    imagefilledellipse($img, $x2 - $radius, $y1 + $radius, $radius * 2, $radius * 2, $color);
    imagefilledellipse($img, $x1 + $radius, $y2 - $radius, $radius * 2, $radius * 2, $color);
    imagefilledellipse($img, $x2 - $radius, $y2 - $radius, $radius * 2, $radius * 2, $color);
}

/**
 * Draw a thick anti-aliased line
 */
function drawThickLine($img, $x1, $y1, $x2, $y2, $thickness, $color): void
{
    $thickness = max(1, $thickness);

    if ($thickness === 1) {
        imageline($img, (int)$x1, (int)$y1, (int)$x2, (int)$y2, $color);
        return;
    }

    // Calculate the perpendicular offset
    $dx = $x2 - $x1;
    $dy = $y2 - $y1;
    $length = sqrt($dx * $dx + $dy * $dy);

    if ($length === 0.0) {
        imagefilledellipse($img, (int)$x1, (int)$y1, $thickness, $thickness, $color);
        return;
    }

    // Normalize and get perpendicular
    $nx = -$dy / $length;
    $ny = $dx / $length;

    // Calculate polygon points
    $halfThick = $thickness / 2;
    $points = [
        (int)($x1 + $nx * $halfThick), (int)($y1 + $ny * $halfThick),
        (int)($x2 + $nx * $halfThick), (int)($y2 + $ny * $halfThick),
        (int)($x2 - $nx * $halfThick), (int)($y2 - $ny * $halfThick),
        (int)($x1 - $nx * $halfThick), (int)($y1 - $ny * $halfThick),
    ];

    imagefilledpolygon($img, $points, $color);

    // Add rounded caps
    imagefilledellipse($img, (int)$x1, (int)$y1, $thickness, $thickness, $color);
    imagefilledellipse($img, (int)$x2, (int)$y2, $thickness, $thickness, $color);
}
