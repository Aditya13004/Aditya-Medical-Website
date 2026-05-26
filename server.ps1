$port = 8080
$path = $PSScriptRoot

if (-not $path) {
    $path = (Get-Location).Path
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Server listening on http://localhost:$port/"
Write-Host "Press Ctrl+C to stop"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/") {
            $localPath = "/index.html"
        }
        
        $filePath = Join-Path $path $localPath.Replace('/', '\')
        
        if (Test-Path $filePath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $content.Length
            
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($extension) {
                ".html" { "text/html" }
                ".css"  { "text/css" }
                ".js"   { "application/javascript" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                default { "application/octet-stream" }
            }
            $response.ContentType = $contentType
            
            $output = $response.OutputStream
            $output.Write($content, 0, $content.Length)
            $output.Close()
            
            Write-Host "200 OK - $localPath"
        } else {
            $response.StatusCode = 404
            $output = $response.OutputStream
            $output.Close()
            Write-Host "404 Not Found - $localPath" -ForegroundColor Red
        }
    }
} finally {
    $listener.Stop()
}
