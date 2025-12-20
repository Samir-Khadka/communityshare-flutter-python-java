@echo off
echo Starting Java Backend...
cd /d "%~dp0"
set "JAVA_HOME=C:\Program Files\Java\jdk-17"
"C:\maven-mvnd-1.0.3-windows-amd64\bin\mvnd.exe" clean spring-boot:run > backend.log 2>&1
pause
