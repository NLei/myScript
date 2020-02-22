@echo --------------------------------------------
@echo              PPT_DPI设置脚本 
@echo.        
@echo    功能: 设置PowerPoint保存图片的分辨率    
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
@echo         您的PowerPoint版本为2003
set version=11
goto office_old

:office2007
@echo         您的PowerPoint版本为2007
set version=12
goto office_old

:office2010
@echo         您的PowerPoint版本为2010
set version=14
goto office_old

:office2013
@echo         您的PowerPoint版本为2013
set version=15
goto office_old

:office2016
@echo       您的PowerPoint版本为2016或2019
set version=16
goto office_new

:office_null
@echo    抱歉,您未安装PowerPoint,或版本不支持
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
@echo 请输入您想要设置的DPI值 (直接回车设为300)
@echo 取值范围[50~%dpiMAX%]
: inputDPI
@set /p DPI=

@if "%DPI%"=="" @set DPI=300

@echo %DPI%|findstr "[^0-9]" >nul&&(
	echo 输入有误,请输入纯数字
	goto inputDPI)

@if %DPI% GEQ %dpiMAX% @set DPI=%dpiMAX% 
@if %DPI% LEQ 50 @set DPI=50

@echo.
@echo 正在设置DPI为: %DPI% 

reg add HKCU\Software\Microsoft\Office\%version%.0\PowerPoint\Options /v "ExportBitmapResolution" /t "REG_DWORD" /d %DPI% /f

:ending
@echo.
@echo --------------------------------------------
@echo 按任意键退出 & pause>nul 

:: 脚本作者：知乎@木雷