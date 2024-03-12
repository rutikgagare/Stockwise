@echo off

REM Open first terminal and run frontend commands
start "Frontend" cmd /k "cd frontend & npm i & npm start"

REM Open second terminal and run backend commands
start "Backend" cmd /k "cd backend & npm i & npm start"