#!/usr/bin/env pwsh

# Script to check YAML files using yamllint
# Equivalent to the bash script but for Windows PowerShell

# Check if yamllint is installed
try {
    $null = (Get-Command yamllint -ErrorAction Stop)
    $yamlLintInstalled = $true
} catch {
    $yamlLintInstalled = $false
}

if (-not $yamlLintInstalled) {
    Write-Host "yamllint not found. Please install it using:" -ForegroundColor Yellow
    Write-Host "pip install yamllint" -ForegroundColor Cyan
    exit 1
}

# If no arguments provided, show usage
if ($args.Count -eq 0) {
    Write-Host "Usage: $($MyInvocation.MyCommand.Name) [yaml_files...]" -ForegroundColor Yellow
    exit 1
}

$exitCode = 0

# Process each file argument
foreach ($file in $args) {
    # Convert paths if needed (handle both forward and backslashes)
    $filePath = $file -replace '/', '\'
    
    # Check if file exists
    if (-not (Test-Path $filePath)) {
        Write-Host "File not found: $filePath" -ForegroundColor Red
        $exitCode = 1
        continue
    }
    
    # Run yamllint on the file
    Write-Host "Linting $filePath..." -ForegroundColor Green
    $result = yamllint $filePath
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host $result -ForegroundColor Red
        $exitCode = 1
    } else {
        Write-Host "No issues found in $filePath" -ForegroundColor Green
    }
}

exit $exitCode

