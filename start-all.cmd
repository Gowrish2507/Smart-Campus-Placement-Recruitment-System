@echo off
title Launch Smart Campus Placement & Recruitment System
echo ===================================================================
echo   Starting Smart Campus Placement System (Backend + Frontend)
echo ===================================================================
echo 1. Launching Spring Boot Backend on http://localhost:8080...
start "Placement System - Spring Boot Backend" cmd /k run-backend.cmd

timeout /t 5 /nobreak >nul

echo 2. Launching React Frontend on http://localhost:5173...
start "Placement System - React Frontend" cmd /k run-frontend.cmd

echo.
echo ===================================================================
echo   System launched! Open browser at: http://localhost:5173
echo   H2 Console:                      http://localhost:8080/h2-console
echo ===================================================================
timeout /t 3 >nul
start http://localhost:5173
