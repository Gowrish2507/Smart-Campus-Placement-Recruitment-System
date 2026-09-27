@echo off
title Campus Placement System - Backend (Spring Boot 3)
echo ==========================================================
echo Starting Smart Campus Placement Backend on Port 8080...
echo ==========================================================
cd backend
call ..\tools\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
pause
