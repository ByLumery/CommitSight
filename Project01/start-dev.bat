@echo off
echo Iniciando CommitSight em modo desenvolvimento...
echo.

echo Parando containers existentes...
docker-compose down

echo.
echo Iniciando banco de dados...
docker-compose up -d postgres

echo.
echo Aguardando banco de dados inicializar...
timeout /t 10 /nobreak

echo.
echo Iniciando backend...
docker-compose up -d backend

echo.
echo Aguardando backend inicializar...
timeout /t 15 /nobreak

echo.
echo Iniciando frontend...
docker-compose up -d frontend

echo.
echo CommitSight iniciado!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:3001
echo.
echo Para parar: docker-compose down
echo Para ver logs: docker-compose logs -f
pause
