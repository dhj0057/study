$ErrorActionPreference = 'Stop'
$docPath = (Resolve-Path -LiteralPath 'work/helpdesk_pm/AI_Help_Desk_PM_Plan.docx').Path
$pdfPath = [System.IO.Path]::ChangeExtension($docPath, '.pdf')
$wordApp = $null
$wordDoc = $null
function Invoke-WordRetry([scriptblock]$action) {
    for ($attempt=0; $attempt -lt 12; $attempt++) {
        try { return (& $action) }
        catch { if ($attempt -eq 11) { throw }; Start-Sleep -Milliseconds 700 }
    }
}
try {
    $wordApp = New-Object -ComObject Word.Application
    Invoke-WordRetry { $wordApp.Visible = $false }
    Invoke-WordRetry { $wordApp.DisplayAlerts = 0 }
    $wordDoc = Invoke-WordRetry { $wordApp.Documents.Open($docPath, $false, $true) }
    Invoke-WordRetry { $wordDoc.Repaginate() }
    $pageCount = Invoke-WordRetry { $wordDoc.ComputeStatistics(2) }
    Invoke-WordRetry { $wordDoc.ExportAsFixedFormat($pdfPath, 17) }
    Write-Output "Pages: $pageCount"
    Write-Output $pdfPath
}
finally {
    if ($null -ne $wordDoc) { try { Invoke-WordRetry { $wordDoc.Close(0) } } catch { Write-Warning $_ } }
    if ($null -ne $wordApp) { try { Invoke-WordRetry { $wordApp.Quit() } } catch { Write-Warning $_ } }
}
