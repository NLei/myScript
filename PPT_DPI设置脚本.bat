@echo --------------------------------------------
@echo              PPT_DPI���ýű� 
@echo.        
@echo    ����: ����PowerPoint����ͼƬ�ķֱ���    
@echo.

@reg query "HKEY_CLASSES_ROOT\PowerPoint.Application\CurVer" > temp_setdpi.txt
@echo off
 
type temp_setdpi.txt | find "PowerPoint.Application.11" > NUL && goto office2003
type temp_setdpi.txt | find "PowerPoint.Application.12" > NUL && goto office2007
type temp_setdpi.txt | find "PowerPoint.Application.14" > NUL && goto office2010
type temp_setdpi.txt | find "PowerPoint.Application.15" > NUL && goto office2013
type temp_setdpi.txt | find "PowerPoint.Application.16" > NUL && goto office2016

goto office_null
 
:office2003
@echo         ����PowerPoint�汾Ϊ2003
set version=11
goto office_old

:office2007
@echo         ����PowerPoint�汾Ϊ2007
set version=12
goto office_old

:office2010
@echo         ����PowerPoint�汾Ϊ2010
set version=14
goto office_old

:office2013
@echo         ����PowerPoint�汾Ϊ2013
set version=15
goto office_old

:office2016
@echo       ����PowerPoint�汾Ϊ2016��2019
set version=16
goto office_new

:office_null
@echo    ��Ǹ,��δ��װPowerPoint,��汾��֧��
goto ending

:office_old
set dpiMAX=307
goto setDPI

:office_new
set dpiMAX=1000
goto setDPI

:setDPI
@echo --------------------------------------------
@del temp_setdpi.txt
@echo.
@echo ����������Ҫ���õ�DPIֵ (ֱ�ӻس���Ϊ300)
@echo ȡֵ��Χ[50~%dpiMAX%]
: inputDPI
@set /p DPI=

@if "%DPI%"=="" @set DPI=300

@echo %DPI%|findstr "[^0-9]" >nul&&(
	echo ��������,�����봿����
	goto inputDPI)

@if %DPI% GEQ %dpiMAX% @set DPI=%dpiMAX% 
@if %DPI% LEQ 50 @set DPI=50

@echo.
@echo ��������DPIΪ: %DPI% 

reg add HKCU\Software\Microsoft\Office\%version%.0\PowerPoint\Options /v "ExportBitmapResolution" /t "REG_DWORD" /d %DPI% /f

:ending
@echo.
@echo --------------------------------------------
@echo ��������˳� & pause>nul 

:: �ű����ߣ�֪��@ľ��