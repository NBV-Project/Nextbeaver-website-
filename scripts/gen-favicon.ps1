Add-Type -AssemblyName System.Drawing

$src = "public/icon/source.png"
$sizes = @(16, 32, 48)

$original = [System.Drawing.Bitmap]::FromFile($src)
$width = $original.Width
$height = $original.Height

$minX = $width
$minY = $height
$maxX = 0
$maxY = 0

for ($y = 0; $y -lt $height; $y++) {
  for ($x = 0; $x -lt $width; $x++) {
    $pixel = $original.GetPixel($x, $y)
    if ($pixel.R -gt 10 -or $pixel.G -gt 10 -or $pixel.B -gt 10) {
      if ($x -lt $minX) { $minX = $x }
      if ($y -lt $minY) { $minY = $y }
      if ($x -gt $maxX) { $maxX = $x }
      if ($y -gt $maxY) { $maxY = $y }
    }
  }
}

if ($maxX -le $minX -or $maxY -le $minY) {
  throw "Could not find non-black pixels to crop."
}

$cropWidth = $maxX - $minX + 1
$cropHeight = $maxY - $minY + 1
$cropRect = New-Object System.Drawing.Rectangle $minX, $minY, $cropWidth, $cropHeight
$cropped = $original.Clone($cropRect, $original.PixelFormat)

$squareSize = [Math]::Max($cropWidth, $cropHeight)
$square = New-Object System.Drawing.Bitmap $squareSize, $squareSize
$graphics = [System.Drawing.Graphics]::FromImage($square)
$graphics.Clear([System.Drawing.Color]::Transparent)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

$offsetX = [Math]::Floor(($squareSize - $cropWidth) / 2)
$offsetY = [Math]::Floor(($squareSize - $cropHeight) / 2)
$graphics.DrawImage($cropped, $offsetX, $offsetY, $cropWidth, $cropHeight)
$graphics.Dispose()
$cropped.Dispose()
$original.Dispose()

foreach ($s in $sizes) {
  $outBmp = New-Object System.Drawing.Bitmap $s, $s
  $g = [System.Drawing.Graphics]::FromImage($outBmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.DrawImage($square, 0, 0, $s, $s)
  $g.Dispose()
  $outPath = "public/favicon-${s}x${s}.png"
  $outBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $outBmp.Dispose()
}

$square.Dispose()
