@echo off
setlocal EnableDelayedExpansion

:: Function to get the current context menu state
:getCurrentState
reg query "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32" /ve >nul 2>&1
if %errorlevel% equ 0 (
    set state=classic
) else (
    set state=new
)


:: Display current state and ask if the user wants to switch
if "!state!" equ "classic" (
    echo 当前右键菜单: 经典样式。
) else (
    echo 当前右键菜单: Win11新样式。
)

set /p switchChoice=是否切换右键菜单模式？(y/n): 
if /i "!switchChoice!" neq "y" goto end

:: Switch context menu state
if "!state!" equ "classic" (
    reg delete "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}" /f
    echo 已切换到新版右键菜单。
) else (
    reg add "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32" /f /ve
    echo 已切换到经典右键菜单。
)

:: Ask if the user wants to restart explorer.exe
set /p restartChoice=是否重启explorer使设置生效？(y/n): 
if /i "!restartChoice!" neq "y" goto end

:: Restart explorer.exe
echo 正在重启explorer.exe...
taskkill /f /im explorer.exe
start explorer.exe

:end
echo 操作完成。
pause
