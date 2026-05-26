$dir = 'c:\Users\ADITYA\Downloads\Aditya Medical Web 1 - Copy\Aditya Medical Web'
$files = @('contact.html','customer-dashboard.html','ai-recommendations.html','login.html','faq.html','about.html','order.html','privacy.html','terms.html')

foreach ($fname in $files) {
    $path = Join-Path $dir $fname
    if (-not (Test-Path $path)) { Write-Host "Not found: $fname"; continue }
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $content = [System.Text.Encoding]::UTF8.GetString($bytes)
    $original = $content

    $content = $content.Replace("`u{1F916} AI Help", "AI Help")
    $content = $content.Replace("`u{1F916} AI Recommendations", "AI Recommendations")
    $content = $content.Replace("`u{1F4CA} My Orders", "My Orders")
    $content = $content.Replace("`u{1F464} Login", "Account")
    $content = $content.Replace("`u{1F464} Account", "Account")
    $content = $content.Replace("`u{1F6D2} Order Now", "Order Now")
    $content = $content.Replace("`u{1F6D2} Place Order", "Place Order")
    $content = $content.Replace(">``u{1F464}<", ">Account<")

    if ($content -ne $original) {
        $newBytes = [System.Text.Encoding]::UTF8.GetBytes($content)
        [System.IO.File]::WriteAllBytes($path, $newBytes)
        Write-Host "Fixed: $fname"
    } else {
        Write-Host "No change: $fname"
    }
}
Write-Host "Done!"
