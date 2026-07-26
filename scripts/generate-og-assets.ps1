# generate-og-assets.ps1
# Renders brand PNG assets for the HFL AI Agent Lab VitePress site:
#   - docs\blogs\public\og-cover.png         (1200 x 630)
#   - docs\blogs\public\favicon-32.png       (32 x 32)
#   - docs\blogs\public\apple-touch-icon.png (180 x 180)
# Uses System.Drawing (GDI+), works on Windows PowerShell 5.1.
# This source file is pure ASCII on purpose: PS 5.1 mangles non-ASCII
# literals in BOM-less files, so all CJK copy lives in og-text.json (UTF-8)
# and is loaded at runtime.

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

# ---------------------------------------------------------------- paths ----
$repoRoot  = Split-Path -Parent $PSScriptRoot
$publicDir = Join-Path $repoRoot 'docs\blogs\public'
if (-not (Test-Path $publicDir)) {
    New-Item -ItemType Directory -Force -Path $publicDir | Out-Null
}
$ogPath    = Join-Path $publicDir 'og-cover.png'
$favPath   = Join-Path $publicDir 'favicon-32.png'
$applePath = Join-Path $publicDir 'apple-touch-icon.png'

# ------------------------------------------------------- copy (CJK text) ----
$textPath = Join-Path $PSScriptRoot 'og-text.json'
$jsonRaw  = [System.IO.File]::ReadAllText($textPath, [System.Text.Encoding]::UTF8)
$copy     = $jsonRaw | ConvertFrom-Json
$domain   = 'hfl-ai-agent-lab.vercel.app'   # ASCII, safe to keep inline

# --------------------------------------------------------------- palette ----
function New-Color([int]$a, [int]$r, [int]$gr, [int]$b) {
    return [System.Drawing.Color]::FromArgb($a, $r, $gr, $b)
}
$colBgTop    = New-Color 255   2   6  23   # slate-950  #020617
$colBgBottom = New-Color 255  15  23  42   # slate-900  #0f172a
$colCyan     = New-Color 255 103 232 249   # cyan-300   #67e8f9
$colPurple   = New-Color 255 196 181 253   # violet-300 #c4b5fd
$colGreen    = New-Color 255  34 197  94   # green-500  #22c55e
$colTitle    = New-Color 255 248 250 252   # slate-50   title white
$colSub      = New-Color 255 207 250 254   # cyan-100   cyan-tinted white
$colChips    = New-Color 255 203 213 225   # slate-300  gray-white
$colMeta     = New-Color 255 148 163 184   # slate-400  meta gray
$colBorder   = New-Color 175  51  65  85   # slate-600 at ~68% alpha

# --------------------------------------------------------------- helpers ----
function New-RoundedRect([single]$x, [single]$y, [single]$w, [single]$h, [single]$r) {
    $p = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $r * 2
    $p.AddArc($x, $y, $d, $d, 180, 90)
    $p.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
    $p.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
    $p.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
    $p.CloseFigure()
    return $p
}

function Add-Glow($gfx, [single]$cx, [single]$cy, [single]$radius, $color) {
    # Soft radial glow: PathGradientBrush fading to fully transparent.
    $gp = New-Object System.Drawing.Drawing2D.GraphicsPath
    $gp.AddEllipse($cx - $radius, $cy - $radius, $radius * 2, $radius * 2)
    $pgb = New-Object System.Drawing.Drawing2D.PathGradientBrush($gp)
    $pgb.CenterColor = $color
    $pgb.SurroundColors = @([System.Drawing.Color]::FromArgb(0, $color.R, $color.G, $color.B))
    $gfx.FillPath($pgb, $gp)
    $pgb.Dispose()
    $gp.Dispose()
}

function Get-BrandFont([single]$sizePx, [bool]$bold) {
    $style = [System.Drawing.FontStyle]::Regular
    if ($bold) { $style = [System.Drawing.FontStyle]::Bold }
    try {
        return New-Object System.Drawing.Font('Microsoft YaHei', $sizePx, $style, ([System.Drawing.GraphicsUnit]::Pixel))
    } catch {
        return New-Object System.Drawing.Font('Segoe UI', $sizePx, $style, ([System.Drawing.GraphicsUnit]::Pixel))
    }
}

# ------------------------------------------------ og-cover.png 1200 x 630 ----
$W = 1200; $H = 630
$bmp = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

# dark diagonal base
$bgRect  = New-Object System.Drawing.Rectangle(0, 0, $W, $H)
$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($bgRect, $colBgTop, $colBgBottom, 32.0)
$g.FillRectangle($bgBrush, $bgRect)
$bgBrush.Dispose()

# glows: cyan top-left, purple mid-right
Add-Glow $g  150  20 440 (New-Color 50 103 232 249)
Add-Glow $g 1080 430 480 (New-Color 55 196 181 253)

# gradient accent bar above the title (cyan -> purple)
$barRect  = New-Object System.Drawing.Rectangle(84, 174, 96, 8)
$barBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($barRect, $colCyan, $colPurple, 0.0)
$barPath  = New-RoundedRect 84 174 96 8 4
$g.FillPath($barBrush, $barPath)
$barBrush.Dispose()
$barPath.Dispose()

# title / subtitle / chips / meta
$fontTitle = Get-BrandFont 72 $true
$fontSub   = Get-BrandFont 34 $false
$fontChips = Get-BrandFont 22 $false
$fontMeta  = Get-BrandFont 20 $false

$bTitle = New-Object System.Drawing.SolidBrush($colTitle)
$bSub   = New-Object System.Drawing.SolidBrush($colSub)
$bChips = New-Object System.Drawing.SolidBrush($colChips)
$bMeta  = New-Object System.Drawing.SolidBrush($colMeta)
$bGreen = New-Object System.Drawing.SolidBrush($colGreen)

$g.DrawString([string]$copy.title,    $fontTitle, $bTitle, 72, 206)
$g.DrawString([string]$copy.subtitle, $fontSub,   $bSub,   78, 322)
$g.DrawString([string]$copy.chips,    $fontChips, $bChips, 80, 494)

# bottom-left: small green dot + domain (ASCII)
$g.FillEllipse($bGreen, 84, 563, 12, 12)
$g.DrawString($domain, $fontMeta, $bMeta, 104, 556)

$g.Dispose()
$bmp.Save($ogPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

$fontTitle.Dispose(); $fontSub.Dispose(); $fontChips.Dispose(); $fontMeta.Dispose()
$bTitle.Dispose(); $bSub.Dispose(); $bChips.Dispose(); $bMeta.Dispose(); $bGreen.Dispose()

# ------------------------------------------------------------- icon PNGs ----
function New-IconPng([string]$outPath, [int]$size, [bool]$withDot) {
    $s = $size / 32.0
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

    # dark rounded tile (corners stay transparent), rx ~= 7/32 of the size
    $inset = [single](0.5 * $s)
    $side  = [single]($size - (1.0 * $s))
    $tile  = New-RoundedRect $inset $inset $side $side ([single](6.5 * $s))
    $tileRect  = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $tileBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($tileRect, $colBgTop, $colBgBottom, 45.0)
    $g.FillPath($tileBrush, $tile)
    $pen = New-Object System.Drawing.Pen($colBorder, ([single][Math]::Max(1.0, 1.0 * $s)))
    $g.DrawPath($pen, $tile)

    # centered H, cyan -> purple gradient, Microsoft YaHei Bold.
    # Drawn as a GraphicsPath so the real glyph bounds can be centered
    # geometrically (DrawString line-box centering is off by a few px).
    $fam = $null
    try { $fam = New-Object System.Drawing.FontFamily('Microsoft YaHei') } catch { $fam = New-Object System.Drawing.FontFamily('Segoe UI') }
    $gpH = New-Object System.Drawing.Drawing2D.GraphicsPath
    $origin = New-Object System.Drawing.PointF(0, 0)
    $gpH.AddString('H', $fam, ([int][System.Drawing.FontStyle]::Bold), ([single](24 * $s)), $origin, ([System.Drawing.StringFormat]::GenericDefault))
    $hb = $gpH.GetBounds()
    $mtx = New-Object System.Drawing.Drawing2D.Matrix
    $mtx.Translate(([single](($size / 2.0) - ($hb.X + $hb.Width / 2.0))), ([single](($size / 2.0) - ($hb.Y + $hb.Height / 2.0))))
    $gpH.Transform($mtx)
    $hBounds = $gpH.GetBounds()
    $hBrush  = New-Object System.Drawing.Drawing2D.LinearGradientBrush($hBounds, $colCyan, $colPurple, 50.0)
    $g.FillPath($hBrush, $gpH)
    $mtx.Dispose(); $gpH.Dispose(); $fam.Dispose()

    if ($withDot) {
        $bGreen = New-Object System.Drawing.SolidBrush($colGreen)
        $g.FillEllipse($bGreen, ([single](24.0 * $s)), ([single](5.0 * $s)), ([single](3.0 * $s)), ([single](3.0 * $s)))
        $bGreen.Dispose()
    }

    $g.Dispose()
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $hBrush.Dispose(); $tileBrush.Dispose(); $pen.Dispose(); $tile.Dispose()
}

New-IconPng $favPath 32 $false
New-IconPng $applePath 180 $true

# ---------------------------------------------------------------- report ----
Write-Output ''
Write-Output 'Generated assets:'
foreach ($f in @($ogPath, $favPath, $applePath)) {
    if (Test-Path $f) {
        $len = (Get-Item $f).Length
        Write-Output ("  OK      {0}  ({1} bytes)" -f $f, $len)
    } else {
        Write-Output ("  MISSING {0}" -f $f)
    }
}
if (Test-Path $ogPath) {
    $ogLen = (Get-Item $ogPath).Length
    if ($ogLen -ge 300KB) {
        Write-Output ("  WARNING og-cover.png is {0} bytes, over the 300 KB budget" -f $ogLen)
    } else {
        Write-Output ("  og-cover.png is under the 300 KB budget ({0} bytes)" -f $ogLen)
    }
}
