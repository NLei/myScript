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
    echo ��ǰ�Ҽ��˵�: ������ʽ��
) else (
    echo ��ǰ�Ҽ��˵�: Win11����ʽ��
)

set /p switchChoice=�Ƿ��л��Ҽ��˵�ģʽ��(y/n): 
if /i "!switchChoice!" neq "y" goto end

:: Switch context menu state
if "!state!" equ "classic" (
    reg delete "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}" /f
    echo ���л����°��Ҽ��˵���
) else (
    reg add "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32" /f /ve
    echo ���л��������Ҽ��˵���
)

:: Ask if the user wants to restart explorer.exe
set /p restartChoice=�Ƿ�����explorerʹ������Ч��(y/n): 
if /i "!restartChoice!" neq "y" goto end

:: Restart explorer.exe
echo ��������explorer.exe...
taskkill /f /im explorer.exe
start explorer.exe

:end
echo ������ɡ�
pause
