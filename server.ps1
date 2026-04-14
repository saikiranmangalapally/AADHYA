$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8090/')
$listener.Start()
Write-Host 'Server running on http://localhost:8090'

while($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $resp = $ctx.Response
    $path = $req.Url.LocalPath
    
    if($path -eq '/') { $path = '/index.html' }
    
    $filePath = 'c:\aadhyas-lifeline' + $path.Replace('/', '\')
    
    if(Test-Path $filePath) {
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath)
        $mime = switch($ext) {
            '.html' {'text/html; charset=utf-8'}
            '.css'  {'text/css'}
            '.js'   {'application/javascript'}
            '.png'  {'image/png'}
            '.jpg'  {'image/jpeg'}
            '.ico'  {'image/x-icon'}
            default {'application/octet-stream'}
        }
        $resp.ContentType = $mime
        $resp.OutputStream.Write($content, 0, $content.Length)
    } else {
        $resp.StatusCode = 404
        $bytes = [Text.Encoding]::UTF8.GetBytes('Not found')
        $resp.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    $resp.Close()
}
