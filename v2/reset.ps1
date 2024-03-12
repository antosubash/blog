if (Test-Path pnpm-lock.yaml) {
    Write-Host "Removing pnpm-lock.yaml"
    Remove-Item pnpm-lock.yaml
}

Write-Host "Removing all node_modules,dist,.turbo,out,.next folders"

Get-ChildItem -Path . -Include node_modules, dist, .turbo, out, .next, .contentlayer -Recurse -Force | Remove-Item -Recurse -Force

Write-Host "Installing dependencies"

pnpm install