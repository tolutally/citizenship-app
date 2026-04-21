@echo off
setlocal
set "ROOT=%~dp0"
set "PATH=%ROOT%.tools\node-v22.22.2-win-x64;%PATH%"
set "NPM_CMD=%ROOT%.tools\node-v22.22.2-win-x64\npm.cmd"

if not exist "%NPM_CMD%" (
  echo Local npm runtime not found in .tools\node-v22.22.2-win-x64
  exit /b 1
)

call "%NPM_CMD%" %*